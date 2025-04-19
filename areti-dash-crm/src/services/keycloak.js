import Keycloak from 'keycloak-js';
import axios from 'axios';

// Configuration from environment variables
const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || 'https://auth.aretialliance.com';
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'areti-alliance';
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'areti-crm-client';
const API_URL = process.env.REACT_APP_API_URL || 'https://api.aretialliance.com';

// Debugging helper
function debugLog(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Auth]', ...args);
  }
}

// Initialize Keycloak instance
const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID
};

const keycloak = new Keycloak(keycloakConfig);

// Authentication service
const AuthService = {
  // Initialize Keycloak with proper configuration
  init: () => {
    debugLog('Initializing Keycloak');
    return new Promise((resolve, reject) => {
      keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/dashboard/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false
      })
        .then(authenticated => {
          debugLog('Keycloak initialized, authenticated:', authenticated);
          
          if (authenticated) {
            debugLog('User authenticated with valid token');
            
            // Store basic user info from token
            const basicUserInfo = {
              name: keycloak.tokenParsed.preferred_username || keycloak.tokenParsed.name,
              email: keycloak.tokenParsed.email || keycloak.tokenParsed.preferred_username,
              role: AuthService.getUserRole(keycloak.tokenParsed),
              token: keycloak.token,
              timestamp: new Date().getTime()
            };
            
            localStorage.setItem('aretiUser', JSON.stringify(basicUserInfo));
            
            // Setup token refresh
            AuthService.setupTokenRefresh();
            
            resolve(authenticated);
          } else {
            debugLog('User not authenticated');
            localStorage.removeItem('aretiUser');
            resolve(authenticated);
          }
        })
        .catch(error => {
          debugLog('Keycloak init error:', error);
          reject(error);
        });
    });
  },

  // Get user role from token
  getUserRole: (tokenParsed) => {
    if (!tokenParsed || !tokenParsed.realm_access) {
      return 'user';
    }
    
    const roles = tokenParsed.realm_access.roles || [];
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('manager')) return 'manager';
    return 'user';
  },

  // Setup automatic token refresh
  setupTokenRefresh: () => {
    keycloak.onTokenExpired = () => {
      debugLog('Token expired, refreshing...');
      keycloak.updateToken(30).then((refreshed) => {
        if (refreshed) {
          debugLog('Token refreshed');
          // Update stored user info with new token
          const user = AuthService.getUserProfile();
          if (user) {
            user.token = keycloak.token;
            user.timestamp = new Date().getTime();
            localStorage.setItem('aretiUser', JSON.stringify(user));
          }
        } else {
          debugLog('Token not refreshed, still valid');
        }
      }).catch(error => {
        debugLog('Failed to refresh token:', error);
        // Force re-login on refresh failure
        AuthService.login();
      });
    };
  },

  // Log in
  login: () => {
    debugLog('Starting login process');
    keycloak.login({
      redirectUri: window.location.origin + '/dashboard'
    });
  },

  // Log out
  logout: () => {
    debugLog('Logging out');
    localStorage.removeItem('aretiUser');
    keycloak.logout({
      redirectUri: window.location.origin
    });
  },

  // Check if authenticated
  isAuthenticated: () => {
    // Check local storage first
    const user = localStorage.getItem('aretiUser');
    if (user) {
      const userData = JSON.parse(user);
      const now = new Date().getTime();
      // If token is relatively fresh (less than 5 minutes old), consider authenticated
      if (now - userData.timestamp < 5 * 60 * 1000) {
        return true;
      }
    }
    
    // Otherwise check Keycloak token
    return !!keycloak.token;
  },

  // Get user profile
  getUserProfile: () => {
    const user = localStorage.getItem('aretiUser');
    return user ? JSON.parse(user) : null;
  },

  // Get authorization header for API requests
  getAuthHeader: () => {
    const user = AuthService.getUserProfile();
    if (!user) return {};
    
    return {
      'Authorization': `Bearer ${user.token}`
    };
  },
  
  // Check token validity
  hasValidToken: () => {
    const user = localStorage.getItem('aretiUser');
    if (!user) {
      return false;
    }
    
    const userData = JSON.parse(user);
    const now = new Date().getTime();
    // Check if token is expired (24 hour validity)
    return now - userData.timestamp < 24 * 60 * 60 * 1000;
  }
};

export default AuthService;