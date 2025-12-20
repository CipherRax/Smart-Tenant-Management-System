// app/components/TenantTransactionHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  CreditCard, 
  Banknote, 
  DollarSign,
  FileText,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// TypeScript interfaces
interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'mobile_wallet';
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  date: string; // ISO date string
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  category: 'rent' | 'deposit' | 'utility' | 'maintenance' | 'other';
}

// Mock data - replace with your API call
const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    amount: 1200.00,
    description: 'Monthly rent payment - Apartment 3B',
    paymentMethod: { id: 'pm_001', name: 'Visa ****1234', type: 'credit_card' },
    date: '2023-12-01T10:30:00Z',
    status: 'completed',
    reference: 'REF123456789',
    category: 'rent'
  },
  {
    id: 'txn_002',
    amount: 1200.00,
    description: 'Monthly rent payment - Apartment 3B',
    paymentMethod: { id: 'pm_002', name: 'Bank Transfer', type: 'bank_transfer' },
    date: '2023-11-01T14:15:00Z',
    status: 'completed',
    reference: 'REF987654321',
    category: 'rent'
  },
  {
    id: 'txn_003',
    amount: 500.00,
    description: 'Security deposit refund',
    paymentMethod: { id: 'pm_003', name: 'Check', type: 'check' },
    date: '2023-10-15T09:45:00Z',
    status: 'completed',
    reference: 'REF456789123',
    category: 'deposit'
  },
  {
    id: 'txn_004',
    amount: 85.50,
    description: 'Water and electricity charges',
    paymentMethod: { id: 'pm_004', name: 'PayPal', type: 'mobile_wallet' },
    date: '2023-10-05T16:20:00Z',
    status: 'completed',
    reference: 'REF321654987',
    category: 'utility'
  },
  {
    id: 'txn_005',
    amount: 1200.00,
    description: 'Monthly rent payment - Apartment 3B',
    paymentMethod: { id: 'pm_005', name: 'Cash', type: 'cash' },
    date: '2023-10-01T11:30:00Z',
    status: 'completed',
    reference: 'REF789123456',
    category: 'rent'
  }
];

// Payment method icon mapping
const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'credit_card':
      return <CreditCard className="h-4 w-4" />;
    case 'bank_transfer':
      return <Banknote className="h-4 w-4" />;
    case 'cash':
      return <DollarSign className="h-4 w-4" />;
    case 'check':
      return <FileText className="h-4 w-4" />;
    case 'mobile_wallet':
      return <CreditCard className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

// Payment method display name
const getPaymentMethodDisplay = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'credit_card': return 'Credit Card';
    case 'bank_transfer': return 'Bank Transfer';
    case 'cash': return 'Cash';
    case 'check': return 'Check';
    case 'mobile_wallet': return 'Mobile Wallet';
    default: return 'Payment';
  }
};

export default function TenantTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  // Load transactions (replace with API call)
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = transactions;
    
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }
    
    if (paymentMethodFilter !== 'all') {
      result = result.filter(t => t.paymentMethod.type === paymentMethodFilter);
    }
    
    setFilteredTransactions(result);
  }, [categoryFilter, statusFilter, paymentMethodFilter, transactions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle export
  const handleExport = () => {
    // In a real app, this would generate and download a CSV file
    toast('Exporting transaction history...');
    console.log('Export transactions:', filteredTransactions);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast('Transaction history refreshed');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your payments and transactions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="utility">Utilities</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Payment Method</label>
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Date & Time</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(transaction.date), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'hh:mm a')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">Ref: {transaction.reference}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(transaction.paymentMethod.type)}
                        <span>{getPaymentMethodDisplay(transaction.paymentMethod.type)}</span>
                        {transaction.paymentMethod.name && (
                          <span className="text-sm text-muted-foreground">
                            ({transaction.paymentMethod.name})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'pending' ? 'secondary' : 'destructive'}
                        className="capitalize"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(
                      filteredTransactions
                        .filter(t => t.status === 'completed')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rent Payments</p>
                  <p className="text-lg font-bold">
                    {filteredTransactions.filter(t => t.category === 'rent').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recent Payment</p>
                  <p className="text-lg font-bold">
                    {format(new Date(Math.max(...filteredTransactions.map(t => new Date(t.date).getTime()))), 'MMM d')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Toast notification (replace with your toast implementation)
function toast(message: string) {
  // If you're using sonner or another toast library, replace this
  console.log(message);
}