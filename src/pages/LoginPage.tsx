import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Logo } from '../components/Logo';

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !['user', 'owner', 'admin'].includes(role)) return;

    // Validate email format
    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, role as 'user' | 'owner' | 'admin');
      
      if (success) {
        // Redirect to appropriate dashboard
        navigate(`/dashboard/${role}`);
      }
    } catch (error: any) {
      alert(error?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'user': return 'Player Login';
      case 'owner': return 'Facility Owner Login';
      case 'admin': return 'Administrator Login';
      default: return 'Login';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'user': return 'from-blue-500 to-cyan-400';
      case 'owner': return 'from-green-500 to-emerald-400';
      case 'admin': return 'from-orange-500 to-red-400';
      default: return 'from-blue-500 to-cyan-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <Logo size="sm" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{getRoleTitle()}</h1>
            <p className="text-gray-400">
              {role === 'user' 
                ? 'Book courts, join games, and track your sports activities' 
                : role === 'owner' 
                ? 'Manage your facilities, view bookings, and handle operations'
                : 'Enter your credentials to access your dashboard'
              }
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r ${getRoleColor()} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-cyan-400 hover:text-cyan-300"
                onClick={async () => {
                  if (!formData.email) {
                    alert('Enter your email above to reset password.');
                    return;
                  }
                  try {
                    await resetPassword(formData.email);
                    alert('Password reset email sent. Check your inbox.');
                  } catch (e: any) {
                    alert(e?.message || 'Failed to send reset email.');
                  }
                }}
              >
                Forgot password?
              </button>
            </div>

            {(role === 'user' || role === 'owner' || role === 'admin') && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    const ok = await loginWithGoogle(role as 'user' | 'owner' | 'admin');
                    setIsLoading(false);
                    if (ok) navigate(`/dashboard/${role}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FcGoogle size={20} />
                  Continue with Google
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {role === 'owner' ? 'Sign in as Facility Owner' : role === 'admin' ? 'Sign in as Administrator' : 'Sign in as Player'}
                </p>
              </div>
            )}

            {role === 'user' && (
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-blue-300 font-semibold text-sm mb-2">🎾 Quick Start for Players</h3>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• Browse available sports facilities</li>
                  <li>• Book courts with instant confirmation</li>
                  <li>• Join group games and tournaments</li>
                  <li>• Track your booking history</li>
                </ul>
              </div>
            )}

            {role === 'owner' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <h3 className="text-green-300 font-semibold text-sm mb-2">🏢 Facility Management Tools</h3>
                <ul className="text-xs text-green-200 space-y-1">
                  <li>• Manage your sports facilities</li>
                  <li>• View and approve bookings</li>
                  <li>• Track revenue and analytics</li>
                  <li>• Handle customer inquiries</li>
                </ul>
              </div>
            )}

            {role === 'admin' && (
              <div className="mt-4 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <h3 className="text-orange-300 font-semibold text-sm mb-2">⚙️ Administrative Controls</h3>
                <ul className="text-xs text-orange-200 space-y-1">
                  <li>• Manage all facilities and users</li>
                  <li>• Monitor system analytics</li>
                  <li>• Handle disputes and support</li>
                  <li>• System configuration and settings</li>
                </ul>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {role === 'user' 
                ? 'Demo: Use any email/password or Google sign-in to start booking courts'
                : role === 'owner'
                ? 'Demo: Use any email/password or Google sign-in to manage facilities'
                : role === 'admin'
                ? 'Demo: Use any email/password or Google sign-in for administrative access'
                : 'Demo credentials: Use any email/password combination'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};