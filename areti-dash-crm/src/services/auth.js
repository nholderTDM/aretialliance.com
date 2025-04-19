import { Auth0Client } from '@auth0/auth0-spa-js';
import config from '../config';
import axios from 'axios';

let auth0Client = null;
let cachedUser = null;

// Initialize Auth0 client
const initAuth0 = async () => {
  if (auth0Client) return auth0Client;
  
  auth0Client = new Auth0Client({
    domain: config.auth0Domain,
    client_id: config.auth0ClientId,
    redirect_uri: `${window.location.origin}/callback`,
    audience: config.audience,
    cacheLocation: 'localstorage'
  });

  try {
    // Handle callback if code is present in URL
    if (window.location.search.includes("code=")) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }
    
    // Check if user is authenticated
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    if (isAuthenticated) {
      // Get user info and cache it
      cachedUser = await auth0Client.getUser();
      
      // Get the Auth0 token
      const token = await auth0Client.getTokenSilently();
      
      // Exchange with our service
      try {
        const response = await axios.post(`${config.authServiceUrl}/auth/token`, {
          token
        });
        
        // Store in localStorage
        if (response.data && response.data.token) {
          const userInfo = {
            name: cachedUser.name || cachedUser.nickname || 'User',
            email: cachedUser.email || 'user@example.com',
            role: 'admin', // Customize as needed
            token: response.data.token,
            timestamp: new Date().getTime()
          };
          
          localStorage.setItem('aretiUser', JSON.stringify(userInfo));
        }
      } catch (error) {
        console.error('Token exchange error:', error);
      }
    }
  } catch (error) {
    console.error('Auth0 initialization error:', error);
  }
  
  return auth0Client;
};

// Authentication service
const AuthService = {
  // Initialize
  init: async () => {
    try {
      // Check for cached user in localStorage
      const userFromStorage = localStorage.getItem('aretiUser');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          const now = new Date().getTime();
          
          // Check if token is not expired (24 hour validity)
          if (now - userData.timestamp < 24 * 60 * 60 * 1000) {
            console.log('Found valid user in localStorage');
            cachedUser = userData;
            return true;
          }
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
      
      // Initialize Auth0
      await initAuth0();
      
      // Return authentication status
      return !!cachedUser;
    } catch (error) {
      console.error('Auth initialization error:', error);
      return false;
    }
  },

  // Login
  login: async () => {
    try {
      const client = await initAuth0();
      await client.loginWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('aretiUser');
      
      // Clear cached user
      cachedUser = null;
      
      // Logout from Auth0
      const client = await initAuth0();
      await client.logout({
        returnTo: window.location.origin
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.reload();
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!cachedUser || !!localStorage.getItem('aretiUser');
  },

  // Get user profile
  getUserProfile: () => {
    if (cachedUser) return cachedUser;
    
    const userFromStorage = localStorage.getItem('aretiUser');
    if (userFromStorage) {
      try {
        return JSON.parse(userFromStorage);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return null;
  },

  // Get authorization header
  getAuthHeader: () => {
    const userFromStorage = localStorage.getItem('aretiUser');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        if (userData.token) {
          return {
            'Authorization': `Bearer ${userData.token}`
          };
        }
      } catch (error) {
        console.error('Error creating auth header:', error);
      }
    }
    
    return {};
  }
};

export default AuthService;