import { ReactNode } from 'react';
import { 
  TenantWithDetails, TransactionWithDetails, 
  MaintenanceWithDetails, PropertiesTable 
} from './database.types';

// Common props for components
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export interface TenantCardProps {
  tenant: TenantWithDetails;
  onEdit?: (tenant: TenantWithDetails) => void;
  onDelete?: (tenantId: string) => void;
  onViewTransactions?: (tenantId: string) => void;
}

export interface PropertyCardProps {
  property: PropertiesTable;
  tenantsCount: number;
  occupancyRate: number;
  onViewUnits?: (propertyId: string) => void;
  onEdit?: (property: PropertiesTable) => void;
}

export interface TransactionCardProps {
  transaction: TransactionWithDetails;
  showTenantInfo?: boolean;
}

export interface MaintenanceCardProps {
  request: MaintenanceWithDetails;
  showActions?: boolean;
  onUpdateStatus?: (requestId: string, status: string) => void;
  onAssign?: (requestId: string, adminId: string) => void;
}

// Form props
export interface TenantFormProps {
  initialData?: Partial<TenantWithDetails>;
  onSubmit: (data: Partial<TenantWithDetails>) => void;
  isLoading?: boolean;
  properties?: PropertiesTable[];
  units?: string[];
}

export interface PropertyFormProps {
  initialData?: Partial<PropertiesTable>;
  onSubmit: (data: Partial<PropertiesTable>) => void;
  isLoading?: boolean;
}

export interface TransactionFormProps {
  tenantId?: string;
  onSubmit: (data: Partial<TransactionWithDetails>) => void;
  isLoading?: boolean;
  tenants?: TenantWithDetails[];
}