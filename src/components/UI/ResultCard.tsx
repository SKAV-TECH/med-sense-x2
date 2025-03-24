
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  children,
  onDownload,
  onShare,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className={cn("overflow-hidden shadow-md", className)}>
        <CardHeader className="bg-card pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          
          <div className="flex items-center space-x-2">
            {onShare && (
              <Button variant="ghost" size="icon" onClick={onShare}>
                <Share2 size={18} />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <Download size={18} />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
