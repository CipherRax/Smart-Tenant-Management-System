// components/ui/stat-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  change,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <div className="flex items-center text-xs">
            <span className={cn(
              "flex items-center",
              trend === 'up' ? "text-green-600" :
              trend === 'down' ? "text-red-600" :
              "text-muted-foreground"
            )}>
              {trend === 'up' && <ArrowUpIcon className="mr-1 h-3 w-3" />}
              {trend === 'down' && <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {trend === 'neutral' && <TrendingUpIcon className="mr-1 h-3 w-3" />}
              {change && <span className="font-semibold">{change}</span>}
              {description && <span className="text-muted-foreground ml-1">{description}</span>}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}