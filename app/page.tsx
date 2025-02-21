"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreateCandidate } from "@/components/CreateCandidate";
import { UserVoting } from "@/components/UserVoting";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types/UserVotingProps";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserVote = async () => {
    if (!session?.user) return;
    try {
      const response = await fetch("/api/votes/check");
      if (!response.ok) {
        throw new Error("Failed to check vote status");
      }
      const data = await response.json();
      setVotedFor(data.candidateId);
    } catch (error) {
      console.error("Failed to check vote status:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchCandidates();
      if (session?.user) {
        await checkUserVote();
      }
    };
    init();
  }, [session]);

  const handleVote = async (candidateId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cast vote");
      }

      setVotedFor(candidateId);
      toast({
        title: "Success",
        description: "Your vote has been recorded",
      });
      await fetchCandidates();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to cast vote",
        variant: "destructive",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <p className='text-lg'>Loading...</p>
          <p className='text-sm text-gray-500'>
            Please wait while we set up your session
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold'>Welcome to the Voting System</h1>
          <p className='text-gray-600'>Please sign in to continue</p>
          <Link href='/auth/signup'>
            <Button className='w-full max-w-md mt-4'>Signup</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {session.user.isAdmin ? (
          <>
            <div className='mb-8'>
              <CreateCandidate onSuccess={fetchCandidates} />
            </div>
            <div className='mt-8'>
              <h2 className='text-xl font-semibold mb-4'>Current Results</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {candidates.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <CardTitle>{candidate.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='mb-4'>{candidate.description}</p>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium'>
                          Votes: {candidate._count.votes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <UserVoting
            candidates={candidates}
            votedFor={votedFor}
            onVote={handleVote}
          />
        )}
      </div>
    </div>
  );
}
