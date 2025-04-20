// services/auth.js
import config from '../config';

class AuthService {
  constructor() {
    this.domain = config.auth0Domain;
    this.clientId = config.auth0ClientId;
    this.audience = config.audience;
    this.tokenKey = 'auth_token';
    this.profileKey = 'user_profile';
  }

  init() {
    return new Promise((resolve) => {
      // Check if user is returning from Auth0 (authentication callback)
      if (window.location.hash.includes('access_token')) {
        this.handleAuthentication();
        resolve(true);
      } else {
        resolve(this.isAuthenticated());
      }
    });
  }

  handleAuthentication() {
    const hash = this.parseHash(window.location.hash);
    if (hash.access_token) {
      this.setSession(hash);
      return true;
    }
    return false;
  }

  parseHash(hash) {
    hash = hash.substring(1).split('&');
    const result = {};
    hash.forEach(item => {
      const [key, value] = item.split('=');
      result[key] = value;
    });
    return result;
  }

  setSession(authResult) {
    // Set the time that the access token will expire
    const expiresAt = JSON.stringify(
      authResult.expires_in * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem('expires_at', expiresAt);
    
    // Fetch user profile
    this.getUserInfo(authResult.access_token);
  }

  getUserInfo(accessToken) {
    const url = `https://${this.domain}/userinfo`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(profile => {
      localStorage.setItem(this.profileKey, JSON.stringify(profile));
    })
    .catch(error => console.error('Error fetching user profile:', error));
  }

  login() {
    const redirectUri = `${window.location.origin}/callback`;
    window.location.href = `https://${this.domain}/authorize?` +
      `response_type=token&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `audience=${encodeURIComponent(this.audience)}&` +
      `scope=openid profile email`;
  }

  logout() {
    // Clear all authentication data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem(this.profileKey);
    
    // Redirect to Auth0 logout endpoint
    window.location.href = `https://${this.domain}/v2/logout?client_id=${this.clientId}&returnTo=${encodeURIComponent(window.location.origin)}`;
  }

  isAuthenticated() {
    // Check if the user has an active session
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
    return new Date().getTime() < expiresAt;
  }

  getUserProfile() {
    const profile = localStorage.getItem(this.profileKey);
    return profile ? JSON.parse(profile) : null;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }
}

export default new AuthService();