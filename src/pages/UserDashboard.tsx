import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  MapPin,
  Star,
  Clock,
  Filter,
  Heart,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumButton } from '../components/PremiumButton';
import { useFacilities } from '../context/FacilityContext';
import { 
  mockBookings as initialMockBookings,
  mockCourts,
  indoorGames,
  outdoorGames,
  
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { NotificationContainer, NotificationProps } from '../components/Notification';

export const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [category, setCategory] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [bookings, setBookings] = useState(initialMockBookings);
  
  const navigate = useNavigate();
  useAuth();
  const { approvedFacilities, refreshFacilities, isRefreshing } = useFacilities();
  
  // Track previous approved facilities count to show notifications for new ones
  const [prevApprovedCount, setPrevApprovedCount] = useState(approvedFacilities.length);

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

  // Show notification when new facilities become available
  useEffect(() => {
    if (approvedFacilities.length > prevApprovedCount) {
      const newFacilities = approvedFacilities.slice(0, approvedFacilities.length - prevApprovedCount);
      newFacilities.forEach(facility => {
        addNotification(
          'info',
          'New Facility Available! 🎾',
          `"${facility.name}" in ${facility.location} is now available for booking.`
        );
      });
      setPrevApprovedCount(approvedFacilities.length);
    }
  }, [approvedFacilities.length, prevApprovedCount]);

  // Update last update time when facilities change
  useEffect(() => {
    setLastUpdateTime(new Date());
  }, [approvedFacilities]);

  // Handle manual refresh
  const handleRefresh = () => {
    refreshFacilities();
    
    // Load bookings from localStorage or use initial mock data
    const savedBookings = localStorage.getItem('quickcourt_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    
    addNotification('info', 'Refreshing...', 'Updating facility list and bookings...');
  };
  
  // Booking cancellation functionality removed as requested
  
  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('quickcourt_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Initialize localStorage with mock bookings if not exists
      localStorage.setItem('quickcourt_bookings', JSON.stringify(initialMockBookings));
    }
  }, []);

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search Venues', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderSidebar = () => (
    <nav className="mt-8">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
          }}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-blue-600 text-white border-r-2 border-blue-400'
              : 'text-white hover:text-blue-300 hover:bg-white/10'
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
      case 'home':
        return (
          <div className="space-y-8">
            <div className="mt-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Welcome back!</h1>
                <p className="text-gray-300 mt-1">Ready for your next game?</p>
                <p className="text-sm text-gray-400 mt-1">
                  Last updated: {lastUpdateTime.toLocaleTimeString()}
                </p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRefreshing 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''} 
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Total Bookings',
                  value: '24',
                  icon: Calendar,
                  color: 'from-blue-500 to-blue-600',
                  trend: { value: 12, isUp: true },
                },
                {
                  title: 'Favorite Venues',
                  value: '8',
                  icon: Heart,
                  color: 'from-pink-500 to-pink-600',
                },
                {
                  title: 'Hours Played',
                  value: '156',
                  icon: Clock,
                  color: 'from-green-500 to-green-600',
                  trend: { value: 8, isUp: true },
                },
              ].map((stat, index) => (
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

            {/* Available Venues Count */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Available Venues</h2>
                <span className="text-2xl font-bold text-blue-400">{approvedFacilities.length}</span>
              </div>
              <p className="text-gray-300 text-sm">
                {isRefreshing ? 'Updating venue list...' : 'Real-time updates enabled'}
              </p>
            </div>

            {/* Popular Venues */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Popular Venues</h2>
                {isRefreshing && (
                  <div className="flex items-center space-x-2 text-blue-400">
                    <RefreshCw size={16} className="animate-spin" />
                    <span className="text-sm">Updating...</span>
                  </div>
                )}
              </div>
              
              {approvedFacilities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No venues available yet</div>
                  <button
                    onClick={handleRefresh}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Click here to refresh
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {approvedFacilities.slice(0, 6).map((facility, index) => (
                      <motion.div
                        key={facility.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <PremiumCard
                          image={facility.images[0]}
                          title={facility.name}
                          subtitle={facility.location}
                          badge={`₹${facility.pricePerHour}/hr`}
                          badgeColor="green"
                          onClick={() => navigate(`/facility/${facility.id}`)}
                          className="h-full bg-black/40 border-white/20 backdrop-blur-md"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Star className="text-yellow-400 fill-current" size={16} />
                              <span className="text-sm font-medium ml-1 text-white">{facility.rating}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {facility.sports.slice(0, 2).map((sport: string) => (
                                <span key={sport} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                  {sport}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <PremiumButton
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate(`/facility/${facility.id}`)}
                          >
                            View Details
                          </PremiumButton>
                        </PremiumCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              <div className="text-center mt-8">
                <PremiumButton
                  variant="secondary"
                  size="lg"
                  onClick={() => setActiveTab('search')}
                >
                  View All Venues
                </PremiumButton>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => {
                  const facility = approvedFacilities.find(f => f.id === booking.facilityId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                      <div>
                        <h3 className="font-medium text-white">{facility?.name || 'Unknown Facility'}</h3>
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
      case 'search':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Find Sports Venues</h1>
                <p className="text-gray-300 mt-1">Discover and book the perfect court for your game</p>
                <p className="text-sm text-gray-400 mt-1">
                  {approvedFacilities.length} venues available
                </p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRefreshing 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''} 
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Search Filters */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-6 shadow-2xl">
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="Enter location or venue name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const value = e.target.value as 'all' | 'indoor' | 'outdoor';
                      setCategory(value);
                      setSelectedSport('');
                    }}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  >
                    <option value="all">All</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Sport</label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  >
                    {(() => {
                      const allSports = Array.from(new Set([...indoorGames, ...outdoorGames]));
                      const currentSports =
                        category === 'indoor'
                          ? ['All Indoor Games', ...indoorGames]
                          : category === 'outdoor'
                          ? ['All Outdoor Games', ...outdoorGames]
                          : ['All Sports', ...allSports];
                      
                      return currentSports.map((sport, index) => (
                        <option key={sport} value={index === 0 ? '' : sport}>{sport}</option>
                      ));
                    })()}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                  >
                    <option value="">Any Price</option>
                    <option value="0-25">₹0 - ₹25</option>
                    <option value="25-50">₹25 - ₹50</option>
                    <option value="50+">₹50+</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Filter size={16} className="mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const allSports = Array.from(new Set([...indoorGames, ...outdoorGames]));
                const currentSports =
                  category === 'indoor'
                    ? ['All Indoor Games', ...indoorGames]
                    : category === 'outdoor'
                    ? ['All Outdoor Games', ...outdoorGames]
                    : ['All Sports', ...allSports];

                const filteredFacilities = approvedFacilities.filter((facility) => {
                  const matchesSearch =
                    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    facility.location.toLowerCase().includes(searchTerm.toLowerCase());

                  const matchesSport = selectedSport
                    ? facility.sports.includes(selectedSport)
                    : true;

                  let matchesPrice = true;
                  if (priceRange === '0-25') {
                    matchesPrice = facility.pricePerHour <= 25;
                  } else if (priceRange === '25-50') {
                    matchesPrice = facility.pricePerHour > 25 && facility.pricePerHour <= 50;
                  } else if (priceRange === '50+') {
                    matchesPrice = facility.pricePerHour > 50;
                  }

                  const matchesCategory =
                    category === 'all'
                      ? true
                      : mockCourts.some(
                          (court) => court.facilityId === facility.id && court.environment === category
                        );

                  return matchesSearch && matchesSport && matchesPrice && matchesCategory;
                });

                if (filteredFacilities.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 mb-4">No venues match your search criteria</div>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSport('');
                          setPriceRange('');
                          setCategory('all');
                        }}
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  );
                }

                return filteredFacilities.map((facility, index) => (
                  <motion.div
                    key={facility.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={facility.images[0]}
                        alt={facility.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjc0MjQyIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxMDBMMzAwIDE1MEwyMDAgMjAwTDEwMCAxNTBaIiBmaWxsPSIjM0I4MjFGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM2M0YzNjQiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzYzRjM2NCIvPgo8L3N2Zz4K';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{facility.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm text-gray-300">{facility.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {facility.sports.map((sport: string) => (
                          <span key={sport} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                            {sport}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="text-yellow-400 fill-current" size={16} />
                          <span className="text-sm font-medium ml-1 text-white">{facility.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">(120 reviews)</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">₹{facility.pricePerHour}/hr</span>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/facility/${facility.id}`)}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
            
            {/* Load More Button */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Showing {(() => {
                const allSports = Array.from(new Set([...indoorGames, ...outdoorGames]));
                const currentSports =
                  category === 'indoor'
                    ? ['All Indoor Games', ...indoorGames]
                    : category === 'outdoor'
                    ? ['All Outdoor Games', ...outdoorGames]
                    : ['All Sports', ...allSports];

                const filteredFacilities = approvedFacilities.filter((facility) => {
                  const matchesSearch =
                    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    facility.location.toLowerCase().includes(searchTerm.toLowerCase());

                  const matchesSport = selectedSport
                    ? facility.sports.includes(selectedSport)
                    : true;

                  let matchesPrice = true;
                  if (priceRange === '0-25') {
                    matchesPrice = facility.pricePerHour <= 25;
                  } else if (priceRange === '25-50') {
                    matchesPrice = facility.pricePerHour > 25 && facility.pricePerHour <= 50;
                  } else if (priceRange === '50+') {
                    matchesPrice = facility.pricePerHour > 50;
                  }

                  const matchesCategory =
                    category === 'all'
                      ? true
                      : mockCourts.some(
                          (court) => court.facilityId === facility.id && court.environment === category
                        );

                  return matchesSearch && matchesSport && matchesPrice && matchesCategory;
                });

                return filteredFacilities.length;
              })()} of {approvedFacilities.length} venues</p>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                <p className="text-gray-300 mt-1">Manage your court reservations</p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRefreshing 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''} 
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex space-x-4">
                  <h3 className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                    All Bookings
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => {
                      const facility = approvedFacilities.find(f => f.id === booking.facilityId);
                      const court = mockCourts.find(c => c.id === booking.courtId);
                      
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={facility?.images[0]}
                                alt={facility?.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <div className="text-sm font-semibold text-white">{facility?.name}</div>
                                <div className="text-xs text-blue-300 mb-1">
                                  {court?.name} ({court?.sport})
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Calendar size={14} className="mr-1" />
                                  {booking.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock size={14} className="mr-1" />
                                  <span className="text-sm text-gray-300">{booking.timeSlot}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-white">₹{booking.totalPrice}</p>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                              }`}>
                                {booking.status}
                              </span>
                              {/* Cancel button removed as requested */}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">No bookings found</div>
                      <button
                        onClick={() => navigate('/dashboard/user/search')}
                        className="text-blue-500 hover:text-blue-400 text-sm"
                      >
                        Browse venues to make a booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-300 mt-1">Manage your account settings</p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRefreshing 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''} 
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            <div className="bg-black/40 rounded-xl shadow-2xl border border-white/20 p-6 backdrop-blur-md">
              <div className="max-w-2xl">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xl">
                      U
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                      <User size={12} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">User</h2>
                    <p className="text-gray-300">user@example.com</p>
                    <p className="text-sm text-gray-400">Member</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
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

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Favorite Sports</label>
                    <div className="flex flex-wrap gap-2">
                      {['Badminton', 'Tennis', 'Football', 'Basketball', 'Cricket'].map(sport => (
                        <label key={sport} className="flex items-center text-white">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{sport}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Page not found</h2>
            <p className="text-gray-400 mb-4">The requested tab does not exist</p>
            <button
              onClick={() => setActiveTab('home')}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go to Home
            </button>
          </div>
        );
    }
  };

  return (
    <DashboardLayout sidebar={renderSidebar()} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} showChatbot={true}>
      {renderContent()}
      
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </DashboardLayout>
  );
};