import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Edit, Filter } from 'lucide-react';
import type { User, PaginatedResponse, CreateUserRequest, UpdateUserRequest } from '../types';
import { apiService } from '../services/apiService';
import { LoadingSpinner } from '../components/Loading';
import UserModal from '../components/UserModal';

interface UserTableProps {
  users: User[];
  onDelete: (userId: string) => void;
  onEdit: (user: User) => void;
  loading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onEdit, loading }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (userId: string) => {
    if (deleteConfirm === userId) {
      await onDelete(userId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(userId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && (!users || users.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users) ? users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {user.bio || 'No bio provided'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={`${
                        deleteConfirm === user.id
                          ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      {deleteConfirm === user.id ? (
                        <span className="text-xs">Confirm?</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )) : []}
          </tbody>
        </table>
      </div>
      
      {(!users || users.length === 0) && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (page = 0, search = '', role = 'all') => {
    try {
      setLoading(true);
      setError('');
      setConnectionStatus('connecting');
      
      // Debug logging
      console.log('Fetching users with params:', { page, search, role, pageSize: pagination.size });
      
      // Check if user is authenticated before making API calls
      const authStatus = apiService.getCurrentAuthStatus();
      if (!authStatus.hasToken) {
        setError('Not authenticated. Please log in again.');
        setConnectionStatus('disconnected');
        return;
      }
      
      let response: PaginatedResponse<User>;
      
      if (search) {
        // Use search endpoint
        const searchResults = await apiService.searchUsers(search);
        response = {
          content: searchResults,
          page: 0,
          size: searchResults.length,
          totalElements: searchResults.length,
          totalPages: 1,
          first: true,
          last: true,
        };
      } else {
        // Use paginated endpoint
        response = await apiService.getAllUsers({
          page,
          size: pagination.size,
          role: role === 'all' ? undefined : role,
        });
      }
      
      console.log('Received response:', response);
      
      setUsers(response.content);
      setPagination({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      });
      setConnectionStatus('connected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      
      // Check if it's a network error
      const isNetworkError = errorMessage.includes('Failed to fetch') || 
                            errorMessage.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') ||
                            errorMessage.includes('network') ||
                            errorMessage.includes('connection');
      
      if (isNetworkError) {
        setError('Connection Error\n\nUsing demo data. Failed to fetch');
        setConnectionStatus('disconnected');
      } else {
        setError(errorMessage);
        setConnectionStatus('disconnected');
      }
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('Authentication required') || errorMessage.includes('401')) {
        window.location.href = '/login';
        return; // Don't show mock data for auth errors
      }
      
      // Set mock data for demo when there's a network error
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'STUDENT',
          bio: 'Passionate learner interested in technology',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'INSTRUCTOR',
          bio: 'Experienced software developer and teacher',
          createdAt: '2024-01-10T14:30:00Z',
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@skillup.com',
          role: 'ADMIN',
          bio: 'Platform administrator',
          createdAt: '2024-01-01T09:00:00Z',
        },
        {
          id: '4',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          role: 'STUDENT',
          bio: 'Marketing professional learning new skills',
          createdAt: '2024-01-20T11:00:00Z',
        },
        {
          id: '5',
          name: 'Mike Wilson',
          email: 'mike.wilson@example.com',
          role: 'INSTRUCTOR',
          bio: 'Data science expert and course creator',
          createdAt: '2024-01-05T16:00:00Z',
        },
      ];
      
      // Filter mock data based on current filters
      let filteredUsers = mockUsers;
      if (roleFilter !== 'all') {
        filteredUsers = mockUsers.filter(user => user.role === roleFilter);
      }
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Simulate pagination for demo data
      const startIndex = page * pagination.size;
      const endIndex = startIndex + pagination.size;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      setUsers(paginatedUsers);
      setPagination({
        page,
        size: pagination.size,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / pagination.size),
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.size, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(0, searchTerm, roleFilter);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    fetchUsers(0, searchTerm, role);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiService.deleteUser(userId);
      setUsers((prevUsers) => Array.isArray(prevUsers) ? prevUsers.filter(user => user.id !== userId) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleSaveUser = async (userData: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await apiService.updateUser(editingUser.id, userData as UpdateUserRequest);
        setUsers((prevUsers) => Array.isArray(prevUsers) ? prevUsers.map(user => user.id === editingUser.id ? updatedUser : user) : []);
      } else {
        // Create new user
        const newUser = await apiService.createUser(userData as CreateUserRequest);
        setUsers((prevUsers) => [newUser, ...(Array.isArray(prevUsers) ? prevUsers : [])]);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save user');
    }
  };

  const handleCloseModal = () => {
    setUserModalOpen(false);
    setEditingUser(null);
  };

  const handlePageChange = (newPage: number) => {
    // Clear any existing errors when changing pages
    setError('');
    fetchUsers(newPage, searchTerm, roleFilter);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`} />
              <span className={`text-xs font-medium ${
                connectionStatus === 'connected' ? 'text-green-600' :
                connectionStatus === 'connecting' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Offline'}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Manage all users on your platform
          </p>
        </div>
        <button onClick={handleCreateUser} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm font-medium">
                {error.includes('Access denied') || error.includes('Admin privileges') ? 'Access Denied' : 'Connection Error'}
              </p>
              <p className="text-sm mt-1">
                {error.includes('Access denied') || error.includes('Admin privileges') 
                  ? 'You need admin privileges to access this dashboard. Please log in with an admin account.'
                  : error.includes('Authentication required')
                  ? 'Your session has expired. Please log in again.'
                  : error.includes('Connection Error')
                  ? 'Unable to connect to server. Showing demo data instead.'
                  : `Using demo data. ${error}`
                }
              </p>
              <div className="mt-2 flex gap-2">
                {(error.includes('Access denied') || error.includes('Authentication required')) && (
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Go to Login
                  </button>
                )}
                {error.includes('Connection Error') && (
                  <button 
                    onClick={() => {
                      setError('');
                      setConnectionStatus('connecting');
                      fetchUsers(pagination.page, searchTerm, roleFilter);
                    }}
                    disabled={loading || connectionStatus === 'connecting'}
                    className="text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    {loading || connectionStatus === 'connecting' ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      'Retry Connection'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="input w-auto"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UserTable users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} loading={loading} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} users
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
};

export default UsersPage;
