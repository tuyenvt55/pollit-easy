import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Copy, ExternalLink, Home, Settings } from 'lucide-react';
import { toast } from 'sonner';

const PollSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  
  const pollUrl = `${window.location.origin}/poll/${id}`;
  const adminUrl = `${window.location.origin}/poll/${id}/admin`;

  const copyToClipboard = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Poll Created Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Share the link below to start collecting votes
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-left">Voting Link</label>
              <div className="flex gap-2">
                <Input value={pollUrl} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(pollUrl, 'Voting link')}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link to={`/poll/${id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Poll
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/poll/${id}/admin`}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin View
                </Link>
              </Button>
            </div>

            <Button variant="ghost" asChild className="w-full mt-4">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Create Another Poll
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollSuccess;
