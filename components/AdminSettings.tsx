// app/components/AdminSettings.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Bell, 
  Database, 
  Users, 
  Globe, 
  Lock, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

// TypeScript interfaces
interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  maxUploadSize: number;
  sessionTimeout: number;
  enable2FA: boolean;
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireSpecialChar: boolean;
    requireNumber: boolean;
    expiryDays: number;
  };
  ipWhitelist: string[];
  failedLoginAttempts: number;
  lockoutDuration: number;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  adminEmail: string;
  alertThreshold: number;
}

interface ApiSettings {
  apiKey: string;
  apiSecret: string;
  rateLimit: number;
  endpointUrl: string;
}

export default function AdminSettings() {
  // System Settings
  const [system, setSystem] = useState<SystemSettings>({
    siteName: "TenantPortal Pro",
    maintenanceMode: false,
    maxUploadSize: 10,
    sessionTimeout: 30,
    enable2FA: true
  });

  // Security Settings
  const [security, setSecurity] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      expiryDays: 90
    },
    ipWhitelist: ["192.168.1.0/24", "10.0.0.5"],
    failedLoginAttempts: 5,
    lockoutDuration: 15
  });

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    smsAlerts: false,
    adminEmail: "admin@tenantportal.com",
    alertThreshold: 80
  });

  // API Settings
  const [api, setApi] = useState<ApiSettings>({
    apiKey: "ak_live_********",
    apiSecret: "as_secret_********",
    rateLimit: 100,
    endpointUrl: "https://api.tenantportal.com/v1"
  });

  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle input changes
  const handleSystemChange = (field: keyof SystemSettings, value: any) => {
    setSystem(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordPolicyChange = (field: keyof SecuritySettings['passwordPolicy'], value: any) => {
    setSecurity(prev => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [field]: value }
    }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: any) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleApiChange = (field: keyof ApiSettings, value: any) => {
    setApi(prev => ({ ...prev, [field]: value }));
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Settings saved successfully!", {
        description: "All configuration changes have been applied."
      });
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "Please check your connection and try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSystem({
        siteName: "TenantPortal Pro",
        maintenanceMode: false,
        maxUploadSize: 10,
        sessionTimeout: 30,
        enable2FA: true
      });
      setSecurity({
        passwordPolicy: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumber: true,
          expiryDays: 90
        },
        ipWhitelist: ["192.168.1.0/24", "10.0.0.5"],
        failedLoginAttempts: 5,
        lockoutDuration: 15
      });
      setNotifications({
        emailAlerts: true,
        smsAlerts: false,
        adminEmail: "admin@tenantportal.com",
        alertThreshold: 80
      });
      setApi({
        apiKey: "ak_live_********",
        apiSecret: "as_secret_********",
        rateLimit: 100,
        endpointUrl: "https://api.tenantportal.com/v1"
      });
      toast("Settings reset to defaults");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-blue-600" />
          Admin Settings
        </h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and security policies
        </p>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General System Settings</CardTitle>
              <CardDescription>
                Configure core application behavior and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={system.siteName}
                    onChange={(e) => handleSystemChange('siteName', e.target.value)}
                    placeholder="TenantPortal Pro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUpload">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUpload"
                    type="number"
                    min="1"
                    max="100"
                    value={system.maxUploadSize}
                    onChange={(e) => handleSystemChange('maxUploadSize', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="120"
                    value={system.sessionTimeout}
                    onChange={(e) => handleSystemChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to restrict access during system updates
                  </p>
                </div>
                <Switch
                  checked={system.maintenanceMode}
                  onCheckedChange={(checked) => handleSystemChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch
                  checked={system.enable2FA}
                  onCheckedChange={(checked) => handleSystemChange('enable2FA', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Configure password requirements and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      min="6"
                      max="20"
                      value={security.passwordPolicy.minLength}
                      onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryDays">Expiry Days</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      min="30"
                      max="365"
                      value={security.passwordPolicy.expiryDays}
                      onChange={(e) => handlePasswordPolicyChange('expiryDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">
                      Passwords must include !@#$%^&*
                    </p>
                  </div>
                  <Switch
                    checked={security.passwordPolicy.requireSpecialChar}
                    onCheckedChange={(checked) => handlePasswordPolicyChange('requireSpecialChar', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Passwords must include at least one number
                    </p>
                  </div>
                  <Switch
                    checked={security.passwordPolicy.requireNumber}
                    onCheckedChange={(checked) => handlePasswordPolicyChange('requireNumber', checked)}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="failedAttempts">Failed Login Attempts</Label>
                    <Input
                      id="failedAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={security.failedLoginAttempts}
                      onChange={(e) => handleSecurityChange('failedLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={security.lockoutDuration}
                      onChange={(e) => handleSecurityChange('lockoutDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>IP Whitelist (one per line)</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={security.ipWhitelist.join('\n')}
                    onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                    placeholder="192.168.1.0/24&#10;10.0.0.5&#10;203.0.113.0/24"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Only allow access from these IP addresses/ranges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send critical alerts to admin email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send urgent notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email Address</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={notifications.adminEmail}
                  onChange={(e) => handleNotificationChange('adminEmail', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="alertThreshold"
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={notifications.alertThreshold}
                    onChange={(e) => handleNotificationChange('alertThreshold', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">
                    {notifications.alertThreshold}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trigger alerts when system resource usage exceeds this threshold
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage integration settings and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      readOnly
                      value={api.apiKey}
                      className="pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => navigator.clipboard.writeText(api.apiKey)}
                      title="Copy to clipboard"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret</Label>
                  <div className="relative">
                    <Input
                      id="apiSecret"
                      type={showSecret ? "text" : "password"}
                      readOnly
                      value={api.apiSecret}
                      className="pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowSecret(!showSecret)}
                      title={showSecret ? "Hide secret" : "Show secret"}
                    >
                      {showSecret ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpointUrl">API Endpoint URL</Label>
                <Input
                  id="endpointUrl"
                  value={api.endpointUrl}
                  onChange={(e) => handleApiChange('endpointUrl', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  min="10"
                  max="1000"
                  value={api.rateLimit}
                  onChange={(e) => handleApiChange('rateLimit', parseInt(e.target.value))}
                />
              </div>
              
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      API credentials provide full system access. Never share these with third parties.
                      Rotate keys regularly for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isSaving}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Copy icon component
function CopyIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2" />
    </svg>
  );
}