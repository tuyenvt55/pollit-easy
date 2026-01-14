export type PollType = 'multiple-choice' | 'date-selection' | 'free-text';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface DateOption {
  id: string;
  date: string;
  time?: string;
  votes: number;
}

export interface Vote {
  id: string;
  optionId: string;
  voterName?: string;
  votedAt: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  type: PollType;
  options: PollOption[] | DateOption[];
  votes: Vote[];
  settings: PollSettings;
  createdAt: string;
  expiresAt?: string;
  creatorToken: string;
}

export interface PollSettings {
  allowMultipleChoices: boolean;
  requireVoterName: boolean;
  showResultsBeforeVoting: boolean;
  allowComments: boolean;
}
