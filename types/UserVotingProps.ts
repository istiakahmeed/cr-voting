export interface Candidate {
  id: string;
  name: string;
  description: string;
  _count: {
    votes: number;
  };
}

export interface UserVotingProps {
  candidates: Candidate[];
  votedFor: string | null;
  onVote: (candidateId: string) => Promise<void>;
}
