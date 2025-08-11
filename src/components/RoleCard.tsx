import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  delay?: number;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 20px 40px rgba(${color}, 0.3)`,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-8 cursor-pointer
        bg-gradient-to-br from-gray-900 to-gray-800
        border border-gray-700 hover:border-gray-600
        group transition-all duration-300
      `}
      style={{
        boxShadow: `0 10px 30px rgba(${color}, 0.1)`,
      }}
    >
      <div className="relative z-10">
        <div className={`mb-4 p-3 rounded-xl bg-gradient-to-r ${getGradientClass(color)} w-fit`}>
          <Icon size={32} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        
        <div className="mt-6">
          <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors">
            Get Started →
          </span>
        </div>
      </div>
      
      {/* Background glow effect */}
      <div 
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-20 
          transition-opacity duration-300 bg-gradient-to-r ${getGradientClass(color)}
        `}
      />
    </motion.div>
  );
};

function getGradientClass(color: string): string {
  switch (color) {
    case '0, 212, 255': return 'from-blue-500 to-cyan-400';
    case '0, 255, 136': return 'from-green-500 to-emerald-400';
    case '255, 107, 53': return 'from-orange-500 to-red-400';
    default: return 'from-blue-500 to-cyan-400';
  }
}