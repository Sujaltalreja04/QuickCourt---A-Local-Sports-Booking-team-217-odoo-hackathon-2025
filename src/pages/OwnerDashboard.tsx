import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Calendar, 
  User,
  Plus,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { mockFacilities, mockBookings } from '../data/mockData';

export const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'facilities', label: 'My Facilities', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderSidebar = () => (
    <nav className="mt-8">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-green-50 text-green-600 border-r-2 border-green-600'
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
      case 'facilities':
        return <FacilitiesContent />;
      case 'bookings':
        return <BookingsContent />;
      case 'profile':
        return <ProfileContent />;
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
      title: 'Total Bookings',
      value: '156',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      trend: { value: 15, isUp: true },
    },
    {
      title: 'Active Courts',
      value: '8',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Monthly Earnings',
      value: '₹45,200',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      trend: { value: 22, isUp: true },
    },
    {
      title: 'Active Users',
      value: '89',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      trend: { value: 8, isUp: true },
    },
  ];

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Facility Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your venues and manage bookings</p>
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

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Trends */}
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Trends</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity size={48} className="mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Showing weekly booking patterns</p>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Peak Booking Hours</h2>
          <div className="space-y-4">
            {[
              { time: '6:00 PM - 8:00 PM', bookings: 45, percentage: 90 },
              { time: '10:00 AM - 12:00 PM', bookings: 38, percentage: 76 },
              { time: '8:00 AM - 10:00 AM', bookings: 32, percentage: 64 },
              { time: '2:00 PM - 4:00 PM', bookings: 28, percentage: 56 },
            ].map((slot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{slot.time}</p>
                  <p className="text-sm text-gray-600">{slot.bookings} bookings</p>
                </div>
                <div className="w-24">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${slot.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {mockBookings.slice(0, 5).map((booking) => {
            const facility = mockFacilities.find(f => f.id === booking.facilityId);
            return (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={facility?.images[0]}
                    alt={facility?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{facility?.name}</h3>
                    <p className="text-sm text-gray-600">{booking.date} • {booking.timeSlot}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{booking.totalPrice}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FacilitiesContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Facilities</h1>
          <p className="text-gray-600 mt-1">Manage your sports venues</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
          <Plus size={16} className="mr-2" />
          Add New Facility
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {mockFacilities.map((facility) => (
          <motion.div
            key={facility.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md overflow-hidden shadow-lg"
          >
            <img
              src={facility.images[0]}
              alt={facility.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{facility.location}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  facility.status === 'approved' ? 'bg-green-100 text-green-800' :
                  facility.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {facility.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {facility.sports.map((sport) => (
                  <span key={sport} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {sport}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Price/Hour</p>
                  <p className="font-semibold text-gray-900">₹{facility.pricePerHour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold text-gray-900">{facility.rating}/5.0</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Details
                </button>
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Manage Courts
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BookingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">View and manage all facility bookings</p>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
              All Bookings
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Today
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Upcoming
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Completed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/60 backdrop-blur">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility & Court
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockBookings.map((booking) => {
                const facility = mockFacilities.find(f => f.id === booking.facilityId);
                return (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={facility?.images[0]}
                          alt={facility?.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{facility?.name}</div>
                          <div className="text-sm text-gray-500">Court A1</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">John Player</div>
                      <div className="text-sm text-gray-500">john@example.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.date}</div>
                      <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-2">View</button>
                      <button className="text-red-600 hover:text-red-900">Cancel</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfileContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Owner Profile</h1>
        <p className="text-gray-600 mt-1">Manage your business information</p>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <div className="max-w-2xl">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  defaultValue="Elite Sports Complex"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  defaultValue="Mike Johnson"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="mike@elitesports.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue="+91 9876543210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <textarea
                defaultValue="Downtown Arena, City Center, Mumbai, Maharashtra 400001"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};