
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, AlignJustify } from 'lucide-react';

interface ConciseToggleProps {
  isConcise: boolean;
  onChange: (value: boolean) => void;
}

const ConciseToggle: React.FC<ConciseToggleProps> = ({ isConcise, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <Switch
          id="concise-mode"
          checked={isConcise}
          onCheckedChange={onChange}
        />
        <Label htmlFor="concise-mode" className="ml-2 text-sm font-medium">
          {isConcise ? (
            <div className="flex items-center">
              <AlignJustify className="h-4 w-4 mr-1" />
              <span>Concise</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>Detailed</span>
            </div>
          )}
        </Label>
      </div>
    </div>
  );
};

export default ConciseToggle;
