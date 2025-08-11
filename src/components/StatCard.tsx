import React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.isUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
              <span className="font-semibold">{trend.isUp ? '+' : '-'}{trend.value}%</span>
              <span className="ml-1 text-gray-500">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-md ring-1 ring-white/20`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};