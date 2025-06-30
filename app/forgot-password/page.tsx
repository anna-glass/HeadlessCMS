'use client';

import { useState } from 'react';
import { useStackApp } from '@stackframe/stack';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const app = useStackApp();

  const onSubmit = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const result = await app.sendForgotPasswordEmail(email);
      if (result?.status === 'error') {
        if (result.error.message.includes('not found')) {
          setMessage('If an account exists with this email, a password reset link has been sent.');
        } else {
          setError(`Error: ${result.error.message}`);
        }
      } else {
        setMessage('Password reset email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 p-6 text-center">
          <CardTitle className="text-2xl font-semibold">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address below and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {message ? (
            <div className="mb-4 space-y-4">
              <div className="rounded-md bg-green-100 p-3 text-sm text-green-700">
                {message}
              </div>
              <Link href="/" passHref>
                <Button variant="defaultOutline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
