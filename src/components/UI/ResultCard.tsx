
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  onDownload?: () => void;
  onShare?: () => void;
  extraButtons?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  children,
  onDownload,
  onShare,
  extraButtons
}) => {
  return (
    <Card className="h-full flex flex-col shadow-md border-0">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onDownload && (
            <Button 
              onClick={onDownload} 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/10"
              title="Download content"
            >
              <Download className="h-5 w-5" />
            </Button>
          )}
          {onShare && (
            <Button 
              onClick={onShare} 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/10"
              title="Share content"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          {extraButtons}
        </div>
      </CardHeader>
      <CardContent className="p-5 overflow-auto flex-1">
        {children}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
