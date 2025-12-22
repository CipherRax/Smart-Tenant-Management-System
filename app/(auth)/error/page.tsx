'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'exchange_failed':
        return 'Failed to complete authentication. Please try again.';
      case 'unexpected':
        return 'An unexpected error occurred. Please try again.';
      default:
        return 'An authentication error occurred. Please try signing in again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-muted-foreground">Something went wrong during authentication</p>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/signIn">
              Return to Sign In
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}