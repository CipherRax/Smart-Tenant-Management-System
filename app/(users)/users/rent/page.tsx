// components/rent-payment.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CreditCard, Building, Smartphone, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PaymentMethod, Transaction, PaymentStatus } from '@/types/payment';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    amount: 1200,
    method: 'credit_card',
    status: 'completed',
    description: 'January Rent Payment',
    reference: 'REF-789012'
  },
  {
    id: '2',
    date: new Date('2023-12-15'),
    amount: 1200,
    method: 'bank_transfer',
    status: 'completed',
    description: 'December Rent Payment',
    reference: 'REF-789011'
  },
  {
    id: '3',
    date: new Date('2023-11-15'),
    amount: 1200,
    method: 'mobile_money',
    status: 'completed',
    description: 'November Rent Payment',
    reference: 'REF-789010'
  },
  {
    id: '4',
    date: new Date('2023-10-15'),
    amount: 1200,
    method: 'credit_card',
    status: 'failed',
    description: 'October Rent Payment',
    reference: 'REF-789009'
  }
];

const RentPayment = () => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>('credit_card');
  const [amount, setAmount] = useState<string>('1200');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [mobileProvider, setMobileProvider] = useState<string>('mtn');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>(new Date('2024-02-01'));
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const currentMonth = format(new Date(), 'MMMM');
  const rentAmount = 1200;
  const paidAmount = 1200; // Assuming current month is paid
  const progressValue = (paidAmount / rentAmount) * 100;

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-700';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700';
      case 'failed':
        return 'bg-red-500/20 text-red-700';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building className="h-4 w-4" />;
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert('Payment processed successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rent Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Rent Overview</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Current: {currentMonth}
                </Badge>
              </CardTitle>
              <CardDescription>
                Your rent payment details and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Monthly Rent</Label>
                  <div className="text-2xl font-bold">{formatCurrency(rentAmount)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Due Date</Label>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(dueDate, 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Payment Status</Label>
                  <Badge className="bg-green-500/20 text-green-700">Up to Date</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Progress</span>
                  <span>{progressValue.toFixed(0)}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  You&apos;ve paid {formatCurrency(paidAmount)} of {formatCurrency(rentAmount)} for this period
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Card */}
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Select your preferred payment method to pay your rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit_card" onValueChange={(value) => setActiveTab(value as PaymentMethod)}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="credit_card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bank Transfer
                  </TabsTrigger>
                  <TabsTrigger value="mobile_money" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </TabsTrigger>
                </TabsList>

                {/* Amount Input */}
                <div className="mb-6">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-lg font-semibold"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Suggested: {formatCurrency(rentAmount)} (Full month)
                  </p>
                </div>

                {/* Credit Card Form */}
                <TabsContent value="credit_card" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Your card information is encrypted and secure. We use Stripe for secure payment processing.
                    </p>
                  </div>
                </TabsContent>

                {/* Bank Transfer Form */}
                <TabsContent value="bank_transfer" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select value={bankName} onValueChange={setBankName}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chase">Chase Bank</SelectItem>
                          <SelectItem value="boa">Bank of America</SelectItem>
                          <SelectItem value="wells">Wells Fargo</SelectItem>
                          <SelectItem value="citibank">Citibank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter your account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input id="routingNumber" placeholder="Enter routing number" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Bank transfers typically take 2-3 business days to process.
                    </p>
                  </div>
                </TabsContent>

                {/* Mobile Money Form */}
                <TabsContent value="mobile_money" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileProvider">Mobile Provider</Label>
                      <Select value={mobileProvider} onValueChange={setMobileProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="airtel">Airtel Money</SelectItem>
                          <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                          <SelectItem value="orange">Orange Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN (For authorization)</Label>
                      <Input id="pin" type="password" placeholder="Enter your mobile money PIN" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> You will receive a confirmation message on your phone to authorize the payment.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">
                Total to pay: <span className="font-bold text-foreground">{formatCurrency(parseFloat(amount) || 0)}</span>
              </div>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Transaction History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Recent rent payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        transaction.status === 'completed' ? "bg-green-500/10" :
                        transaction.status === 'failed' ? "bg-red-500/10" :
                        "bg-yellow-500/10"
                      )}>
                        {getMethodIcon(transaction.method)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(transaction.date, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        {getStatusIcon(transaction.status)}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs h-5",
                            getStatusColor(transaction.status)
                          )}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Monthly Summary */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Monthly Summary</h4>
                <div className="space-y-2">
                  {['January', 'December', 'November', 'October'].map((month, index) => (
                    <div key={month} className="flex justify-between items-center">
                      <span className="text-sm">{month} 2024</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            index === 3 ? "bg-red-500/20 text-red-700" : "bg-green-500/20 text-green-700"
                          )}
                        >
                          {index === 3 ? 'Failed' : 'Paid'}
                        </Badge>
                        <span className="text-sm font-medium">{formatCurrency(1200)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => alert('View all transactions')}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-700">Total Paid This Year</p>
                <p className="text-2xl font-bold text-blue-800">{formatCurrency(3600)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentPayment;