export enum UserRole {
  ADMIN = 'admin',
  LANDLORD = 'landlord',
  MANAGER = 'manager',
  STAFF = 'staff'
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum RentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  PARTIAL = 'partial'
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  OTHER = 'other'
}

export enum UnitType {
  STUDIO = 'studio',
  ONE_BED = '1bed',
  TWO_BED = '2bed',
  THREE_BED = '3bed',
  FOUR_BED = '4bed',
  PENTHOUSE = 'penthouse',
  OTHER = 'other'
}

export enum UnitStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  CREDIT_CARD = 'credit_card',
  CHECK = 'check',
  DEBIT_CARD = 'debit_card',
  OTHER = 'other'
}

export enum PaymentType {
  RENT = 'rent',
  DEPOSIT = 'deposit',
  MAINTENANCE = 'maintenance',
  LATE_FEE = 'late_fee',
  UTILITY = 'utility',
  OTHER = 'other'
}

export enum TransactionStatus {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PENDING = 'pending'
}

export enum MaintenanceCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  APPLIANCE = 'appliance',
  HEATING = 'heating',
  GENERAL = 'general',
  EMERGENCY = 'emergency',
  OTHER = 'other'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency'
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum ReportType {
  FINANCIAL = 'financial',
  OCCUPANCY = 'occupancy',
  MAINTENANCE = 'maintenance',
  RENT_COLLECTION = 'rent_collection',
  TENANT = 'tenant',
  CUSTOM = 'custom'
}

export enum DocumentType {
  LEASE_AGREEMENT = 'lease_agreement',
  ID_CARD = 'id_card',
  PROOF_OF_INCOME = 'proof_of_income',
  UTILITY_BILL = 'utility_bill',
  CONTRACT = 'contract',
  OTHER = 'other'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  NOTIFICATION = 'notification',
  ANNOUNCEMENT = 'announcement'
}

export enum NotificationType {
  PAYMENT = 'payment',
  MAINTENANCE = 'maintenance',
  ANNOUNCMENT = 'announcement',
  WARNING = 'warning',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}