// components/tenant-management.tsx
'use client';

import { toast } from "sonner";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Home,
  Calendar,
  DollarSign,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Upload,
  Filter,
  Search,
  User,
  Lock,
  Building,
  FileText
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Form validation schema
const tenantSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits"),
  unitNumber: z.string()
    .min(1, "Unit number is required"),
  monthlyRent: z.string()
    .min(1, "Monthly rent amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  leaseStartDate: z.string()
    .min(1, "Lease start date is required"),
  leaseEndDate: z.string()
    .min(1, "Lease end date is required"),
  securityDeposit: z.string()
    .min(1, "Security deposit amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }),
  notes: z.string().optional(),
  generatePassword: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(true),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

// Mock data for tenants
const initialTenants = [
  {
    id: 'T001',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    unitNumber: '302',
    monthlyRent: 1200,
    securityDeposit: 1200,
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2024-12-31',
    rentStatus: 'paid',
    paymentDueDate: '2024-02-01',
    lastPaymentDate: '2024-01-25',
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse',
    },
    status: 'active',
    createdAt: '2024-01-01',
    notes: 'Always pays on time',
  },
  {
    id: 'T002',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 (555) 234-5678',
    unitNumber: '201',
    monthlyRent: 1100,
    securityDeposit: 1100,
    leaseStartDate: '2023-11-15',
    leaseEndDate: '2024-11-14',
    rentStatus: 'pending',
    paymentDueDate: '2024-02-01',
    lastPaymentDate: '2024-01-02',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+1 (555) 876-5432',
      relationship: 'Brother',
    },
    status: 'active',
    createdAt: '2023-11-15',
    notes: 'Needs reminder for payments',
  },
  {
    id: 'T003',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 345-6789',
    unitNumber: '105',
    monthlyRent: 950,
    securityDeposit: 950,
    leaseStartDate: '2024-01-15',
    leaseEndDate: '2024-12-14',
    rentStatus: 'overdue',
    paymentDueDate: '2024-01-15',
    lastPaymentDate: '2023-12-15',
    emergencyContact: {
      name: 'Emily Wilson',
      phone: '+1 (555) 765-4321',
      relationship: 'Sister',
    },
    status: 'active',
    createdAt: '2024-01-15',
    notes: 'Late payment - follow up required',
  },
  {
    id: 'T004',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 456-7890',
    unitNumber: '401',
    monthlyRent: 1350,
    securityDeposit: 1350,
    leaseStartDate: '2023-10-01',
    leaseEndDate: '2024-09-30',
    rentStatus: 'paid',
    paymentDueDate: '2024-02-01',
    lastPaymentDate: '2024-01-28',
    emergencyContact: {
      name: 'Michael Chen',
      phone: '+1 (555) 654-3210',
      relationship: 'Father',
    },
    status: 'active',
    createdAt: '2023-10-01',
    notes: 'Excellent tenant',
  },
];

