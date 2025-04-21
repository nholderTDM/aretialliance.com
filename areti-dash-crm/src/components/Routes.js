import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startLocation: '',
    endLocation: '',
    distance: '',
    estimatedTime: '',
    status: 'active', // 'active', 'inactive'
    averageDeliveries: '',
    deliveryDays: [], // array of days this route is active
    notes: ''
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getRoutes();
      if (data) {
        setRoutes(data);
      }
    } catch (err) {
      setError('Failed to load routes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        deliveryDays: [...prev.deliveryDays, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        deliveryDays: prev.deliveryDays.filter(day => day !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentRoute) {
        // Update existing route
        await ApiService.updateRoute(currentRoute.id, formData);
      } else {
        // Create new route
        await ApiService.createRoute(formData);
      }
      
      // Reset form and reload routes
      resetForm();
      loadRoutes();
    } catch (err) {
      setError('Failed to save route');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editRoute = (route) => {
    setCurrentRoute(route);
    setFormData({
      name: route.name,
      startLocation: route.startLocation || '',
      endLocation: route.endLocation || '',
      distance: route.distance || '',
      estimatedTime: route.estimatedTime || '',
      status: route.status || 'active',
      averageDeliveries: route.averageDeliveries || '',
      deliveryDays: route.deliveryDays || [],
      notes: route.notes || ''
    });
    setFormOpen(true);
  };

  const deleteRoute = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        setLoading(true);
        await ApiService.deleteRoute(id);
        loadRoutes();
      } catch (err) {
        setError('Failed to delete route');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentRoute(null);
    setFormData({
      name: '',
      startLocation: '',
      endLocation: '',
      distance: '',
      estimatedTime: '',
      status: 'active',
      averageDeliveries: '',
      deliveryDays: [],
      notes: ''
    });
    setFormOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && routes.length === 0) {
    return <div>Loading routes...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Routes</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Route'}
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
            {currentRoute ? 'Edit Route' : 'Add New Route'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Route Name *
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Location *
              </label>
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Location *
              </label>
              <input
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (miles)
              </label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Deliveries (per day)
              </label>
              <input
                type="number"
                name="averageDeliveries"
                value={formData.averageDeliveries}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Days
            </label>
            <div className="flex flex-wrap gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`day-${day.toLowerCase()}`}
                    value={day}
                    checked={formData.deliveryDays.includes(day)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor={`day-${day.toLowerCase()}`}>{day}</label>
                </div>
              ))}
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
              {currentRoute ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {routes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No routes found. Click "Add Route" to create your first route.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {route.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div><span className="font-medium">From:</span> {route.startLocation}</div>
                      <div><span className="font-medium">To:</span> {route.endLocation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{route.distance ? `${route.distance} miles` : '-'}</div>
                    <div className="text-sm text-gray-500">
                      {route.estimatedTime ? `${route.estimatedTime} minutes` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(route.status)}`}>
                      {route.status?.charAt(0).toUpperCase() + route.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {route.deliveryDays?.length > 0 
                        ? route.deliveryDays.join(', ')
                        : 'No regular schedule'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {route.averageDeliveries ? `Avg: ${route.averageDeliveries} deliveries/day` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => editRoute(route)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoute(route.id)}
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

export default Routes;