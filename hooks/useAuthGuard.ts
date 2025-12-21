'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    requireAuth = true,
    allowedRoles = [],
    redirectTo = '/auth/login',
    requireEmailVerification = false,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    role,
    isLoading,
    isAuthenticated,
    isEmailConfirmed,
    isAdmin,
    isTenant,
  } = useAuth();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check if email verification is required
    if (requireEmailVerification && isAuthenticated && !isEmailConfirmed) {
      router.push('/auth/verify-email');
      return;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized');
      return;
    }

    // Special case: Admins shouldn't access tenant portal
    if (pathname.includes('/users/') && isAdmin) {
      router.push('/dashboard');
      return;
    }

    // Special case: Tenants shouldn't access admin dashboard
    if (pathname.includes('/dashboard') && isTenant) {
      router.push('/users/uhome');
      return;
    }

  }, [
    isLoading,
    isAuthenticated,
    role,
    requireAuth,
    allowedRoles,
    redirectTo,
    pathname,
    router,
    user,
    isEmailConfirmed,
    isAdmin,
    isTenant,
    requireEmailVerification,
  ]);

  return {
    user,
    role,
    isLoading,
    isAuthenticated,
    isAuthorized: allowedRoles.length === 0 || (role ? allowedRoles.includes(role) : false),
  };
}