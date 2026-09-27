import { motion } from 'motion/react';

interface BlinkingIndicatorProps {
  isActive: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'red' | 'yellow' | 'blue';
}

export function BlinkingIndicator({ 
  isActive, 
  count, 
  size = 'sm',
  color = 'green' 
}: BlinkingIndicatorProps) {
  if (!isActive) return null;

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="relative">
      {/* Voyant clignotant */}
      <motion.div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full
          shadow-sm
        `}
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Effet de pulse/glow */}
      <motion.div
        className={`
          absolute inset-0
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full
          opacity-40
        `}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Badge avec compteur si fourni */}
      {count !== undefined && count > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </div>
  );
}

interface BlinkingMenuItemProps {
  children: React.ReactNode;
  hasNotification: boolean;
  notificationCount?: number;
  className?: string;
}

export function BlinkingMenuItem({ 
  children, 
  hasNotification, 
  notificationCount,
  className = '' 
}: BlinkingMenuItemProps) {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {children}
      {hasNotification && (
        <div className="absolute -right-1 -top-1">
          <BlinkingIndicator 
            isActive={hasNotification}
            count={notificationCount}
            size="sm"
            color="green"
          />
        </div>
      )}
    </div>
  );
}