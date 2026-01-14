import { useState } from 'react';
import { Poll, PollOption, DateOption } from '@/types/poll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Vote, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VotingFormProps {
  poll: Poll;
  onVote: (optionIds: string[], voterName?: string, freeText?: string) => void;
}

export const VotingForm = ({ poll, onVote }: VotingFormProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voterName, setVoterName] = useState('');
  const [freeText, setFreeText] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const getOptionLabel = (option: PollOption | DateOption) => {
    if ('text' in option) {
      return option.text;
    }
    const dateOption = option as DateOption;
    const dateStr = dateOption.date ? format(new Date(dateOption.date), 'EEEE, MMMM d, yyyy') : '';
    const timeStr = dateOption.time || '';
    return `${dateStr}${timeStr ? ` at ${timeStr}` : ''}`;
  };

  const handleSingleSelect = (optionId: string) => {
    setSelectedOptions([optionId]);
  };

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleSubmit = () => {
    if (poll.type === 'free-text') {
      onVote([], voterName || undefined, freeText);
    } else {
      onVote(selectedOptions, voterName || undefined);
    }
    setHasVoted(true);
  };

  const isValid = poll.type === 'free-text' 
    ? freeText.trim().length > 0 
    : selectedOptions.length > 0;

  if (hasVoted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank you for voting!</h3>
          <p className="text-muted-foreground">Your response has been recorded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {poll.settings.requireVoterName && (
          <div className="space-y-2">
            <Label htmlFor="voterName">Your Name</Label>
            <Input
              id="voterName"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}

        {poll.type === 'free-text' ? (
          <div className="space-y-2">
            <Label htmlFor="freeText">Your Response</Label>
            <Textarea
              id="freeText"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="Enter your response..."
              rows={4}
            />
          </div>
        ) : poll.settings.allowMultipleChoices ? (
          <div className="space-y-3">
            <Label>Select all that apply</Label>
            {poll.options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer',
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/30'
                )}
                onClick={() => handleMultiSelect(option.id, !selectedOptions.includes(option.id))}
              >
                <Checkbox
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => handleMultiSelect(option.id, !!checked)}
                />
                <span className="flex-1">{getOptionLabel(option)}</span>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={selectedOptions[0] || ''} onValueChange={handleSingleSelect}>
            <Label className="mb-3 block">Select one option</Label>
            {poll.options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer',
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/30'
                )}
                onClick={() => handleSingleSelect(option.id)}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {getOptionLabel(option)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full"
          size="lg"
        >
          <Vote className="w-4 h-4 mr-2" />
          Submit Vote
        </Button>
      </CardContent>
    </Card>
  );
};
