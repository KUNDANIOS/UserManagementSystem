import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Shield, LogOut, Users, Crown, UserCheck, UserX, Eye, Settings, X, Filter } from 'lucide-react';
import './Auth.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      const isBlocked = statusFilter === 'blocked';
      filtered = filtered.filter(user => user.isBlocked === isBlocked);
    }

    setFilteredUsers(filtered);
  };

  const handleBlock = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert('Failed to block/unblock user');
    }
  };

  const handlePromote = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/promote/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert('Failed to promote user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        setShowUserModal(false);
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const blockedCount = users.filter(u => u.isBlocked).length;
  const activeCount = totalUsers - blockedCount;

  const stats = [
    { icon: <Users />, value: totalUsers, label: 'Total Users', color: '#6366f1' },
    { icon: <Crown />, value: adminCount, label: 'Administrators', color: '#8b5cf6' },
    { icon: <UserCheck />, value: activeCount, label: 'Active Users', color: '#10b981' },
    { icon: <UserX />, value: blockedCount, label: 'Blocked Users', color: '#ef4444' }
  ];

  return (
    <div className="dashboard admin">
      <nav className="navbar">
        <div className="nav-left">
          <div className="brand-logo-sm">
            <Shield size={24} />
            <span>Admin Panel</span>
          </div>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="btn btn-sm btn-danger">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage and monitor all registered users</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="control-panel">
          <div className="search-filter-section">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            Showing {filteredUsers.length} of {totalUsers} users
          </div>
        </div>

        <div className="table-container">
          {filteredUsers.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-sm">{user.name.charAt(0)}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${user.isBlocked ? 'blocked' : 'active'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => openUserModal(user)}
                          className="action-btn view"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleBlock(user._id)}
                          className={`action-btn ${user.isBlocked ? 'edit' : 'delete'}`}
                          title={user.isBlocked ? 'Unblock' : 'Block'}
                        >
                          {user.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handlePromote(user._id)}
                            className="action-btn edit"
                            title="Promote to Admin"
                          >
                            <Crown size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="action-btn delete"
                          title="Delete User"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <span style={{ fontSize: '48px' }}>🔍</span>
              <h3>No users found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUserModal(false)}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <div className="avatar-lg">{selectedUser.name.charAt(0)}</div>
              <h2>{selectedUser.name}</h2>
              <p>{selectedUser.email}</p>
            </div>

            <div className="modal-body">
              <div className="modal-info">
                <div className="info-row">
                  <span className="label">Role</span>
                  <span className={`badge badge-${selectedUser.role}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Status</span>
                  <span className={`badge badge-${selectedUser.isBlocked ? 'blocked' : 'active'}`}>
                    {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Joined</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Last Updated</span>
                  <span>{new Date(selectedUser.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  handleBlock(selectedUser._id);
                  setShowUserModal(false);
                }}
                className={`btn ${selectedUser.isBlocked ? 'btn-secondary' : 'btn-danger'}`}
              >
                {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
              </button>
              {selectedUser.role !== 'admin' && (
                <button 
                  onClick={() => {
                    handlePromote(selectedUser._id);
                    setShowUserModal(false);
                  }}
                  className="btn btn-secondary"
                >
                  Promote to Admin
                </button>
              )}
              <button 
                onClick={() => handleDelete(selectedUser._id)}
                className="btn btn-danger"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;