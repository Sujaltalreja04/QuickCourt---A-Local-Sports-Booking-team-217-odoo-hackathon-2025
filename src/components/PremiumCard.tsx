import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphism?: boolean;
  onClick?: () => void;
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'orange' | 'red';
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = '',
  hover = true,
  glassmorphism = true,
  onClick,
  image,
  title,
  subtitle,
  badge,
  badgeColor = 'green'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const badgeColors = {
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white'
  };

  const cardClasses = `
    relative overflow-hidden rounded-2xl border border-white/20 
    ${glassmorphism ? 'bg-white/10 backdrop-blur-md' : 'bg-white'}
    ${hover ? 'cursor-pointer' : ''}
    transition-all duration-300
    ${className}
  `;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getFallbackImage = () => {
    // Return a default sports facility image or a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjc0MjQyIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwTDIwMCAxMDBMMzAwIDE1MEwyMDAgMjAwTDEwMCAxNTBaIiBmaWxsPSIjM0I4MjFGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM2M0YzNjQiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzYzRjM2NCIvPgo8L3N2Zz4K';
  };

  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cardClasses}
      onClick={onClick}
    >
      {/* Badge */}
      {badge && (
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[badgeColor]} z-10`}>
          {badge}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={imageError ? getFallbackImage() : image}
            alt={title || 'Card image'} 
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        )}
        {subtitle && (
          <p className="text-gray-300 mb-4">{subtitle}</p>
        )}
        {children}
      </div>

      {/* Hover Effect Overlay */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}
    </motion.div>
  );
};
