// components/Contacts.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead', // 'lead', 'customer', 'partner', etc.
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getContacts();
      if (data) {
        setContacts(data);
      }
    } catch (err) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentContact) {
        // Update existing contact
        await ApiService.updateContact(currentContact.id, formData);
      } else {
        // Create new contact
        await ApiService.createContact(formData);
      }
      
      // Reset form and reload contacts
      resetForm();
      loadContacts();
    } catch (err) {
      setError('Failed to save contact');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editContact = (contact) => {
    setCurrentContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      status: contact.status || 'lead',
      notes: contact.notes || ''
    });
    setFormOpen(true);
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        await ApiService.deleteContact(id);
        loadContacts();
      } catch (err) {
        setError('Failed to delete contact');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      notes: ''
    });
    setFormOpen(false);
  };

  if (loading && contacts.length === 0) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {formOpen && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-medium mb-4">
            {currentContact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="lead">Lead</option>
                <option value="opportunity">Opportunity</option>
                <option value="customer">Customer</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentContact ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contacts found. Click "Add Contact" to create your first contact.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                      contact.status === 'opportunity' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => editContact(contact)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contacts;