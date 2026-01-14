import { useParams, Link } from 'react-router-dom';
import { usePoll } from '@/hooks/usePoll';
import { PollResults } from '@/components/poll/PollResults';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Copy, Download, ExternalLink, Settings, Users, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePoll } from '@/lib/pollStorage';
import { useNavigate } from 'react-router-dom';

const PollAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const { poll, loading, error } = usePoll(id || null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const pollUrl = `${window.location.origin}/poll/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportData = () => {
    if (!poll) return;
    
    const data = {
      poll: {
        title: poll.title,
        description: poll.description,
        type: poll.type,
        createdAt: poll.createdAt,
      },
      options: poll.options,
      votes: poll.votes,
      summary: {
        totalVotes: poll.votes.length,
        optionBreakdown: poll.options.map(opt => ({
          option: 'text' in opt ? opt.text : `${opt.date} ${opt.time || ''}`,
          votes: opt.votes,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll-${id}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleDelete = () => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      deletePoll(id);
      toast.success('Poll deleted');
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container max-w-4xl">
          <Skeleton className="h-8 w-48 mb-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="container max-w-4xl">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{poll.title}</h1>
              <Badge variant="secondary">{poll.type.replace('-', ' ')}</Badge>
            </div>
            <p className="text-muted-foreground">
              Created {format(new Date(poll.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <label className="text-sm font-medium mb-2 block">Share this poll</label>
            <div className="flex gap-2">
              <Input value={pollUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={pollUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="votes">Individual Votes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <PollResults poll={poll} showChart />
          </TabsContent>

          <TabsContent value="votes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Votes ({poll.votes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {poll.votes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No votes yet. Share your poll to start collecting responses!
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Voter</TableHead>
                        <TableHead>Choice</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poll.votes.map((vote) => {
                        const option = poll.options.find(o => o.id === vote.optionId);
                        const optionText = option 
                          ? ('text' in option ? option.text : `${option.date} ${option.time || ''}`)
                          : 'Unknown';
                        
                        return (
                          <TableRow key={vote.id}>
                            <TableCell>{vote.voterName || 'Anonymous'}</TableCell>
                            <TableCell>{optionText}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(vote.votedAt), 'MMM d, h:mm a')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Poll Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Multiple Choices</p>
                    <p className="font-medium">{poll.settings.allowMultipleChoices ? 'Allowed' : 'Single choice only'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Voter Name</p>
                    <p className="font-medium">{poll.settings.requireVoterName ? 'Required' : 'Optional'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Show Results</p>
                    <p className="font-medium">{poll.settings.showResultsBeforeVoting ? 'Before voting' : 'After voting'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Poll Type</p>
                    <p className="font-medium capitalize">{poll.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PollAdmin;
