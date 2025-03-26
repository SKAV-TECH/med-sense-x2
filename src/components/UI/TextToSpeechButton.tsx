
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Loader2 } from 'lucide-react';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text, className }) => {
  const { speak, stop, speaking } = useTextToSpeech();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = () => {
    if (speaking) {
      stop();
    } else {
      setIsLoading(true);
      speak(text);
      // Simulate a brief loading state
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "relative transition-all duration-300 hover:bg-violet-500/20 hover:text-violet-500", 
          className
        )}
        title={speaking ? "Stop speaking" : "Listen to text"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="animate-spin"
            >
              <Loader2 className="h-5 w-5" />
            </motion.div>
          ) : speaking ? (
            <motion.div
              key="stop"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-purple-500"
            >
              <VolumeX className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Volume className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isHovered && !speaking && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute left-full ml-2 whitespace-nowrap text-xs bg-gray-800 text-white px-2 py-1 rounded"
          >
            Listen
          </motion.span>
        )}
        
        {speaking && (
          <motion.div
            className="absolute -bottom-1 -left-1 -right-1 h-0.5 bg-purple-500 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default TextToSpeechButton;
