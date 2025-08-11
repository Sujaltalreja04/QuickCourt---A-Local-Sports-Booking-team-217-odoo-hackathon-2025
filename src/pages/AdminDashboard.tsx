import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { mockFacilities } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'approvals', label: 'Facility Approvals', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: Shield },
  ];

  const renderSidebar = () => (
    <nav className="mt-8">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
        return <OverviewContent />;
      case 'approvals':
        return <ApprovalsContent />;
      case 'users':
        return <UsersContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <DashboardLayout sidebar={renderSidebar()}>
      {renderContent()}
    </DashboardLayout>
  );
};

const OverviewContent: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: { value: 12, isUp: true },
    },
    {
      title: 'Total Owners',
      value: '156',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      trend: { value: 8, isUp: true },
    },
    {
      title: 'Total Bookings',
      value: '12,456',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      trend: { value: 15, isUp: true },
    },
    {
      title: 'Platform Revenue',
      value: '₹8,45,200',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      trend: { value: 22, isUp: true },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor platform performance and manage operations</p>
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
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Activity</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-2" />
              <p>Activity chart would go here</p>
              <p className="text-sm">Showing user engagement trends</p>
            </div>
          </div>
        </div>

        {/* Most Popular Sports */}
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Sports</h2>
          <div className="space-y-4">
            {[
              { sport: 'Badminton', bookings: 3245, percentage: 85 },
              { sport: 'Football', bookings: 2156, percentage: 60 },
              { sport: 'Tennis', bookings: 1876, percentage: 50 },
              { sport: 'Basketball', bookings: 1234, percentage: 35 },
              { sport: 'Cricket', bookings: 987, percentage: 28 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.sport}</p>
                  <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                </div>
                <div className="w-32">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Actions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Facility Approvals</h3>
                <p className="text-2xl font-bold text-yellow-900">12</p>
              </div>
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <button className="mt-3 text-sm text-yellow-700 font-medium hover:text-yellow-800">
              Review Pending →
            </button>
          </div>

          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-800">User Reports</h3>
                <p className="text-2xl font-bold text-red-900">5</p>
              </div>
              <Shield className="text-red-600" size={24} />
            </div>
            <button className="mt-3 text-sm text-red-700 font-medium hover:text-red-800">
              Handle Reports →
            </button>
          </div>

          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">System Alerts</h3>
                <p className="text-2xl font-bold text-blue-900">3</p>
              </div>
              <AlertTriangle className="text-blue-600" size={24} />
            </div>
            <button className="mt-3 text-sm text-blue-700 font-medium hover:text-blue-800">
              View Alerts →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApprovalsContent: React.FC = () => {
  const [facilities] = useState(mockFacilities);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Facility Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve pending facility registrations</p>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium">
              Pending (3)
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Approved (45)
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Rejected (8)
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {facilities.slice(0, 3).map((facility) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-gray-200 rounded-lg p-6"
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
                        <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span className="text-sm">{facility.location}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{facility.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Pending Review
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Sports Offered</h4>
                        <div className="flex flex-wrap gap-2">
                          {facility.sports.map((sport) => (
                            <span key={sport} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {facility.amenities.slice(0, 3).map((amenity) => (
                            <span key={amenity} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                          {facility.amenities.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              +{facility.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Price:</span> ₹{facility.pricePerHour}/hour
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </button>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UsersContent: React.FC = () => {
  const mockUsers = [
    { id: '1', name: 'John Player', email: 'john@example.com', role: 'user', status: 'active', bookings: 24, joined: '2024-01-15' },
    { id: '2', name: 'Mike Owner', email: 'mike@sports.com', role: 'owner', status: 'active', facilities: 3, joined: '2024-02-10' },
    { id: '3', name: 'Sarah Player', email: 'sarah@example.com', role: 'user', status: 'banned', bookings: 8, joined: '2024-03-05' },
    { id: '4', name: 'Elite Sports', email: 'contact@elite.com', role: 'owner', status: 'active', facilities: 2, joined: '2024-01-28' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage platform users</p>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="owner">Owners</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60 backdrop-blur">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <Users size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'user' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'owner' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role === 'user' ? `${user.bookings} bookings` : `${user.facilities} facilities`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">View</button>
                    <button className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                      {user.status === 'active' ? 'Ban' : 'Unban'}
                    </button>
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

const ReportsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Platform insights and user reports</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Analytics */}
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Analytics</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2" />
              <p>Revenue chart would go here</p>
              <p className="text-sm">Monthly revenue breakdown</p>
            </div>
          </div>
        </div>

        {/* User Reports */}
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Reports</h2>
          <div className="space-y-4">
            {[
              { type: 'Facility Issue', facility: 'Elite Sports Complex', reporter: 'John Player', severity: 'High' },
              { type: 'Payment Dispute', facility: 'Green Field Turf', reporter: 'Sarah Wilson', severity: 'Medium' },
              { type: 'Inappropriate Behavior', facility: 'Royal Academy', reporter: 'Mike Johnson', severity: 'High' },
            ].map((report, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{report.type}</h3>
                    <p className="text-sm text-gray-600">Facility: {report.facility}</p>
                    <p className="text-sm text-gray-600">Reporter: {report.reporter}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.severity === 'High' ? 'bg-red-100 text-red-800' :
                      report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity}
                    </span>
                    <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
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