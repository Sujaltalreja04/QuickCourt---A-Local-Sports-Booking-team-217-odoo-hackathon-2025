import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { RoleCard } from '../components/RoleCard';

export const LandingPage: React.FC = () => {
  const [showRoles, setShowRoles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRoles(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const roles = [
    {
      title: 'Player',
      description: 'Find and book your favorite sports courts. Discover new venues and enjoy seamless booking experience.',
      icon: Users,
      color: '0, 212, 255',
      path: '/login/user'
    },
    {
      title: 'Facility Owner',
      description: 'List your sports venues, manage bookings, and grow your business with our comprehensive management tools.',
      icon: Building2,
      color: '0, 255, 136',
      path: '/login/owner'
    },
    {
      title: 'Administrator',
      description: 'Oversee the platform, manage users and facilities, and ensure quality service across all venues.',
      icon: Shield,
      color: '255, 107, 53',
      path: '/login/admin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {!showRoles ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-screen"
            >
              <Logo size="lg" animate={true} />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-gray-400 text-xl mt-4"
              >
                Your Local Sports Booking Hub
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="roles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12">
                <Logo size="md" />
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4"
                >
                  Choose Your Role
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-gray-300 max-w-2xl mx-auto"
                >
                  Access your personalized dashboard and start your sports journey
                </motion.p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {roles.map((role, index) => (
                  <RoleCard
                    key={role.title}
                    title={role.title}
                    description={role.description}
                    icon={role.icon}
                    color={role.color}
                    onClick={() => navigate(role.path)}
                    delay={0.6 + index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};