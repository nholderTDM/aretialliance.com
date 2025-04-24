// services/api.js

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  // Generic request handler
  static async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    
    const config = {
      ...options,
      headers
    };
    
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error in ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Driver methods
  static async getDrivers() {
    return this.request('drivers');
  }
  
  static async getDriver(id) {
    return this.request(`drivers/${id}`);
  }
  
  static async createDriver(data) {
    return this.request('drivers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  static async updateDriver(id, data) {
    return this.request(`drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  static async deleteDriver(id) {
    return this.request(`drivers/${id}`, {
      method: 'DELETE'
    });
  }
  
  // Other API methods for contacts, organizations, etc.
  // Include your existing methods here
  
  static async getContacts() {
    return this.request('contacts');
  }
  
  static async createContact(data) {
    return this.request('contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  static async updateContact(id, data) {
    return this.request(`contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  static async deleteContact(id) {
    return this.request(`contacts/${id}`, {
      method: 'DELETE'
    });
  }
  
  // Add other existing API methods as needed
}

export default ApiService;