// components/pre-login-selector.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Home, Search, MapPin, Users, ArrowRight, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield } from "lucide-react";

// Mock apartment/property data
const mockProperties = [
  {
    id: 'prop-001',
    name: 'Sunset Apartments',
    address: '123 Main Street, San Francisco, CA',
    units: 48,
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h-300'
  },
  {
    id: 'prop-002',
    name: 'Green Valley Complex',
    address: '456 Oak Avenue, San Jose, CA',
    units: 120,
    type: 'condominium',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h-300'
  },
  {
    id: 'prop-003',
    name: 'Riverside Towers',
    address: '789 River Road, Oakland, CA',
    units: 200,
    type: 'high-rise',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h-300'
  },
  {
    id: 'prop-004',
    name: 'Mountain View Estates',
    address: '101 Pine Street, Berkeley, CA',
    units: 36,
    type: 'townhouse',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h-300'
  },
  {
    id: 'prop-005',
    name: 'Ocean Breeze Apartments',
    address: '202 Beach Boulevard, Santa Cruz, CA',
    units: 72,
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h-300'
  }
];

const mockUnits = {
  'prop-001': [
    { number: '101', floor: '1', bedrooms: 1, status: 'occupied' },
    { number: '102', floor: '1', bedrooms: 2, status: 'occupied' },
    { number: '201', floor: '2', bedrooms: 1, status: 'vacant' },
    { number: '202', floor: '2', bedrooms: 3, status: 'occupied' },
    { number: '301', floor: '3', bedrooms: 2, status: 'occupied' },
    { number: '302', floor: '3', bedrooms: 1, status: 'occupied' },
  ],
  'prop-002': [
    { number: 'A101', floor: '1', bedrooms: 2, status: 'occupied' },
    { number: 'A102', floor: '1', bedrooms: 3, status: 'occupied' },
    { number: 'B201', floor: '2', bedrooms: 1, status: 'vacant' },
  ],
  'prop-003': [
    { number: '1501', floor: '15', bedrooms: 2, status: 'occupied' },
    { number: '1502', floor: '15', bedrooms: 3, status: 'occupied' },
    { number: '1601', floor: '16', bedrooms: 1, status: 'occupied' },
  ],
  'prop-004': [
    { number: 'T1', floor: '1', bedrooms: 3, status: 'occupied' },
    { number: 'T2', floor: '1', bedrooms: 2, status: 'occupied' },
    { number: 'T3', floor: '2', bedrooms: 4, status: 'vacant' },
  ],
  'prop-005': [
    { number: '101', floor: '1', bedrooms: 1, status: 'occupied' },
    { number: '102', floor: '1', bedrooms: 2, status: 'occupied' },
    { number: '201', floor: '2', bedrooms: 3, status: 'occupied' },
  ]
};

