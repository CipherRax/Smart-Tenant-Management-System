'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

interface UseAuthReturn {
  // User state
  user: User | null;
  session: Session | null;
  role: string | null;
  userProfile: Record<string, unknown> | null; // Combined admin/tenant profile
  
  // Loading states
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Role checks
  isAdmin: boolean;
  isLandlord: boolean;
  isManager: boolean;
  isStaff: boolean;
  isTenant: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any; data: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any; data: any }>;
  
  // Profile methods
  refreshProfile: () => Promise<void>;
  
  // Status
  isEmailConfirmed: boolean;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Helper: Check if user is admin/landlord/manager/staff
  const isAdmin = role === 'admin' || role === 'landlord' || role === 'manager' || role === 'staff';
  const isLandlord = role === 'landlord';
  const isManager = role === 'manager';
  const isStaff = role === 'staff';
  const isTenant = role === 'tenant';
  const isEmailConfirmed = user?.email_confirmed_at !== null;

  // Fetch user profile (admin or tenant)
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      // First check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('id', userId)
        .single();

      if (adminData && !adminError) {
        setRole(adminData.role);
        setUserProfile(adminData);
        return adminData;
      }

      // If not admin, check if tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select(`
          *,
          property:properties(*),
          unit:units(*)
        `)
        .eq('id', userId)
        .single();

      if (tenantData && !tenantError) {
        setRole('tenant');
        setUserProfile(tenantData);
        return tenantData;
      }

      // No profile found
      setRole(null);
      setUserProfile(null);
      return null;

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setRole(null);
      setUserProfile(null);
      return null;
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);

        if (currentSession?.user) {
          // Fetch user profile
          await fetchUserProfile(currentSession.user.id);
        } else {
          setRole(null);
          setUserProfile(null);
        }

      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setSession(null);
        setRole(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession?.user);

        if (newSession?.user) {
          // Fetch user profile on auth state change
          await fetchUserProfile(newSession.user.id);
          
          // Redirect based on role if on auth pages
          if (pathname.includes('/auth/')) {
            const profile = await fetchUserProfile(newSession.user.id);
            if (profile) {
              if (profile.role === 'tenant') {
                router.push('/users/uhome');
              } else if (['admin', 'landlord', 'manager', 'staff'].includes(profile.role)) {
                router.push('/dashboard');
              }
            }
          }
        } else {
          setRole(null);
          setUserProfile(null);
          
          // Redirect to login if on protected page
          if (pathname.includes('/dashboard') || pathname.includes('/users/')) {
            router.push('/auth/login');
          }
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname, fetchUserProfile]);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        return { error: result.error, data: null };
      }

      if (result.data.user) {
        await fetchUserProfile(result.data.user.id);
      }

      return { error: null, data: result.data };
    } catch (error: any) {
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up method (for admin creating tenant accounts)
  const signUp = async (email: string, password: string, userData?: any) => {
    setIsLoading(true);
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // Additional user metadata
        },
      });

      if (result.error) {
        return { error: result.error, data: null };
      }

      return { error: null, data: result.data };
    } catch (error: any) {
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out method
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password method
  const resetPassword = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error: result.error, data: result.data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  // Update password method
  const updatePassword = async (newPassword: string) => {
    try {
      const result = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error: result.error, data: result.data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  // Refresh profile method
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  return {
    // State
    user,
    session,
    role,
    userProfile,
    
    // Loading states
    isLoading,
    isAuthenticated,
    
    // Role checks
    isAdmin,
    isLandlord,
    isManager,
    isStaff,
    isTenant,
    
    // Authentication methods
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    
    // Profile methods
    refreshProfile,
    
    // Status
    isEmailConfirmed,
  };
}