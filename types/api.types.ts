// Common API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form/Request DTOs
export interface CreateTenantDto {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  property_id?: string;
  unit_id?: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit: number;
}

export interface UpdateTenantDto {
  full_name?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  account_status?: string;
}

export interface CreateTransactionDto {
  tenant_id: string;
  amount: number;
  payment_method: string;
  payment_type: string;
  period_start?: string;
  period_end?: string;
  reference_number?: string;
  notes?: string;
}

export interface CreateMaintenanceRequestDto {
  tenant_id: string;
  property_id: string;
  unit_id?: string;
  title: string;
  description: string;
  category?: string;
  priority: string;
  images?: File[];
}

export interface SendMessageDto {
  receiver_id: string;
  property_id?: string;
  message: string;
  message_type?: string;
  attachments?: File[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterAdminDto {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  national_id?: string;
  role?: string;
}