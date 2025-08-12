export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
  favoriteSports?: string[];
  createdAt: Date;
  status?: 'active' | 'banned';
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  description: string;
  sports: string[];
  amenities: string[];
  images: string[];
  rating: number;
  pricePerHour: number;
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Court {
  id: string;
  facilityId: string;
  name: string;
  sport: string;
  environment: 'indoor' | 'outdoor';
  pricePerHour: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  facilityId: string;
  courtId: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Review {
  id: string;
  facilityId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}