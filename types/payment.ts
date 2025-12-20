// types/payment.ts
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'mobile_money';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  reference: string;
}

export interface PaymentDetails {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  mobileProvider?: 'mtn' | 'airtel' | 'vodafone' | 'orange';
  phoneNumber?: string;
}