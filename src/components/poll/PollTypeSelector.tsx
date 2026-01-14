import { PollType } from '@/types/poll';
import { Card, CardContent } from '@/components/ui/card';
import { ListChecks, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PollTypeSelectorProps {
  selected: PollType;
  onSelect: (type: PollType) => void;
}

const pollTypes = [
  {
    type: 'multiple-choice' as PollType,
    icon: ListChecks,
    title: 'Multiple Choice',
    description: 'Create options for voters to choose from',
  },
  {
    type: 'date-selection' as PollType,
    icon: Calendar,
    title: 'Date Selection',
    description: 'Find the best date/time for an event',
  },
  {
    type: 'free-text' as PollType,
    icon: MessageSquare,
    title: 'Free Text',
    description: 'Collect open-ended responses',
  },
];

export const PollTypeSelector = ({ selected, onSelect }: PollTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pollTypes.map(({ type, icon: Icon, title, description }) => (
        <Card
          key={type}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md border-2',
            selected === type
              ? 'border-primary bg-primary/5'
              : 'border-transparent hover:border-primary/30'
          )}
          onClick={() => onSelect(type)}
        >
          <CardContent className="p-6 text-center">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
              selected === type ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
