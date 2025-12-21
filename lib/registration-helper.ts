// src/lib/registration-helper.ts
import { createClient } from '@/lib/supabase/client';

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: 'manager' | 'landlord';
  is_active: boolean;
  permissions: {
    can_create_users: boolean;
    can_delete_users: boolean;
    can_manage_properties: boolean;
    can_view_reports: boolean;
    can_manage_finances: boolean;
  };
}

export async function registerAdminUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'landlord' | 'property_manager';
  companyName?: string;
}) {
  const supabase = createClient();

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          user_type: userData.userType,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // 2. Create admin profile
    const adminData = {
      id: authData.user.id,
      full_name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone_number: userData.phone,
      role: userData.userType === 'property_manager' ? 'manager' : 'landlord',
      is_active: true,
      permissions: {
        can_create_users: true,
        can_delete_users: true,
        can_manage_properties: true,
        can_view_reports: true,
        can_manage_finances: true,
      },
    };

    const { error: dbError } = await supabase
      .from('admin')
      .insert<AdminProfile>(adminData);

    if (dbError) {
      // If DB insert fails, try with session
      await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      const { error: retryError } = await supabase
        .from('admin')
        .insert<AdminProfile>(adminData);

      if (retryError) throw retryError;
    }

    return {
      success: true,
      userId: authData.user.id,
      email: authData.user.email,
      needsEmailVerification: !authData.session,
    };

  } catch (error: any) {
    console.error('Registration helper error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}