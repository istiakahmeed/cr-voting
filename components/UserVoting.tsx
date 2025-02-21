"use client";

import { signOut } from "next-auth/react";

export interface Candidate {
  id: string;
  name: string;
  description: string;
  _count: {
    votes: number;
  };
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserVotingProps } from "@/types/UserVotingProps";

export function UserVoting({ candidates, votedFor, onVote }: UserVotingProps) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Cast Your Vote</h1>
        <Button
          variant='outline'
          size='sm'
          onClick={handleSignOut}
          className='flex items-center gap-2'
        >
          <LogOut className='h-4 w-4' />
          Sign Out
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {candidates.map((candidate: Candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <CardTitle>{candidate.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='mb-4'>{candidate.description}</p>
              <div className='flex justify-between items-center'>
                <span>Votes: {candidate._count.votes}</span>
                <Button
                  onClick={() => onVote(candidate.id)}
                  disabled={!!votedFor}
                  variant={votedFor === candidate.id ? "secondary" : "default"}
                >
                  {votedFor === candidate.id ? "Voted" : "Vote"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
