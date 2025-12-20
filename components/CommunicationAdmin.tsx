// components/admin-communication.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Users,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Phone,
  Video,
  Info,
  Trash2,
  Archive,
  Bell,
  BellOff,
  Download,
  Eye,
  Filter,
  UserPlus,
  Building,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Clock,
  Mail,
  Shield,
  Wifi,
  Upload,
  X,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";



// Types
interface User {
  id: string;
  name: string;
  role: 'tenant' | 'landlord' | 'manager' | 'admin';
  online: boolean;
  lastSeen?: Date;
  unit?: string;
  property?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
  type: 'text' | 'image' | 'file' | 'system' | 'announcement';
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'pdf' | 'other';
  size: number;
  uploadedAt: Date;
}

interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  pinned: boolean;
  muted: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'maintenance' | 'event' | 'payment' | 'safety' | 'general';
  createdAt: Date;
  recipients: string[];
  readBy: string[];
}

// Mock Data
const mockUsers: User[] = [
  { id: '1', name: 'Alex Johnson', role: 'tenant', online: true, unit: '302', property: 'Sunset Apartments' },
  { id: '2', name: 'Maria Garcia', role: 'tenant', online: false, unit: '201', property: 'Sunset Apartments' },
  { id: '3', name: 'James Wilson', role: 'tenant', online: true, unit: '105', property: 'Sunset Apartments' },
  { id: '4', name: 'Sarah Chen', role: 'tenant', online: false, unit: '401', property: 'Green Valley Complex' },
  { id: '5', name: 'Michael Brown', role: 'tenant', online: true, unit: '203', property: 'Green Valley Complex' },
  { id: '6', name: 'Property Manager', role: 'manager', online: true },
  { id: '7', name: 'Maintenance Team', role: 'manager', online: true },
  { id: '8', name: 'Robert Davis (Owner)', role: 'landlord', online: false },
];

