// components/tenant-report.tsx
'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TenantReport, MonthlyReport } from '@/types/report';
import { ChartCard } from '@/components/ui/chart-card';
import { StatCard } from '@/components/ui/stat-card';
import {
  Download,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { format, subMonths } from 'date-fns';

// Mock data
const mockMonthlyReports: MonthlyReport[] = [
  { month: 'Jan', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-01-01', lateFees: 0, daysLate: 0 },
  { month: 'Feb', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-02-01', lateFees: 0, daysLate: 0 },
  { month: 'Mar', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-03-01', lateFees: 0, daysLate: 0 },
  { month: 'Apr', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-04-01', lateFees: 0, daysLate: 0 },
  { month: 'May', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-05-01', lateFees: 0, daysLate: 0 },
  { month: 'Jun', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-06-01', lateFees: 0, daysLate: 0 },
  { month: 'Jul', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-07-01', lateFees: 0, daysLate: 0 },
  { month: 'Aug', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-08-01', lateFees: 0, daysLate: 0 },
  { month: 'Sep', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-09-01', lateFees: 0, daysLate: 0 },
  { month: 'Oct', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-10-01', lateFees: 0, daysLate: 0 },
  { month: 'Nov', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-11-01', lateFees: 0, daysLate: 0 },
  { month: 'Dec', year: 2024, rentAmount: 1200, paidAmount: 1200, status: 'paid', paymentDate: '2024-12-01', lateFees: 0, daysLate: 0 },
];

const mockTenantReport: TenantReport = {
  tenantId: 'TEN-001',
  tenantName: 'John Smith',
  property: 'Sunset Apartments',
  unit: 'Unit 302',
  leaseStart: new Date('2024-01-01'),
  leaseEnd: new Date('2024-12-31'),
  monthlyRent: 1200,
  securityDeposit: 1200,
  currentBalance: 0,
  paymentHistory: mockMonthlyReports,
  averagePaymentDelay: 0,
  totalLateFees: 0,
  onTimePaymentRate: 100,
  totalPaid: 14400,
};

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function TenantReportComponent() {
  const [timeRange, setTimeRange] = useState<string>('12m');
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare chart data
  const paymentTrendData = mockMonthlyReports.map(report => ({
    month: report.month,
    paid: report.paidAmount,
    due: report.rentAmount,
  }));

  const paymentStatusData = [
    { name: 'On Time', value: mockMonthlyReports.filter(r => r.daysLate === 0).length },
    { name: '1-3 Days Late', value: mockMonthlyReports.filter(r => r.daysLate > 0 && r.daysLate <= 3).length },
    { name: '4-7 Days Late', value: mockMonthlyReports.filter(r => r.daysLate > 3 && r.daysLate <= 7).length },
    { name: 'Over 7 Days Late', value: mockMonthlyReports.filter(r => r.daysLate > 7).length },
  ];

  const monthlyPerformanceData = mockMonthlyReports.map(report => ({
    month: report.month,
    performance: report.daysLate === 0 ? 100 : Math.max(0, 100 - (report.daysLate * 5)),
  }));

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    
    // Create and download a mock report
    const reportContent = `
      Tenant Payment Report
      ====================
      
      Tenant: ${mockTenantReport.tenantName}
      Property: ${mockTenantReport.property}
      Unit: ${mockTenantReport.unit}
      Period: Last 12 Months
      
      Summary:
      - Total Rent Paid: ${formatCurrency(mockTenantReport.totalPaid)}
      - On-Time Payment Rate: ${mockTenantReport.onTimePaymentRate}%
      - Average Payment Delay: ${mockTenantReport.averagePaymentDelay} days
      - Total Late Fees: ${formatCurrency(mockTenantReport.totalLateFees)}
      
      Monthly Breakdown:
      ${mockMonthlyReports.map(r => 
        `${r.month} ${r.year}: ${formatCurrency(r.paidAmount)} - ${r.status.toUpperCase()}`
      ).join('\n      ')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenant-report-${mockTenantReport.tenantId}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Partial</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Report</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your rent payment history and performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleDownloadReport} disabled={isGenerating} className="min-w-[200px]">
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Report ({reportFormat.toUpperCase()})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Paid"
          value={formatCurrency(mockTenantReport.totalPaid)}
          description="Last 12 months"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="On-Time Rate"
          value={formatPercentage(mockTenantReport.onTimePaymentRate)}
          description="Payment punctuality"
          trend="up"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatCard
          title="Avg. Payment Delay"
          value={`${mockTenantReport.averagePaymentDelay} days`}
          description="Lower is better"
          trend="neutral"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Current Balance"
          value={formatCurrency(mockTenantReport.currentBalance)}
          description="Outstanding amount"
          trend={mockTenantReport.currentBalance > 0 ? "down" : "up"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Trend Chart */}
        <ChartCard
          title="Payment Trend"
          description="Monthly rent payment history"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="due"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Rent Due"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Amount Paid"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Payment Status Distribution */}
        <ChartCard
          title="Payment Status Distribution"
          description="Breakdown of payment timeliness"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} months`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Monthly Performance */}
        <ChartCard
          title="Monthly Performance Score"
          description="Payment performance rating (0-100)"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value} points`, 'Performance Score']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="performance" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Performance Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Late Fees History */}
        <ChartCard
          title="Late Fees Over Time"
          description="Monthly late fee charges"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyReports}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Late Fees']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="lateFees" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late Fees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Payment History</CardTitle>
          <CardDescription>
            Month-by-month breakdown of your rent payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Rent Due</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Days Late</TableHead>
                  <TableHead>Late Fees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMonthlyReports.map((report) => (
                  <TableRow key={`${report.month}-${report.year}`}>
                    <TableCell className="font-medium">
                      {report.month} {report.year}
                    </TableCell>
                    <TableCell>{formatCurrency(report.rentAmount)}</TableCell>
                    <TableCell>{formatCurrency(report.paidAmount)}</TableCell>
                    <TableCell>
                      {report.paymentDate ? format(new Date(report.paymentDate), 'MMM dd, yyyy') : 'Not Paid'}
                    </TableCell>
                    <TableCell>
                      <span className={report.daysLate > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {report.daysLate}
                      </span>
                    </TableCell>
                    <TableCell>
                      {report.lateFees > 0 ? (
                        <span className="text-red-600 font-semibold">
                          {formatCurrency(report.lateFees)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              Overall performance analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Lease Period</p>
                <p className="font-semibold">
                  {format(mockTenantReport.leaseStart, 'MMM yyyy')} - {format(mockTenantReport.leaseEnd, 'MMM yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold">{formatCurrency(mockTenantReport.monthlyRent)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Security Deposit</p>
                <p className="font-semibold">{formatCurrency(mockTenantReport.securityDeposit)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Perfect Payments</p>
                <p className="font-semibold">
                  {mockMonthlyReports.filter(r => r.daysLate === 0).length} of {mockMonthlyReports.length} months
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Payment Pattern Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your payment history shows excellent consistency with 100% on-time payments over the last 12 months. 
                You have maintained a perfect payment record with no late fees incurred.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleDownloadReport}>
              <FileText className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Advanced Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Compare With Average
            </Button>
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Tip:</strong> Set up automatic payments to maintain your perfect payment record.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}