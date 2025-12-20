'use client'
import * as React from "react";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building,
  ShieldCheck,
  User,
  Users,
  Key,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Upload,
  Settings,
  Database,
  BarChart3,
  Bell,
  Lock,
  Globe,
  CreditCard,
  FileText,
  Activity,
  Server,
  Wifi,
  Zap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

// Types
interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "super_admin" | "admin";
  avatar?: string;
  department?: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  systemPreferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
  };
}

interface SystemStats {
  totalUsers: number;
  activeTenants: number;
  pendingRequests: number;
  systemHealth: "healthy" | "warning" | "critical";
  uptime: string;
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
}

// Mock data
const initialProfile: AdminProfile = {
  id: "admin-001",
  name: "Sarah Chen",
  email: "sarah.chen@propertysystems.com",
  phone: "+1 (555) 987-6543",
  role: "super_admin",
  avatar: "https://placehold.co/400x400/2563eb/white?text=SC",
  department: "System Administration",
  permissions: ["manage_users", "manage_properties", "view_financials", "system_settings", "audit_logs"],
  twoFactorEnabled: true,
  notificationPreferences: {
    email: true,
    sms: false,
    push: true
  },
  systemPreferences: {
    theme: "system",
    language: "en-US",
    timezone: "America/New_York"
  }
};

const mockSystemStats: SystemStats = {
  totalUsers: 1247,
  activeTenants: 892,
  pendingRequests: 23,
  systemHealth: "healthy",
  uptime: "99.98%",
  storage: {
    used: 156,
    total: 500,
    percentage: 31.2
  }
};

const mockActivityLog = [
  { id: "1", action: "Updated tenant permissions", user: "John Davis", timestamp: "2 hours ago", ip: "192.168.1.105" },
  { id: "2", action: "Created new property listing", user: "Sarah Chen", timestamp: "4 hours ago", ip: "192.168.1.89" },
  { id: "3", action: "Deleted user account", user: "Admin Panel", timestamp: "1 day ago", ip: "192.168.1.1" },
  { id: "4", action: "Updated system settings", user: "Sarah Chen", timestamp: "2 days ago", ip: "192.168.1.89" },
  { id: "5", action: "Processed payment batch", user: "System", timestamp: "3 days ago", ip: "192.168.1.2" }
];

export function ProfileAdmin() {
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form handlers
  const handleInputChange = (field: keyof AdminProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof AdminProfile, child: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, string | boolean>),
        [child]: value
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfile(prev => ({ ...prev, avatar: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Admin profile updated:", profile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setConfirmPassword("");
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      super_admin: "destructive",
      admin: "default"
    };
    
    const labels: Record<string, string> = {
      super_admin: "Super Administrator",
      admin: "Administrator"
    };
    
    return <Badge variant={variants[role] || "outline"}>{labels[role] || role}</Badge>;
  };

  const getHealthColor = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Administrator Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your admin account and system settings
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Main Content */}
          <div>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="system">
                  <Settings className="h-4 w-4 mr-2" />
                  System
                </TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your administrator profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Administrator Role</Label>
                        <div className="flex items-center space-x-2">
                          {getRoleBadge(profile.role)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {profile.role === "super_admin" 
                              ? "Full system control with elevated privileges" 
                              : "Standard administrator access"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profile.department || ""}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          placeholder="Department name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="id">Admin ID</Label>
                        <Input
                          id="id"
                          value={profile.id}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      How others can reach you for administrative matters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@company.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Permissions */}
              <TabsContent value="permissions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>
                      Manage what this administrator can access and modify
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: "manage_users", label: "User Management", description: "Create, edit, and delete user accounts" },
                        { id: "manage_properties", label: "Property Management", description: "Manage property listings and details" },
                        { id: "view_financials", label: "Financial Access", description: "View payment records and financial reports" },
                        { id: "system_settings", label: "System Configuration", description: "Modify system-wide settings and preferences" },
                        { id: "audit_logs", label: "Audit Logs", description: "Access and export system activity logs" },
                        { id: "api_access", label: "API Access", description: "Generate and manage API keys for integrations" }
                      ].map(permission => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50">
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={profile.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.id]
                                  }));
                                } else {
                                  setProfile(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission.id)
                                  }));
                                }
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={permission.id} className="font-medium">{permission.label}</Label>
                            <p className="text-sm text-muted-foreground mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your authentication and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.twoFactorEnabled}
                          onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive system notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive important updates via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={profile.notificationPreferences.email}
                        onCheckedChange={(checked) => handleNestedChange("notificationPreferences", "email", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive urgent alerts via text message
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={profile.notificationPreferences.sms}
                        onCheckedChange={(checked) => handleNestedChange("notificationPreferences", "sms", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Browser and mobile app notifications
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={profile.notificationPreferences.push}
                        onCheckedChange={(checked) => handleNestedChange("notificationPreferences", "push", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System */}
              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                    <CardDescription>
                      Configure your system appearance and behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                          value={profile.systemPreferences.theme}
                          onValueChange={(value) => handleNestedChange("systemPreferences", "theme", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={profile.systemPreferences.language}
                          onValueChange={(value) => handleNestedChange("systemPreferences", "language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="es-ES">Spanish</SelectItem>
                            <SelectItem value="fr-FR">French</SelectItem>
                            <SelectItem value="de-DE">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={profile.systemPreferences.timezone}
                        onValueChange={(value) => handleNestedChange("systemPreferences", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (US)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (US)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload your administrator photo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Current system status and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Health</span>
                  <span className={`font-medium ${getHealthColor(mockSystemStats.systemHealth)}`}>
                    {mockSystemStats.systemHealth.charAt(0).toUpperCase() + mockSystemStats.systemHealth.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-medium">{mockSystemStats.uptime}</span>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage Usage</span>
                    <span>{mockSystemStats.storage.used}GB / {mockSystemStats.storage.total}GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${mockSystemStats.storage.percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-accent/30 rounded-lg">
                    <p className="text-2xl font-bold">{mockSystemStats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                  <div className="text-center p-3 bg-accent/30 rounded-lg">
                    <p className="text-2xl font-bold">{mockSystemStats.activeTenants}</p>
                    <p className="text-xs text-muted-foreground">Active Tenants</p>
                  </div>
                  <div className="text-center p-3 bg-accent/30 rounded-lg">
                    <p className="text-2xl font-bold">{mockSystemStats.pendingRequests}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent administrative actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockActivityLog.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-accent/50 rounded">
                      <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-xs mt-2">
                  View Full Activity Log
                </Button>
              </CardContent>
            </Card>

            {/* API Access */}
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Manage your API keys and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/30 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">Primary API Key</p>
                        <p className="text-xs text-muted-foreground">Full access • Created 3 months ago</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
