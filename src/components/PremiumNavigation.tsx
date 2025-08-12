import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumButton } from './PremiumButton';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';

interface PremiumNavigationProps {
  logo?: React.ReactNode;
  navigationItems?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  ctaText?: string;
  ctaAction?: () => void;
  showCart?: boolean;
  showSearch?: boolean;
  className?: string;
}

export const PremiumNavigation: React.FC<PremiumNavigationProps> = ({
  logo,
  navigationItems = [
    { label: 'HOME', href: '/', active: true },
  ],
  ctaText,
  ctaAction,
  showCart = false,
  showSearch = false,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            {logo || (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white font-display">QUICKCOURT</span>
              </div>
            )}
          </div>

          {/* Centered Navigation - Only HOME */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-white font-semibold text-lg px-6 py-2 transition-colors duration-200 hover:text-green-400 ${
                  item.active ? 'text-green-400 border-b-2 border-green-400' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Empty for balance */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Empty space to balance the layout */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-green-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 text-white font-medium transition-colors duration-200 hover:text-green-400 hover:bg-white/10 rounded-lg ${
                    item.active ? 'text-green-400 bg-white/10' : ''
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

