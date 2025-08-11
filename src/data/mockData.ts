import { Facility, Booking, Court, Review } from '../types';

export const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Elite Sports Complex',
    location: 'Downtown Arena, City Center',
    description: 'Premium sports facility with state-of-the-art equipment and professional courts. Perfect for tournaments and casual play.',
    sports: ['Badminton', 'Tennis', 'Basketball'],
    amenities: ['Parking', 'Changing Rooms', 'Cafeteria', 'AC', 'Equipment Rental', 'WiFi', 'Water Dispenser'],
    images: [
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    pricePerHour: 25,
    ownerId: 'owner_1',
    status: 'approved',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Green Field Football Turf',
    location: 'Sports Valley, North District',
    description: 'Artificial turf football ground perfect for 5v5 and 7v7 matches. Professional quality with floodlights.',
    sports: ['Football', 'Cricket'],
    amenities: ['Parking', 'Floodlights', 'Changing Rooms', 'First Aid', 'Equipment Rental', 'Water Dispenser'],
    images: [
      'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.5,
    pricePerHour: 35,
    ownerId: 'owner_2',
    status: 'approved',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    name: 'Royal Badminton Academy',
    location: 'Heritage Club, East Wing',
    description: 'Professional badminton courts with wooden flooring and perfect lighting. Coaching available.',
    sports: ['Badminton'],
    amenities: ['AC', 'Parking', 'Equipment Rental', 'Coaching Available', 'Spectator Seating', 'WiFi'],
    images: [
      'https://images.pexels.com/photos/976873/pexels-photo-976873.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    pricePerHour: 20,
    ownerId: 'owner_3',
    status: 'approved',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '4',
    name: 'Sky High Basketball Arena',
    location: 'Sports Hub, West Zone',
    description: 'Indoor basketball courts with professional hoops and air conditioning. Perfect for tournaments.',
    sports: ['Basketball'],
    amenities: ['AC', 'Parking', 'Changing Rooms', 'Equipment Rental', 'Spectator Seating', 'WiFi', 'Water Dispenser'],
    images: [
      'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.7,
    pricePerHour: 30,
    ownerId: 'owner_4',
    status: 'approved',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '5',
    name: 'Tennis Paradise',
    location: 'Garden Club, South District',
    description: 'Professional tennis courts with clay and hard court options. Coaching and equipment available.',
    sports: ['Tennis'],
    amenities: ['AC', 'Parking', 'Changing Rooms', 'Equipment Rental', 'Coaching Available', 'Spectator Seating', 'WiFi'],
    images: [
      'https://images.pexels.com/photos/573945/pexels-photo-573945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    pricePerHour: 40,
    ownerId: 'owner_5',
    status: 'approved',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '6',
    name: 'Cricket Champions Ground',
    location: 'Sports Complex, Central Area',
    description: 'Professional cricket ground with practice nets and floodlights. Perfect for training and matches.',
    sports: ['Cricket'],
    amenities: ['Parking', 'Floodlights', 'Changing Rooms', 'Practice Nets', 'Equipment Rental', 'Water Dispenser'],
    images: [
      'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.4,
    pricePerHour: 50,
    ownerId: 'owner_6',
    status: 'approved',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '7',
    name: 'Volleyball Victory Court',
    location: 'Beach Sports Zone, Coastal Area',
    description: 'Indoor and outdoor volleyball courts with professional equipment and coaching.',
    sports: ['Volleyball'],
    amenities: ['AC', 'Parking', 'Changing Rooms', 'Equipment Rental', 'Coaching Available', 'WiFi'],
    images: [
      'https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.3,
    pricePerHour: 25,
    ownerId: 'owner_7',
    status: 'approved',
    createdAt: new Date('2024-02-25'),
  },
  {
    id: '8',
    name: 'Table Tennis Pro Center',
    location: 'Indoor Sports Hub, Downtown',
    description: 'Professional table tennis facility with multiple tables and coaching available.',
    sports: ['Table Tennis'],
    amenities: ['AC', 'Parking', 'Equipment Rental', 'Coaching Available', 'WiFi', 'Water Dispenser'],
    images: [
      'https://images.pexels.com/photos/573945/pexels-photo-573945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    pricePerHour: 15,
    ownerId: 'owner_8',
    status: 'approved',
    createdAt: new Date('2024-03-10'),
  }
];

export const mockCourts: Court[] = [
  { id: '1', facilityId: '1', name: 'Court A1', sport: 'Badminton', environment: 'indoor', pricePerHour: 20, isActive: true },
  { id: '2', facilityId: '1', name: 'Court A2', sport: 'Badminton', environment: 'indoor', pricePerHour: 20, isActive: true },
  { id: '3', facilityId: '1', name: 'Tennis Court 1', sport: 'Tennis', environment: 'outdoor', pricePerHour: 30, isActive: true },
  { id: '4', facilityId: '2', name: 'Main Turf', sport: 'Football', environment: 'outdoor', pricePerHour: 35, isActive: true },
  { id: '5', facilityId: '3', name: 'Court 1', sport: 'Badminton', environment: 'indoor', pricePerHour: 20, isActive: true },
  { id: '6', facilityId: '3', name: 'Court 2', sport: 'Badminton', environment: 'indoor', pricePerHour: 20, isActive: true },
  { id: '7', facilityId: '4', name: 'Basketball Court 1', sport: 'Basketball', environment: 'indoor', pricePerHour: 30, isActive: true },
  { id: '8', facilityId: '4', name: 'Basketball Court 2', sport: 'Basketball', environment: 'indoor', pricePerHour: 30, isActive: true },
  { id: '9', facilityId: '5', name: 'Clay Court 1', sport: 'Tennis', environment: 'outdoor', pricePerHour: 40, isActive: true },
  { id: '10', facilityId: '5', name: 'Hard Court 1', sport: 'Tennis', environment: 'outdoor', pricePerHour: 40, isActive: true },
  { id: '11', facilityId: '6', name: 'Main Ground', sport: 'Cricket', environment: 'outdoor', pricePerHour: 50, isActive: true },
  { id: '12', facilityId: '6', name: 'Practice Net 1', sport: 'Cricket', environment: 'outdoor', pricePerHour: 25, isActive: true },
  { id: '13', facilityId: '7', name: 'Indoor Court 1', sport: 'Volleyball', environment: 'indoor', pricePerHour: 25, isActive: true },
  { id: '14', facilityId: '7', name: 'Outdoor Court 1', sport: 'Volleyball', environment: 'outdoor', pricePerHour: 20, isActive: true },
  { id: '15', facilityId: '8', name: 'Table 1', sport: 'Table Tennis', environment: 'indoor', pricePerHour: 15, isActive: true },
  { id: '16', facilityId: '8', name: 'Table 2', sport: 'Table Tennis', environment: 'indoor', pricePerHour: 15, isActive: true }
];

export const indoorCourts: Court[] = mockCourts.filter(c => c.environment === 'indoor');
export const outdoorCourts: Court[] = mockCourts.filter(c => c.environment === 'outdoor');

export const indoorSports: string[] = Array.from(
  new Set(indoorCourts.map(c => c.sport))
);

export const outdoorSports: string[] = Array.from(
  new Set(outdoorCourts.map(c => c.sport))
);

// Simple aliases if you prefer "games" wording in UI
export const indoorGames: string[] = indoorSports;
export const outdoorGames: string[] = outdoorSports;

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'user_1',
    facilityId: '1',
    courtId: '1',
    date: '2024-12-25',
    timeSlot: '10:00-11:00',
    duration: 1,
    totalPrice: 20,
    status: 'confirmed',
    createdAt: new Date('2024-12-20'),
  },
  {
    id: '2',
    userId: 'user_1',
    facilityId: '2',
    courtId: '4',
    date: '2024-12-28',
    timeSlot: '16:00-17:00',
    duration: 1,
    totalPrice: 35,
    status: 'confirmed',
    createdAt: new Date('2024-12-21'),
  },
  {
    id: '3',
    userId: 'user_1',
    facilityId: '3',
    courtId: '5',
    date: '2024-12-30',
    timeSlot: '18:00-19:00',
    duration: 1,
    totalPrice: 20,
    status: 'confirmed',
    createdAt: new Date('2024-12-22'),
  },
  {
    id: '4',
    userId: 'user_1',
    facilityId: '4',
    courtId: '7',
    date: '2025-01-02',
    timeSlot: '14:00-16:00',
    duration: 2,
    totalPrice: 60,
    status: 'confirmed',
    createdAt: new Date('2024-12-23'),
  },
  {
    id: '5',
    userId: 'user_1',
    facilityId: '5',
    courtId: '9',
    date: '2025-01-05',
    timeSlot: '09:00-10:00',
    duration: 1,
    totalPrice: 40,
    status: 'confirmed',
    createdAt: new Date('2024-12-24'),
  }
];

export const timeSlots = [
  '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
  '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
  '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00',
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    facilityId: '1',
    userName: 'Aarav Sharma',
    rating: 5,
    comment: 'Excellent courts and great lighting. Staff was very helpful!',
    createdAt: new Date('2024-12-12'),
  },
  {
    id: 'r2',
    facilityId: '1',
    userName: 'Neha Patel',
    rating: 4,
    comment: 'Good facilities and clean changing rooms. Slightly crowded in evenings.',
    createdAt: new Date('2024-12-18'),
  },
  {
    id: 'r3',
    facilityId: '2',
    userName: 'Rohit Verma',
    rating: 5,
    comment: 'Turf quality is top-notch. Perfect for 7v7 games with friends.',
    createdAt: new Date('2024-12-20'),
  },
  {
    id: 'r4',
    facilityId: '3',
    userName: 'Priya Singh',
    rating: 5,
    comment: 'Best badminton academy around. Coaching was superb!',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'r5',
    facilityId: '4',
    userName: 'Vikram Desai',
    rating: 4,
    comment: 'Great indoor arena. AC kept the court cool even during peak hours.',
    createdAt: new Date('2025-01-02'),
  },
  {
    id: 'r6',
    facilityId: '5',
    userName: 'Anjali Gupta',
    rating: 4,
    comment: 'Clay court was well maintained. Booking process was smooth.',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'r7',
    facilityId: '6',
    userName: 'Sameer Khan',
    rating: 5,
    comment: 'Amazing ground with proper nets. Floodlights are bright and even.',
    createdAt: new Date('2024-12-29'),
  }
];