import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, MoreVertical } from 'lucide-react';
import { Logo } from './Logo';
import { ChatbotAI } from './ChatbotAI';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  showChatbot?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar, sidebarOpen, onToggleSidebar, showChatbot = false }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md shadow-md border-b border-white/20">
        <div className="container-pro">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onToggleSidebar}
                className="p-2 text-white hover:text-blue-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              <Logo size="sm" />
            </div>
            
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
                <span className="text-sm font-medium text-white">{user?.name}</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white capitalize">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-white hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
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
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-black/90 backdrop-blur-md shadow-lg min-h-screen border-r border-white/20 overflow-hidden"
            >
              {sidebar}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-black">
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 min-h-screen"
          >
            {children}
          </motion.main>
        </div>
      </div>
      
      {/* AI Chatbot */}
      {showChatbot && <ChatbotAI />}
    </div>
  );
};