// app/components/TransactionHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  CreditCard, 
  Banknote, 
  Clock, 
  User 
} from "lucide-react";
import { format } from 'date-fns';

// Define TypeScript interfaces
interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank_transfer' | 'cash' | 'other';
}

interface Transaction {
  id: string;
  tenantName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO date string
  status: 'completed' | 'pending' | 'failed';
}

// Payment method icons mapping
const PaymentMethodIcon = ({ method }: { method: PaymentMethod['type'] }) => {
  switch (method) {
    case 'card':
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    case 'bank_transfer':
      return <Banknote className="h-4 w-4 text-green-500" />;
    case 'cash':
      return <Banknote className="h-4 w-4 text-yellow-500" />;
    default:
      return <Banknote className="h-4 w-4 text-gray-500" />;
  }
};

// Main component
export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data fetch - replace with your actual API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            tenantName: 'Alex Johnson',
            amount: 1200.00,
            paymentMethod: { id: 'pm1', name: 'Visa ****1234', type: 'card' },
            date: '2023-10-15T10:30:00Z',
            status: 'completed'
          },
          {
            id: '2',
            tenantName: 'Maria Garcia',
            amount: 1200.00,
            paymentMethod: { id: 'pm2', name: 'Bank Transfer', type: 'bank_transfer' },
            date: '2023-10-10T14:15:00Z',
            status: 'completed'
          },
          {
            id: '3',
            tenantName: 'James Wilson',
            amount: 1200.00,
            paymentMethod: { id: 'pm3', name: 'Cash', type: 'cash' },
            date: '2023-10-05T09:45:00Z',
            status: 'completed'
          },
          {
            id: '4',
            tenantName: 'Sarah Miller',
            amount: 1200.00,
            paymentMethod: { id: 'pm4', name: 'PayPal', type: 'other' },
            date: '2023-09-28T16:20:00Z',
            status: 'completed'
          }
        ];
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply filters when payment method changes
  useEffect(() => {
    if (paymentMethodFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(t => t.paymentMethod.type === paymentMethodFilter)
      );
    }
  }, [paymentMethodFilter, transactions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Rent Payment History</CardTitle>
        <Select 
          value={paymentMethodFilter} 
          onValueChange={setPaymentMethodFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Methods</SelectItem>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {transaction.tenantName}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <PaymentMethodIcon method={transaction.paymentMethod.type} />
                      <span className="ml-2">{transaction.paymentMethod.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div>{format(new Date(transaction.date), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(transaction.date), 'hh:mm a')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}