// types/communication.ts
export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'tenant' | 'landlord' | 'manager' | 'maintenance';
  online: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
  type: 'text' | 'image' | 'file' | 'system' | 'complaint';
  complaintCategory?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'pdf' | 'other';
  size: number;
  uploadedAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'noise' | 'safety' | 'cleanliness' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
  assignedTo?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'general' | 'maintenance' | 'payment' | 'complaint' | 'other';
}