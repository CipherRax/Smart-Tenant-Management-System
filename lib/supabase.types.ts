import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

// Type helpers for database operations
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T] extends { Row: infer R } ? R : never;
export type InsertDto<T extends TableName> = Tables[T] extends { Insert: infer I } ? I : never;
export type UpdateDto<T extends TableName> = Tables[T] extends { Update: infer U } ? U : never;

// Auth user type
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

// Session type
export interface AppSession {
  user: AuthUser;
  access_token: string;
  expires_at?: number;
}