"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { validateEmail } from "@/lib/utils/validateEmail";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      const { isValid, message } = validateEmail(newEmail, isAdmin);
      setEmailError(isValid ? "" : message);
    } else {
      setEmailError("");
    }
  };

  const handleAdminChange = (checked: boolean) => {
    setIsAdmin(checked);
    if (email) {
      const { isValid, message } = validateEmail(email, checked);
      setEmailError(isValid ? "" : message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email, isAdmin);
    if (!emailValidation.isValid) {
      toast({
        title: "Invalid Email",
        description: emailValidation.message,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          isAdmin,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={handleEmailChange}
                placeholder={
                  isAdmin
                    ? "admin@example.com"
                    : "*************@cse.bubt.edu.bd"
                }
                required
                className={emailError ? "border-red-500" : ""}
              />
              {emailError ? (
                <p className='text-sm text-red-500'>{emailError}</p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  {isAdmin
                    ? "Only authorized admin emails are allowed"
                    : "Format: YearBatchSeriesNumber@cse.bubt.edu.bd"}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor='name' className='text-sm font-medium'>
                Name
              </label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='confirmPassword' className='text-sm font-medium'>
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='isAdmin'
                checked={isAdmin}
                onCheckedChange={handleAdminChange}
              />
              <label
                htmlFor='isAdmin'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Sign up as Administrator
              </label>
            </div>
            <Button type='submit' className='w-full'>
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{" "}
            <Link
              href='/auth/signin'
              className='text-blue-600 hover:text-blue-700 font-medium'
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
