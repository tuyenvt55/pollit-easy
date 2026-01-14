import { useState, useEffect, useCallback } from 'react';
import { Poll, Vote } from '@/types/poll';
import { getPollById, savePoll, addVote as addVoteToStorage, getCreatorPolls, getOrCreateCreatorToken } from '@/lib/pollStorage';

export const usePoll = (pollId: string | null) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPoll = useCallback(() => {
    if (!pollId) {
      setLoading(false);
      return;
    }

    try {
      const foundPoll = getPollById(pollId);
      if (foundPoll) {
        setPoll(foundPoll);
        setError(null);
      } else {
        setError('Poll not found');
      }
    } catch (err) {
      setError('Failed to load poll');
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const addVote = useCallback((vote: Omit<Vote, 'id' | 'votedAt'>) => {
    if (!pollId) return null;
    
    const newVote: Vote = {
      ...vote,
      id: Math.random().toString(36).substring(2, 15),
      votedAt: new Date().toISOString(),
    };
    
    const updatedPoll = addVoteToStorage(pollId, newVote);
    if (updatedPoll) {
      setPoll(updatedPoll);
    }
    return updatedPoll;
  }, [pollId]);

  const updatePoll = useCallback((updates: Partial<Poll>) => {
    if (!poll) return;
    
    const updatedPoll = { ...poll, ...updates };
    savePoll(updatedPoll);
    setPoll(updatedPoll);
  }, [poll]);

  return { poll, loading, error, addVote, updatePoll, refresh: loadPoll };
};

export const useCreatorPolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const creatorToken = getOrCreateCreatorToken();

  const loadPolls = useCallback(() => {
    try {
      const creatorPolls = getCreatorPolls(creatorToken);
      setPolls(creatorPolls);
    } catch (err) {
      console.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  }, [creatorToken]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  return { polls, loading, refresh: loadPolls, creatorToken };
};
