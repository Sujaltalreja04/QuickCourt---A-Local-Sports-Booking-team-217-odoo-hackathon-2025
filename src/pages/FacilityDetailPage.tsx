import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowLeft,
  Phone,
  Mail,
  Home
} from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';
import { Logo } from '../components/Logo';
import { useFacilities } from '../context/FacilityContext';
import { mockCourts, mockReviews, timeSlots } from '../data/mockData';
import { ReviewCard } from '../components/ReviewCard';
import { Review } from '../types';

export const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1.0);
  const [personCount, setPersonCount] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: '',
  });
  const [bookingForm, setBookingForm] = useState({
    email: '',
    phone: '',
    address: '',
    personCount: 1
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Additional services for dynamic pricing
  const [additionalServices, setAdditionalServices] = useState({
    equipment: false,
    coaching: false,
    refreshments: false,
    parking: false
  });

  const { facilities, refreshFacilities, isRefreshing } = useFacilities();
  const facility = facilities.find(f => f.id === id);
  const courts = mockCourts.filter(c => c.facilityId === id);

  // Dynamic pricing calculation function
  const calculateTotalPrice = () => {
    if (!facility) return 0;
    
    let basePrice = facility.pricePerHour;
    
    // Peak time pricing (higher rates for popular times)
    const isPeakTime = selectedTime && ['16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'].includes(selectedTime);
    if (isPeakTime) {
      basePrice = basePrice * 1.2; // 20% premium for peak hours
    }
    
    // Weekend pricing (higher rates for weekends)
    const selectedDateObj = new Date(selectedDate);
    const isWeekend = selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6; // Sunday or Saturday
    if (isWeekend) {
      basePrice = basePrice * 1.15; // 15% premium for weekends
    }
    
    // Person count multiplier (discount for more people)
    let personMultiplier = 1;
    if (personCount >= 6) {
      personMultiplier = 0.85; // 15% discount for 6+ people
    } else if (personCount >= 4) {
      personMultiplier = 0.9; // 10% discount for 4+ people
    } else if (personCount >= 2) {
      personMultiplier = 0.95; // 5% discount for 2+ people
    }
    
    // Additional services pricing
    let servicesPrice = 0;
    if (additionalServices.equipment) servicesPrice += 50; // ₹50 for equipment
    if (additionalServices.coaching) servicesPrice += 200; // ₹200 for coaching
    if (additionalServices.refreshments) servicesPrice += 100; // ₹100 for refreshments
    if (additionalServices.parking) servicesPrice += 30; // ₹30 for parking
    
    // Calculate total - handle half-hour increments correctly
    const totalPrice = (basePrice * selectedDuration * personMultiplier) + servicesPrice;
    
    return Math.round(totalPrice); // Round to nearest rupee
  };

  // Get price breakdown for display
  const getPriceBreakdown = () => {
    if (!facility) return null;
    
    const basePrice = facility.pricePerHour;
    const isPeakTime = selectedTime && ['16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'].includes(selectedTime);
    const selectedDateObj = new Date(selectedDate);
    const isWeekend = selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6;
    
    let personMultiplier = 1;
    if (personCount >= 6) personMultiplier = 0.85;
    else if (personCount >= 4) personMultiplier = 0.9;
    else if (personCount >= 2) personMultiplier = 0.95;
    
    let servicesPrice = 0;
    if (additionalServices.equipment) servicesPrice += 50;
    if (additionalServices.coaching) servicesPrice += 200;
    if (additionalServices.refreshments) servicesPrice += 100;
    if (additionalServices.parking) servicesPrice += 30;
    
    // Format duration display for half-hour increments
    const durationDisplay = selectedDuration === 0.5 ? '30 min' : 
      `${selectedDuration} ${selectedDuration === 1 ? 'hour' : 'hours'}`;
    
    return {
      basePrice,
      duration: selectedDuration,
      durationDisplay,
      peakTimeSurcharge: isPeakTime ? basePrice * selectedDuration * 0.2 : 0,
      weekendSurcharge: isWeekend ? basePrice * selectedDuration * 0.15 : 0,
      personDiscount: basePrice * selectedDuration * (1 - personMultiplier),
      servicesPrice,
      total: calculateTotalPrice()
    };
  };

  // Load reviews from mock + localStorage
  React.useEffect(() => {
    if (!id) return;
    const base = mockReviews.filter(r => r.facilityId === id);
    const storedRaw = localStorage.getItem(`quickcourt_reviews_${id}`);
    const stored: Review[] = storedRaw ? JSON.parse(storedRaw) : [];
    // Convert createdAt strings back to Date
    const normalize = (r: Review) => ({ ...r, createdAt: new Date(r.createdAt) });
    setReviews([...base.map(normalize), ...stored.map(normalize)]);
  }, [id]);

  if (!facility) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facility Not Found</h1>
          <button 
            onClick={() => navigate('/dashboard/user')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time before booking');
      return;
    }
    setShowBookingForm(true);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation - 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    if (!validateEmail(bookingForm.email)) {
      alert('Please enter a valid email address (e.g., yourusername@gmail.com)');
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(bookingForm.phone)) {
      alert('Please enter a valid 10-digit Indian phone number');
      return;
    }

    // Calculate total price using dynamic pricing
    const totalPrice = calculateTotalPrice();

    // Create booking data object
    const bookingData = {
      id: `booking_${Date.now()}`,
      userId: 'user_1', // Mock user ID
      facilityId: facility.id,
      courtId: selectedCourt,
      date: selectedDate,
      timeSlot: selectedTime,
      duration: selectedDuration,
      totalPrice,
      status: 'confirmed' as const,
      createdAt: new Date(),
      personCount: personCount,
      additionalServices,
      userDetails: bookingForm
    };

    console.log('Booking submitted:', bookingData);
    
    // Store booking data in localStorage for later retrieval
    const savedBookings = localStorage.getItem('quickcourt_bookings');
    let bookings = [];
    
    if (savedBookings) {
      bookings = JSON.parse(savedBookings);
    }
    
    // Add new booking to the array
    bookings.unshift(bookingData);
    
    // Save updated bookings array back to localStorage
    localStorage.setItem('quickcourt_bookings', JSON.stringify(bookings));
    
    // Show payment modal
    setShowPaymentModal(true);
  };
  
  const handlePaymentComplete = () => {
    // Reset form
    setSelectedCourt('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDuration(1);
    setPersonCount(1);
    setAdditionalServices([]);
    setBookingForm({
      name: '',
      email: '',
      phone: ''
    });
    
    // Hide forms and modals
    setShowBookingForm(false);
    setShowPaymentModal(false);
    
    // Show success message and redirect to user dashboard
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    navigate('/dashboard/user/bookings');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!reviewForm.userName.trim() || !reviewForm.comment.trim()) {
      alert('Please provide your name and a comment.');
      return;
    }
    const newReview: Review = {
      id: `r_${Date.now()}`,
      facilityId: id,
      userName: reviewForm.userName.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      createdAt: new Date(),
    };
    const next = [newReview, ...reviews];
    setReviews(next);
    // Persist only user-submitted reviews in localStorage
    const existingRaw = localStorage.getItem(`quickcourt_reviews_${id}`);
    const existing: Review[] = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem(`quickcourt_reviews_${id}`, JSON.stringify([newReview, ...existing]));
    setReviewForm({ userName: '', rating: 5, comment: '' });
    alert('Thanks for your review!');
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Check if facility exists
  if (!facility) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏟️</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">Facility Not Found</div>
          <div className="text-gray-600 mb-4">The facility you're looking for doesn't exist or has been removed.</div>
          <button
            onClick={() => navigate('/dashboard/user')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .calendar-date {
            transition: all 0.2s ease;
          }
          .calendar-date:hover:not(:disabled) {
            transform: scale(1.1);
          }
        `}
      </style>
      <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md shadow-md border-b border-white/20">
        <div className="container-pro">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard/user')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <Logo size="md" animate={true} />
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshFacilities}
                disabled={isRefreshing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRefreshing 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                  {isRefreshing ? '🔄' : '🔄'}
                </div>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Facility Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Facility Images */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md overflow-hidden shadow-lg">
              {facility.images && facility.images.length > 0 && facility.images[0] ? (
                <img
                  src={facility.images[0]}
                  alt={facility.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxMDBMMzAwIDE1MEwyMDAgMjAwTDEwMCAxNTBaIiBmaWxsPSIjM0I4MjFGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM2M0YzNjQiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzYzRjM2NCIvPgo8L3N2Zz4K';
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏟️</div>
                    <div className="text-gray-500 text-lg">No image available</div>
                    <div className="text-gray-400 text-sm">{facility?.name || 'Unknown Facility'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Facility Details */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{facility?.name || 'Unknown Facility'}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{facility?.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current mr-1" size={16} />
                      <span className="font-medium">{facility?.rating || 0}</span>
                      <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">₹{facility?.pricePerHour || 0}</div>
                  <div className="text-gray-500">per hour</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{facility?.description || 'No description available for this facility.'}</p>

              {/* Sports Offered */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sports Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {facility?.sports && facility.sports.length > 0 ? (
                    facility.sports.map((sport) => (
                      <span key={sport} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {sport}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No sports specified</span>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {facility?.amenities && facility.amenities.length > 0 ? (
                    facility.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No amenities specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Available Courts */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Courts</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    onClick={() => setSelectedCourt(court.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCourt === court.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{court.name}</h4>
                        <p className="text-sm text-gray-600">{court.sport}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">₹{court.pricePerHour}</div>
                        <div className="text-xs text-gray-500">per hour</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                <div className="text-sm text-gray-600">{reviews.length} reviews</div>
              </div>

              {/* Aggregate rating */}
              <div className="flex items-center mb-4">
                {(() => {
                  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
                  const rounded = Math.round(avg);
                  return (
                    <>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={18} className={idx < rounded ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                      ))}
                      <span className="ml-2 text-sm text-gray-700">{avg.toFixed(1)} / 5.0</span>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {reviews.length === 0 && (
                <p className="text-gray-600">No reviews yet. Be the first to review this facility!</p>
              )}

              {/* Write a Review */}
              <div className="mt-6 border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewForm.userName}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[5,4,3,2,1].map(r => (
                        <option key={r} value={r}>{r} Star{r>1?'s':''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Section */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Your Slot</h3>
              
              {!showBookingForm ? (
                <div className="space-y-4">
                  {/* Date Selection - Calendar Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const dates = getAvailableDates();
                        const today = new Date();
                        const currentMonth = today.getMonth();
                        const currentYear = today.getFullYear();
                        
                        // Get first day of current month
                        const firstDay = new Date(currentYear, currentMonth, 1);
                        const startDate = new Date(firstDay);
                        startDate.setDate(1);
                        
                        // Get last day of current month
                        const lastDay = new Date(currentYear, currentMonth + 1, 0);
                        const endDate = new Date(lastDay);
                        
                        const calendarDates = [];
                        
                        // Add empty cells for days before month starts
                        for (let i = 0; i < startDate.getDay(); i++) {
                          calendarDates.push(<div key={`empty-${i}`} className="h-8"></div>);
                        }
                        
                        // Add dates for current month
                        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                          const dateStr = date.toISOString().split('T')[0];
                          const isAvailable = dates.includes(dateStr);
                          const isSelected = selectedDate === dateStr;
                          const isToday = date.toDateString() === today.toDateString();
                          
                          calendarDates.push(
                            <button
                              key={dateStr}
                              onClick={() => isAvailable && setSelectedDate(dateStr)}
                              disabled={!isAvailable}
                              className={`h-8 rounded-md text-sm font-medium transition-all calendar-date ${
                                isSelected 
                                  ? 'bg-blue-600 text-white' 
                                  : isToday 
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                    : isAvailable 
                                      ? 'hover:bg-gray-100 text-gray-900' 
                                      : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        }
                        
                        return calendarDates;
                      })()}
                    </div>
                    {selectedDate && (
                      <div className="mt-2 text-sm text-blue-600">
                        Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>

                  {/* Combined Time and Duration Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {timeSlots.map((slot) => {
                        const [startTime] = slot.split('-');
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedTime === slot 
                              ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {startTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration Selection - Dynamic Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((duration) => (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setSelectedDuration(duration)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedDuration === duration 
                            ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {duration === 0.5 ? '30 min' : `${duration} ${duration === 1 ? 'hour' : 'hours'}`}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Custom Duration</span>
                        <span className="text-sm font-medium text-blue-600">{selectedDuration} hour{selectedDuration !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        <button 
                          type="button"
                          onClick={() => setSelectedDuration(prev => Math.max(0.5, prev - 0.5))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="range"
                          min="0.5"
                          max="8"
                          step="0.5"
                          value={selectedDuration}
                          onChange={(e) => setSelectedDuration(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(selectedDuration - 0.5) / 7.5 * 100}%, #E5E7EB ${(selectedDuration - 0.5) / 7.5 * 100}%, #E5E7EB 100%)`
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => setSelectedDuration(prev => Math.min(8, prev + 0.5))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Person Count - Dynamic Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People: {personCount} person{personCount > 1 ? 's' : ''}
                    </label>
                    <div className="space-y-4">
                      {/* Quick selection buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 6].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setPersonCount(count)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${personCount === count 
                              ? 'bg-green-600 text-white shadow-md transform scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {count} {count === 1 ? 'person' : 'people'}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom slider */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Custom count</span>
                          <span className="text-sm font-medium text-green-600">{personCount}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            type="button"
                            onClick={() => setPersonCount(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={personCount}
                            onChange={(e) => setPersonCount(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #10B981 0%, #10B981 ${(personCount - 1) / 19 * 100}%, #E5E7EB ${(personCount - 1) / 19 * 100}%, #E5E7EB 100%)`
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => setPersonCount(prev => Math.min(20, prev + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1</span>
                          <span>5</span>
                          <span>10</span>
                          <span>15</span>
                          <span>20</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={additionalServices.equipment}
                          onChange={(e) => setAdditionalServices(prev => ({ ...prev, equipment: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Sports Equipment (₹50)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={additionalServices.coaching}
                          onChange={(e) => setAdditionalServices(prev => ({ ...prev, coaching: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Professional Coaching (₹200)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={additionalServices.refreshments}
                          onChange={(e) => setAdditionalServices(prev => ({ ...prev, refreshments: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Refreshments (₹100)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={additionalServices.parking}
                          onChange={(e) => setAdditionalServices(prev => ({ ...prev, parking: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Parking (₹30)</span>
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Price Calculation */}
                  {selectedDate && selectedTime && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
                      {(() => {
                        const breakdown = getPriceBreakdown();
                        if (!breakdown) return null;
                        
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Base Price ({breakdown.durationDisplay}):</span>
                              <span>₹{breakdown.basePrice * breakdown.duration}</span>
                            </div>
                            {breakdown.peakTimeSurcharge > 0 && (
                              <div className="flex justify-between text-orange-600">
                                <span>Peak Time Surcharge:</span>
                                <span>+₹{breakdown.peakTimeSurcharge}</span>
                              </div>
                            )}
                            {breakdown.weekendSurcharge > 0 && (
                              <div className="flex justify-between text-orange-600">
                                <span>Weekend Surcharge:</span>
                                <span>+₹{breakdown.weekendSurcharge}</span>
                              </div>
                            )}
                            {breakdown.personDiscount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Group Discount:</span>
                                <span>-₹{breakdown.personDiscount}</span>
                              </div>
                            )}
                            {breakdown.servicesPrice > 0 && (
                              <div className="flex justify-between text-blue-600">
                                <span>Additional Services:</span>
                                <span>+₹{breakdown.servicesPrice}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total Price:</span>
                                <span className="text-blue-600">₹{breakdown.total}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <button
                    onClick={handleBookNow}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        onBlur={(e) => {
                          if (e.target.value && !validateEmail(e.target.value)) {
                            e.target.setCustomValidity('Please enter a valid email address (e.g., yourusername@gmail.com)');
                            e.target.reportValidity();
                          } else {
                            e.target.setCustomValidity('');
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${bookingForm.email && !validateEmail(bookingForm.email) ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        placeholder="yourusername@gmail.com"
                        required
                      />
                      {bookingForm.email && !validateEmail(bookingForm.email) && (
                        <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setBookingForm(prev => ({ ...prev, phone: value }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value && !validatePhoneNumber(e.target.value)) {
                            e.target.setCustomValidity('Please enter a valid 10-digit Indian phone number');
                            e.target.reportValidity();
                          } else {
                            e.target.setCustomValidity('');
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${bookingForm.phone && !validatePhoneNumber(bookingForm.phone) ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        placeholder="10-digit number (e.g., 9876543210)"
                        maxLength={10}
                        required
                      />
                      {bookingForm.phone && !validatePhoneNumber(bookingForm.phone) && (
                        <p className="mt-1 text-sm text-red-600">Please enter a valid 10-digit Indian phone number</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <textarea
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                        onBlur={(e) => {
                          if (!e.target.value.trim()) {
                            e.target.setCustomValidity('Please enter your address');
                            e.target.reportValidity();
                          } else {
                            e.target.setCustomValidity('');
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${bookingForm.address === '' ? 'border-gray-300' : bookingForm.address.trim().length < 5 ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        placeholder="Enter your complete address"
                        rows={3}
                        required
                      />
                      {bookingForm.address && bookingForm.address.trim().length < 5 && (
                        <p className="mt-1 text-sm text-red-600">Please enter a complete address</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {/* Quick selection buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 6].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setBookingForm(prev => ({ ...prev, personCount: count }))}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${bookingForm.personCount === count 
                              ? 'bg-green-600 text-white shadow-md transform scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {count} {count === 1 ? 'person' : 'people'}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom input */}
                      <div className="flex items-center space-x-3">
                        <button 
                          type="button"
                          onClick={() => setBookingForm(prev => ({ ...prev, personCount: Math.max(1, prev.personCount - 1) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={bookingForm.personCount}
                          onChange={(e) => {
                            const value = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                            setBookingForm(prev => ({ ...prev, personCount: value }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setBookingForm(prev => ({ ...prev, personCount: Math.min(20, prev.personCount + 1) }))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facility:</span>
                        <span className="font-medium">{facility.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facility Type:</span>
                        <span className="font-medium">
                          {facility.sports.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedDuration} hour{selectedDuration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">{personCount}</span>
                      </div>
                      {Object.values(additionalServices).some(Boolean) && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Services:</span>
                          <span className="font-medium">
                            {[
                              additionalServices.equipment && 'Equipment',
                              additionalServices.coaching && 'Coaching',
                              additionalServices.refreshments && 'Refreshments',
                              additionalServices.parking && 'Parking'
                            ].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span className="text-blue-600">
                            ₹{calculateTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Facility Info Card */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={16} />
                  <span className="text-gray-700">{facility.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-400" size={16} />
                  <span className="text-gray-700">Open 6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-gray-400" size={16} />
                  <span className="text-gray-700">Max capacity: 50 people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Payment Modal */}
    <PaymentModal 
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      amount={calculateTotalPrice()}
      onPaymentComplete={handlePaymentComplete}
    />
    </>
  );
};
