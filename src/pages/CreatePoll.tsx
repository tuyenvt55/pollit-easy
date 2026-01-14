import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Poll, PollType, PollSettings, PollOption, DateOption } from '@/types/poll';
import { savePoll, generateId, generateShortId, getOrCreateCreatorToken } from '@/lib/pollStorage';
import { PollTypeSelector } from '@/components/poll/PollTypeSelector';
import { OptionEditor } from '@/components/poll/OptionEditor';
import { DateTimeEditor } from '@/components/poll/DateTimeEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pollType, setPollType] = useState<PollType>('multiple-choice');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [dateOptions, setDateOptions] = useState<{ date: string; time: string }[]>([{ date: '', time: '' }]);
  const [settings, setSettings] = useState<PollSettings>({
    allowMultipleChoices: false,
    requireVoterName: false,
    showResultsBeforeVoting: true,
    allowComments: false,
  });

  const handleCreate = () => {
    const pollId = generateShortId();
    const creatorToken = getOrCreateCreatorToken();

    let pollOptions: PollOption[] | DateOption[];

    if (pollType === 'date-selection') {
      pollOptions = dateOptions
        .filter(opt => opt.date)
        .map(opt => ({
          id: generateId(),
          date: opt.date,
          time: opt.time,
          votes: 0,
        }));
    } else {
      pollOptions = options
        .filter(opt => opt.trim())
        .map(opt => ({
          id: generateId(),
          text: opt.trim(),
          votes: 0,
        }));
    }

    const poll: Poll = {
      id: pollId,
      title,
      description,
      type: pollType,
      options: pollOptions,
      votes: [],
      settings,
      createdAt: new Date().toISOString(),
      creatorToken,
    };

    savePoll(poll);
    navigate(`/poll/${pollId}/success`);
  };

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return title.trim().length > 0;
    if (step === 3) {
      if (pollType === 'date-selection') {
        return dateOptions.some(opt => opt.date);
      }
      if (pollType === 'free-text') return true;
      return options.filter(opt => opt.trim()).length >= 2;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-3xl py-8 px-4">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Create a Poll</h1>
          </div>
          <p className="text-muted-foreground">Step {step} of 4</p>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Poll Type</CardTitle>
              <CardDescription>Select the type of poll you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <PollTypeSelector selected={pollType} onSelect={setPollType} />
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Poll Details</CardTitle>
              <CardDescription>Give your poll a title and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., When should we have the team meeting?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more context about your poll..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {pollType === 'date-selection' ? 'Add Date Options' : 
                 pollType === 'free-text' ? 'Free Text Settings' : 'Add Options'}
              </CardTitle>
              <CardDescription>
                {pollType === 'date-selection' 
                  ? 'Add the dates and times you want people to vote on'
                  : pollType === 'free-text'
                  ? 'Voters will be able to enter their own text responses'
                  : 'Add the options voters can choose from'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pollType === 'date-selection' ? (
                <DateTimeEditor options={dateOptions} onChange={setDateOptions} />
              ) : pollType === 'free-text' ? (
                <p className="text-muted-foreground py-8 text-center">
                  No options needed! Voters will enter their own responses.
                </p>
              ) : (
                <OptionEditor options={options} onChange={setOptions} />
              )}
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure how your poll works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pollType !== 'free-text' && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow multiple choices</Label>
                    <p className="text-sm text-muted-foreground">Voters can select more than one option</p>
                  </div>
                  <Switch
                    checked={settings.allowMultipleChoices}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, allowMultipleChoices: checked })
                    }
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require voter name</Label>
                  <p className="text-sm text-muted-foreground">Voters must enter their name</p>
                </div>
                <Switch
                  checked={settings.requireVoterName}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, requireVoterName: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show results before voting</Label>
                  <p className="text-sm text-muted-foreground">Let voters see current results</p>
                </div>
                <Switch
                  checked={settings.showResultsBeforeVoting}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showResultsBeforeVoting: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={!canProceed()}>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
