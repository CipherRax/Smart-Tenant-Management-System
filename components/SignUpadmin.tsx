// components/landlord-registration.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Users,
  Home,
  Globe,
  CreditCard,
  FileText,
  MapPin,
  Briefcase
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from "sonner";
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LandlordRegistration() {
  const router = useRouter();
  const supabase = createClient();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState<'landlord' | 'property_manager' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    userType: 'landlord' as 'landlord' | 'property_manager',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyWebsite: '',
    propertiesCount: '1' as '1' | '2-5' | '6-10' | '11-20' | '21+',
    acceptTerms: false,
    marketingEmails: false,
  });

  const steps = [
    { number: 1, title: 'Account Type', description: 'Select your role' },
    { number: 2, title: 'Personal Info', description: 'Enter your details' },
    { number: 3, title: 'Business Info', description: 'Company details' },
    { number: 4, title: 'Security', description: 'Set password' },
  ];

  const handleUserTypeSelect = (type: 'landlord' | 'property_manager') => {
    setSelectedUserType(type);
    setFormData(prev => ({ ...prev, userType: type }));
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Simple validation for current step
    let isValid = true;
    
    switch (currentStep) {
      case 1:
        isValid = !!selectedUserType;
        break;
      case 2:
        isValid = !!formData.firstName && 
                  !!formData.lastName && 
                  !!formData.email && 
                  !!formData.phone;
        break;
      case 3:
        // No validation needed for step 3
        break;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Basic validation
  if (!formData.acceptTerms) {
    toast.error("You must accept the terms and conditions");
    return;
  }
  
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }
  
  if (formData.password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  setIsSubmitting(true);
  setError(null);
  setSuccess(null);

  try {
    console.log('Starting registration for:', formData.email);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          user_type: formData.userType,
          role: formData.userType === 'property_manager' ? 'manager' : 'landlord',
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    console.log('Auth user created:', authData.user.id);
    console.log('User metadata:', authData.user.user_metadata);

    // Wait a moment for auth to propagate
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Try to insert admin profile with error handling
    try {
      const adminData = {
        id: authData.user.id,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone_number: formData.phone,
        role: formData.userType === 'property_manager' ? 'manager' : 'landlord',
        is_active: true,
        user_type: formData.userType,
        properties_count: formData.propertiesCount,
        company_name: formData.companyName || null,
        company_website: formData.companyWebsite || null,
        created_at: new Date().toISOString(),
        permissions: {
          can_create_users: true,
          can_delete_users: false, // Start with false for new users
          can_manage_properties: true,
          can_view_reports: true,
          can_manage_finances: true,
        },
      };

      console.log('Inserting admin data:', adminData);

      const { data: adminResult, error: dbError } = await supabase
        .from('admin')
        .insert(adminData)
        .select()
        .single();

      if (dbError) {
        // If the error is about RLS or permissions, try without permissions field first
        if (dbError.message.includes('permission') || dbError.message.includes('policy')) {
          console.log('Retrying without permissions field...');
          
          const simplifiedAdminData = {
            id: authData.user.id,
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone_number: formData.phone,
            role: formData.userType === 'property_manager' ? 'manager' : 'landlord',
            is_active: true,
            user_type: formData.userType,
            created_at: new Date().toISOString(),
          };

          const { error: retryError } = await supabase
            .from('admin')
            .insert(simplifiedAdminData);

          if (retryError) {
            console.error('Retry failed:', retryError);
            // Don't throw here - the user was created successfully in auth
            // Just log the error and continue
          }
        } else {
          throw dbError;
        }
      } else {
        console.log('Admin profile created:', adminResult);
      }
    } catch (profileError: any) {
      console.warn('Admin profile creation warning:', profileError.message);
      // Don't block registration if profile creation fails
      // The user can always complete their profile later
    }

    // Show success
    // In your registration handleSubmit function, replace the success section:
setSuccess('Registration successful!');

// Store email in localStorage
localStorage.setItem('adminRegistrationData', JSON.stringify({
  email: formData.email,
  firstName: formData.firstName,
  lastName: formData.lastName,
  userType: formData.userType,
  timestamp: new Date().toISOString(),
}));

// DO NOT redirect immediately - let user see the success message
// The user will manually click "Go to Verify" or be redirected by email
    
    toast.success(
      authData.session 
        ? "Registration successful! Redirecting to dashboard..."
        : "Registration successful! Please check your email to verify your account.",
      {
        duration: 5000,
      }
    );

    // Redirect
    setTimeout(() => {
      if (authData.session) {
        router.push('/Dashboard');
      } else {
        router.push('/verify');
      }
    }, 2000);

  } catch (error: any) {
    console.error('Registration error:', error);
    
    let userMessage = error.message;
    
    // User-friendly error messages
    if (error.message.includes('User already registered')) {
      userMessage = 'This email is already registered. Please try logging in or use a different email.';
    } else if (error.message.includes('password')) {
      userMessage = 'Password error. Please ensure your password is at least 8 characters long.';
    } else if (error.message.includes('email')) {
      userMessage = 'Invalid email format. Please enter a valid email address.';
    } else if (error.message.includes('policy') || error.message.includes('RLS')) {
      userMessage = 'Registration completed! Some profile features may need setup later.';
      // This is not a critical error - the user was created
      setSuccess('Account created successfully!');
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setError(userMessage);
    
    toast.error("Registration issue", {
      description: userMessage,
      duration: 5000,
    });

  } finally {
    setIsSubmitting(false);
  }
};

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Select Your Role</h3>
              <p className="text-muted-foreground">
                Choose the option that best describes you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Landlord Card */}
              <Card 
                className={`cursor-pointer transition-all border-2 hover:border-primary hover:shadow-lg ${
                  selectedUserType === 'landlord' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
                onClick={() => handleUserTypeSelect('landlord')}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${
                      selectedUserType === 'landlord' ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <Home className={`h-8 w-8 ${
                        selectedUserType === 'landlord' ? 'text-primary' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Landlord / Property Owner</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        I own one or more rental properties
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Manage your own properties</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Collect rent online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Handle maintenance requests</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Manager Card */}
              <Card 
                className={`cursor-pointer transition-all border-2 hover:border-primary hover:shadow-lg ${
                  selectedUserType === 'property_manager' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
                onClick={() => handleUserTypeSelect('property_manager')}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${
                      selectedUserType === 'property_manager' ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <Briefcase className={`h-8 w-8 ${
                        selectedUserType === 'property_manager' ? 'text-primary' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Property Manager</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        I manage properties for multiple owners
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Manage multiple properties</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Multi-owner support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Advanced reporting</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground">
                Enter your personal details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="firstName"
                    placeholder="John" 
                    className="pl-10" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="lastName"
                    placeholder="Doe" 
                    className="pl-10" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="john.doe@example.com" 
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                We'll send verification and important updates to this email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone"
                  placeholder="1234567890" 
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Used for urgent notifications and account recovery
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Business Information</h3>
              <p className="text-muted-foreground">
                Tell us about your {formData.userType === 'landlord' ? 'properties' : 'management business'}
              </p>
            </div>

            {formData.userType === 'property_manager' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="companyName"
                      placeholder="Your Property Management Company" 
                      className="pl-10"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="companyWebsite"
                      placeholder="https://yourcompany.com" 
                      className="pl-10"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="propertiesCount">
                How many properties do you {formData.userType === 'landlord' ? 'own' : 'currently manage'}?
              </Label>
              <Select 
                value={formData.propertiesCount}
                onValueChange={(value: any) => handleInputChange('propertiesCount', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 property</SelectItem>
                  <SelectItem value="2-5">2-5 properties</SelectItem>
                  <SelectItem value="6-10">6-10 properties</SelectItem>
                  <SelectItem value="11-20">11-20 properties</SelectItem>
                  <SelectItem value="21+">21+ properties</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This helps us customize your experience
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Professional Features</p>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                    <li>Add properties after registration</li>
                    <li>Invite team members to your account</li>
                    <li>Access advanced reporting tools</li>
                    <li>24/7 priority support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Account Security</h3>
              <p className="text-muted-foreground">
                Set a password to protect your account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  disabled={isSubmitting}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="acceptTerms">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketingEmails"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                  disabled={isSubmitting}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="marketingEmails">
                    Send me product updates, tips, and offers via email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You can unsubscribe at any time
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Security Tips</p>
                  <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                    <li>Use a unique password not used elsewhere</li>
                    <li>Enable two-factor authentication after registration</li>
                    <li>Never share your password with anyone</li>
                    <li>Log out from shared devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Building className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Register as Landlord/Manager
              </h1>
              <p className="text-sm text-muted-foreground">Create your professional account</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  stepItem.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                    stepItem.number <= currentStep ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                  }`}>
                    {stepItem.number}
                  </div>
                  <span className="text-sm mt-2 hidden md:block">{stepItem.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 ${
                    stepItem.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                {currentStep === 1 && 'Select Account Type'}
                {currentStep === 2 && 'Personal Information'}
                {currentStep === 3 && 'Business Details'}
                {currentStep === 4 && 'Account Security'}
              </CardTitle>
              <CardDescription className="text-center">
                {currentStep === 1 && 'Choose the role that fits you best'}
                {currentStep === 2 && 'Enter your personal details to continue'}
                {currentStep === 3 && 'Tell us about your properties or business'}
                {currentStep === 4 && 'Set up a password for your account'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {getStepContent()}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={(!selectedUserType && currentStep === 1) || isSubmitting}
                  >
                    Next: {steps[currentStep].title}
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                )}
              </div>

              {currentStep === 4 && (
                <div className="text-center w-full pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    By completing registration, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              )}

              <Separator />

              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </form>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Online Rent Collection</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Accept rent payments online with automated reminders and receipts
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Digital Documentation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Store leases, contracts, and important documents securely in the cloud
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Tenant Communication</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Message tenants directly and manage maintenance requests efficiently
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Your data is encrypted and secured with bank-level security
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} TenantFlow. All property management rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}