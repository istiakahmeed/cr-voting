"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Plus } from "lucide-react";

export function CreateCandidate({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create candidate");
      }

      toast({
        title: "Success",
        description: "Candidate created successfully",
      });

      setName("");
      setDescription("");
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create candidate",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/auth/signin" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className='relative'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-7'>
        <CardTitle className='text-2xl font-bold'>
          Create New Candidate
        </CardTitle>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-4 right-4'
          onClick={handleSignOut}
        >
          <LogOut className='h-5 w-5' />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm font-medium'>
              Name
            </label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter candidate name'
              required
              className='w-full'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='description' className='text-sm font-medium'>
              Description
            </label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter candidate description'
              required
              className='w-full min-h-[100px]'
            />
          </div>
          <Button type='submit' className='w-full flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Create Candidate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
