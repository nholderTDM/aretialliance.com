import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    trackingNumber: '',
    description: '',
    status: 'pending', // 'pending', 'in-transit', 'delivered', 'canceled'
    priority: 'standard', // 'standard', 'express', 'rush'
    pickupAddress: '',
    deliveryAddress: '',
    scheduledDate: '',
    organizationId: '',
    driverId: '',
    notes: ''
  });

  useEffect(() => {
    loadDeliveries();
    loadDrivers();
    loadOrganizations();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDeliveries();
      if (data) {
        setDeliveries(data);
      }
    } catch (err) {
      setError('Failed to load deliveries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const data = await ApiService.getDrivers();
      if (data) {
        setDrivers(data);
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    }
  };

  const loadOrganizations = async () => {
    try {
      const data = await ApiService.getOrganizations();
      if (data) {
        setOrganizations(data);
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
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
      
      const deliveryData = {
        ...formData,
        trackingNumber: formData.trackingNumber || generateTrackingNumber()
      };
      
      if (currentDelivery) {
        // Update existing delivery
        await ApiService.updateDelivery(currentDelivery.id, deliveryData);
      } else {
        // Create new delivery
        await ApiService.createDelivery(deliveryData);
      }
      
      // Reset form and reload deliveries
      resetForm();
      loadDeliveries();
    } catch (err) {
      setError('Failed to save delivery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingNumber = () => {
    const prefix = 'ARETI';
    const timestamp = new Date().getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const editDelivery = (delivery) => {
    setCurrentDelivery(delivery);
    setFormData({
      trackingNumber: delivery.trackingNumber || '',
      description: delivery.description || '',
      status: delivery.status || 'pending',
      priority: delivery.priority || 'standard',
      pickupAddress: delivery.pickupAddress || '',
      deliveryAddress: delivery.deliveryAddress || '',
      scheduledDate: delivery.scheduledDate ? new Date(delivery.scheduledDate).toISOString().split('T')[0] : '',
      organizationId: delivery.organizationId || '',
      driverId: delivery.driverId || '',
      notes: delivery.notes || ''
    });
    setFormOpen(true);
  };

  const deleteDelivery = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        setLoading(true);
        await ApiService.deleteDelivery(id);
        loadDeliveries();
      } catch (err) {
        setError('Failed to delete delivery');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateDeliveryStatus = async (delivery, newStatus) => {
    try {
      setLoading(true);
      await ApiService.updateDelivery(delivery.id, { ...delivery, status: newStatus });
      loadDeliveries();
    } catch (err) {
      setError(`Failed to update delivery status to ${newStatus}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentDelivery(null);
    setFormData({
      trackingNumber: '',
      description: '',
      status: 'pending',
      priority: 'standard',
      pickupAddress: '',
      deliveryAddress: '',
      scheduledDate: '',
      organizationId: '',
      driverId: '',
      notes: ''
    });
    setFormOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'rush':
        return 'bg-red-100 text-red-800';
      case 'express':
        return 'bg-orange-100 text-orange-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && deliveries.length === 0) {
    return <div>Loading deliveries...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Deliveries</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Delivery'}
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
            {currentDelivery ? 'Edit Delivery' : 'Add New Delivery'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                placeholder="Auto-generated if left blank"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
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
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="rush">Rush</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Driver
              </label>
              <select
                name="driverId"
                value={formData.driverId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <select
                name="organizationId"
                value={formData.organizationId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Address *
              </label>
              <textarea
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border rounded"
              ></textarea>
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
              {currentDelivery ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {deliveries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No deliveries found. Click "Add Delivery" to create your first delivery.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {delivery.trackingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{delivery.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className={`px-2 py-1 rounded ${getPriorityBadgeClass(delivery.priority)}`}>
                        {delivery.priority?.charAt(0).toUpperCase() + delivery.priority?.slice(1) || 'Standard'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(delivery.status)}`}>
                      {delivery.status === 'in-transit' ? 'In Transit' : 
                       delivery.status?.charAt(0).toUpperCase() + delivery.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {delivery.driverId ? 
                      drivers.find(d => d.id === delivery.driverId)?.name || '-' : 
                      '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(delivery.scheduledDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery, 'in-transit')}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Start
                      </button>
                    )}
                    {delivery.status === 'in-transit' && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery, 'delivered')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => editDelivery(delivery)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDelivery(delivery.id)}
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

export default Deliveries;