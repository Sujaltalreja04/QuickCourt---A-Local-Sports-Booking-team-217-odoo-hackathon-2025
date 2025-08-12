import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const notificationStyles = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-300',
    iconColor: 'text-green-400'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-300',
    iconColor: 'text-red-400'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-300',
    iconColor: 'text-yellow-400'
  },
  info: {
    icon: AlertCircle,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-300',
    iconColor: 'text-blue-400'
  }
};

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const styles = notificationStyles[type];
  const Icon = styles.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-4 shadow-lg backdrop-blur-md max-w-sm`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`${styles.iconColor} mt-0.5 flex-shrink-0`} size={20} />
        <div className="flex-1 min-w-0">
          <h4 className={`${styles.textColor} font-medium text-sm`}>{title}</h4>
          <p className={`${styles.textColor} text-sm mt-1`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`${styles.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
