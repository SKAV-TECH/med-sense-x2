
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onClick, 
  className,
  iconClassName
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className={cn("h-full flex flex-col shadow-md hover:shadow-lg transition-shadow", className)}>
        <CardHeader className="pb-2">
          <div className={cn("w-12 h-12 rounded-md flex items-center justify-center mb-4", iconClassName || "bg-primary/10")}>
            <Icon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          {/* Content can be added here if needed */}
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full bg-card hover:bg-accent transition-colors"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
