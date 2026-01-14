import { Poll, PollOption, DateOption } from '@/types/poll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PollResultsProps {
  poll: Poll;
  showChart?: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(173 58% 39%)', 'hsl(43 74% 66%)', 'hsl(12 76% 61%)'];

export const PollResults = ({ poll, showChart = true }: PollResultsProps) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  
  const getOptionLabel = (option: PollOption | DateOption) => {
    if ('text' in option) {
      return option.text;
    }
    const dateOption = option as DateOption;
    const dateStr = dateOption.date ? format(new Date(dateOption.date), 'MMM d, yyyy') : '';
    const timeStr = dateOption.time || '';
    return `${dateStr}${timeStr ? ` at ${timeStr}` : ''}`;
  };

  const chartData = poll.options.map((option, index) => ({
    name: getOptionLabel(option),
    votes: option.votes,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    fill: COLORS[index % COLORS.length],
  }));

  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  const winner = sortedOptions[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Results</span>
            <Badge variant="secondary">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedOptions.map((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isWinner = index === 0 && option.votes > 0;
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isWinner ? 'text-primary' : ''}`}>
                    {getOptionLabel(option)}
                    {isWinner && <span className="ml-2">🏆</span>}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {option.votes} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {showChart && totalVotes > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bar Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => `${percentage}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
