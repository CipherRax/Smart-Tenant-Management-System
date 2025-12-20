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
  Upload
} from "lucide-react";

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "tenant";
  avatar?: string;
  address?: string;
  unitNumber?: string;
  building?: string;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Mock data - replace with your actual data fetching
const initialProfile: UserProfile = {
  id: "user-123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  role: "tenant",
  avatar: "https://placehold.co/400x400",
  address: "123 Main Street",
  unitNumber: "Apt 4B",
  building: "Oakwood Residences",
  leaseStartDate: new Date(2023, 5, 1),
  leaseEndDate: new Date(2024, 4, 31),
  emergencyContact: {
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    relationship: "Spouse"
  }
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form handlers
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field: keyof UserProfile['emergencyContact'], value: string) => {
    setProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to your server and get a URL
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the profile data to your backend
      console.log("Profile updated:", profile);
      
      // Show success feedback
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

  // Helper functions
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      admin: "default",
      manager: "secondary",
      tenant: "outline"
    };
    
    const labels: Record<string, string> = {
      admin: "Administrator",
      manager: "Property Manager",
      tenant: "Tenant"
    };
    
    return <Badge variant={variants[role] || "outline"}>{labels[role] || role}</Badge>;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Profile Header */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information and preferences
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

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr,300px]">
          {/* Main Content */}
          <div>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Details
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Key className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your basic personal details
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
                        <Label htmlFor="role">Account Role</Label>
                        <div className="flex items-center space-x-2">
                          {getRoleBadge(profile.role)}
                          <span className="text-sm text-muted-foreground ml-2">
                            {profile.role === "admin" 
                              ? "Full system access" 
                              : profile.role === "manager" 
                                ? "Property management access" 
                                : "Tenant access"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Street address"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="building">Building</Label>
                        <Input
                          id="building"
                          value={profile.building || ""}
                          onChange={(e) => handleInputChange("building", e.target.value)}
                          placeholder="Building name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit Number</Label>
                        <Input
                          id="unit"
                          value={profile.unitNumber || ""}
                          onChange={(e) => handleInputChange("unitNumber", e.target.value)}
                          placeholder="Apartment/unit number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Lease Period</Label>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(profile.leaseStartDate)} - {formatDate(profile.leaseEndDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                    <CardDescription>
                      Information for emergency situations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-name">Contact Name</Label>
                        <Input
                          id="emergency-name"
                          value={profile.emergencyContact?.name || ""}
                          onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergency-relation">Relationship</Label>
                        <Input
                          id="emergency-relation"
                          value={profile.emergencyContact?.relationship || ""}
                          onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                          placeholder="Relationship to you"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone">Phone Number</Label>
                        <Input
                          id="emergency-phone"
                          value={profile.emergencyContact?.phone || ""}
                          onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Details */}
              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Manage how others can reach you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none border-l-0">
                          Verify
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Well send important notifications to this email
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        This will be visible to property management
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {profile.address}, {profile.unitNumber}, {profile.building}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive important updates via email
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">On</span>
                        <div className="w-10 h-5 bg-primary rounded-full relative">
                          <div className="w-4 h-4 bg-background rounded-full absolute top-0.5 left-0.5"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a photo to represent your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.charAt(0)}
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
                  <p className="text-xs text-muted-foreground text-center">
                    JPG, GIF or PNG. Max 2MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">Account holder</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{profile.building}</p>
                    <p className="text-xs text-muted-foreground">Building</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{profile.unitNumber}</p>
                    <p className="text-xs text-muted-foreground">Unit</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-mono text-sm">{profile.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Actions that cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Permanently delete your account and all data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Profile;