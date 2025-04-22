// File: areti-dash-crm/src/components/Drivers.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [syncStats, setSyncStats] = useState({ lastSync: null, count: null });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'car', // 'car', 'suv', 'cargo', 'truck'
    licenseNumber: '',
    status: 'active', // 'active', 'inactive', 'pending'
    address: '',
    city: '',
    state: '',
    notes: '',
    applicationDate: ''
  });

  useEffect(() => {
    loadDrivers();
    loadSyncStats();
  }, []);

  // Load sync statistics from localStorage
  const loadSyncStats = () => {
    try {
      const lastSync = localStorage.getItem('lastDriverSync');
      const syncCount = localStorage.getItem('lastDriverSyncCount');
      
      if (lastSync) {
        setSyncStats({
          lastSync: new Date(lastSync),
          count: syncCount ? parseInt(syncCount) : null
        });
      }
    } catch (err) {
      console.error('Error loading sync stats:', err);
    }
  };

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDrivers();
      if (data) {
        setDrivers(data);
      }
    } catch (err) {
      setError('Failed to load drivers');
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
      
      if (currentDriver) {
        // Update existing driver
        await ApiService.updateDriver(currentDriver.id, formData);
      } else {
        // Create new driver
        await ApiService.createDriver(formData);
      }
      
      // Reset form and reload drivers
      resetForm();
      loadDrivers();
    } catch (err) {
      setError('Failed to save driver');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to sync with Google Sheets
  const syncWithGoogleSheets = async () => {
    if (!window.confirm('This will import new driver applications from Google Sheets. Continue?')) {
      return;
    }
    
    try {
      setSyncLoading(true);
      setSyncMessage(null);
      
      const response = await fetch('/api/sync/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const message = `Successfully imported ${data.imported} new driver${data.imported !== 1 ? 's' : ''} and updated ${data.updated} existing driver${data.updated !== 1 ? 's' : ''}.`;
        setSyncMessage({
          type: 'success',
          text: message
        });
        
        // Save sync stats to localStorage
        localStorage.setItem('lastDriverSync', new Date().toISOString());
        localStorage.setItem('lastDriverSyncCount', data.imported + data.updated);
        
        // Update the stats in state
        setSyncStats({
          lastSync: new Date(),
          count: data.imported + data.updated
        });
        
        // Reload drivers to show the imported data
        loadDrivers();
      } else {
        setSyncMessage({
          type: 'error',
          text: data.error || 'Failed to sync with Google Sheets.'
        });
      }
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: `Error: ${err.message}`
      });
      console.error('Sync error:', err);
    } finally {
      setSyncLoading(false);
    }
  };

  const editDriver = (driver) => {
    setCurrentDriver(driver);
    setFormData({
      name: driver.name || '',
      email: driver.email || '',
      phone: driver.phone || '',
      vehicleType: driver.vehicleType || 'car',
      licenseNumber: driver.licenseNumber || '',
      status: driver.status || 'active',
      address: driver.address || '',
      city: driver.city || '',
      state: driver.state || '',
      notes: driver.notes || '',
      applicationDate: driver.applicationDate ? new Date(driver.applicationDate).toISOString().split('T')[0] : ''
    });
    setFormOpen(true);
  };

  const deleteDriver = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        setLoading(true);
        await ApiService.deleteDriver(id);
        loadDrivers();
      } catch (err) {
        setError('Failed to delete driver');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const changeDriverStatus = async (driver, newStatus) => {
    try {
      setLoading(true);
      await ApiService.updateDriver(driver.id, { ...driver, status: newStatus });
      loadDrivers();
    } catch (err) {
      setError(`Failed to update driver status to ${newStatus}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentDriver(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicleType: 'car',
      licenseNumber: '',
      status: 'active',
      address: '',
      city: '',
      state: '',
      notes: '',
      applicationDate: ''
    });
    setFormOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX if 10 digits
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    // Return as-is if not 10 digits
    return phone;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && drivers.length === 0) {
    return <div>Loading drivers...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Drivers</h2>
          {syncStats.lastSync && (
            <div className="text-xs text-gray-500">
              Last synced: {syncStats.lastSync.toLocaleString()} 
              {syncStats.count !== null && ` • ${syncStats.count} driver${syncStats.count !== 1 ? 's' : ''} imported/updated`}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={syncWithGoogleSheets}
            disabled={syncLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            {syncLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Sync from Google Sheets
              </>
            )}
          </button>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {formOpen ? 'Cancel' : 'Add Driver'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {syncMessage && (
        <div className={`${syncMessage.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 mb-4 flex justify-between items-center`}>
          <div>{syncMessage.text}</div>
          <button 
            onClick={() => setSyncMessage(null)} 
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
      )}

      {formOpen && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-medium mb-4">
            {currentDriver ? 'Edit Driver' : 'Add New Driver'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                placeholder="XXX-XXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="cargo">Cargo Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
            {currentDriver && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Date
                </label>
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
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
              {currentDriver ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {drivers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No drivers found. Click "Add Driver" to create your first driver.
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-xs text-gray-500">
                      {driver.applicationDate && `Applied: ${formatDate(driver.applicationDate)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{driver.email}</div>
                    <div className="text-sm text-gray-500">{formatPhoneNumber(driver.phone)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.vehicleType?.charAt(0).toUpperCase() + driver.vehicleType?.slice(1) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.city && driver.state ? `${driver.city}, ${driver.state}` : 
                     driver.city ? driver.city : 
                     driver.state ? driver.state : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(driver.status)}`}>
                      {driver.status?.charAt(0).toUpperCase() + driver.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {driver.status === 'pending' && (
                      <button
                        onClick={() => changeDriverStatus(driver, 'active')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                    )}
                    {driver.status === 'active' && (
                      <button
                        onClick={() => changeDriverStatus(driver, 'inactive')}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        Deactivate
                      </button>
                    )}
                    {driver.status === 'inactive' && (
                      <button
                        onClick={() => changeDriverStatus(driver, 'active')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => editDriver(driver)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDriver(driver.id)}
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

export default Drivers;