// components/Tasks.js
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium', // 'low', 'medium', 'high'
    status: 'pending', // 'pending', 'in-progress', 'completed'
    contactId: '',
  });

  useEffect(() => {
    loadTasks();
    loadContacts();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getTasks();
      if (data) {
        setTasks(data);
      }
    } catch (err) {
      setError('Failed to load tasks');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentTask) {
        // Update existing task
        await ApiService.updateTask(currentTask.id, formData);
      } else {
        // Create new task
        await ApiService.createTask(formData);
      }
      
      // Reset form and reload tasks
      resetForm();
      loadTasks();
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      contactId: task.contactId || '',
    });
    setFormOpen(true);
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await ApiService.deleteTask(id);
        loadTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      setLoading(true);
      await ApiService.updateTask(task.id, { ...task, status: newStatus });
      loadTasks();
    } catch (err) {
      setError(`Failed to update task status to ${newStatus}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      contactId: '',
    });
    setFormOpen(false);
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && tasks.length === 0) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {formOpen ? 'Cancel' : 'Add Task'}
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
            {currentTask ? 'Edit Task' : 'Add New Task'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
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
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Associated Contact
              </label>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">None</option>
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
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
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
              {currentTask ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Click "Add Task" to create your first task.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(task.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.contactId ? 
                      contacts.find(c => c.id === task.contactId)?.name || '-' : 
                      '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateTaskStatus(task, 'completed')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => editTask(task)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
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

export default Tasks;