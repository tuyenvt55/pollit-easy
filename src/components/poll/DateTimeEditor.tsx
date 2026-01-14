import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimeOption {
  date: string;
  time: string;
}

interface DateTimeEditorProps {
  options: DateTimeOption[];
  onChange: (options: DateTimeOption[]) => void;
}

export const DateTimeEditor = ({ options, onChange }: DateTimeEditorProps) => {
  const addOption = () => {
    onChange([...options, { date: '', time: '' }]);
  };

  const updateOption = (index: number, field: keyof DateTimeOption, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) return;
    onChange(options.filter((_, i) => i !== index));
  };

  const handleDateSelect = (index: number, date: Date | undefined) => {
    if (date) {
      updateOption(index, 'date', format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full sm:w-[180px] justify-start text-left font-normal',
                  !option.date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {option.date ? format(new Date(option.date), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={option.date ? new Date(option.date) : undefined}
                onSelect={(date) => handleDateSelect(index, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={option.time}
            onChange={(e) => updateOption(index, 'time', e.target.value)}
            className="w-full sm:w-[120px]"
            placeholder="Time (optional)"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeOption(index)}
            disabled={options.length <= 1}
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
        Add Date/Time
      </Button>
    </div>
  );
};
