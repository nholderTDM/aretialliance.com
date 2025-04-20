// components/Organizations.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    size: 'small', // 'small', 'medium', 'large'
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getOrganizations();
      if (data) {
        setOrganizations(data);
      }
    } catch (err) {
      setError('Failed to load organizations');
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
      
      if (currentOrg) {
        // Update existing organization
        await ApiService.updateOrganization(currentOrg.id, formData);
      } else {
        // Create new organization
        await ApiService.createOrganization(formData);
      }
      
      // Reset form and reload organizations
      resetForm();
      loadOrganizations();
    } catch (err) {
      setError('Failed to save organization');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editOrganization = (org) => {
    setCurrentOrg(org);
    setFormData({
      name: org.name,
      industry: org.industry || '',
      website: org.website || '',
      size: org.size || 'small',
      address: org.address || '',
      notes: org.notes || ''
    });
    setFormOpen(true);
  };

  const deleteOrganization = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        setLoading(true);
        await ApiService.deleteOrganization(id);
        loadOrganizations();
      } catch (err) {
        setError('Failed to delete organization');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentOrg(null);
    setFormData({
      name: '',
      industry: '',
      website: '',
      size: 'small',
      address: '',
      notes: ''
    });
    setFormOpen(false);
  };

  if (loading && organizations.length === 0) {
    return <div>Loading organizations...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Organizations</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Organization'}
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
            {currentOrg ? 'Edit Organization' : 'Add New Organization'}
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
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="small">Small (1-50)</option>
                <option value="medium">Medium (51-500)</option>
                <option value="large">Large (500+)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
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
              {currentOrg ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {organizations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No organizations found. Click "Add Organization" to create your first organization.
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
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.industry || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.size === 'small' ? 'Small (1-50)' : 
                     org.size === 'medium' ? 'Medium (51-500)' : 
                     'Large (500+)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.website ? (
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {org.website.replace(/^https?:\/\//i, '')}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => editOrganization(org)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOrganization(org.id)}
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

export default Organizations;