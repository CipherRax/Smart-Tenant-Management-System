// types/report.ts
export interface MonthlyReport {
  month: string;
  year: number;
  rentAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  paymentDate: string | null;
  lateFees: number;
  daysLate: number;
}

export interface TenantReport {
  tenantId: string;
  tenantName: string;
  property: string;
  unit: string;
  leaseStart: Date;
  leaseEnd: Date;
  monthlyRent: number;
  securityDeposit: number;
  currentBalance: number;
  paymentHistory: MonthlyReport[];
  averagePaymentDelay: number;
  totalLateFees: number;
  onTimePaymentRate: number;
  totalPaid: number;
}