const mockChats: Chat[] = [
  {
    id: '1',
    participants: ['admin', '1'],
    lastMessage: { id: '101', content: 'The kitchen leak is getting worse', senderId: '1', receiverId: 'admin', timestamp: new Date('2024-01-20T14:30:00'), read: true, type: 'text' },
    unreadCount: 0,
    isGroup: false,
    pinned: true,
    muted: false
  },
  {
    id: '2',
    participants: ['admin', '6'],
    lastMessage: { id: '102', content: 'Monthly report is ready for review', senderId: '6', receiverId: 'admin', timestamp: new Date('2024-01-20T15:45:00'), read: false, type: 'text' },
    unreadCount: 2,
    isGroup: false,
    pinned: true,
    muted: false
  },
  {
    id: '3',
    participants: ['admin', '7'],
    lastMessage: { id: '103', content: 'AC maintenance scheduled for tomorrow', senderId: '7', receiverId: 'admin', timestamp: new Date('2024-01-19T09:15:00'), read: true, type: 'text' },
    unreadCount: 0,
    isGroup: false,
    pinned: false,
    muted: false
  },
  {
    id: '4',
    participants: ['admin', '1', '2', '3'],
    lastMessage: { id: '104', content: 'Building meeting this Friday at 6 PM', senderId: 'admin', receiverId: '1', timestamp: new Date('2024-01-20T16:30:00'), read: true, type: 'text' },
    unreadCount: 0,
    isGroup: true,
    groupName: 'Sunset Apartments Tenants',
    groupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunset',
    pinned: false,
    muted: true
  },
  {
    id: '5',
    participants: ['admin', '4', '5'],
    lastMessage: { id: '105', content: 'Parking lot rescheduled for next week', senderId: 'admin', receiverId: '4', timestamp: new Date('2024-01-19T11:20:00'), read: false, type: 'text' },
    unreadCount: 3,
    isGroup: true,
    groupName: 'Green Valley Complex',
    groupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=greenvalley',
    pinned: false,
    muted: false
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi, I wanted to report a leak in the kitchen sink.',
    senderId: '1',
    receiverId: 'admin',
    timestamp: new Date('2024-01-20T14:00:00'),
    read: true,
    type: 'text'
  },
  {
    id: '2',
    content: 'Thanks for letting me know. Can you send a photo?',
    senderId: 'admin',
    receiverId: '1',
    timestamp: new Date('2024-01-20T14:05:00'),
    read: true,
    type: 'text'
  },
  {
    id: '3',
    content: 'Here is the photo of the leak',
    senderId: '1',
    receiverId: 'admin',
    timestamp: new Date('2024-01-20T14:10:00'),
    read: true,
    type: 'image',
    attachments: [
      {
        id: 'att1',
        name: 'leak-photo.jpg',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        type: 'image',
        size: 2048576,
        uploadedAt: new Date('2024-01-20T14:10:00')
      }
    ]
  },
  {
    id: '4',
    content: 'I\'ll send maintenance right away. They should be there within 2 hours.',
    senderId: 'admin',
    receiverId: '1',
    timestamp: new Date('2024-01-20T14:15:00'),
    read: true,
    type: 'text'
  },
  {
    id: '5',
    content: 'IMPORTANT: Building water will be shut off tomorrow from 9 AM to 12 PM for maintenance.',
    senderId: 'admin',
    receiverId: '1',
    timestamp: new Date('2024-01-20T16:00:00'),
    read: false,
    type: 'announcement'
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Water Shut-off Notice',
    content: 'Building water will be shut off tomorrow from 9 AM to 12 PM for maintenance.',
    sender: 'admin',
    priority: 'high',
    category: 'maintenance',
    createdAt: new Date('2024-01-20'),
    recipients: ['1', '2', '3', '4', '5'],
    readBy: ['1', '3']
  },
  {
    id: 'ann2',
    title: 'Rent Due Reminder',
    content: 'Friendly reminder: Rent is due on February 1st. Late fees apply after the 5th.',
    sender: 'admin',
    priority: 'medium',
    category: 'payment',
    createdAt: new Date('2024-01-18'),
    recipients: ['1', '2', '3', '4', '5'],
    readBy: ['1', '2', '4', '5']
  },
  {
    id: 'ann3',
    title: 'Building Meeting',
    content: 'Quarterly building meeting this Friday at 6 PM in the community room.',
    sender: 'admin',
    priority: 'low',
    category: 'event',
    createdAt: new Date('2024-01-15'),
    recipients: ['1', '2', '3', '4', '5'],
    readBy: ['1', '3', '5']
  }
];

