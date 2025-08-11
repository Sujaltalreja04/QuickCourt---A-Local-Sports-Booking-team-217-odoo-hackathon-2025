import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', animate = false }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`font-bold ${sizeClasses[size]} text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text`}
      variants={animate ? logoVariants : {}}
      initial={animate ? "hidden" : "visible"}
      animate={animate ? ["visible", "pulse"] : "visible"}
      style={{
        filter: animate ? 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))' : 'none'
      }}
    >
      Quick<span className="text-green-400">Court</span>
    </motion.div>
  );
};