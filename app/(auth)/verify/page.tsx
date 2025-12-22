'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Mail, RefreshCw, ArrowRight, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Get email from URL params first
    const emailFromParams = searchParams.get('email');
    
    if (emailFromParams) {
      setEmail(emailFromParams);
      // Store it in localStorage for future reference
      localStorage.setItem('adminRegistrationData', JSON.stringify({ 
        email: emailFromParams,
        timestamp: new Date().toISOString()
      }));
      setHasCheckedStorage(true);
      return;
    }

    // If no URL param, check localStorage
    try {
      const registrationData = localStorage.getItem('adminRegistrationData');
      if (registrationData) {
        const data = JSON.parse(registrationData);
        if (data.email) {
          setEmail(data.email);
        }
      }
    } catch (e) {
      console.log('Error reading localStorage:', e);
    }
    
    setHasCheckedStorage(true);
  }, [searchParams]);

  // Only redirect if we've checked and found no email
  useEffect(() => {
    if (hasCheckedStorage && !email) {
      toast.info('No registration found. Please register first.');
      setTimeout(() => {
        router.push('/signIn');
      }, 2000);
    }
  }, [hasCheckedStorage, email, router]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('No email address found');
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Resend error:', error);
        toast.error('Failed to resend verification email');
      } else {
        setResendSuccess(true);
        toast.success('Verification email resent! Check your inbox.');
        
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!email) return;

    toast.info('Checking verification status...');
    
    try {
      // Try to sign in to see if account is active
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password', // Will fail but show if account exists
      });

      // If we get here, the account might be verified
      if (data?.user?.email_confirmed_at) {
        toast.success('Email verified! You can now sign in.');
        localStorage.removeItem('adminRegistrationData');
        router.push('/signIn');
      }
    } catch (error: any) {
      // Check error message to determine status
      if (error.message?.includes('Invalid login credentials')) {
        // Account exists but password is wrong - this is expected
        toast.info('Account exists. Please use the verification link from your email.');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.info('Email not confirmed yet. Please check your inbox.');
      } else {
        console.error('Check error:', error);
      }
    }
  };

  const handleGoToSignIn = () => {
    router.push('/signIn');
  };

  if (!hasCheckedStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No Registration Found</h1>
          <p className="mb-6">Please register first to verify your email.</p>
          <Button onClick={() => router.push('/signIn')}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground mt-2">
            Check your inbox to complete your registration
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle>Almost there!</CardTitle>
            <CardDescription>
              We've sent a verification email to:
            </CardDescription>
            <div className="mt-2">
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-all">
                {email}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                <strong>Check your email inbox (and spam folder)</strong> for the verification link.
                Click that link to verify your account.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Check your email</h4>
                  <p className="text-sm text-muted-foreground">
                    Look for an email with subject "Confirm your signup"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Click the verification link</h4>
                  <p className="text-sm text-muted-foreground">
                    The link will take you back to our site to confirm your email
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Sign in to your account</h4>
                  <p className="text-sm text-muted-foreground">
                    After verification, return here and click "Go to Sign In"
                  </p>
                </div>
              </div>
            </div>

            {resendSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Verification email resent successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex-1"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleCheckVerification}
                className="flex-1"
              >
                Check Verification Status
              </Button>
            </div>

            <div className="w-full">
              <Button
                onClick={handleGoToSignIn}
                className="w-full"
              >
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center w-full pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> You must click the verification link in the email.
                Just checking your email is not enough.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Didn't receive the email? Check spam or{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={handleResendEmail}
                  disabled={isResending}
                >
                  resend
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Make sure you:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 text-left max-w-md mx-auto">
            <li className="mb-1">• Checked the correct email inbox</li>
            <li className="mb-1">• Looked in the spam/junk folder</li>
            <li className="mb-1">• Waited a few minutes for the email to arrive</li>
            <li>• Used the same email you registered with</li>
          </ul>
        </div>
      </div>
    </div>
  );
}