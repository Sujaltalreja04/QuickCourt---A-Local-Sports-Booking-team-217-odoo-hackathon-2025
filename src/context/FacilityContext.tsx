import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Facility } from '../types';
import { mockFacilities } from '../data/mockData';

interface FacilityContextType {
  facilities: Facility[];
  approvedFacilities: Facility[]; // Only approved facilities for users
  addFacility: (facility: Facility) => void;
  updateFacility: (id: string, updates: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  approveFacility: (id: string) => void;
  rejectFacility: (id: string) => void;
  refreshFacilities: () => void;
  isRefreshing: boolean;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export const useFacilities = () => {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  return context;
};

interface FacilityProviderProps {
  children: ReactNode;
}

export const FacilityProvider: React.FC<FacilityProviderProps> = ({ children }) => {
  // Load facilities from localStorage on initial render
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const savedFacilities = localStorage.getItem('facilities');
    if (savedFacilities) {
      try {
        return JSON.parse(savedFacilities);
      } catch (error) {
        console.error('Error parsing saved facilities:', error);
        return mockFacilities;
      }
    }
    return mockFacilities;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter approved facilities for users
  const approvedFacilities = facilities.filter(facility => facility.status === 'approved');

  // Save facilities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('facilities', JSON.stringify(facilities));
  }, [facilities]);

  // Real-time update mechanism - check for changes every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const savedFacilities = localStorage.getItem('facilities');
      if (savedFacilities) {
        try {
          const parsedFacilities = JSON.parse(savedFacilities);
          // Only update if there are actual changes
          if (JSON.stringify(parsedFacilities) !== JSON.stringify(facilities)) {
            setFacilities(parsedFacilities);
          }
        } catch (error) {
          console.error('Error parsing saved facilities during refresh:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [facilities]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'facilities' && e.newValue) {
        try {
          const newFacilities = JSON.parse(e.newValue);
          setFacilities(newFacilities);
        } catch (error) {
          console.error('Error parsing facilities from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshFacilities = useCallback(() => {
    setIsRefreshing(true);
    const savedFacilities = localStorage.getItem('facilities');
    if (savedFacilities) {
      try {
        const parsedFacilities = JSON.parse(savedFacilities);
        setFacilities(parsedFacilities);
      } catch (error) {
        console.error('Error parsing saved facilities during manual refresh:', error);
      }
    }
    // Simulate a small delay to show loading state
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const addFacility = (facility: Facility) => {
    setFacilities(prev => [facility, ...prev]);
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'facilities',
      newValue: JSON.stringify([facility, ...facilities])
    }));
  };

  const updateFacility = (id: string, updates: Partial<Facility>) => {
    setFacilities(prev => 
      prev.map(facility => 
        facility.id === id ? { ...facility, ...updates } : facility
      )
    );
  };

  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.id !== id));
  };

  const approveFacility = (id: string) => {
    setFacilities(prev => 
      prev.map(facility => 
        facility.id === id ? { ...facility, status: 'approved' as const } : facility
      )
    );
  };

  const rejectFacility = (id: string) => {
    setFacilities(prev => 
      prev.map(facility => 
        facility.id === id ? { ...facility, status: 'rejected' as const } : facility
      )
    );
  };

  return (
    <FacilityContext.Provider value={{ 
      facilities, 
      approvedFacilities,
      addFacility, 
      updateFacility, 
      deleteFacility,
      approveFacility,
      rejectFacility,
      refreshFacilities,
      isRefreshing
    }}>
      {children}
    </FacilityContext.Provider>
  );
};