export default function TenantManagement() {
  const [tenants, setTenants] = useState(initialTenants);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Filter tenants based on search and tab
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? tenant.status === 'active' :
      activeTab === 'inactive' ? tenant.status === 'inactive' :
      tenant.rentStatus === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      unitNumber: '',
      monthlyRent: '',
      securityDeposit: '',
      leaseStartDate: '',
      leaseEndDate: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      notes: '',
      generatePassword: true,
      sendWelcomeEmail: true,
    },
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    return password;
  };

  const onSubmit = async (data: TenantFormValues) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTenant = {
      id: `T${String(tenants.length + 1).padStart(3, '0')}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      unitNumber: data.unitNumber,
      monthlyRent: parseFloat(data.monthlyRent),
      securityDeposit: parseFloat(data.securityDeposit),
      leaseStartDate: data.leaseStartDate,
      leaseEndDate: data.leaseEndDate,
      rentStatus: 'pending',
      paymentDueDate: new Date().toISOString().split('T')[0],
      lastPaymentDate: '',
      emergencyContact: data.emergencyContact,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      notes: data.notes || '',
    };

    setTenants([...tenants, newTenant]);
    setIsLoading(false);
    setIsAddDialogOpen(false);
    form.reset();
    
    // Show success message
    toast.success(`Tenant ${data.firstName} ${data.lastName} added successfully!`);

  };

  const handleEditSubmit = async (data: TenantFormValues) => {
    if (!editingTenant) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedTenants = tenants.map(tenant => {
      if (tenant.id === editingTenant.id) {
        return {
          ...tenant,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          unitNumber: data.unitNumber,
          monthlyRent: parseFloat(data.monthlyRent),
          securityDeposit: parseFloat(data.securityDeposit),
          leaseStartDate: data.leaseStartDate,
          leaseEndDate: data.leaseEndDate,
          emergencyContact: data.emergencyContact,
          notes: data.notes || '',
        };
      }
      return tenant;
    });

    setTenants(updatedTenants);
    setIsLoading(false);
    setIsEditDialogOpen(false);
    setEditingTenant(null);
    
    alert(`Tenant ${data.firstName} ${data.lastName} updated successfully!`);
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== tenantId));
    alert('Tenant deleted successfully!');
  };

  const handleTerminateTenant = (tenantId: string) => {
    const updatedTenants = tenants.map(tenant => {
      if (tenant.id === tenantId) {
        return { ...tenant, status: 'inactive' };
      }
      return tenant;
    });
    setTenants(updatedTenants);
    alert('Tenant terminated successfully!');
  };

  const handleReactivateTenant = (tenantId: string) => {
    const updatedTenants = tenants.map(tenant => {
      if (tenant.id === tenantId) {
        return { ...tenant, status: 'active' };
      }
      return tenant;
    });
    setTenants(updatedTenants);
    alert('Tenant reactivated successfully!');
  };

  const openEditDialog = (tenant: any) => {
    setEditingTenant(tenant);
    form.reset({
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      unitNumber: tenant.unitNumber,
      monthlyRent: tenant.monthlyRent.toString(),
      securityDeposit: tenant.securityDeposit.toString(),
      leaseStartDate: tenant.leaseStartDate,
      leaseEndDate: tenant.leaseEndDate,
      emergencyContact: tenant.emergencyContact,
      notes: tenant.notes,
      generatePassword: false,
      sendWelcomeEmail: false,
    });
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleExportTenants = () => {
    const dataStr = JSON.stringify(tenants, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `tenants-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportTenants = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTenants = JSON.parse(e.target?.result as string);
          setTenants([...tenants, ...importedTenants]);
          alert(`${importedTenants.length} tenants imported successfully!`);
        } catch (error) {
          alert('Error importing tenants. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    paid: tenants.filter(t => t.rentStatus === 'paid').length,
    pending: tenants.filter(t => t.rentStatus === 'pending').length,
    overdue: tenants.filter(t => t.rentStatus === 'overdue').length,
    totalRent: tenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0),
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage all tenants, add new ones, and track rent payments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportTenants}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <input
            type="file"
            id="import-tenants"
            accept=".json"
            className="hidden"
            onChange={handleImportTenants}
          />
          <Button variant="outline" asChild>
            <label htmlFor="import-tenants" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </label>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New Tenant
                </DialogTitle>
                <DialogDescription>
                  Enter tenant details to create a new account
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="lease">Lease Details</TabsTrigger>
                      <TabsTrigger value="settings">Account Settings</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="email" placeholder="john.doe@example.com" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="unitNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Number *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="e.g., 302, A101" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Emergency Contact (Optional)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="emergencyContact.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyContact.phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="emergencyContact.relationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input placeholder="Relationship" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lease" className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="monthlyRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Rent *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="1200.00" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="securityDeposit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Security Deposit *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="1200.00" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="leaseStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lease Start Date *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="date" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="leaseEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lease End Date *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="date" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Additional notes about the tenant..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="settings" className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Account Setup
                        </h4>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">Password Generation</p>
                              <p className="text-sm text-blue-700">
                                A secure password will be generated and sent to the tenant via email
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="generate-password"
                              checked={true}
                              readOnly
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="generate-password" className="text-sm">
                              Generate secure password for tenant
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="send-welcome"
                              checked={true}
                              readOnly
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="send-welcome" className="text-sm">
                              Send welcome email with login instructions
                            </Label>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-yellow-800">Important Note</p>
                              <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                                <li>Tenant will receive login credentials via email</li>
                                <li>Password should be changed on first login</li>
                                <li>You can reset the password anytime from the tenant's profile</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Adding Tenant...
                        </>
                      ) : (
                        'Add Tenant'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tenants</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rent Collected</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Rent</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRent)}</p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tenants by name, email, or unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant List</CardTitle>
          <CardDescription>
            Showing {filteredTenants.length} of {tenants.length} tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Lease</TableHead>
                  <TableHead>Rent Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tenant.firstName} {tenant.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">ID: {tenant.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{tenant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{tenant.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Unit {tenant.unitNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(tenant.monthlyRent)}/month
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {formatDate(tenant.leaseStartDate)} - {formatDate(tenant.leaseEndDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due: {formatDate(tenant.paymentDueDate)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getRentStatusBadge(tenant.rentStatus)}
                          <p className="text-xs text-muted-foreground">
                            Last paid: {tenant.lastPaymentDate ? formatDate(tenant.lastPaymentDate) : 'Never'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tenant.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(tenant)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Tenant
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {tenant.status === 'active' ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Terminate Tenant
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Terminate Tenant Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will deactivate {tenant.firstName} {tenant.lastName}'s account.
                                      They will no longer be able to access the tenant portal.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleTerminateTenant(tenant.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Terminate Account
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <DropdownMenuItem onClick={() => handleReactivateTenant(tenant.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Reactivate Account
                              </DropdownMenuItem>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Permanently
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    {tenant.firstName} {tenant.lastName}'s account and all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTenant(tenant.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Permanently
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No tenants found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ? 'Try a different search term' : 'Start by adding your first tenant'}
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New Tenant
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Tenant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Tenant: {editingTenant?.firstName} {editingTenant?.lastName}
            </DialogTitle>
            <DialogDescription>
              Update tenant information and lease details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="lease">Lease Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="email" placeholder="john.doe@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="unitNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Number *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., 302, A101" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="lease" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="monthlyRent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rent *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="1200.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="securityDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="1200.00" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="leaseStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Start Date *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="leaseEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease End Date *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-6 pt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes about the tenant..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add any relevant notes about this tenant for your reference
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}