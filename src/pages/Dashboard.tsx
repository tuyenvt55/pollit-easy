import { Link } from 'react-router-dom';
import { useCreatorPolls } from '@/hooks/usePoll';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, BarChart3, Calendar, ListChecks, MessageSquare, ArrowLeft, Users } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { polls, loading } = useCreatorPolls();

  const typeIcon = {
    'multiple-choice': ListChecks,
    'date-selection': Calendar,
    'free-text': MessageSquare,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="container max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Polls</h1>
            <p className="text-muted-foreground">Manage and view results of your polls</p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              New Poll
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : polls.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No polls yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first poll to start collecting votes
              </p>
              <Button asChild>
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Poll
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {polls.map((poll) => {
              const TypeIcon = typeIcon[poll.type];
              const totalVotes = poll.votes.length;
              
              return (
                <Card key={poll.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg truncate">{poll.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {format(new Date(poll.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {poll.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            {poll.options.length} options
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link to={`/poll/${poll.id}/admin`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
