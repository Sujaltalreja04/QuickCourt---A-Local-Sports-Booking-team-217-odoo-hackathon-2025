import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Logo } from './Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md shadow-md border-b border-white/20">
        <div className="container-pro">
          <div className="flex justify-between items-center h-16">
            <Logo size="sm" />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=E5E7EB&color=374151&size=64&bold=true`;
                    }}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 capitalize">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/50 backdrop-blur-md shadow-lg min-h-screen border-r border-white/20">
          {sidebar}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};