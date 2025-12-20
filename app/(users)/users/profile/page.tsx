// components/tenant-profile.tsx (Fixed Version)
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Globe,
  Lock,
  Camera,
  Save,
  Edit,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  EyeOff,
  CreditCard,
  FileText,
  Home,
  Users,
  AlertCircle,
  Check,
  Building,
  Key,
  ShieldCheck,
  Smartphone,
  Wifi,
  Printer,
  Download
} from 'lucide-react';

// Form schemas and mock data remain the same...

export default function TenantProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(mockTenantData.avatar);

  // Form setup remains the same...
  const passwordForm = useForm({
    resolver: zodResolver(z.object({
      currentPassword: z.string().min(8, "Password must be at least 8 characters"),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })),
  });

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileContent();
      case 'security':
        return renderSecurityContent();
      case 'preferences':
        return renderPreferencesContent();
      case 'documents':
        return renderDocumentsContent();
      default:
        return renderProfileContent();
    }
  };

  // Profile Content
  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
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
                  control={profileForm.control}
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      );
    } else {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <p className="text-lg font-medium">{mockTenantData.firstName} {mockTenantData.lastName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <p className="text-lg font-medium">{mockTenantData.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <p className="text-lg font-medium">{mockTenantData.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <p className="text-lg font-medium whitespace-pre-line">{mockTenantData.address}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Move-in Date</Label>
                <p className="text-lg font-medium">{formatDate(mockTenantData.moveInDate)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Lease End Date</Label>
                <p className="text-lg font-medium">{formatDate(mockTenantData.leaseEndDate)}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{mockTenantData.emergencyContact.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p className="font-medium">{mockTenantData.emergencyContact.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Relationship</Label>
                  <p className="font-medium">{mockTenantData.emergencyContact.relationship}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </>
      );
    }
  };

  // Security Content
  const renderSecurityContent = () => {
    const handlePasswordSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        try {
            // In a real application, send this to your backend API
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (response.ok) {
                // Reset form and show success message
                passwordForm.reset();
                // You could add a toast notification here
                console.log('Password updated successfully');
            } else {
                const error = await response.json();
                passwordForm.setError('currentPassword', { message: error.message || 'Failed to update password' });
            }
        } catch (error) {
            console.error('Password update error:', error);
            passwordForm.setError('currentPassword', { message: 'An error occurred while updating password' });
        }
    };
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </h3>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters with uppercase, number, and special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Two-Factor Authentication
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Use Google Authenticator or similar
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via email
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Active Sessions
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chrome • Windows 10</p>
                    <p className="text-sm text-muted-foreground">
                      New York, USA • Current Session
                    </p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Safari • iPhone 14</p>
                    <p className="text-sm text-muted-foreground">
                      Los Angeles, USA • 2 hours ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Sign Out</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Preferences Content
  const renderPreferencesContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </h3>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in browser
                  </p>
                </div>
                <Switch defaultChecked={mockTenantData.preferences.notifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch defaultChecked={mockTenantData.preferences.emailUpdates} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent alerts via SMS
                  </p>
                </div>
                <Switch defaultChecked={mockTenantData.preferences.smsAlerts} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Language</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue={mockTenantData.preferences.language}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timezone</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue={mockTenantData.preferences.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    );
  };

  // Documents Content
  const renderDocumentsContent = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Documents
          </h3>
          <p className="text-muted-foreground">
            View and manage your uploaded documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTenantData.documents.map((doc, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-100 rounded-lg w-fit">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="font-medium">{doc}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {formatDate(mockTenantData.moveInDate)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-semibold mb-2">Upload New Document</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upload lease agreements, ID proofs, or other documents
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Document Guidelines</p>
              <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                <li>Accepted formats: PDF, JPG, PNG, DOC</li>
                <li>Maximum file size: 10MB per document</li>
                <li>Ensure documents are clear and readable</li>
                <li>Keep sensitive information secure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

    const handleExportData = () => {
        const dataToExport = {
            profile: {
                firstName: mockTenantData.firstName,
                lastName: mockTenantData.lastName,
                email: mockTenantData.email,
                phone: mockTenantData.phone,
                address: mockTenantData.address,
                moveInDate: mockTenantData.moveInDate,
                leaseEndDate: mockTenantData.leaseEndDate,
                property: mockTenantData.property,
                unit: mockTenantData.unit,
            },
            emergencyContact: mockTenantData.emergencyContact,
            preferences: mockTenantData.preferences,
            exportDate: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tenant-profile-${mockTenantData.firstName}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setIsUploading(false);
            };
            setIsUploading(true);
            reader.readAsDataURL(file);
        }
    }
  // Main render function
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={avatarPreview} alt={mockTenantData.firstName} />
                    <AvatarFallback className="text-2xl">
                      {mockTenantData.firstName[0]}{mockTenantData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 cursor-pointer">
                    <div className="p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                {isUploading && (
                  <div className="text-sm text-muted-foreground animate-pulse">
                    Uploading...
                  </div>
                )}
                
                <h2 className="text-xl font-bold">{mockTenantData.firstName} {mockTenantData.lastName}</h2>
                <p className="text-sm text-muted-foreground">{mockTenantData.email}</p>
                
                <Badge className="mt-2 bg-green-500/20 text-green-700 hover:bg-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {mockTenantData.status.toUpperCase()}
                </Badge>
              </div>

              <Separator className="my-4" />

              {/* Profile Completion */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span>{mockTenantData.profileCompletion}%</span>
                </div>
                <Progress value={mockTenantData.profileCompletion} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Complete your profile for better experience
                </p>
              </div>

              <Separator className="my-4" />

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Property
                  </span>
                  <span className="text-sm font-medium">{mockTenantData.property}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Unit
                  </span>
                  <span className="text-sm font-medium">{mockTenantData.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Lease End
                  </span>
                  <span className="text-sm font-medium">{formatDate(mockTenantData.leaseEndDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Data Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Profile Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="border-b pb-3">
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Mock data (add this after the component)
const mockTenantData = {
  id: 'TEN-001',
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  address: '123 Main St, Apt 302\nNew York, NY 10001',
  moveInDate: '2023-01-15',
  leaseEndDate: '2024-12-31',
  status: 'active',
  property: 'Sunset Apartments',
  unit: 'Unit 302',
  rentAmount: 1200,
  securityDeposit: 1200,
  emergencyContact: {
    name: 'Sarah Johnson',
    phone: '+1 (555) 987-6543',
    relationship: 'Spouse',
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsAlerts: false,
    language: 'English',
    timezone: 'America/New_York',
  },
  profileCompletion: 85,
  documents: ['Lease Agreement', 'ID Proof', 'Income Statement'],
};

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
];