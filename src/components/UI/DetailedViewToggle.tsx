
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DetailedViewToggleProps {
  isDetailed: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

const DetailedViewToggle: React.FC<DetailedViewToggleProps> = ({
  isDetailed,
  onChange,
  className
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="detailed-view"
        checked={isDetailed}
        onCheckedChange={onChange}
      />
      <Label htmlFor="detailed-view" className="text-sm cursor-pointer">
        {isDetailed ? "Detailed view" : "Concise view (≈50 words)"}
      </Label>
    </div>
  );
};

export default DetailedViewToggle;
