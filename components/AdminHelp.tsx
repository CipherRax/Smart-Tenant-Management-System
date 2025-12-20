// app/components/AdminHelpCenter.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  Bot, 
  Lightbulb, 
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Send,
  ExternalLink,
  Copy,
  Play
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// TypeScript interfaces
interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: string; // ISO date
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO date
}

// Mock data
const helpArticles: HelpArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Admin Dashboard',
    excerpt: 'Learn how to navigate the admin interface and manage your property',
    content: `The admin dashboard provides a centralized interface for managing all aspects of your property management system. Key sections include:
    
1. **Dashboard**: Overview of key metrics and recent activity
2. **Tenants**: Manage tenant profiles, leases, and communications
3. **Billing**: Handle rent payments, invoices, and financial reports
4. **Maintenance**: Track and resolve maintenance requests
5. **Settings**: Configure system preferences and user roles

Start by exploring the navigation sidebar to access different modules.`,
    category: 'onboarding',
    tags: ['dashboard', 'navigation', 'basics'],
    lastUpdated: '2023-10-15'
  },
  {
    id: 'billing-setup',
    title: 'Setting Up Billing and Payment Methods',
    excerpt: 'Configure rent payments, late fees, and payment gateways',
    content: `To set up billing:

1. Go to **Settings > Billing**
2. Configure payment gateways (Stripe, PayPal, etc.)
3. Set up late fee policies
4. Create payment schedules for tenants
5. Enable automatic payment reminders

You can also customize invoice templates and set up payment notifications.`,
    category: 'billing',
    tags: ['payments', 'invoices', 'stripe', 'paypal'],
    lastUpdated: '2023-11-02'
  },
  {
    id: 'user-management',
    title: 'Managing User Roles and Permissions',
    excerpt: 'Control access levels for staff and property managers',
    content: `User roles determine what actions users can perform:

- **Admin**: Full access to all features
- **Property Manager**: Access to assigned properties only
- **Staff**: Limited access to specific modules
- **Accountant**: Financial reporting and billing access only

To manage roles, go to **Settings > User Management** and assign roles when creating new users.`,
    category: 'security',
    tags: ['roles', 'permissions', 'access control'],
    lastUpdated: '2023-09-28'
  }
];

const faqItems: FAQItem[] = [
  {
    question: 'How do I reset a tenant\'s password?',
    answer: 'Go to Tenants > select the tenant > click "Reset Password". The tenant will receive an email with password reset instructions.',
    category: 'tenants'
  },
  {
    question: 'Can I customize email templates?',
    answer: 'Yes! Go to Settings > Email Templates to customize all system email templates including rent reminders, maintenance updates, and welcome emails.',
    category: 'settings'
  },
  {
    question: 'How do I handle maintenance requests?',
    answer: 'All maintenance requests appear in the Maintenance section. You can assign staff, set priority levels, track progress, and communicate with tenants directly from the request details page.',
    category: 'maintenance'
  },
  {
    question: 'What reports are available?',
    answer: 'We provide financial reports (income/expense, rent roll), occupancy reports, maintenance reports, and tenant activity reports. All reports can be exported to CSV or PDF.',
    category: 'reports'
  }
];

