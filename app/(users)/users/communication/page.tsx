// components/tenant-communication.tsx (Fixed Version)
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { User, Message, Chat, Complaint, Attachment } from '@/types/communication';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mail,
  MessageSquare,
  AlertTriangle,
  Users,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Phone,
  Video,
  Info,
  Trash2,
  Archive,
  Bell,
  BellOff,
  Download,
  Eye,
  Plus,
  Filter,
  AlertCircle,
  Home,
  Wrench,
  Volume2,
  Shield,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data (same as before)
const mockUsers: User[] = [
  { id: '1', name: 'John Smith', role: 'tenant', online: true },
  { id: '2', name: 'Sarah Johnson', role: 'tenant', online: true },
  { id: '3', name: 'Michael Chen', role: 'tenant', online: false, lastSeen: new Date('2024-01-20T10:30:00') },
  { id: '4', name: 'Robert Wilson', role: 'landlord', online: true },
  { id: '5', name: 'Maintenance Team', role: 'maintenance', online: true },
  { id: '6', name: 'Property Manager', role: 'manager', online: true },
];

const mockChats: Chat[] = [
  {
    id: '1',
    participants: ['1', '4'],
    lastMessage: {
      id: '101',
      content: 'The leak in the kitchen has been fixed',
      senderId: '4',
      receiverId: '1',
      timestamp: new Date('2024-01-20T14:30:00'),
      read: true,
      type: 'text'
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: '2',
    participants: ['1', '2', '3'],
    lastMessage: {
      id: '102',
      content: 'Building party this Friday at 8 PM!',
      senderId: '2',
      receiverId: '1',
      timestamp: new Date('2024-01-20T15:45:00'),
      read: false,
      type: 'text'
    },
    unreadCount: 3,
    isGroup: true,
    groupName: 'Sunset Apartments Tenants',
    groupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tenants'
  },
  {
    id: '3',
    participants: ['1', '5'],
    lastMessage: {
      id: '103',
      content: 'AC unit replacement scheduled for tomorrow',
      senderId: '5',
      receiverId: '1',
      timestamp: new Date('2024-01-19T09:15:00'),
      read: true,
      type: 'text'
    },
    unreadCount: 0,
    isGroup: false
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! The water pressure seems low in the bathroom.',
    senderId: '1',
    receiverId: '4',
    timestamp: new Date('2024-01-20T10:00:00'),
    read: true,
    type: 'text'
  },
  {
    id: '2',
    content: 'Thanks for letting me know. I\'ll send maintenance to check it.',
    senderId: '4',
    receiverId: '1',
    timestamp: new Date('2024-01-20T10:05:00'),
    read: true,
    type: 'text'
  },
  {
    id: '3',
    content: 'Here\'s a photo of the leak under the sink',
    senderId: '1',
    receiverId: '4',
    timestamp: new Date('2024-01-20T10:10:00'),
    read: true,
    type: 'image',
    attachments: [
      {
        id: 'att1',
        name: 'leak-photo.jpg',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        type: 'image',
        size: 2048576,
        uploadedAt: new Date('2024-01-20T10:10:00')
      }
    ]
  },
  {
    id: '4',
    content: 'The noise from apartment 302 is excessive after 10 PM',
    senderId: '1',
    receiverId: '4',
    timestamp: new Date('2024-01-19T22:30:00'),
    read: true,
    type: 'complaint',
    complaintCategory: 'noise'
  }
];

const mockComplaints: Complaint[] = [
  {
    id: 'comp1',
    title: 'Excessive Noise at Night',
    description: 'Loud music and parties from apartment 302 after 10 PM, violating quiet hours',
    category: 'noise',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20'),
    assignedTo: 'Property Manager'
  },
  {
    id: 'comp2',
    title: 'Kitchen Sink Leak',
    description: 'Constant dripping from kitchen sink causing water damage',
    category: 'maintenance',
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    assignedTo: 'Maintenance Team'
  },
  {
    id: 'comp3',
    title: 'Parking Lot Lights',
    description: 'Several lights in parking lot are out, creating safety concerns',
    category: 'safety',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

export default function TenantCommunication() {
  const [activeTab, setActiveTab] = useState<string>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [complaintTitle, setComplaintTitle] = useState<string>('');
  const [complaintDescription, setComplaintDescription] = useState<string>('');
  const [complaintCategory, setComplaintCategory] = useState<string>('maintenance');
  const [complaintPriority, setComplaintPriority] = useState<string>('medium');
  const [showComplaintDialog, setShowComplaintDialog] = useState<boolean>(false);
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser: User = {
    id: 'current',
    name: 'You',
    role: 'tenant',
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

  const handleSendComplaint = () => {
    if (!complaintTitle.trim() || !complaintDescription.trim()) return;

    const complaintMessage: Message = {
      id: Date.now().toString(),
      content: `COMPLAINT: ${complaintTitle} - ${complaintDescription}`,
      senderId: currentUser.id,
      receiverId: '4', // Landlord
      timestamp: new Date(),
      read: false,
      type: 'complaint',
      complaintCategory
    };

    setMessages([...messages, complaintMessage]);

    const newComplaint: Complaint = {
      id: `comp${Date.now()}`,
      title: complaintTitle,
      description: complaintDescription,
      category: complaintCategory as any,
      priority: complaintPriority as any,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockComplaints.unshift(newComplaint);
    
    setComplaintTitle('');
    setComplaintDescription('');
    setComplaintCategory('maintenance');
    setComplaintPriority('medium');
    setShowComplaintDialog(false);
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;

    console.log('Email sent:', { subject: emailSubject, body: emailBody });
    
    setEmailSubject('');
    setEmailBody('');
    setShowEmailDialog(false);
    
    alert('Email sent successfully to landlord!');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'noise': return <Volume2 className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'cleanliness': return <Sparkles className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Separate function to render tabs content
  const renderTabsContent = () => {
    return (
      <Tabs defaultValue="chats" className="flex-1">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="mt-0 h-full">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-2">
              {mockChats.map((chat) => {
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
                          {other.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {!chat.isGroup && getUserById(other.id).online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold truncate">{other.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(chat.lastMessage?.timestamp || new Date(), 'HH:mm')}
                        </span>
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
        </TabsContent>
        
        <TabsContent value="tenants" className="mt-0 h-full">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-2">
              {mockUsers
                .filter(user => user.role === 'tenant' && user.id !== currentUser.id)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
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
                      <p className="font-semibold">{user.name}</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          {user.online ? 'Online' : `Last seen ${format(user.lastSeen || new Date(), 'HH:mm')}`}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="complaints" className="mt-0 h-full">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="space-y-3 pr-4">
              {mockComplaints.map((complaint) => (
                <Card key={complaint.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          {getCategoryIcon(complaint.category)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{complaint.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(complaint.priority)}`} />
                              <span className="text-xs capitalize">{complaint.priority}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(complaint.status)}`} />
                              <span className="text-xs">
                                {complaint.status.replace('_', ' ')}
                              </span>
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
                            Download Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)]">
        {/* Left Sidebar - Chats & Contacts */}
        <Card className="md:w-1/3 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Messages</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEmailDialog(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowComplaintDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  New Complaint
                </Button>
              </div>
            </div>
            <CardDescription>
              Chat with tenants, landlord, and teams
            </CardDescription>
          </CardHeader>
          
          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="px-6 pb-6 flex-1">
            {renderTabsContent()}
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
                        {getOtherParticipant(selectedChat).name.split(' ').map(n => n[0]).join('')}
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
                          <Bell className="h-4 w-4 mr-2" />
                          Mute Notifications
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
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {sender.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-first' : ''}`}>
                          {!isCurrentUser && (
                            <p className="text-sm font-medium mb-1">{sender.name}</p>
                          )}
                          
                          <div className={`rounded-2xl p-4 ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {message.type === 'complaint' && (
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-semibold">Complaint</span>
                                <Badge variant="outline" className="text-xs">
                                  {message.complaintCategory}
                                </Badge>
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
              <h3 className="text-2xl font-semibold mb-2">Select a chat</h3>
              <p className="text-muted-foreground mb-6">
                Choose a conversation from the sidebar or start a new one
              </p>
              <div className="flex gap-3">
                <Button onClick={() => setShowEmailDialog(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={() => setShowComplaintDialog(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  File Complaint
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Complaint Dialog */}
      <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              File a New Complaint
            </DialogTitle>
            <DialogDescription>
              Report issues or concerns to the property management
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complaint-title">Complaint Title *</Label>
                <Input
                  id="complaint-title"
                  placeholder="e.g., Excessive Noise at Night"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="complaint-category">Category *</Label>
                <Select value={complaintCategory} onValueChange={setComplaintCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Maintenance
                      </div>
                    </SelectItem>
                    <SelectItem value="noise">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Noise
                      </div>
                    </SelectItem>
                    <SelectItem value="safety">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Safety
                      </div>
                    </SelectItem>
                    <SelectItem value="cleanliness">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Cleanliness
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Other
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complaint-priority">Priority Level *</Label>
              <Select value={complaintPriority} onValueChange={setComplaintPriority}>
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
              <Label htmlFor="complaint-description">Description *</Label>
              <Textarea
                id="complaint-description"
                placeholder="Please provide detailed information about the issue..."
                rows={6}
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComplaintDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendComplaint} disabled={!complaintTitle || !complaintDescription}>
              Submit Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Email to Landlord
            </DialogTitle>
            <DialogDescription>
              Send a formal email to the property owner or manager
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                value="landlord@sunsetapartments.com"
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="e.g., Rent Payment Inquiry"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-body">Message *</Label>
              <Textarea
                id="email-body"
                placeholder="Type your message here..."
                rows={12}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>This email will be sent through our secure system and logged in your communication history.</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={!emailSubject || !emailBody}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}