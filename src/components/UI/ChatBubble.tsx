
import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  isUser: boolean;
  message: string;
  timestamp: Date;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isUser, message, timestamp }) => {
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      x: isUser ? 20 : -20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { duration: 0.3 } 
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={bubbleVariants}
      className={cn(
        "flex items-start mb-4 max-w-[80%]",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot size={16} />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-lg p-3 shadow-sm",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <div className="text-sm whitespace-pre-wrap">{message}</div>
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default ChatBubble;
