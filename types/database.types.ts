import { 
  UserRole, AccountStatus, RentStatus, PropertyType, UnitType, UnitStatus,
  PaymentMethod, PaymentType, TransactionStatus, MaintenanceCategory,
  MaintenancePriority, MaintenanceStatus, ReportType, DocumentType,
  MessageType, NotificationType
} from './enums';

// Base interface for all tables with common fields
export interface DatabaseTable {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Extend Supabase's Database type if you have it
export interface Database {
  public: {
    Tables: {
      properties: PropertiesTable;
      units: UnitsTable;
      admin: AdminTable;
      tenants: TenantsTable;
      transactions: TransactionsTable;
      maintenance_requests: MaintenanceRequestsTable;
      communications: CommunicationsTable;
      reports: ReportsTable;
      notifications: NotificationsTable;
      documents: DocumentsTable;
      settings: SettingsTable;
    };
    Views: {
      dashboard_stats: DashboardStatsView;
    };
  };
}

// Individual table interfaces
export interface PropertiesTable extends DatabaseTable {
  property_name: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  property_type: PropertyType;
  total_units: number;
  available_units: number;
  monthly_rent_range?: string;
  amenities?: string[];
  property_manager_id?: string;
  is_active: boolean;
}

export interface UnitsTable extends DatabaseTable {
  property_id: string;
  unit_number: string;
  unit_type: UnitType;
  square_feet?: number;
  monthly_rent: number;
  security_deposit: number;
  status: UnitStatus;
  features?: string[];
  floor_number?: number;
  bedroom_count?: number;
  bathroom_count?: number;
}

export interface AdminTable extends DatabaseTable {
  id: string; // References auth.users.id
  full_name: string;
  email: string;
  phone_number?: string;
  national_id?: string;
  role: UserRole;
  profile_image_url?: string;
  is_active: boolean;
  permissions?: {
    can_create_users: boolean;
    can_delete_users: boolean;
    can_manage_properties: boolean;
    can_view_reports: boolean;
    can_manage_finances: boolean;
  };
}

export interface TenantsTable extends DatabaseTable {
  id: string; // References auth.users.id
  full_name: string;
  phone_number?: string;
  email: string;
  property_id?: string;
  unit_id?: string;
  house_unit_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  account_status: AccountStatus;
  rent_status: RentStatus;
  lease_start_date: string; // ISO date string
  lease_end_date: string; // ISO date string
  monthly_rent: number;
  security_deposit: number;
  deposit_paid: boolean;
  created_by: string; // Admin who created this tenant
  notes?: string;
}

export interface TransactionsTable extends DatabaseTable {
  tenant_id: string;
  property_id?: string;
  unit_id?: string;
  tenant_name: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  status: TransactionStatus;
  transaction_date: string;
  due_date?: string;
  period_start?: string;
  period_end?: string;
  reference_number?: string;
  receipt_url?: string;
  notes?: string;
  recorded_by: string; // Admin who recorded this transaction
}

export interface MaintenanceRequestsTable extends DatabaseTable {
  tenant_id: string;
  property_id: string;
  unit_id?: string;
  title: string;
  description: string;
  category?: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assigned_to?: string;
  estimated_cost: number;
  actual_cost: number;
  scheduled_date?: string;
  completed_date?: string;
  tenant_rating?: number;
  tenant_feedback?: string;
  images?: string[];
}

export interface CommunicationsTable extends DatabaseTable {
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  message: string;
  message_type: MessageType;
  is_read: boolean;
  read_at?: string;
  attachments?: string[];
}

export interface ReportsTable extends DatabaseTable {
  report_type: ReportType;
  title: string;
  description?: string;
  period_start?: string;
  period_end?: string;
  generated_by: string;
  data: Record<string, string | number | boolean | null>;
  filters?: Record<string, string | number | boolean | null>;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_public: boolean;
}

export interface NotificationsTable extends DatabaseTable {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  related_id?: string;
  related_type?: string;
  action_url?: string;
}

export interface DocumentsTable extends DatabaseTable {
  tenant_id?: string;
  admin_id?: string;
  document_type: DocumentType;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type?: string;
  uploaded_by: string;
  expiry_date?: string;
  is_verified: boolean;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
}

export interface SettingsTable extends DatabaseTable {
  setting_key: string;
  setting_value: Record<string, string | number | boolean | null>;
  description?: string;
  category: string;
  is_public: boolean;
  updated_by?: string;
}

// View interfaces
export interface DashboardStatsView {
  active_tenants: number;
  overdue_tenants: number;
  active_properties: number;
  pending_maintenance: number;
  monthly_rent_collected: number;
  total_monthly_rent_due: number;
}

// Joined/Composite types for common queries
export interface TenantWithDetails extends TenantsTable {
  property?: PropertiesTable;
  unit?: UnitsTable;
  admin_creator?: AdminTable;
}

export interface TransactionWithDetails extends TransactionsTable {
  tenant?: TenantsTable;
  property?: PropertiesTable;
  unit?: UnitsTable;
  recorded_by_admin?: AdminTable;
}

export interface MaintenanceWithDetails extends MaintenanceRequestsTable {
  tenant?: TenantsTable;
  property?: PropertiesTable;
  unit?: UnitsTable;
  assigned_admin?: AdminTable;
}

export interface CommunicationWithDetails extends CommunicationsTable {
  sender?: AdminTable | TenantsTable;
  receiver?: AdminTable | TenantsTable;
  property?: PropertiesTable;
}