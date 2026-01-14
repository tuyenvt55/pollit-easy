import { Poll, Vote } from '@/types/poll';

const POLLS_STORAGE_KEY = 'polls_app_data';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

export const getAllPolls = (): Poll[] => {
  const data = localStorage.getItem(POLLS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPollById = (id: string): Poll | null => {
  const polls = getAllPolls();
  return polls.find(poll => poll.id === id) || null;
};

export const savePoll = (poll: Poll): void => {
  const polls = getAllPolls();
  const existingIndex = polls.findIndex(p => p.id === poll.id);
  
  if (existingIndex >= 0) {
    polls[existingIndex] = poll;
  } else {
    polls.push(poll);
  }
  
  localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
};

export const deletePoll = (id: string): void => {
  const polls = getAllPolls().filter(p => p.id !== id);
  localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
};

export const addVote = (pollId: string, vote: Vote): Poll | null => {
  const poll = getPollById(pollId);
  if (!poll) return null;
  
  poll.votes.push(vote);
  
  // Update option vote count
  const option = poll.options.find(o => o.id === vote.optionId);
  if (option) {
    option.votes += 1;
  }
  
  savePoll(poll);
  return poll;
};

export const getCreatorPolls = (creatorToken: string): Poll[] => {
  return getAllPolls().filter(poll => poll.creatorToken === creatorToken);
};

export const getOrCreateCreatorToken = (): string => {
  const TOKEN_KEY = 'poll_creator_token';
  let token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) {
    token = generateId();
    localStorage.setItem(TOKEN_KEY, token);
  }
  
  return token;
};
