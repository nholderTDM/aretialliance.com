import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    quoteNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    status: 'pending', // 'pending', 'approved', 'rejected', 'expired'
    totalAmount: '',
    validUntil: '',
    pickupZip: '',
    deliveryZip: '',
    packageDetails: '',
    deliverySpeed: 'standard', // 'standard', 'same-day', 'rush', 'express'
    contactId: '',
    notes: ''
  });

  useEffect(() => {
    loadQuotes();
    loadContacts();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getQuotes();
      if (data) {
        setQuotes(data);
      }
    } catch (err) {
      setError('Failed to load quotes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await ApiService.getContacts();
      if (data) {
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQuoteNumber = () => {
    const prefix = 'QT';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const quoteData = {
        ...formData,
        quoteNumber: formData.quoteNumber || generateQuoteNumber(),
        validUntil: formData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      if (currentQuote) {
        // Update existing quote
        await ApiService.updateQuote(currentQuote.id, quoteData);
      } else {
        // Create new quote
        await ApiService.createQuote(quoteData);
      }
      
      // Reset form and reload quotes
      resetForm();
      loadQuotes();
    } catch (err) {
      setError('Failed to save quote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const convertToDelivery = async (quote) => {
    try {
      setLoading(true);
      // Create delivery from quote
      await ApiService.createDeliveryFromQuote(quote.id);
      // Update quote status
      await ApiService.updateQuote(quote.id, { ...quote, status: 'approved' });
      loadQuotes();
    } catch (err) {
      setError('Failed to convert quote to delivery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quote, newStatus) => {
    try {
      setLoading(true);
      await ApiService.updateQuote(quote.id, { ...quote, status: newStatus });
      loadQuotes();
    } catch (err) {
      setError(`Failed to update quote status to ${newStatus}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editQuote = (quote) => {
    setCurrentQuote(quote);
    setFormData({
      quoteNumber: quote.quoteNumber || '',
      customerName: quote.customerName || '',
      customerEmail: quote.customerEmail || '',
      customerPhone: quote.customerPhone || '',
      company: quote.company || '',
      status: quote.status || 'pending',
      totalAmount: quote.totalAmount || '',
      validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : '',
      pickupZip: quote.pickupZip || '',
      deliveryZip: quote.deliveryZip || '',
      packageDetails: quote.packageDetails || '',
      deliverySpeed: quote.deliverySpeed || 'standard',
      contactId: quote.contactId || '',
      notes: quote.notes || ''
    });
    setFormOpen(true);
  };

  const deleteQuote = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        setLoading(true);
        await ApiService.deleteQuote(id);
        loadQuotes();
      } catch (err) {
        setError('Failed to delete quote');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentQuote(null);
    setFormData({
      quoteNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      company: '',
      status: 'pending',
      totalAmount: '',
      validUntil: '',
      pickupZip: '',
      deliveryZip: '',
      packageDetails: '',
      deliverySpeed: 'standard',
      contactId: '',
      notes: ''
    });
    setFormOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliverySpeedBadgeClass = (speed) => {
    switch (speed) {
      case 'rush':
        return 'bg-red-100 text-red-800';
      case 'express':
        return 'bg-orange-100 text-orange-800';
      case 'same-day':
        return 'bg-blue-100 text-blue-800';
      case 'standard':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading && quotes.length === 0) {
    return <div>Loading quotes...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quotes</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Quote'}
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
            {currentQuote ? 'Edit Quote' : 'Add New Quote'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote Number
              </label>
              <input
                type="text"
                name="quoteNumber"
                value={formData.quoteNumber}
                onChange={handleInputChange}
                placeholder="Auto-generated if left blank"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
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
                Total Amount *
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Speed
              </label>
              <select
                name="deliverySpeed"
                value={formData.deliverySpeed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="standard">Standard</option>
                <option value="same-day">Same Day</option>
                <option value="express">Express</option>
                <option value="rush">Rush</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup ZIP Code
              </label>
              <input
                type="text"
                name="pickupZip"
                value={formData.pickupZip}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery ZIP Code
              </label>
              <input
                type="text"
                name="deliveryZip"
                value={formData.deliveryZip}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Details
            </label>
            <textarea
              name="packageDetails"
              value={formData.packageDetails}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., 2 small packages (5-20lbs), 1 medium package (20-50lbs)"
            ></textarea>
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
              {currentQuote ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {quotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No quotes found. Click "Add Quote" to create your first quote.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {quote.quoteNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{quote.customerName}</div>
                    <div className="text-sm text-gray-500">{quote.company || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{formatCurrency(quote.totalAmount)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className={`px-2 py-1 rounded ${getDeliverySpeedBadgeClass(quote.deliverySpeed)}`}>
                        {quote.deliverySpeed === 'same-day' ? 'Same Day' : 
                         quote.deliverySpeed?.charAt(0).toUpperCase() + quote.deliverySpeed?.slice(1) || 'Standard'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(quote.status)}`}>
                      {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(quote.validUntil)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {quote.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateQuoteStatus(quote, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateQuoteStatus(quote, 'rejected')}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {quote.status === 'approved' && (
                      <button
                        onClick={() => convertToDelivery(quote)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Create Delivery
                      </button>
                    )}
                    <button
                      onClick={() => editQuote(quote)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
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

export default Quotes;