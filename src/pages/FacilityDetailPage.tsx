import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  Phone,
  Mail,
  Home,
  
} from 'lucide-react';
import { mockFacilities, mockCourts, timeSlots, mockReviews } from '../data/mockData';
import { Logo } from '../components/Logo';
import { ReviewCard } from '../components/ReviewCard';
import { Review } from '../types';

export const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
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

  const facility = mockFacilities.find(f => f.id === id);
  const courts = mockCourts.filter(c => c.facilityId === id);

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
    if (!selectedCourt || !selectedDate || !selectedTime) {
      alert('Please select court, date, and time before booking');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate total price
    const court = courts.find(c => c.id === selectedCourt);
    const totalPrice = (court?.pricePerHour || facility.pricePerHour) * selectedDuration;

    // Here you would typically send the booking to your backend
    const bookingData = {
      facilityId: facility.id,
      courtId: selectedCourt,
      date: selectedDate,
      timeSlot: selectedTime,
      duration: selectedDuration,
      personCount: personCount,
      totalPrice,
      userDetails: bookingForm
    };

    console.log('Booking submitted:', bookingData);
    
    // Show success message and redirect
    alert('Booking submitted successfully! You will receive a confirmation email shortly.');
    navigate('/dashboard/user');
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

  return (
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
            <Logo size="sm" />
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Facility Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Facility Images */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md overflow-hidden shadow-lg">
              <img
                src={facility.images[0]}
                alt={facility.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Facility Details */}
            <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{facility.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current mr-1" size={16} />
                      <span className="font-medium">{facility.rating}</span>
                      <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">₹{facility.pricePerHour}</div>
                  <div className="text-gray-500">per hour</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{facility.description}</p>

              {/* Sports Offered */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sports Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.sports.map((sport) => (
                    <span key={sport} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {facility.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
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
                  {/* Court Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Court</label>
                    <select
                      value={selectedCourt}
                      onChange={(e) => setSelectedCourt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a court</option>
                      {courts.map((court) => (
                        <option key={court.id} value={court.id}>
                          {court.name} - {court.sport} (₹{court.pricePerHour}/hr)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a date</option>
                      {getAvailableDates().map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((hours) => (
                        <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Person Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                    <select
                      value={personCount}
                      onChange={(e) => setPersonCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <option key={count} value={count}>{count} person{count > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Calculation */}
                  {selectedCourt && selectedDate && selectedTime && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Price:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{(courts.find(c => c.id === selectedCourt)?.pricePerHour || facility.pricePerHour) * selectedDuration}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookNow}
                    disabled={!selectedCourt || !selectedDate || !selectedTime}
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                        required
                      />
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
                        onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                        required
                      />
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your address"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={personCount}
                      onChange={(e) => setPersonCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <option key={count} value={count}>{count} person{count > 1 ? 's' : ''}</option>
                      ))}
                    </select>
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
                        <span className="text-gray-600">Court:</span>
                        <span className="font-medium">
                          {courts.find(c => c.id === selectedCourt)?.name}
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
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span className="text-blue-600">
                            ₹{(courts.find(c => c.id === selectedCourt)?.pricePerHour || facility.pricePerHour) * selectedDuration}
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
  );
};
