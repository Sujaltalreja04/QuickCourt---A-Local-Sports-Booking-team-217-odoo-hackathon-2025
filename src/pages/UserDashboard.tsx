import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { 
  mockFacilities, 
  mockBookings,
  mockCourts,
  indoorGames,
  outdoorGames,
  
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  useAuth();

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
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id
              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
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
      case 'home':
        return <HomeContent navigate={navigate} setActiveTab={setActiveTab} />;
      case 'search':
        return <SearchContent navigate={navigate} />;
      case 'bookings':
        return <BookingsContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <HomeContent navigate={navigate} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout sidebar={renderSidebar()}>
      {renderContent()}
    </DashboardLayout>
  );
};

interface HomeContentProps {
  navigate: (path: string) => void;
  setActiveTab: (tab: string) => void;
}

const HomeContent: React.FC<HomeContentProps> = ({ navigate, setActiveTab }) => {
  const stats = [
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
    {
      title: 'This Month',
      value: '12',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
       <div>
         <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Welcome back!</h1>
         <p className="text-gray-600 mt-1">Ready for your next game?</p>
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

      {/* Popular Venues */}
      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Venues</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFacilities.slice(0, 6).map((facility) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={facility.images[0]}
                alt={facility.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900">{facility.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin size={14} className="mr-1" />
                {facility.location}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium ml-1">{facility.rating}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">₹{facility.pricePerHour}/hr</span>
              </div>
              
              <button 
                onClick={() => navigate(`/facility/${facility.id}`)}
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => setActiveTab('search')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Venues
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {mockBookings.slice(0, 3).map((booking) => {
            const facility = mockFacilities.find(f => f.id === booking.facilityId);
            return (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{facility?.name}</h3>
                  <p className="text-sm text-gray-600">{booking.date} • {booking.timeSlot}</p>
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

interface SearchContentProps {
  navigate: (path: string) => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [category, setCategory] = useState<'all' | 'indoor' | 'outdoor'>('all');

  const allSports = Array.from(new Set([...indoorGames, ...outdoorGames]));
  const currentSports =
    category === 'indoor'
      ? ['All Indoor Games', ...indoorGames]
      : category === 'outdoor'
      ? ['All Outdoor Games', ...outdoorGames]
      : ['All Sports', ...allSports];

  const filteredFacilities = mockFacilities.filter((facility) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Sports Venues</h1>
        <p className="text-gray-600 mt-1">Discover and book the perfect court for your game</p>
      </div>

      {/* Search Filters */}
      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location or venue name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value as 'all' | 'indoor' | 'outdoor';
                setCategory(value);
                setSelectedSport('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currentSports.map((sport, index) => (
                <option key={sport} value={index === 0 ? '' : sport}>{sport}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        {filteredFacilities.map((facility) => (
          <motion.div
            key={facility.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={facility.images[0]}
              alt={facility.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{facility.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {facility.sports.map((sport) => (
                  <span key={sport} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {sport}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium ml-1">{facility.rating}</span>
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
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">Showing {filteredFacilities.length} of {mockFacilities.length} venues</p>
      </div>
    </div>
  );
};

const BookingsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">Manage your court reservations</p>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
              All Bookings
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Upcoming
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg">
              Completed
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {mockBookings.map((booking) => {
              const facility = mockFacilities.find(f => f.id === booking.facilityId);
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
                        <h3 className="font-semibold text-gray-900">{facility?.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar size={14} className="mr-1" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-1" />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{booking.totalPrice}</p>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.status === 'confirmed' && (
                        <button className="mt-2 text-xs text-red-600 hover:text-red-800 block">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileContent: React.FC = () => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || user?.name || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const allSports = ['Badminton', 'Tennis', 'Football', 'Basketball', 'Cricket'];
  const [favoriteSports, setFavoriteSports] = useState<string[]>(user?.favoriteSports || ['Badminton']);

  const toggleSport = (sport: string) => {
    setFavoriteSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user!,
      name: [firstName, lastName].filter(Boolean).join(' ').trim(),
      phone,
      favoriteSports,
    };
    setUser(updated);
    alert('Profile updated');
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700">
                <User size={12} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Member</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={onSave}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Sports</label>
              <div className="flex flex-wrap gap-2">
                {allSports.map(sport => (
                  <label key={sport} className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={favoriteSports.includes(sport)} onChange={() => toggleSport(sport)} />
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
};