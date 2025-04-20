// services/api.js - Complete file
import AuthService from './auth';
import config from '../config';
import { mockContacts, mockTasks, mockOrganizations } from './mockData';

class ApiService {
  constructor() {
    this.baseUrl = config.authServiceUrl;
  }

  async fetchWithAuth(endpoint, options = {}) {
    // Get the authentication token
    const token = AuthService.getToken();
    
    // Add token to headers if available
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Token might be expired, log user out
      AuthService.logout();
      return null;
    }
    
    return response;
  }

  // User methods
  async getCurrentUser() {
    // Mock implementation
    return Promise.resolve({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    });
  }

  // Contact methods
  async getContacts() {
    // Mock implementation
    return Promise.resolve([...mockContacts]);
  }

  async getContact(id) {
    // Mock implementation
    const contact = mockContacts.find(c => c.id === id);
    return Promise.resolve(contact || null);
  }

  async createContact(contactData) {
    // Mock implementation
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockContacts.push(newContact);
    return Promise.resolve(newContact);
  }

  async updateContact(id, contactData) {
    // Mock implementation
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedContact = {
      ...mockContacts[index],
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    mockContacts[index] = updatedContact;
    return Promise.resolve(updatedContact);
  }

  async deleteContact(id) {
    // Mock implementation
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockContacts.splice(index, 1);
    return Promise.resolve(true);
  }

  // Organization methods
  async getOrganizations() {
    // Mock implementation
    return Promise.resolve([...mockOrganizations]);
  }

  async getOrganization(id) {
    // Mock implementation
    const org = mockOrganizations.find(o => o.id === id);
    return Promise.resolve(org || null);
  }

  async createOrganization(orgData) {
    // Mock implementation
    const newOrg = {
      id: Date.now().toString(),
      ...orgData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockOrganizations.push(newOrg);
    return Promise.resolve(newOrg);
  }

  async updateOrganization(id, orgData) {
    // Mock implementation
    const index = mockOrganizations.findIndex(o => o.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedOrg = {
      ...mockOrganizations[index],
      ...orgData,
      updatedAt: new Date().toISOString()
    };
    
    mockOrganizations[index] = updatedOrg;
    return Promise.resolve(updatedOrg);
  }

  async deleteOrganization(id) {
    // Mock implementation
    const index = mockOrganizations.findIndex(o => o.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockOrganizations.splice(index, 1);
    return Promise.resolve(true);
  }

  // Task methods
  async getTasks() {
    // Mock implementation
    return Promise.resolve([...mockTasks]);
  }

  async getTask(id) {
    // Mock implementation
    const task = mockTasks.find(t => t.id === id);
    return Promise.resolve(task || null);
  }

  async createTask(taskData) {
    // Mock implementation
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return Promise.resolve(newTask);
  }

  async updateTask(id, taskData) {
    // Mock implementation
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);
    
    const updatedTask = {
      ...mockTasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    mockTasks[index] = updatedTask;
    return Promise.resolve(updatedTask);
  }

  async deleteTask(id) {
    // Mock implementation
    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockTasks.splice(index, 1);
    return Promise.resolve(true);
  }

  // Dashboard methods
  async getDashboardStats() {
    // Mock implementation
    return Promise.resolve({
      totalContacts: mockContacts.length,
      totalOrganizations: mockOrganizations.length,
      tasksByStatus: {
        pending: mockTasks.filter(t => t.status === 'pending').length,
        inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
        completed: mockTasks.filter(t => t.status === 'completed').length
      }
    });
  }
}

export default new ApiService();