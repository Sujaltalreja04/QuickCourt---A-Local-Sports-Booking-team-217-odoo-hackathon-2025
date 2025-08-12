import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from 'firebase/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: 'user' | 'owner' | 'admin') => Promise<boolean>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  loginWithGoogle: (role?: 'user' | 'owner' | 'admin') => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('quickcourt_user');
    if (savedUser) {
      try {
        const raw = JSON.parse(savedUser);
        // Normalize persisted user to avoid broken avatar edge cases
        const normalized = {
          ...raw,
          avatar:
            typeof raw?.avatar === 'string' && raw.avatar.trim() && raw.avatar !== 'undefined' && raw.avatar !== 'null'
              ? raw.avatar
              : undefined,
        } as User;
        setAuthState({
          user: normalized,
          isAuthenticated: true,
          loading: false,
        });
      } catch {
        localStorage.removeItem('quickcourt_user');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'owner' | 'admin'): Promise<boolean> => {
    try {
      // For demo purposes, allow any email/password combination to work
      // Generate a random user ID
      const randomId = Math.random().toString(36).substring(2, 15);
      
      // Create a mock user object
      const signedInUser: User = {
        id: randomId,
        email: email,
        name: email.split('@')[0],
        role,
        avatar: undefined,
        createdAt: new Date(),
      };

      // Update auth state and store in localStorage
      setAuthState({ user: signedInUser, isAuthenticated: true, loading: false });
      localStorage.setItem('quickcourt_user', JSON.stringify(signedInUser));
      
      return true;
    } catch (e: any) {
      console.error(e);
      throw e instanceof Error ? e : new Error('Email/password sign-in failed.');
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, loading: false });
    localStorage.removeItem('quickcourt_user');
    if (auth) { try { signOut(auth); } catch {} }
  };

  const loginWithGoogle = async (role: 'user' | 'owner' | 'admin' = 'user'): Promise<boolean> => {
    try {
      if (!auth || !googleProvider) {
        alert('Google Sign-In is not configured.');
        return false;
      }
      const result = await signInWithPopup(auth, googleProvider);
      const profile = result.user;

      const googleUser: User = {
        id: profile.uid,
        email: profile.email || '',
        name: profile.displayName || profile.email?.split('@')[0] || 'User',
        role,
        avatar:
          typeof profile.photoURL === 'string' && profile.photoURL.trim() && profile.photoURL !== 'undefined' && profile.photoURL !== 'null'
            ? profile.photoURL
            : undefined,
        createdAt: new Date(),
      };

      setAuthState({ user: googleUser, isAuthenticated: true, loading: false });
      localStorage.setItem('quickcourt_user', JSON.stringify(googleUser));
      return true;
    } catch (e) {
      console.error(e);
      alert('Google Sign-In failed.');
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    return otp === '123456'; // Mock OTP
  };

  const setUser = (user: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
    if (user) {
      localStorage.setItem('quickcourt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('quickcourt_user');
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Auth is not configured.');
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      verifyOTP,
      setUser,
      loginWithGoogle,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};