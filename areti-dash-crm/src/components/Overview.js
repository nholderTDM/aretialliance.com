// components/Overview.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Overview = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalOrganizations: 0,
    tasksByStatus: {
      pending: 0,
      inProgress: 0,
      completed: 0
    },
    recentTasks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from API
        const contacts = await ApiService.getContacts();
        const organizations = await ApiService.getOrganizations();
        const tasks = await ApiService.getTasks();
        
        // Calculate stats
        const tasksByStatus = {
          pending: tasks?.filter(t => t.status === 'pending').length || 0,
          inProgress: tasks?.filter(t => t.status === 'in-progress').length || 0,
          completed: tasks?.filter(t => t.status === 'completed').length || 0
        };
        
        // Get recent tasks (last 5)
        const recentTasks = tasks
          ? tasks
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5)
          : [];
        
        setStats({
          totalContacts: contacts?.length || 0,
          totalOrganizations: organizations?.length || 0,
          tasksByStatus,
          recentTasks
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Contacts</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalContacts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Organizations</div>
          <div className="mt-1 text-3xl font-semibold">{stats.totalOrganizations}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Tasks Overview</div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-medium">{stats.tasksByStatus.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">In Progress</span>
              <span className="font-medium">{stats.tasksByStatus.inProgress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-medium">{stats.tasksByStatus.completed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Tasks</h3>
        {stats.recentTasks.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTasks.map(task => (
              <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : 
                     task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No recent tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;