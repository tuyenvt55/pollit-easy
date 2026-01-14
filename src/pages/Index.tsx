import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Vote, 
  Calendar, 
  BarChart3, 
  Share2, 
  Users, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  ListChecks,
  MessageSquare
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: ListChecks,
      title: 'Multiple Choice Polls',
      description: 'Create polls with custom options for your audience to choose from',
    },
    {
      icon: Calendar,
      title: 'Date Selection',
      description: 'Find the perfect time for meetings and events with date/time voting',
    },
    {
      icon: MessageSquare,
      title: 'Free Text Responses',
      description: 'Collect open-ended feedback and suggestions from participants',
    },
    {
      icon: BarChart3,
      title: 'Real-time Results',
      description: 'Watch votes come in with beautiful charts and visualizations',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Get a unique link to share via email, social media, or messaging',
    },
    {
      icon: Users,
      title: 'Anonymous or Named',
      description: 'Choose whether voters need to identify themselves or stay anonymous',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="container py-6 px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">PollCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">My Polls</Link>
            </Button>
            <Button asChild>
              <Link to="/create">Create Poll</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, Beautiful Polls
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Create Polls in
            <span className="text-primary"> Seconds</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The easiest way to gather opinions, schedule meetings, and make decisions together. 
            No signup required – just create, share, and vote!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/create">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Free Poll
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/dashboard">
                View My Polls
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features to create the perfect poll for any situation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in just three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create', description: 'Choose a poll type and add your options' },
              { step: '2', title: 'Share', description: 'Copy your unique link and send it to participants' },
              { step: '3', title: 'Collect', description: 'Watch results come in and make decisions' },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 px-4">
        <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Poll?</h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of users making better decisions together
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/create">
                Get Started – It's Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container py-8 px-4 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Vote className="w-6 h-6 text-primary" />
            <span className="font-semibold">PollCraft</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Simple, beautiful polls for everyone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
