import React from 'react';
import { motion } from 'framer-motion';
import { PremiumButton } from './PremiumButton';
import { ChevronDown, ShoppingCart, Image, Monitor } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: () => void;
  backgroundVideo?: string;
  backgroundImage?: string;
  showFloatingElements?: boolean;
  showScrollIndicator?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaAction,
  backgroundVideo,
  backgroundImage,
  showFloatingElements = false,
  showScrollIndicator = false
}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={backgroundImage}
        >
          <source src={backgroundVideo} type="video/mp4" />
          {backgroundImage && (
            <img src={backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
          )}
        </video>
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Cinematic of badminton.mp4" type="video/mp4" />
          <img 
            src="https://images.pexels.com/photos/573945/pexels-photo-573945.jpeg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </video>
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PremiumButton
            size="xl"
            onClick={ctaAction}
            className="text-lg px-12 py-4"
          >
            {ctaText}
          </PremiumButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="text-white text-2xl" />
          </motion.div>
        </motion.div>
      )}

      {/* Floating Elements */}
      {showFloatingElements && (
        <>
          {/* Right Sidebar */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-4 z-20">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
            >
              <ShoppingCart className="text-white text-xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
            >
              <Image className="text-white text-xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
            >
              <Monitor className="text-white text-xl" />
            </motion.div>
          </div>

          {/* Bottom Left Chat */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="absolute bottom-6 left-6 flex items-center space-3 z-20"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="bg-white text-gray-900 px-4 py-2 rounded-xl font-medium shadow-lg">
              Live Chat
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
