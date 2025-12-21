'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Mail, RefreshCw, ArrowRight, Shield } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(() => {
    // Get registration data from localStorage
    const registrationData = localStorage.getItem('adminRegistrationData');
    if (registrationData) {
      const data = JSON.parse(registrationData);
      return data.email;
    }
    return '';
  });
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // If no registration data, redirect to signup
    const registrationData = localStorage.getItem('adminRegistrationData');
    if (!registrationData) {
      router.push('/auth/signup');
    }
  }, [router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // In a real app, you would call your API to resend verification email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResendSuccess(true);
    setIsResending(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setResendSuccess(false);
    }, 3000);
  };

  const handleGoToDashboard = () => {
    // Clear registration data
    localStorage.removeItem('adminRegistrationData');
    router.push('/dashboard');
  };

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
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {email}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                You must verify your email before you can access your dashboard.
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
                  <h4 className="font-medium">Check your inbox</h4>
                  <p className="text-sm text-muted-foreground">
                    Look for an email from TenantFlow with the subject "Verify your email address"
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
                    Click the link in the email to confirm your email address
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
                  <h4 className="font-medium">Access your dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Once verified, you'll be redirected to your dashboard automatically
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
                onClick={handleGoToDashboard}
                className="flex-1"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center w-full pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={handleResendEmail}
                  disabled={isResending}
                >
                  click here to resend
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Security First</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Email verification ensures that only you can access your account and protects against unauthorized access.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you're having trouble verifying your email, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By verifying your email, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}