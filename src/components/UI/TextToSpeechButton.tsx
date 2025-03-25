
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX } from 'lucide-react';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text, className }) => {
  const { speak, stop, speaking } = useTextToSpeech();
  
  const handleToggle = () => {
    if (speaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn("hover:bg-primary/10", className)}
      title={speaking ? "Stop speaking" : "Listen to text"}
    >
      {speaking ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
    </Button>
  );
};

export default TextToSpeechButton;
