// app/components/FinancialProjectsShowcase.tsx
'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Badge, 
  Coins, 
  TrendingUp, 
  Calendar, 
  Users, 
  Target, 
  Shield, 
  Clock, 
  Activity,
  ArrowRight,
  Play,
  Star,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import Image from "next/image";

// TypeScript interfaces
interface FinancialProject {
  id: string;
  title: string;
  description: string;
  category: 'real_estate' | 'renewable' | 'venture_capital' | 'infrastructure' | 'private_equity';
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  expectedReturn: number; // percentage
  duration: number; // months
  riskLevel: 'low' | 'medium' | 'high';
  status: 'funding' | 'active' | 'completed' | 'upcoming';
  featured: boolean;
  image: string;
  details: {
    location?: string;
    irr?: number;
    capRate?: number;
    exitStrategy: string;
    keyRisks: string[];
  };
}

// Mock data for financial projects
const financialProjects: FinancialProject[] = [
  {
    id: 'proj-1',
    title: 'Downtown Luxury Apartments',
    description: 'Premium residential development in the heart of the financial district with 98% pre-leasing rate.',
    category: 'real_estate',
    targetAmount: 2500000,
    raisedAmount: 1875000,
    minInvestment: 25000,
    expectedReturn: 12.5,
    duration: 24,
    riskLevel: 'medium',
    status: 'funding',
    featured: true,
    image: '/images/real-estate-1.jpg',
    details: {
      location: 'New York, NY',
      irr: 14.2,
      capRate: 6.8,
      exitStrategy: 'Sale to REIT after stabilization',
      keyRisks: ['Market volatility', 'Construction delays', 'Interest rate changes']
    }
  },
  {
    id: 'proj-2',
    title: 'Solar Energy Farm Portfolio',
    description: 'Diversified portfolio of utility-scale solar projects with 20-year power purchase agreements.',
    category: 'renewable',
    targetAmount: 5000000,
    raisedAmount: 3200000,
    minInvestment: 50000,
    expectedReturn: 9.8,
    duration: 120,
    riskLevel: 'low',
    status: 'funding',
    featured: true,
    image: '/images/solar-farm.jpg',
    details: {
      location: 'Multiple States',
      irr: 10.5,
      capRate: null,
      exitStrategy: 'Refinancing after 10 years',
      keyRisks: ['Regulatory changes', 'Technology obsolescence', 'Weather patterns']
    }
  },
  {
    id: 'proj-3',
    title: 'Fintech Startup Fund',
    description: 'Early-stage investment fund focused on disruptive financial technology companies with proven traction.',
    category: 'venture_capital',
    targetAmount: 10000000,
    raisedAmount: 7500000,
    minInvestment: 100000,
    expectedReturn: 25.0,
    duration: 60,
    riskLevel: 'high',
    status: 'active',
    featured: false,
    image: '/images/fintech.jpg',
    details: {
      location: 'San Francisco, CA',
      irr: null,
      capRate: null,
      exitStrategy: 'IPO or strategic acquisition',
      keyRisks: ['Startup failure rate', 'Market competition', 'Regulatory compliance']
    }
  },
  {
    id: 'proj-4',
    title: 'Highway Infrastructure Bond',
    description: 'Government-backed infrastructure bonds for major highway expansion project with guaranteed returns.',
    category: 'infrastructure',
    targetAmount: 15000000,
    raisedAmount: 15000000,
    minInvestment: 10000,
    expectedReturn: 6.2,
    duration: 60,
    riskLevel: 'low',
    status: 'completed',
    featured: false,
    image: '/images/infrastructure.jpg',
    details: {
      location: 'Texas, USA',
      irr: 6.8,
      capRate: null,
      exitStrategy: 'Bond maturity',
      keyRisks: ['Government budget cuts', 'Construction delays']
    }
  }
];

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCategoryIcon = (category: FinancialProject['category']) => {
  switch (category) {
    case 'real_estate': return <Coins className="h-5 w-5" />;
    case 'renewable': return <TrendingUp className="h-5 w-5" />;
    case 'venture_capital': return <Target className="h-5 w-5" />;
    case 'infrastructure': return <Shield className="h-5 w-5" />;
    case 'private_equity': return <Users className="h-5 w-5" />;
    default: return <Coins className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: FinancialProject['category']) => {
  switch (category) {
    case 'real_estate': return 'bg-blue-100 text-blue-800';
    case 'renewable': return 'bg-green-100 text-green-800';
    case 'venture_capital': return 'bg-purple-100 text-purple-800';
    case 'infrastructure': return 'bg-orange-100 text-orange-800';
    case 'private_equity': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (riskLevel: FinancialProject['riskLevel']) => {
  switch (riskLevel) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default function FinancialProjectsShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<FinancialProject | null>(null);
  
  // Filter projects by category
  const filteredProjects = activeCategory === 'all' 
    ? financialProjects 
    : financialProjects.filter(project => project.category === activeCategory);

  // Get unique categories
  const categories = [
    { id: 'all', name: 'All Projects', count: financialProjects.length },
    ...Array.from(new Set(financialProjects.map(p => p.category))).map(category => ({
      id: category,
      name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: financialProjects.filter(p => p.category === category).length
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          Premium Investment Opportunities
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Exclusive Financial Projects</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Access vetted, high-potential investment opportunities across diverse asset classes with transparent terms and professional management.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{financialProjects.length}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(financialProjects.reduce((sum, p) => sum + p.raisedAmount, 0))}</div>
            <div className="text-sm text-muted-foreground">Total Raised</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{financialProjects.filter(p => p.status === 'funding').length}</div>
            <div className="text-sm text-muted-foreground">Funding Now</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">8.5%</div>
            <div className="text-sm text-muted-foreground">Avg. Return</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
            className="gap-2"
          >
            {category.id !== 'all' && getCategoryIcon(category.id as FinancialProject['category'])}
            {category.name}
            <Badge variant="secondary" className="ml-1">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Featured Projects Section */}
      {financialProjects.some(p => p.featured) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
            <Button variant="link" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financialProjects
              .filter(p => p.featured)
              .map(project => (
                <FeaturedProjectCard 
                  key={project.id} 
                  project={project} 
                  onInvestClick={() => setSelectedProject(project)} 
                />
              ))}
          </div>
        </div>
      )}

      {/* All Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {activeCategory === 'all' ? 'All Investment Opportunities' : `${categories.find(c => c.id === activeCategory)?.name} Projects`}
        </h2>
        
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found in this category</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onInvestClick={() => setSelectedProject(project)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Investment Process */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl">How It Works</CardTitle>
          <CardDescription>
            Simple, transparent investment process with professional support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Discover', description: 'Browse vetted opportunities', icon: <SearchIcon className="h-6 w-6" /> },
              { step: 2, title: 'Review', description: 'Analyze detailed documents', icon: <FileIcon className="h-6 w-6" /> },
              { step: 3, title: 'Invest', description: 'Secure your allocation', icon: <Coins className="h-6 w-6" /> },
              { step: 4, title: 'Monitor', description: 'Track performance', icon: <Activity className="h-6 w-6" /> }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  {item.icon}
                </div>
                <div className="font-semibold">Step {item.step}</div>
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <ProjectDetailModal project={selectedProject} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Featured Project Card Component
function FeaturedProjectCard({ project, onInvestClick }: { project: FinancialProject; onInvestClick: () => void }) {
  const progress = (project.raisedAmount / project.targetAmount) * 100;
  const daysLeft = Math.floor(Math.random() * 30) + 1; // Mock days left

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${getCategoryColor(project.category)} gap-1`}>
            {getCategoryIcon(project.category)}
            {project.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        {project.status === 'funding' && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {daysLeft} days left to invest
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge className={getRiskColor(project.riskLevel)}>
            {project.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Target Amount</div>
            <div className="font-semibold">{formatCurrency(project.targetAmount)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Min Investment</div>
            <div className="font-semibold">{formatCurrency(project.minInvestment)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Expected Return</div>
            <div className="font-semibold text-green-600">{project.expectedReturn}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="font-semibold">{project.duration} months</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Raised: {formatCurrency(project.raisedAmount)}</span>
            <span>{progress.toFixed(0)}% funded</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={onInvestClick}>
          {project.status === 'funding' ? 'Invest Now' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Regular Project Card Component
function ProjectCard({ project, onInvestClick }: { project: FinancialProject; onInvestClick: () => void }) {
  const progress = (project.raisedAmount / project.targetAmount) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-32">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${getCategoryColor(project.category)} gap-1 text-xs`}>
            {getCategoryIcon(project.category)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2 flex-grow">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
          <Badge variant="outline" className={getRiskColor(project.riskLevel)}>
            {project.riskLevel}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Return</span>
          <span className="font-medium text-green-600">{project.expectedReturn}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Min Investment</span>
          <span className="font-medium">{formatCurrency(project.minInvestment)}</span>
        </div>
        {project.status === 'funding' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{progress.toFixed(0)}% funded</span>
              <span>{formatCurrency(project.targetAmount - project.raisedAmount)} left</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant={project.status === 'funding' ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={onInvestClick}
        >
          {project.status === 'funding' ? 'Invest' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Project Detail Modal Component
function ProjectDetailModal({ project }: { project: FinancialProject }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{project.title}</DialogTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge className={`${getCategoryColor(project.category)} gap-1`}>
            {getCategoryIcon(project.category)}
            {project.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge variant="outline" className={getRiskColor(project.riskLevel)}>
            {project.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Project Image */}
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Project Description */}
        <div>
          <h3 className="font-semibold mb-2">Overview</h3>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Target Amount" value={formatCurrency(project.targetAmount)} />
          <MetricCard title="Raised" value={formatCurrency(project.raisedAmount)} />
          <MetricCard title="Min Investment" value={formatCurrency(project.minInvestment)} />
          <MetricCard 
            title="Expected Return" 
            value={`${project.expectedReturn}%`} 
            className="text-green-600" 
          />
          {project.details.irr && (
            <MetricCard title="Projected IRR" value={`${project.details.irr}%`} />
          )}
          {project.details.capRate && (
            <MetricCard title="Cap Rate" value={`${project.details.capRate}%`} />
          )}
          <MetricCard title="Duration" value={`${project.duration} months`} />
          {project.details.location && (
            <MetricCard title="Location" value={project.details.location} />
          )}
        </div>
        
        {/* Progress Bar */}
        {project.status === 'funding' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Funding Progress</span>
              <span>{((project.raisedAmount / project.targetAmount) * 100).toFixed(0)}% complete</span>
            </div>
            <Progress value={(project.raisedAmount / project.targetAmount) * 100} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {formatCurrency(project.targetAmount - project.raisedAmount)} remaining to reach target
            </div>
          </div>
        )}
        
        {/* Exit Strategy */}
        <div>
          <h3 className="font-semibold mb-2">Exit Strategy</h3>
          <p className="text-muted-foreground">{project.details.exitStrategy}</p>
        </div>
        
        {/* Key Risks */}
        <div>
          <h3 className="font-semibold mb-2">Key Risks</h3>
          <ul className="space-y-1">
            {project.details.keyRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Investment CTA */}
        <div className="pt-4">
          {project.status === 'funding' ? (
            <Button className="w-full text-lg py-6">
              Invest {formatCurrency(project.minInvestment)} or more
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              {project.status === 'completed' ? 'Fully Funded' : 'Not Currently Accepting Investments'}
            </Button>
          )}
          <p className="text-xs text-muted-foreground text-center mt-2">
            {project.status === 'funding' && 'Secure your allocation before funding closes'}
          </p>
        </div>
      </div>
    </>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  className = "" 
}: { 
  title: string; 
  value: string; 
  className?: string; 
}) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className={`font-semibold mt-1 ${className}`}>{value}</div>
    </div>
  );
}

// Icon Components
function SearchIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FileIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function AlertTriangleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}