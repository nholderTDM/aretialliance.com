import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ApiService from '../services/api';

const Performance = () => {
  const [performanceData, setPerformanceData] = useState({
    deliveryPerformance: [],
    driverPerformance: [],
    customerSatisfaction: [],
    deliveryStatus: { onTime: 0, delayed: 0, veryDelayed: 0 },
    avgDeliveryTime: 0,
    completionRate: 0
  });
  
  const [timeFrame, setTimeFrame] = useState('week'); // 'week', 'month', 'quarter'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPerformanceData();
  }, [timeFrame]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getPerformanceData(timeFrame);
      if (data) {
        setPerformanceData(data);
      }
    } catch (err) {
      setError('Failed to load performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Colors for the pie chart
  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

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

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">On-Time Delivery Rate</div>
          <div className="mt-1 text-3xl font-semibold">{(performanceData.completionRate * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Average Delivery Time</div>
          <div className="mt-1 text-3xl font-semibold">{performanceData.avgDeliveryTime} min</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Customer Satisfaction</div>
          <div className="mt-1 text-3xl font-semibold">{performanceData.avgSatisfactionScore}/5</div>
        </div>
      </div>
      
      {/* Time Frame Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Delivery Performance</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-3 py-1 rounded ${timeFrame === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-3 py-1 rounded ${timeFrame === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeFrame('quarter')}
              className={`px-3 py-1 rounded ${timeFrame === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Quarterly
            </button>
          </div>
        </div>
        
        {/* Delivery Performance Line Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData.deliveryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="deliveries" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Total Deliveries" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="onTimePercentage" 
                stroke="#82ca9d" 
                name="On-Time %" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Delivery Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Delivery Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'On Time', value: performanceData.deliveryStatus.onTime },
                    { name: 'Delayed', value: performanceData.deliveryStatus.delayed },
                    { name: 'Very Delayed', value: performanceData.deliveryStatus.veryDelayed }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'On Time', value: performanceData.deliveryStatus.onTime },
                    { name: 'Delayed', value: performanceData.deliveryStatus.delayed },
                    { name: 'Very Delayed', value: performanceData.deliveryStatus.veryDelayed }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} deliveries`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Customer Satisfaction Score */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Customer Satisfaction Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData.customerSatisfaction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [`${value}/5`, 'Satisfaction Score']} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#FF5722" 
                  strokeWidth={2}
                  name="Satisfaction Score" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Driver Performance */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Driver Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={performanceData.driverPerformance}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => [`${value}%`, 'On-Time Percentage']} />
              <Legend />
              <Bar 
                dataKey="onTimePercentage" 
                name="On-Time Delivery %" 
                fill="#1E88E5" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Performance Insights */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Performance Insights</h3>
        <div className="space-y-4">
          {performanceData.insights && performanceData.insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'positive' ? 'bg-green-50 border-green-500 text-green-700' :
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
              'bg-red-50 border-red-500 text-red-700'
            }`}>
              <h4 className="font-medium mb-1">{insight.title}</h4>
              <p className="text-sm">{insight.description}</p>
            </div>
          ))}
          {(!performanceData.insights || performanceData.insights.length === 0) && (
            <p className="text-gray-500 italic">No performance insights available for the selected time period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;