
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Loader2 } from 'lucide-react';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showLabel?: boolean;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ 
  text, 
  className,
  size = 'icon',
  showLabel = false
}) => {
  const { speak, stop, speaking, paused } = useTextToSpeech();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = async () => {
    if (speaking) {
      stop();
      return;
    }
    
    setIsLoading(true);
    try {
      await speak(text);
      toast({
        title: "Audio Started",
        description: "Text-to-speech playback has started.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: "Audio Error",
        description: "Could not play audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={cn(
        "hover:bg-primary/10 relative transition-all",
        speaking && "bg-primary/10",
        className
      )}
      title={speaking ? "Stop speaking" : "Listen to text"}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : speaking ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume className="h-5 w-5" />
      )}
      
      {showLabel && (
        <span className="ml-2">{speaking ? "Stop" : "Listen"}</span>
      )}
      
      {speaking && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
      )}
    </Button>
  );
};

export default TextToSpeechButton;
