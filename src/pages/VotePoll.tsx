import { useParams, Link } from 'react-router-dom';
import { usePoll } from '@/hooks/usePoll';
import { VotingForm } from '@/components/poll/VotingForm';
import { PollResults } from '@/components/poll/PollResults';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, ListChecks, MessageSquare, Users } from 'lucide-react';
import { format } from 'date-fns';

const VotePoll = () => {
  const { id } = useParams<{ id: string }>();
  const { poll, loading, error, addVote } = usePoll(id || null);

  const handleVote = (optionIds: string[], voterName?: string) => {
    optionIds.forEach(optionId => {
      addVote({ optionId, voterName });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container max-w-2xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Poll Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This poll may have been deleted or the link is incorrect.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeIcon = {
    'multiple-choice': ListChecks,
    'date-selection': Calendar,
    'free-text': MessageSquare,
  };
  const TypeIcon = typeIcon[poll.type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="container max-w-2xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TypeIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
                {poll.description && (
                  <CardDescription className="text-base">{poll.description}</CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {poll.votes.length} votes
              </span>
              <span>Created {format(new Date(poll.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          <VotingForm poll={poll} onVote={handleVote} />
          
          {poll.settings.showResultsBeforeVoting && (
            <PollResults poll={poll} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePoll;
