// app/components/AdminNotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Badge, 
  BadgeCheck, 
  Bell, 
  Mail, 
  MessageCircle, 
  Users, 
  Globe, 
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Send
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from 'date-fns';

// TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'admin';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  lastActive: string; // ISO date
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  channels: ('email' | 'sms' | 'push')[];
}

interface SentNotification {
  id: string;
  title: string;
  message: string;
  channels: ('email' | 'sms' | 'push')[];
  recipients: string[]; // user IDs
  status: 'sent' | 'failed' | 'pending';
  sentAt: string; // ISO date
  scheduledFor?: string; // ISO date
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1234567890',
    role: 'tenant',
    notificationPreferences: { email: true, sms: true, push: true },
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '+1987654321',
    role: 'tenant',
    notificationPreferences: { email: true, sms: false, push: true },
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '+1122334455',
    role: 'tenant',
    notificationPreferences: { email: true, sms: true, push: false },
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'rent_due',
    name: 'Rent Due Reminder',
    subject: 'Your Rent is Due Soon',
    message: 'Hello {{name}}, your rent payment for {{month}} is due on {{dueDate}}. Please submit your payment to avoid late fees.',
    channels: ['email', 'sms', 'push']
  },
  {
    id: 'maintenance',
    name: 'Maintenance Notice',
    subject: 'Upcoming Maintenance',
    message: 'Dear {{name}}, scheduled maintenance will occur on {{date}} from {{startTime}} to {{endTime}}. Please expect temporary service interruptions.',
    channels: ['email', 'push']
  },
  {
    id: 'welcome',
    name: 'Welcome New Tenant',
    subject: 'Welcome to Your New Home!',
    message: 'Hi {{name}}, welcome to {{property}}! Your move-in date is {{moveInDate}}. Here are your access instructions: {{instructions}}',
    channels: ['email', 'sms']
  }
];

export default function AdminNotificationCenter() {
  const [users] = useState<User[]>(mockUsers);
  const [templates] = useState<NotificationTemplate[]>(mockTemplates);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  
  // Compose state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    push: true
  });
  const [scheduleTime, setScheduleTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  // Load sent notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-notifications');
    if (saved) {
      try {
        setSentNotifications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved notifications');
      }
    }
  }, []);

  // Save sent notifications to localStorage
  useEffect(() => {
    localStorage.setItem('admin-notifications', JSON.stringify(sentNotifications));
  }, [sentNotifications]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setIsTemplateLoading(true);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setTitle(template.subject);
      setMessage(template.message);
      setChannels({
        email: template.channels.includes('email'),
        sms: template.channels.includes('sms'),
        push: template.channels.includes('push')
      });
    }
    setSelectedTemplate(templateId);
    setTimeout(() => setIsTemplateLoading(false), 300);
  };

  // Handle recipient selection
  const toggleRecipient = (userId: string) => {
    setSelectedRecipients(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Handle channel toggle
  const toggleChannel = (channel: 'email' | 'sms' | 'push') => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  // Send notification
  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }
    
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    
    if (!channels.email && !channels.sms && !channels.push) {
      toast.error('Please select at least one notification channel');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newNotification: SentNotification = {
        id: `notif_${Date.now()}`,
        title,
        message,
        channels: Object.entries(channels)
          .filter(([_, enabled]) => enabled)
          .map(([channel]) => channel as 'email' | 'sms' | 'push'),
        recipients: selectedRecipients,
        status: 'sent',
        sentAt: new Date().toISOString(),
        scheduledFor: scheduleTime || undefined
      };
      
      setSentNotifications(prev => [newNotification, ...prev]);
      
      // Reset form
      setTitle('');
      setMessage('');
      setSelectedRecipients([]);
      setChannels({ email: true, sms: true, push: true });
      setScheduleTime('');
      setSelectedTemplate('');
      
      toast.success('Notification sent successfully!', {
        description: `${selectedRecipients.length} user(s) notified via ${newNotification.channels.join(', ')}`
      });
    } catch (error) {
      toast.error('Failed to send notification', {
        description: 'Please check your connection and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // Format channels for display
  const formatChannels = (channels: string[]) => {
    return channels.map(channel => 
      channel === 'email' ? 'Email' : 
      channel === 'sms' ? 'SMS' : 
      'Push'
    ).join(', ');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notification Center</h1>
            <p className="text-muted-foreground">
              Send targeted notifications to tenants and users
            </p>
          </div>
        </div>
        
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'compose' 
                ? 'bg-background shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('compose')}
          >
            Compose
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history' 
                ? 'bg-background shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Form */}
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Create and send notifications to selected users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Templates */}
              <div className="space-y-2">
                <Label>Notification Template</Label>
                <Select onValueChange={handleTemplateSelect} value={selectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Message</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title / Subject</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your notification message..."
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Use placeholders like {`{{name}}, {{dueDate}}, {{property}}`} for personalization
                </p>
              </div>

              {/* Channels */}
              <div className="space-y-2">
                <Label>Notification Channels</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
                    { id: 'sms', label: 'SMS', icon: <MessageCircle className="h-4 w-4" /> },
                    { id: 'push', label: 'Push', icon: <Bell className="h-4 w-4" /> }
                  ].map(channel => (
                    <Button
                      key={channel.id}
                      variant={channels[channel.id as keyof typeof channels] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleChannel(channel.id as 'email' | 'sms' | 'push')}
                      className="gap-2"
                    >
                      {channel.icon}
                      {channel.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to send immediately
                </p>
              </div>

              {/* Send Button */}
              <Button 
                className="w-full mt-4"
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <CardDescription>
                Select users to receive this notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  {selectedRecipients.length} of {users.length} selected
                </p>
                {selectedRecipients.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedRecipients([])}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRecipients.includes(user.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-accent'
                    }`}
                    onClick={() => toggleRecipient(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          {user.role === 'tenant' && (
                            <Badge className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500">
                              <Users className="h-3 w-3 text-white" />
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {user.notificationPreferences.email && <Mail className="h-4 w-4 text-blue-500" />}
                        {user.notificationPreferences.sms && <MessageCircle className="h-4 w-4 text-green-500" />}
                        {user.notificationPreferences.push && <Bell className="h-4 w-4 text-purple-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Recipient Notes:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Only users with enabled notification channels will receive messages</li>
                  <li>• SMS requires phone number verification</li>
                  <li>• Push notifications require mobile app installation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Notification History */
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>
              View previously sent notifications and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sentNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications sent yet</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('compose')}
                >
                  Send Your First Notification
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentNotifications.map(notification => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {notification.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {notification.recipients.length} user{notification.recipients.length !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {notification.channels.map(channel => (
                            <Badge key={channel} variant="outline" className="gap-1">
                              {getChannelIcon(channel)}
                              {channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'Push'}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {notification.status === 'sent' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : notification.status === 'failed' ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Target className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="capitalize">{notification.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(notification.sentAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}