export default function AdminHelpCenter() {
  const [activeTab, setActiveTab] = useState<'docs' | 'ai' | 'support'>('docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const aiResponseRef = useRef<HTMLDivElement>(null);

  // AI response generator (mock)
  const generateAIResponse = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      `Based on your query "${query}", I recommend checking our documentation on billing setup. You can find detailed instructions in the Help Center under Billing category.`,
      `For "${query}", the best approach is to navigate to Settings > User Management. There you can configure all access permissions and roles for your team members.`,
      `I understand you need help with "${query}". Try using the search function in the top navigation bar - it indexes all help articles and can quickly find relevant information.`,
      `"${query}" - This is covered in our maintenance workflow guide. Go to Maintenance > Settings to configure your request handling process and notification preferences.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await generateAIResponse(aiQuery);
      setAiResponse(response);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Support ticket created!', {
        description: 'Our team will contact you within 24 hours'
      });
      
      // Reset form
      setSupportForm({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to submit support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFAQs = faqItems.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-scroll to AI response
  useEffect(() => {
    if (aiResponse && aiResponseRef.current) {
      aiResponseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResponse]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Help Center</h1>
            <p className="text-muted-foreground">
              Find answers, get AI assistance, or contact our support team
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, or ask a question..."
              className="pl-10 pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => {
                if (searchQuery.trim()) {
                  setActiveTab('docs');
                }
              }}
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setActiveTab('docs')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive guides and tutorials for all admin features
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setActiveTab('ai')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-green-600" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get instant help from our AI-powered assistant
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setActiveTab('support')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items为中心 gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Submit a ticket or contact our support team directly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="docs">Docs</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Articles */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Help Articles</CardTitle>
                  <CardDescription>
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Browse our comprehensive documentation'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No articles found. Try a different search term.
                    </div>
                  ) : (
                    filteredArticles.map(article => (
                      <div 
                        key={article.id} 
                        className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium flex items-center gap-2">
                              {expandedArticle === article.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Updated {new Date(article.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {expandedArticle === article.id && (
                          <div className="mt-4 pt-4 border-t">
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
                            />
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="mt-3 p-0 h-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(article.content);
                                toast('Content copied to clipboard');
                              }}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy Content
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/dashboard" className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
                    <span>Dashboard Overview</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link href="/admin/settings" className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
                    <span>System Settings</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link href="/admin/billing" className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
                    <span>Billing Setup</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link href="/admin/users" className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
                    <span>User Management</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredFAQs.slice(0, 3).map((faq, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-medium text-sm">{faq.question}</h4>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                  {filteredFAQs.length > 3 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => {
                        // In a real app, this would navigate to full FAQ page
                        toast('Full FAQ section coming soon!');
                      }}
                    >
                      View all FAQs
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Video Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded px-1">
                        2:15
                      </div>
                    </div>
                    <span className="text-sm">Getting Started Guide</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded px-1">
                        3:42
                      </div>
                    </div>
                    <span className="text-sm">Billing Setup Walkthrough</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded px-1">
                        1:58
                      </div>
                    </div>
                    <span className="text-sm">Maintenance Request Flow</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                AI Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about the admin system. I'll help you navigate and find what you need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Chat Interface */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="What do you need help with? (e.g., 'How do I set up billing?', 'Where can I find maintenance reports?')"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAIQuery();
                        }
                      }}
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button 
                    onClick={handleAIQuery}
                    disabled={isAiLoading || !aiQuery.trim()}
                    className="self-end"
                  >
                    {isAiLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {aiResponse && (
                  <div 
                    ref={aiResponseRef}
                    className="bg-muted/50 rounded-lg p-4 animate-in fade-in duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <Bot className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="whitespace-pre-wrap">{aiResponse}</p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setAiQuery('Can you show me the documentation for this?');
                              handleAIQuery();
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Show Documentation
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setAiQuery('How do I contact support about this?');
                              handleAIQuery();
                            }}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Tips */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Lightbulb className="h-5 w-5" />
                    AI Assistant Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-green-700 space-y-2 text-sm">
                    <li>• Ask specific questions like "How do I reset a tenant's password?"</li>
                    <li>• Request step-by-step guides: "Show me how to set up payment reminders"</li>
                    <li>• Ask for feature explanations: "What does the maintenance module do?"</li>
                    <li>• Request troubleshooting help: "Why can't I see the billing reports?"</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Support Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Submit a support ticket and our team will get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Please provide as much detail as possible..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map(priority => (
                      <Button
                        key={priority}
                        variant={supportForm.priority === priority ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSupportForm(prev => ({ ...prev, priority }))}
                        className={priority === 'high' ? 'border-red-500' : ''}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High priority: System downtime or critical issues
                  </p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleSupportSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Support Ticket
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Support Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@yourcompany.com</p>
                      <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9AM-5PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Knowledge Base</h4>
                      <p className="text-sm text-muted-foreground">24/7 access to documentation</p>
                      <p className="text-xs text-muted-foreground mt-1">Search our help center anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Login Problems</h4>
                      <p className="text-xs text-muted-foreground">Try resetting your password or clearing browser cache</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Payment Processing</h4>
                      <p className="text-xs text-muted-foreground">Check your payment gateway configuration in Settings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Feature Requests</h4>
                      <p className="text-xs text-muted-foreground">Submit feature requests through our feedback portal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Badge component for categories
function Badge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline"; 
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input"
  };
  
  return <span className={`${baseClasses} ${variantClasses[variant]}`}>{children}</span>;
}