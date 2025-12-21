'use client';

import { ReactNode } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  requireEmailVerification?: boolean;
  showLoading?: boolean;
}

export function AuthGuard({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/auth/login',
  requireEmailVerification = false,
  showLoading = true,
}: AuthGuardProps) {
  const { isLoading } = useAuthGuard({
    requireAuth,
    allowedRoles,
    redirectTo,
    requireEmailVerification,
  });

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}