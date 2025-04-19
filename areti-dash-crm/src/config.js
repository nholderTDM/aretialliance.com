// Configuration for different environments
const config = {
  development: {
    auth0Domain: 'dev-eprewkd4xyuf3khb.us.auth0.com', // Replace with your Auth0 domain
    auth0ClientId: 'qYMCXz5ytGyVzMTKwJh0hrTIH83ATTO6', // Replace with your Auth0 client ID
    authServiceUrl: 'http://localhost:4000',
    audience: 'https://api.aretialliance.com'
  },
  production: {
    auth0Domain: 'dev-eprewkd4xyuf3khb.us.auth0.com', // Replace with your Auth0 domain
    auth0ClientId: 'qYMCXz5ytGyVzMTKwJh0hrTIH83ATTO6', // Replace with your Auth0 client ID
    authServiceUrl: 'https://aretialliance-com.onrender.com', // Replace with your deployed auth service URL
    audience: 'https://api.aretialliance.com'
  }
};

// Determine which environment we're in
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Export the correct configuration
export default isDevelopment ? config.development : config.production;