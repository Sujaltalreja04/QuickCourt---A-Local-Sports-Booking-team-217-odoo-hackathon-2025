import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Users, 
  Shield,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { useFacilities } from '../context/FacilityContext';
import { useUsers } from '../context/UserContext';
import { NotificationContainer, NotificationProps } from '../components/Notification';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const { facilities, approveFacility, rejectFacility } = useFacilities();
  const { users, banUser, unbanUser, deleteUser, getUsersByRole, getActiveUsers, getBannedUsers } = useUsers();

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'approvals', label: 'Facility Approvals', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: Shield },
  ];

  // Notification functions
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = `notification_${Date.now()}`;
    const notification: NotificationProps = {
      id,
      type,
      title,
      message,
      duration: 5000,
      onClose: removeNotification
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderSidebar = () => (
    <nav className="mt-8">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-orange-600 text-white border-r-2 border-orange-400'
              : 'text-white hover:text-orange-300 hover:bg-white/10'
          }`}
        >
          <item.icon size={20} />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent facilities={facilities} users={users} onTabChange={setActiveTab} />;
      case 'approvals':
        return <ApprovalsContent 
          facilities={facilities} 
          onApprove={approveFacility} 
          onReject={rejectFacility}
          onNotification={addNotification}
        />;
      case 'users':
        return <UsersContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <OverviewContent facilities={facilities} users={users} onTabChange={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout 
      sidebar={renderSidebar()} 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      {renderContent()}
      
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </DashboardLayout>
  );
};

const OverviewContent: React.FC<{ facilities: any[], users: any[], onTabChange: (tab: string) => void }> = ({ facilities, users, onTabChange }) => {
  const pendingFacilities = facilities.filter(f => f.status === 'pending');
  const approvedFacilities = facilities.filter(f => f.status === 'approved');
  const rejectedFacilities = facilities.filter(f => f.status === 'rejected');

  // Get user statistics from context
  const { getUsersByRole, getActiveUsers, getBannedUsers } = useUsers();
  const totalUsers = users.length;
  const activeUsers = getActiveUsers().length;
  const bannedUsers = getBannedUsers().length;
  const userUsers = getUsersByRole('user').length;
  const ownerUsers = getUsersByRole('owner').length;
  const adminUsers = getUsersByRole('admin').length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Facilities',
      value: facilities.length.toString(),
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Pending Approvals',
      value: pendingFacilities.length.toString(),
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600',
      trend: { value: pendingFacilities.length, isUp: pendingFacilities.length > 0 },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-gray-300 mt-1">Monitor platform performance and manage operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Platform Activity */}
        <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Activity</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-2" />
              <p>Activity chart would go here</p>
              <p className="text-sm">Showing user engagement trends</p>
            </div>
          </div>
        </div>

        {/* Facility Status Distribution */}
        <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Facility Status Distribution</h2>
          <div className="space-y-4">
            {[
              { status: 'Approved', count: approvedFacilities.length, color: 'bg-green-500', percentage: facilities.length > 0 ? Math.round((approvedFacilities.length / facilities.length) * 100) : 0 },
              { status: 'Pending', count: pendingFacilities.length, color: 'bg-yellow-500', percentage: facilities.length > 0 ? Math.round((pendingFacilities.length / facilities.length) * 100) : 0 },
              { status: 'Rejected', count: rejectedFacilities.length, color: 'bg-red-500', percentage: facilities.length > 0 ? Math.round((rejectedFacilities.length / facilities.length) * 100) : 0 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{item.status}</p>
                  <p className="text-sm text-gray-300">{item.count} facilities</p>
                </div>
                <div className="w-32">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">Pending Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-yellow-500/30 rounded-lg p-4 bg-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-300">Facility Approvals</h3>
                <p className="text-2xl font-bold text-yellow-200">{pendingFacilities.length}</p>
              </div>
              <AlertTriangle className="text-yellow-400" size={24} />
            </div>
            <button 
              onClick={() => onTabChange('approvals')}
              className="mt-3 text-sm text-yellow-300 font-medium hover:text-yellow-200"
            >
              Review Pending →
            </button>
          </div>

          <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-300">User Management</h3>
                <p className="text-2xl font-bold text-blue-200">{users.length}</p>
              </div>
              <Users className="text-blue-400" size={24} />
            </div>
            <button 
              onClick={() => onTabChange('users')}
              className="mt-3 text-sm text-blue-300 font-medium hover:text-blue-200"
            >
              Manage Users →
            </button>
          </div>

          <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-300">User Reports</h3>
                <p className="text-2xl font-bold text-red-200">5</p>
              </div>
              <Shield className="text-red-400" size={24} />
            </div>
            <button className="mt-3 text-sm text-red-300 font-medium hover:text-red-200">
              Handle Reports →
            </button>
          </div>

          <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-300">System Alerts</h3>
                <p className="text-2xl font-bold text-blue-200">3</p>
              </div>
              <AlertTriangle className="text-blue-400" size={24} />
            </div>
            <button className="mt-3 text-sm text-blue-300 font-medium hover:text-blue-200">
              View Alerts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApprovalsContent: React.FC<{ 
  facilities: any[], 
  onApprove: (id: string) => void, 
  onReject: (id: string) => void,
  onNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void
}> = ({ facilities, onApprove, onReject, onNotification }) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const filteredFacilities = facilities.filter(f => f.status === filter);
  const pendingCount = facilities.filter(f => f.status === 'pending').length;
  const approvedCount = facilities.filter(f => f.status === 'approved').length;
  const rejectedCount = facilities.filter(f => f.status === 'rejected').length;

  const handleApprove = (facility: any) => {
    onApprove(facility.id);
    onNotification(
      'success',
      'Facility Approved! ✅',
      `"${facility.name}" has been approved and is now visible to users.`
    );
    // Force re-render to show updated status
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReject = (facility: any) => {
    onReject(facility.id);
    onNotification(
      'warning',
      'Facility Rejected! ❌',
      `"${facility.name}" has been rejected. Owner will be notified.`
    );
    // Force re-render to show updated status
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Facility Approvals</h1>
        <p className="text-gray-300 mt-1">Review and approve pending facility registrations</p>
      </div>

      <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex space-x-4">
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button 
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button 
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredFacilities.length === 0 ? (
            <div className="text-center py-12">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 text-lg">No {filter} facilities found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter === 'pending' ? 'All pending facilities have been processed' : 
                 filter === 'approved' ? 'No facilities have been approved yet' : 
                 'No facilities have been rejected'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFacilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border border-white/20 rounded-lg p-6 bg-white/5 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-6">
                    <img
                      src={facility.images[0]}
                      alt={facility.name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{facility.name}</h3>
                          <div className="flex items-center text-gray-400 mt-1">
                            <MapPin size={16} className="mr-1" />
                            <span className="text-sm">{facility.location}</span>
                          </div>
                          <p className="text-gray-300 mt-2">{facility.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          facility.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          facility.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {facility.status === 'pending' ? 'Pending Review' :
                           facility.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-medium text-white mb-2">Sports Offered</h4>
                          <div className="flex flex-wrap gap-2">
                            {facility.sports.map((sport: string) => (
                              <span key={sport} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                                {sport}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {facility.amenities.slice(0, 3).map((amenity: string) => (
                              <span key={amenity} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                                {amenity}
                              </span>
                            ))}
                            {facility.amenities.length > 3 && (
                              <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-1 rounded-full border border-gray-500/30">
                                +{facility.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                          <span className="font-medium">Price:</span> ₹{facility.pricePerHour}/hour
                        </div>
                        
                        {facility.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleReject(facility)}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </button>
                            <button 
                              onClick={() => handleApprove(facility)}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </button>
                          </div>
                        )}
                        
                        {facility.status === 'approved' && (
                          <div className="flex items-center text-green-400">
                            <CheckCircle size={16} className="mr-2" />
                            <span className="text-sm">Approved on {new Date(facility.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {facility.status === 'rejected' && (
                          <div className="flex items-center text-red-400">
                            <XCircle size={16} className="mr-2" />
                            <span className="text-sm">Rejected on {new Date(facility.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersContent: React.FC = () => {
  const { users, banUser, unbanUser, deleteUser, getUsersByRole } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'owner' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<string | null>(null);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBanUser = (userId: string) => {
    banUser(userId);
    // Show notification
    const user = users.find(u => u.id === userId);
    if (user) {
      // You can add notification here if needed
      console.log(`User ${user.name} has been banned`);
      // Force re-render to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleUnbanUser = (userId: string) => {
    unbanUser(userId);
    // Show notification
    const user = users.find(u => u.id === userId);
    if (user) {
      // You can add notification here if needed
      console.log(`User ${user.name} has been unbanned`);
      // Force re-render to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setShowDeleteConfirm(null);
    // Show notification
    const user = users.find(u => u.id === userId);
    if (user) {
      // You can add notification here if needed
      console.log(`User ${user.name} has been deleted`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-300 mt-1">Monitor and manage platform users</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white placeholder-gray-400"
          />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'owner' | 'admin')}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="owner">Owners</option>
            <option value="admin">Admins</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
            className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-800 text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-300">{users.length}</div>
          <div className="text-sm text-blue-200">Total Users</div>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-300">{getUsersByRole('user').length}</div>
          <div className="text-sm text-green-200">Regular Users</div>
        </div>
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-300">{getUsersByRole('owner').length}</div>
          <div className="text-sm text-orange-200">Facility Owners</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">{getUsersByRole('admin').length}</div>
          <div className="text-sm text-purple-200">Administrators</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 backdrop-blur">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-white/20">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <Users size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'user' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      user.role === 'owner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.role === 'user' ? `${user.favoriteSports?.length || 0} sports` : `${user.favoriteSports?.length || 0} sports`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setShowUserDetails(user.id)}
                      className="text-orange-400 hover:text-orange-300 mr-3"
                    >
                      View
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-400 hover:text-red-300 mr-2"
                      >
                        Ban
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUnbanUser(user.id)}
                        className="text-green-400 hover:text-green-300 mr-2"
                      >
                        Unban
                      </button>
                    )}
                    <button 
                      onClick={() => setShowDeleteConfirm(user.id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetails(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {(() => {
              const user = users.find(u => u.id === showUserDetails);
              if (!user) return null;
              
              return (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users size={32} className="text-gray-300" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                      <p className="text-gray-300">{user.email}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'user' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        user.role === 'owner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-white mb-2">Contact Information</h4>
                      <div className="space-y-2 text-gray-300">
                        <p><span className="font-medium">Phone:</span> {user.phone || 'Not provided'}</p>
                        <p><span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </p>
                        <p><span className="font-medium">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">Favorite Sports</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.favoriteSports && user.favoriteSports.length > 0 ? (
                          user.favoriteSports.map((sport, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                              {sport}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No favorite sports listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setShowUserDetails(null)}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => {
                          handleBanUser(user.id);
                          setShowUserDetails(null);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Ban User
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleUnbanUser(user.id);
                          setShowUserDetails(null);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Unban User
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete User</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-gray-300 mt-1">Platform insights and user reports</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Analytics */}
        <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Analytics</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2" />
              <p>Revenue chart would go here</p>
              <p className="text-sm">Monthly revenue breakdown</p>
            </div>
          </div>
        </div>

        {/* User Reports */}
        <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">User Reports</h2>
          <div className="space-y-4">
            {[
              { type: 'Facility Issue', facility: 'Elite Sports Complex', reporter: 'John Player', severity: 'High' },
              { type: 'Payment Dispute', facility: 'Green Field Turf', reporter: 'Sarah Wilson', severity: 'Medium' },
              { type: 'Inappropriate Behavior', facility: 'Royal Academy', reporter: 'Mike Johnson', severity: 'High' },
            ].map((report, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{report.type}</h3>
                    <p className="text-sm text-gray-300">Facility: {report.facility}</p>
                    <p className="text-sm text-gray-300">Reporter: {report.reporter}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.severity === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      report.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {report.severity}
                    </span>
                    <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};