export default function AdminCommunication() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'announcements' | 'contacts'>('chats');
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState<boolean>(false);
  const [announcementTitle, setAnnouncementTitle] = useState<string>('');
  const [announcementContent, setAnnouncementContent] = useState<string>('');
  const [announcementPriority, setAnnouncementPriority] = useState<string>('medium');
  const [announcementCategory, setAnnouncementCategory] = useState<string>('general');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser: User = {
    id: 'admin',
    name: 'Admin User',
    role: 'admin',
    online: true
  };

  const getOtherParticipant = (chat: Chat) => {
    if (chat.isGroup) {
      return {
        name: chat.groupName || 'Group Chat',
        avatar: chat.groupAvatar,
        role: 'group' as const
      };
    }
    const otherId = chat.participants.find(id => id !== currentUser.id);
    const user = mockUsers.find(u => u.id === otherId);
    return user || mockUsers[0];
  };

  const getUserById = (id: string) => {
    if (id === currentUser.id) return currentUser;
    return mockUsers.find(user => user.id === id) || mockUsers[0];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      receiverId: selectedChat?.id || '',
      timestamp: new Date(),
      read: false,
      type: attachments.length > 0 ? 'file' : 'text',
      attachments: attachments.map(file => ({
        id: file.name + Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size,
        uploadedAt: new Date()
      }))
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setAttachments([]);
  };

  const handleSendAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim() || selectedRecipients.length === 0) return;

    const newAnnouncement: Announcement = {
      id: `ann${Date.now()}`,
      title: announcementTitle,
      content: announcementContent,
      sender: currentUser.id,
      priority: announcementPriority as any,
      category: announcementCategory as any,
      createdAt: new Date(),
      recipients: selectedRecipients,
      readBy: []
    };

    // Add to announcements list
    mockAnnouncements.unshift(newAnnouncement);

    // Send as messages to each recipient
    selectedRecipients.forEach(recipientId => {
      const announcementMessage: Message = {
        id: `ann_msg_${Date.now()}_${recipientId}`,
        content: `ANNOUNCEMENT: ${announcementTitle} - ${announcementContent}`,
        senderId: currentUser.id,
        receiverId: recipientId,
        timestamp: new Date(),
        read: false,
        type: 'announcement'
      };
      setMessages(prev => [...prev, announcementMessage]);
    });

    // Reset form
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementPriority('medium');
    setAnnouncementCategory('general');
    setSelectedRecipients([]);
    setShowAnnouncementDialog(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <Wifi className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const toggleRecipient = (userId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllTenants = () => {
    const tenantIds = mockUsers.filter(u => u.role === 'tenant').map(u => u.id);
    setSelectedRecipients(tenantIds);
  };

  const clearRecipients = () => {
    setSelectedRecipients([]);
  };

  const filteredChats = mockChats.filter(chat => {
    const other = getOtherParticipant(chat);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.unit?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatList = () => (
    <ScrollArea className="h-[calc(100vh-22rem)]">
      <div className="space-y-2">
        {filteredChats.map((chat) => {
          const other = getOtherParticipant(chat);
          return (
            <div
              key={chat.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                selectedChat?.id === chat.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={other.avatar} />
                  <AvatarFallback>
                    {chat.isGroup ? 'G' : other.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {!chat.isGroup && getUserById(other.id).online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
                {chat.pinned && (
                  <div className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 17.5v-11l7 7 7-7v11a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{other.name}</p>
                    {chat.isGroup && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Group
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {chat.muted && <BellOff className="h-3 w-3 text-muted-foreground" />}
                    <span className="text-xs text-muted-foreground">
                      {format(chat.lastMessage?.timestamp || new Date(), 'HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.content}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-500">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  const renderContactsList = () => (
    <ScrollArea className="h-[calc(100vh-22rem)]">
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            onClick={() => {
              // Find or create chat with this user
              const existingChat = mockChats.find(chat => 
                !chat.isGroup && chat.participants.includes(user.id)
              );
              if (existingChat) {
                setSelectedChat(existingChat);
              }
            }}
          >
            <div className="relative">
              <Avatar>
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {user.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{user.name}</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {user.unit && (
                  <>
                    <span>Unit {user.unit}</span>
                    <span>•</span>
                  </>
                )}
                <span>{user.online ? 'Online' : `Last seen ${format(user.lastSeen || new Date(), 'HH:mm')}`}</span>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderAnnouncementsList = () => (
    <ScrollArea className="h-[calc(100vh-22rem)]">
      <div className="space-y-3">
        {mockAnnouncements.map((announcement) => {
          const sender = getUserById(announcement.sender);
          return (
            <Card key={announcement.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {getCategoryIcon(announcement.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <div className="flex items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(announcement.priority)}`} />
                          <span className="text-xs capitalize">{announcement.priority}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>By {sender.name}</span>
                          <span>•</span>
                          <span>{format(announcement.createdAt, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{announcement.recipients.length} recipients</span>
                          <span>•</span>
                          <span>{announcement.readBy.length} read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <Card className="md:w-1/3 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Communications</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAnnouncementDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
                <Button
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>
            <CardDescription>
              Manage conversations and announcements
            </CardDescription>
          </CardHeader>
          
          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="chats">Chats</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content based on active tab */}
          <div className="px-6 pb-6 flex-1">
            {activeTab === 'chats' && renderChatList()}
            {activeTab === 'announcements' && renderAnnouncementsList()}
            {activeTab === 'contacts' && renderContactsList()}
          </div>
        </Card>

        {/* Main Chat Area */}
        <Card className="md:w-2/3 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getOtherParticipant(selectedChat).avatar} />
                      <AvatarFallback>
                        {selectedChat.isGroup ? 'G' : getOtherParticipant(selectedChat).name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {getOtherParticipant(selectedChat).name}
                        {selectedChat.isGroup && (
                          <Badge variant="outline" className="ml-2">
                            <Users className="h-3 w-3 mr-1" />
                            Group
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        {!selectedChat.isGroup ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                            {getUserById(getOtherParticipant(selectedChat).id).online ? 'Online' : 'Offline'}
                          </>
                        ) : (
                          `${selectedChat.participants.length} members`
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Info className="h-4 w-4 mr-2" />
                          Chat Info
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {selectedChat.muted ? (
                            <>
                              <Bell className="h-4 w-4 mr-2" />
                              Unmute Notifications
                            </>
                          ) : (
                            <>
                              <BellOff className="h-4 w-4 mr-2" />
                              Mute Notifications
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => {
                    const sender = getUserById(message.senderId);
                    const isCurrentUser = sender.id === currentUser.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}
                      >
                        {!isCurrentUser && !selectedChat.isGroup && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {sender.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-first' : ''}`}>
                          {!isCurrentUser && selectedChat.isGroup && (
                            <p className="text-sm font-medium mb-1">{sender.name}</p>
                          )}
                          
                          <div className={`rounded-2xl p-4 ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : message.type === 'announcement'
                              ? 'bg-yellow-500/20 border border-yellow-300'
                              : 'bg-muted'
                          }`}>
                            {message.type === 'announcement' && (
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <span className="font-semibold">Announcement</span>
                              </div>
                            )}
                            
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                                  >
                                    {attachment.type === 'image' ? (
                                      <ImageIcon className="h-8 w-8 text-primary" />
                                    ) : (
                                      <FileText className="h-8 w-8 text-primary" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {attachment.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatFileSize(attachment.size)}
                                      </p>
                                    </div>
                                    <Button size="sm" variant="ghost">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-2 mt-1 ${
                            isCurrentUser ? 'justify-end' : ''
                          }`}>
                            <span className="text-xs text-muted-foreground">
                              {format(message.timestamp, 'HH:mm')}
                            </span>
                            {isCurrentUser && (
                              <>
                                {message.read ? (
                                  <CheckCheck className="h-3 w-3 text-blue-500" />
                                ) : (
                                  <Check className="h-3 w-3 text-muted-foreground" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getOtherParticipant(selectedChat).name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl p-4">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted rounded-lg p-2"
                      >
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="text-sm truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        className="cursor-pointer"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </label>
                    
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && attachments.length === 0}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground mb-6">
                Choose a chat from the sidebar or start a new one
              </p>
              <div className="flex gap-3">
                <Button onClick={() => setShowAnnouncementDialog(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Send Announcement
            </DialogTitle>
            <DialogDescription>
              Broadcast important messages to selected tenants
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcement-title">Announcement Title *</Label>
              <Input
                id="announcement-title"
                placeholder="e.g., Water Shut-off Notice"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="announcement-priority">Priority *</Label>
                <Select value={announcementPriority} onValueChange={setAnnouncementPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="announcement-category">Category *</Label>
                <Select value={announcementCategory} onValueChange={setAnnouncementCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="announcement-content">Message Content *</Label>
              <Textarea
                id="announcement-content"
                placeholder="Enter your announcement message..."
                rows={6}
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Recipients *</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllTenants}>
                    Select All Tenants
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearRecipients}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                {mockUsers
                  .filter(user => user.role === 'tenant')
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={selectedRecipients.includes(user.id)}
                          onChange={() => toggleRecipient(user.id)}
                          className="rounded border-gray-300"
                        />
                        <div>
                          <Label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                            {user.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Unit {user.unit} • {user.property}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Selected: {selectedRecipients.length} recipients
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Announcement Delivery</p>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                    <li>Will be sent as a priority message to selected tenants</li>
                    <li>Appears in the announcements tab for all recipients</li>
                    <li>Can be tracked for read receipts</li>
                    <li>Cannot be edited after sending</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendAnnouncement} 
              disabled={!announcementTitle || !announcementContent || selectedRecipients.length === 0}
            >
              Send Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}