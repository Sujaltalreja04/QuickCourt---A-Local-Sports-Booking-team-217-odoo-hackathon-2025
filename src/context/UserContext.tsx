import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: 'user' | 'owner' | 'admin') => User[];
  getActiveUsers: () => User[];
  getBannedUsers: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Mock initial users for demonstration
const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'john.player@example.com',
    name: 'John Player',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+91 98765 43210',
    favoriteSports: ['Badminton', 'Tennis'],
    createdAt: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: 'user_2',
    email: 'mike.owner@sports.com',
    name: 'Mike Owner',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+91 87654 32109',
    favoriteSports: ['Football', 'Cricket'],
    createdAt: new Date('2024-02-10'),
    status: 'active'
  },
  {
    id: 'user_3',
    email: 'sarah.player@example.com',
    name: 'Sarah Player',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+91 76543 21098',
    favoriteSports: ['Basketball', 'Volleyball'],
    createdAt: new Date('2024-03-05'),
    status: 'banned'
  },
  {
    id: 'user_4',
    email: 'elite.sports@contact.com',
    name: 'Elite Sports Complex',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    phone: '+91 65432 10987',
    favoriteSports: ['Multi-sport'],
    createdAt: new Date('2024-01-28'),
    status: 'active'
  },
  {
    id: 'user_5',
    email: 'admin@quickcourt.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+91 54321 09876',
    favoriteSports: ['All Sports'],
    createdAt: new Date('2024-01-01'),
    status: 'active'
  },
  {
    id: 'user_6',
    email: 'alex.tennis@example.com',
    name: 'Alex Tennis',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    phone: '+91 43210 98765',
    favoriteSports: ['Tennis', 'Table Tennis'],
    createdAt: new Date('2024-02-20'),
    status: 'active'
  },
  {
    id: 'user_7',
    email: 'royal.academy@contact.com',
    name: 'Royal Academy',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face',
    phone: '+91 32109 87654',
    favoriteSports: ['Badminton', 'Squash'],
    createdAt: new Date('2024-02-15'),
    status: 'active'
  },
  {
    id: 'user_8',
    email: 'emma.fitness@example.com',
    name: 'Emma Fitness',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+91 21098 76543',
    favoriteSports: ['Yoga', 'Pilates'],
    createdAt: new Date('2024-03-10'),
    status: 'active'
  }
];

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Load users from localStorage on initial render
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('quickcourt_users');
    if (savedUsers) {
      try {
          return JSON.parse(savedUsers);
      } catch (error) {
          console.error('Error parsing saved users:', error);
          return mockUsers;
      }
    }
    return mockUsers;
  });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quickcourt_users', JSON.stringify(users));
  }, [users]);

  const addUser = (user: User) => {
    setUsers(prev => [user, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const banUser = (id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, status: 'banned' as const } : user
      )
    );
  };

  const unbanUser = (id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, status: 'active' as const } : user
      )
    );
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: 'user' | 'owner' | 'admin') => {
    return users.filter(user => user.role === role);
  };

  const getActiveUsers = () => {
    return users.filter(user => user.status === 'active');
  };

  const getBannedUsers = () => {
    return users.filter(user => user.status === 'banned');
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser,
      banUser,
      unbanUser,
      getUserById,
      getUsersByRole,
      getActiveUsers,
      getBannedUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};
