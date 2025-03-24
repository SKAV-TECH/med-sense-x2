
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'md', 
  className,
  text
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const circleVariants = {
    initial: { pathLength: 0 },
    animate: { 
      pathLength: 1, 
      transition: { 
        duration: 1.5, 
        ease: "easeInOut", 
        repeat: Infinity
      } 
    }
  };

  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        variants={containerVariants}
        animate="animate"
        className={cn("text-primary", sizeMap[size])}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          className="w-full h-full"
        >
          <motion.circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            variants={circleVariants}
            initial="initial"
            animate="animate"
          />
        </svg>
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default LoadingIndicator;
