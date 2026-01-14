import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, GripVertical } from 'lucide-react';

interface OptionEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
  placeholder?: string;
}

export const OptionEditor = ({ options, onChange, placeholder = 'Option' }: OptionEditorProps) => {
  const addOption = () => {
    onChange([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
          <Input
            value={option}
            onChange={(e) => updateOption(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeOption(index)}
            disabled={options.length <= 2}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addOption}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Option
      </Button>
    </div>
  );
};
