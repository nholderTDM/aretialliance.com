import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ApiService from '../services/api';

const Revenue = () => {
  const [revenueData, setRevenueData] = useState({
    monthly: [],
    quarterly: [],
    yearly: [],
    byService: [],
    totalYear: 0,
    totalMonth: 0,
    comparisonToLastMonth: 0,
    comparisonToLastYear: 0
  });
  
  const [dateRange, setDateRange] = useState('month'); // 'month', 'quarter', 'year'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRevenueData();
  }, [dateRange]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getRevenueData(dateRange);
      if (data) {
        setRevenueData(data);
      }
    } catch (err) {
      setError('Failed to load revenue data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getComparisonColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getComparisonArrow = (value) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  const formatPercentage = (value) => {
    return `${getComparisonArrow(value)} ${Math.abs(value).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        {error}
      </div>
    );
  }

  // Determine which data to display based on the selected date range
  const chartData = dateRange === 'month' 
    ? revenueData.monthly 
    : dateRange === 'quarter' 
      ? revenueData.quarterly 
      : revenueData.yearly;

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Revenue (This Year)</div>
          <div className="mt-1 flex items-end">
            <div className="text-2xl font-semibold mr-2">{formatCurrency(revenueData.totalYear)}</div>
            <div className={`text-sm ${getComparisonColor(revenueData.comparisonToLastYear)}`}>
              {formatPercentage(revenueData.comparisonToLastYear)}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Revenue (This Month)</div>
          <div className="mt-1 flex items-end">
            <div className="text-2xl font-semibold mr-2">{formatCurrency(revenueData.totalMonth)}</div>
            <div className={`text-sm ${getComparisonColor(revenueData.comparisonToLastMonth)}`}>
              {formatPercentage(revenueData.comparisonToLastMonth)}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Average Order Value</div>
          <div className="mt-1 text-2xl font-semibold">{formatCurrency(revenueData.averageOrderValue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Highest Revenue Route</div>
          <div className="mt-1">
            <div className="text-2xl font-semibold">{revenueData.highestRevenueRoute?.name || '-'}</div>
            <div className="text-sm text-gray-500">{formatCurrency(revenueData.highestRevenueRoute?.amount || 0)}</div>
          </div>
        </div>
      </div>
      
      {/* Revenue Period Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Revenue Trend</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1 rounded ${dateRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-1 rounded ${dateRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1 rounded ${dateRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Yearly
            </button>
          </div>
        </div>
        
        {/* Revenue Line Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#1E88E5" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Revenue by Service Type */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Revenue by Service Type</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData.byService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="amount" fill="#FF5722" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Top Customers */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Customers by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  # of Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.topCustomers?.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(customer.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.orderCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(customer.averageOrderValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;