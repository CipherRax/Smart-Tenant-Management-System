// components/landlord-registration.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  Upload,
  MapPin,
  Briefcase
} from 'lucide-react';

// Form validation schema
const registrationSchema = z.object({
  userType: z.enum(['landlord', 'property_manager'], {
    required_error: "Please select your role",
  }),
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  companyWebsite: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  propertiesCount: z.enum(['1', '2-5', '6-10', '11-20', '21+']),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  marketingEmails: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function LandlordRegistration() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState<'landlord' | 'property_manager' | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      userType: 'landlord',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyWebsite: '',
      propertiesCount: '1',
      acceptTerms: false,
      marketingEmails: false,
    },
  });

  const userType = form.watch('userType');
  const steps = [
    { number: 1, title: 'Account Type', description: 'Select your role' },
    { number: 2, title: 'Personal Info', description: 'Enter your details' },
    { number: 3, title: 'Business Info', description: 'Company details' },
    { number: 4, title: 'Security', description: 'Set password' },
  ];

  const handleUserTypeSelect = (type: 'landlord' | 'property_manager') => {
    setSelectedUserType(type);
    form.setValue('userType', type);
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormValues)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['userType'];
        break;
      case 2:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
        break;
      case 3:
        fieldsToValidate = ['companyName', 'companyWebsite', 'propertiesCount'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Registration data:', data);
    
    // Store registration data
    localStorage.setItem('registeredUser', JSON.stringify(data));
    
    // Redirect to verification or dashboard
    router.push('/auth/verify');
    
    setIsSubmitting(false);
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

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John" className="pl-10" {...field} />
                      </div>
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Doe" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    We'll send verification and important updates to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Used for urgent notifications and account recovery
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Business Information</h3>
              <p className="text-muted-foreground">
                Tell us about your {userType === 'landlord' ? 'properties' : 'management business'}
              </p>
            </div>

            {userType === 'property_manager' && (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Your Property Management Company" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="https://yourcompany.com" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="propertiesCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How many properties do you {userType === 'landlord' ? 'own' : 'currently manage'}?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of properties" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 property</SelectItem>
                      <SelectItem value="2-5">2-5 properties</SelectItem>
                      <SelectItem value="6-10">6-10 properties</SelectItem>
                      <SelectItem value="11-20">11-20 properties</SelectItem>
                      <SelectItem value="21+">21+ properties</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This helps us customize your experience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Set a strong password to protect your account
              </p>
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Must contain 8+ characters with uppercase, number, and special character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
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

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-3">
                <FormField
                  control={form.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Send me product updates, tips, and offers via email
                        </FormLabel>
                        <FormDescription className="text-xs">
                          You can unsubscribe at any time
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  {currentStep === 4 && 'Set up a secure password for your account'}
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
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedUserType && currentStep === 1}
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
                    <Link href="/auth/login" className="text-primary font-medium hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>

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