export default function PreLoginSelector() {
  const router = useRouter();
  const [step, setStep] = useState<'property' | 'unit' | 'login' | 'signup'>('property');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter properties based on search
  const filteredProperties = mockProperties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPropertyData = mockProperties.find(p => p.id === selectedProperty);
  const availableUnits = selectedProperty ? (mockUnits[selectedProperty as keyof typeof mockUnits] || []) : [];

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setSelectedUnit('');
    if (propertyId) {
      setStep('unit');
    }
  };

  const handleUnitSelect = (unitNumber: string) => {
    setSelectedUnit(unitNumber);
    setStep('login');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !selectedUnit || !loginEmail || !loginPassword) {
      return;
    }
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Store property and unit info in localStorage or context
      localStorage.setItem('selectedProperty', selectedProperty);
      localStorage.setItem('selectedUnit', selectedUnit);
      // Redirect to tenant dashboard
      router.push('/users/uhome');
    }, 1500);
  };

  const handleSignupRedirect = () => {
    if (!selectedProperty || !selectedUnit) {
      return;
    }
    // Store property and unit info for signup
    localStorage.setItem('selectedProperty', selectedProperty);
    localStorage.setItem('selectedUnit', selectedUnit);
    router.push('/auth/signup');
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return '🏢';
      case 'condominium': return '🏘️';
      case 'high-rise': return '🏙️';
      case 'townhouse': return '🏡';
      default: return '🏠';
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
                Tenant Portal
              </h1>
              <p className="text-sm text-muted-foreground">Select your property to continue</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please identify your apartment complex and unit number to access your tenant portal
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${step === 'property' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === 'property' ? 'border-primary bg-primary/10' : 'border-muted-foreground'}`}>
                1
              </div>
              <span className="text-sm mt-2">Select Property</span>
            </div>
            <div className={`h-1 w-20 ${step !== 'property' ? 'bg-primary' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step === 'unit' ? 'text-primary' : step === 'property' ? 'text-muted-foreground' : 'text-primary'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === 'unit' ? 'border-primary bg-primary/10' : step === 'property' ? 'border-muted-foreground' : 'border-primary'}`}>
                2
              </div>
              <span className="text-sm mt-2">Select Unit</span>
            </div>
            <div className={`h-1 w-20 ${step === 'login' || step === 'signup' ? 'bg-primary' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step === 'login' || step === 'signup' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step === 'login' || step === 'signup' ? 'border-primary bg-primary/10' : 'border-muted-foreground'}`}>
                3
              </div>
              <span className="text-sm mt-2">Login/Signup</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6">
            {/* Step 1: Property Selection */}
            {step === 'property' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Select Your Apartment Complex</h2>
                  <p className="text-muted-foreground">
                    Choose the property where you reside from the list below
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search properties by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Property List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {filteredProperties.map((property) => (
                    <Card
                      key={property.id}
                      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                        selectedProperty === property.id ? 'border-primary' : 'border-gray-200'
                      }`}
                      onClick={() => handlePropertySelect(property.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                              <span className="text-2xl">{getPropertyTypeIcon(property.type)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">{property.name}</h3>
                              {selectedProperty === property.id && (
                                <Badge className="bg-green-500/20 text-green-700">Selected</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{property.address}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {property.units} units
                              </span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {property.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                    <p className="text-muted-foreground">
                      Try a different search term or contact your property manager
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" asChild>
                    <Link href="/">
                      ← Back to Home
                    </Link>
                  </Button>
                  <Button
                    onClick={() => setStep('unit')}
                    disabled={!selectedProperty}
                  >
                    Next: Select Unit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Unit Selection */}
            {step === 'unit' && selectedPropertyData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Select Your Unit</h2>
                  <p className="text-muted-foreground">
                    Choose your specific unit at {selectedPropertyData.name}
                  </p>
                </div>

                {/* Property Info Banner */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{selectedPropertyData.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedPropertyData.address}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep('property')}
                      >
                        Change Property
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Unit Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {availableUnits.map((unit) => (
                    <Card
                      key={unit.number}
                      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                        selectedUnit === unit.number ? 'border-primary' : 'border-gray-200'
                      }`}
                      onClick={() => handleUnitSelect(unit.number)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Home className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-xl">Unit {unit.number}</h3>
                              <p className="text-sm text-muted-foreground">Floor {unit.floor}</p>
                            </div>
                          </div>
                          {selectedUnit === unit.number && (
                            <Badge className="bg-green-500/20 text-green-700">Selected</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>{unit.bedrooms} {unit.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                          <Badge
                            variant={unit.status === 'occupied' ? 'default' : 'outline'}
                            className={unit.status === 'occupied' ? 'bg-blue-500' : 'bg-gray-100'}
                          >
                            {unit.status === 'occupied' ? 'Occupied' : 'Vacant'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {availableUnits.length === 0 && (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No units available</h3>
                    <p className="text-muted-foreground">
                      Contact property management for unit assignment
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep('property')}>
                    ← Back to Properties
                  </Button>
                  <Button
                    onClick={() => setStep('login')}
                    disabled={!selectedUnit}
                  >
                    Next: Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Login */}
            {step === 'login' && selectedPropertyData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Login to Your Account</h2>
                  <p className="text-muted-foreground">
                    Enter your credentials to access {selectedPropertyData.name}, Unit {selectedUnit}
                  </p>
                </div>

                {/* Selected Property & Unit Info */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{selectedPropertyData.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Unit {selectedUnit} • {availableUnits.find(u => u.number === selectedUnit)?.bedrooms} Bedrooms
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStep('unit')}
                        >
                          Change Unit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStep('property')}
                        >
                          Change Property
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
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
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" size="sm" className="px-0">
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !loginEmail || !loginPassword}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login to Portal
                      </>
                    )}
                  </Button>
                </form>

                <Separator />

                {/* Signup Option */}
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Don't have an account yet?</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignupRedirect}
                    disabled={!selectedProperty || !selectedUnit}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create New Account
                  </Button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep('unit')}>
                    ← Back to Unit Selection
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Signup (Alternative path) */}
            {step === 'signup' && selectedPropertyData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Create New Account</h2>
                  <p className="text-muted-foreground">
                    Set up your account for {selectedPropertyData.name}, Unit {selectedUnit}
                  </p>
                </div>

                {/* Rest of signup form would go here */}
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Redirecting to Signup</h3>
                  <p className="text-muted-foreground mb-4">
                    You'll be taken to the full signup form
                  </p>
                  <Button onClick={handleSignupRedirect}>
                    Continue to Signup
                  </Button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep('login')}>
                    ← Back to Login
                  </Button>
                  <Button variant="ghost" onClick={() => setStep('unit')}>
                    ← Change Unit
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help finding your property?{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/support">
                Contact Support
              </Link>
            </Button>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure Login
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              Multi-Property Support
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              24/7 Assistance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}