'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Mock data for analytics
const occupancyData = [
  { month: "Jan", occupancy: 75 },
  { month: "Feb", occupancy: 82 },
  { month: "Mar", occupancy: 88 },
  { month: "Apr", occupancy: 92 },
  { month: "May", occupancy: 85 },
  { month: "Jun", occupancy: 90 },
];

const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 14200 },
  { month: "Mar", revenue: 15800 },
  { month: "Apr", revenue: 18500 },
  { month: "May", revenue: 17200 },
  { month: "Jun", revenue: 19500 },
];

const propertyData = [
  { name: "Building A", value: 45 },
  { name: "Building B", value: 30 },
  { name: "Building C", value: 25 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const detailedReport = [
  { id: "INV-001", property: "Building A", tenant: "John Smith", amount: "$1,250", status: "Paid", date: "2023-06-15" },
  { id: "INV-002", property: "Building B", tenant: "Sarah Johnson", amount: "$950", status: "Paid", date: "2023-06-18" },
  { id: "INV-003", property: "Building C", tenant: "Michael Brown", amount: "$1,100", status: "Pending", date: "2023-06-20" },
  { id: "INV-004", property: "Building A", tenant: "Emily Davis", amount: "$1,250", status: "Paid", date: "2023-06-22" },
  { id: "INV-005", property: "Building B", tenant: "Robert Wilson", amount: "$950", status: "Overdue", date: "2023-06-25" },
];

const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor system performance and key metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground">
              <rect width="18" height="8" x="3" y="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M3 11V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M8 9v4" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 9v4" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16 9v4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground">
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19,500</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>Monthly occupancy trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 20000]} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Property Distribution</CardTitle>
              <CardDescription>Tenants by property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} tenants`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Financial Report</CardTitle>
              <CardDescription>Complete breakdown of transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 p-4 bg-muted rounded-t-md">
                  <div className="font-medium">Invoice ID</div>
                  <div className="font-medium">Property</div>
                  <div className="font-medium">Tenant</div>
                  <div className="font-medium text-right">Amount</div>
                  <div className="font-medium">Status</div>
                  <div className="font-medium">Date</div>
                </div>
                <div className="divide-y">
                  {detailedReport.map((item) => (
                    <div key={item.id} className="grid grid-cols-6 gap-4 p-4 hover:bg-muted/50">
                      <div className="font-medium">{item.id}</div>
                      <div>{item.property}</div>
                      <div>{item.tenant}</div>
                      <div className="text-right font-medium">{item.amount}</div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === "Paid" 
                            ? "bg-green-100 text-green-800" 
                            : item.status === "Pending" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div>{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default AnalyticsDashboard;