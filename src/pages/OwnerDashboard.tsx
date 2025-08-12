import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Calendar, 
  User, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Plus,
  Users,
  Star,
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useFacilities } from '../context/FacilityContext';
import { mockBookings, mockCourts } from '../data/mockData';
import { NotificationContainer, NotificationProps } from '../components/Notification';

export const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const { facilities, approvedFacilities, addFacility, approveFacility, rejectFacility } = useFacilities();

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

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'facilities', label: 'My Facilities', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Available amenities list
  const availableAmenities = [
    'WiFi',
    'Changing Rooms',
    'Parking',
    'CCTV Cameras',
    'Drinking Water'
  ];
  
  // Add facility form state
  const [addFacilityForm, setAddFacilityForm] = useState({
    name: '',
    location: '',
    description: '',
    sports: [''],
    pricePerHour: '',
    amenities: [] as string[],
    images: [] as string[]
  });

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setAddFacilityForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new sport field
  const addSport = () => {
    setAddFacilityForm(prev => ({
      ...prev,
      sports: [...prev.sports, '']
    }));
  };

  // Remove sport field
  const removeSport = (index: number) => {
    setAddFacilityForm(prev => ({
      ...prev,
      sports: prev.sports.filter((_, i) => i !== index)
    }));
  };

  // Update sport value
  const updateSport = (index: number, value: string) => {
    setAddFacilityForm(prev => ({
      ...prev,
      sports: prev.sports.map((sport, i) => i === index ? value : sport)
    }));
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    setAddFacilityForm(prev => {
      if (prev.amenities.includes(amenity)) {
        // Remove amenity if already selected
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        // Add amenity if not selected
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setAddFacilityForm(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  // Submit new facility
  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!addFacilityForm.name || !addFacilityForm.location || !addFacilityForm.pricePerHour) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new facility
    const newFacility = {
      id: `facility_${Date.now()}`,
      name: addFacilityForm.name,
      location: addFacilityForm.location,
      description: addFacilityForm.description,
      sports: addFacilityForm.sports.filter(sport => sport.trim() !== ''),
      pricePerHour: parseInt(addFacilityForm.pricePerHour),
      amenities: addFacilityForm.amenities.filter(amenity => amenity.trim() !== ''),
      images: addFacilityForm.images.length > 0 ? addFacilityForm.images : ['https://images.pexels.com/photos/573945/pexels-photo-573945.jpeg'],
      rating: 0,
      ownerId: 'owner_1', // Mock owner ID
      status: 'pending' as const,
      createdAt: new Date()
    };

    // Add to facilities list
    addFacility(newFacility);
    
    // Reset form and close popup
    setAddFacilityForm({
      name: '',
      location: '',
      description: '',
      sports: [''],
      pricePerHour: '',
      amenities: [],
      images: []
    });
    setShowAddFacility(false);
    
    // Show success notification
    addNotification(
      'success',
      'Facility Added Successfully! 🎉',
      `"${newFacility.name}" has been added and is pending approval. Users will see it once approved.`
    );
  };

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

  const renderSidebar = () => (
    <nav className="mt-8">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-green-600 text-white border-r-2 border-green-400'
              : 'text-white hover:text-green-300 hover:bg-white/10'
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
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-300 mt-1">Welcome back! Here's what's happening with your facilities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl`}
                >
                  <div className="flex items-center mb-4">
                    <stat.icon size={32} className={`mr-4 text-white/70`} />
                    <h3 className="text-xl font-semibold text-white">{stat.title}</h3>
                  </div>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  {stat.trend && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      {stat.trend.value}%
                      {stat.trend.isUp ? ' more' : ' less'} than last month
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {mockBookings.slice(0, 5).map((booking) => {
                  const facility = facilities.find(f => f.id === booking.facilityId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                      <div>
                        <h3 className="font-medium text-white">{facility?.name}</h3>
                        <p className="text-sm text-gray-300">{booking.date} • {booking.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-500/30'
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
      case 'facilities':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">My Facilities</h1>
                <p className="text-gray-300 mt-1">Manage your sports venues</p>
              </div>
              <button 
                onClick={() => setShowAddFacility(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add New Facility
              </button>
            </div>

            {/* Status Summary */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Facility Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{approvedFacilities.length}</div>
                  <div className="text-sm text-green-300">Approved</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{facilities.filter(f => f.status === 'pending').length}</div>
                  <div className="text-sm text-yellow-300">Pending</div>
                </div>
                <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{facilities.filter(f => f.status === 'rejected').length}</div>
                  <div className="text-sm text-red-300">Rejected</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {facilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl"
                >
                  <img
                    src={facility.images[0]}
                    alt={facility.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{facility.name}</h3>
                        <div className="flex items-center text-gray-300 mt-1">
                          <MapPin size={16} className="mr-1" />
                          <span className="text-sm">{facility.location}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        facility.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        facility.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {facility.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {facility.sports.map((sport: string) => (
                        <span key={sport} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                          {sport}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-300">Price/Hour</p>
                        <p className="font-semibold text-white">₹{facility.pricePerHour}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Rating</p>
                        <p className="font-semibold text-white">{facility.rating}/5.0</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      
                    </div>
                    
                    {/* Quick Approval for Testing */}
                    {facility.status === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-300 text-sm mb-2">
                          ⏳ Waiting for admin approval. For testing, you can approve it yourself:
                        </p>
                        <button 
                          onClick={() => {
                            approveFacility(facility.id);
                            addNotification(
                              'success',
                              'Facility Approved! 🎉',
                              `"${facility.name}" is now visible to users.`
                            );
                            // Force re-render to show updated status
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          }}
                          className="w-full bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                        >
                          Approve Facility (Test Mode)
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Booking Management</h1>
              <p className="text-gray-300 mt-1">Monitor and manage all facility bookings</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white font-medium">Facility</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Time</th>
                      <th className="text-left py-3 px-4 text-white font-medium">User</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-white font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-white/20">
                    {mockBookings.map((booking) => {
                      const facility = facilities.find(f => f.id === booking.facilityId);
                      return (
                        <tr key={booking.id}>
                          <td className="py-3 px-4 text-white">{facility?.name}</td>
                          <td className="py-3 px-4 text-gray-300">{booking.date}</td>
                          <td className="py-3 px-4 text-gray-300">{booking.timeSlot}</td>
                          <td className="py-3 px-4 text-gray-300">User {booking.userId}</td>
                          <td className="py-3 px-4 text-white font-medium">₹{booking.totalPrice}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-400 hover:text-blue-300 text-sm">View Details</button>
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
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Owner Profile</h1>
              <p className="text-gray-300 mt-1">Manage your business information</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Business Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="owner@example.com"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                      placeholder="Enter contact email"
                      onChange={(e) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(e.target.value) && e.target.value !== '') {
                          e.target.setCustomValidity('Please enter a valid email address');
                        } else {
                          e.target.setCustomValidity('');
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Business Address</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                    placeholder="Enter business address"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Business Type</label>
                    <select className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white">
                      <option>Sports Complex</option>
                      <option>Fitness Center</option>
                      <option>Recreation Center</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-300 mt-1">Welcome back! Here's what's happening with your facilities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl`}
                >
                  <div className="flex items-center mb-4">
                    <stat.icon size={32} className={`mr-4 text-white/70`} />
                    <h3 className="text-xl font-semibold text-white">{stat.title}</h3>
                  </div>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  {stat.trend && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      {stat.trend.value}%
                      {stat.trend.isUp ? ' more' : ' less'} than last month
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {mockBookings.slice(0, 5).map((booking) => {
                  const facility = facilities.find(f => f.id === booking.facilityId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                      <div>
                        <h3 className="font-medium text-white">{facility?.name}</h3>
                        <p className="text-sm text-gray-300">{booking.date} • {booking.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-500/30'
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
    }
  };

  return (
    <DashboardLayout
      sidebar={renderSidebar()}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      showChatbot={true}
    >
      {renderContent()}
      
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
      
      {/* Add Facility Popup */}
      {showAddFacility && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Facility</h2>
              <button
                onClick={() => setShowAddFacility(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddFacility} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Facility Name *</label>
                  <input
                    type="text"
                    value={addFacilityForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                    placeholder="Enter facility name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location *</label>
                  <input
                    type="text"
                    value={addFacilityForm.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={addFacilityForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                  placeholder="Describe your facility"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Price per Hour (₹) *</label>
                <input
                  type="number"
                  value={addFacilityForm.pricePerHour}
                  onChange={(e) => handleFormChange('pricePerHour', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                  placeholder="Enter price per hour"
                  required
                />
              </div>
              
              {/* Sports */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sports Offered</label>
                <div className="space-y-2">
                  {addFacilityForm.sports.map((sport, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={sport}
                        onChange={(e) => updateSport(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
                        placeholder="Enter sport name"
                      />
                      {addFacilityForm.sports.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSport(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + Add Sport
                  </button>
                </div>
              </div>
              
              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {availableAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-lg transition-colors ${addFacilityForm.amenities.includes(amenity) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Click to select/deselect amenities</p>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Facility Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700"
                />
                {addFacilityForm.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {addFacilityForm.images.map((image, index) => (
                      <img key={index} src={image} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Form Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddFacility(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};