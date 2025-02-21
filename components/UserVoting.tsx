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
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <div className='flex justify-between items-center mb-12 border-b pb-6'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
          Cast Your Vote
        </h1>
        <Button
          variant='outline'
          size='sm'
          onClick={handleSignOut}
          className='flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors'
        >
          <LogOut className='h-4 w-4' />
          Sign Out
        </Button>
      </div>

      {candidates.length === 0 ? (
        <Card className='w-full p-8 border-2 border-dashed'>
          <div className='text-center space-y-4'>
            <h2 className='text-2xl font-semibold text-gray-700'>
              No Candidates Available
            </h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              There are currently no candidates registered for voting. Please
              check back later or contact the administrator.
            </p>
          </div>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {candidates.map((candidate: Candidate) => (
            <Card
              key={candidate.id}
              className='hover:shadow-lg transition-shadow duration-300 border-2'
            >
              <CardHeader className='space-y-4 pb-4'>
                <CardTitle className='text-xl font-bold text-gray-800'>
                  {candidate.name}
                </CardTitle>
                <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium'>
                  Votes: {candidate._count.votes}
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-gray-600 leading-relaxed'>
                  {candidate.description}
                </p>
                <Button
                  onClick={() => onVote(candidate.id)}
                  disabled={!!votedFor}
                  variant={votedFor === candidate.id ? "secondary" : "default"}
                  className={`w-full ${
                    votedFor === candidate.id
                      ? "bg-green-50 text-green-700 hover:bg-green-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } transition-colors`}
                >
                  {votedFor === candidate.id ? "✓ Voted" : "Cast Vote"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
