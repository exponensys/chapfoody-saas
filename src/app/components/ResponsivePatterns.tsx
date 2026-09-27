import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ResponsiveGrid } from './ResponsiveGrid';
import { motion } from 'motion/react';

interface ActionHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: Array<{
    label: string;
    mobileLabel?: string;
    icon?: ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'outline';
    className?: string;
  }>;
}

export function ActionHeader({ 
  title, 
  subtitle, 
  onBack, 
  actions = [] 
}: ActionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="gap-2">
            ← Retour
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>
      
      {actions.length > 0 && (
        <div className="flex gap-2 w-full sm:w-auto">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              className={`gap-2 flex-1 sm:flex-none ${action.className || ''}`}
              onClick={action.onClick}
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">{action.mobileLabel || action.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  delay?: number;
}

export function StatsCard({ 
  icon, 
  label, 
  value, 
  change, 
  changeType, 
  color = 'bg-blue-100',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <p className={`text-sm ${
                  changeType === 'positive' ? 'text-green-600' : 
                  changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {change}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: Array<{
    icon: ReactNode;
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    color?: string;
  }>;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export function StatsGrid({ 
  stats, 
  columns = { base: 1, sm: 2, lg: 4 } 
}: StatsGridProps) {
  return (
    <ResponsiveGrid cols={columns} gap={4}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </ResponsiveGrid>
  );
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    key: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }>;
}

export function FilterBar({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = "Rechercher...",
  filters = [] 
}: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#b70f23] focus:border-transparent"
            />
          </div>
          
          {filters.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              {filters.map((filter) => (
                <select
                  key={filter.key}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="flex-1 sm:w-40 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#b70f23] focus:border-transparent"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ItemCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function ItemCard({ 
  children, 
  onClick, 
  className = '',
  delay = 0 
}: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`border rounded-lg p-4 hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: string;
  statusConfigs: Record<string, {
    label: string;
    color: string;
    icon?: ReactNode;
  }>;
}

export function StatusBadge({ status, statusConfigs }: StatusBadgeProps) {
  const config = statusConfigs[status] || { 
    label: status, 
    color: 'bg-gray-100 text-gray-800' 
  };
  
  return (
    <Badge className={config.color}>
      {config.icon}
      <span className={config.icon ? 'ml-1' : ''}>{config.label}</span>
    </Badge>
  );
}

interface ActionButtonsProps {
  actions: Array<{
    icon: ReactNode;
    label?: string;
    onClick?: () => void;
    variant?: 'default' | 'ghost' | 'outline';
    className?: string;
    show?: boolean;
  }>;
}

export function ActionButtons({ actions }: ActionButtonsProps) {
  const visibleActions = actions.filter(action => action.show !== false);
  
  return (
    <div className="flex gap-1">
      {visibleActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'ghost'}
          size="sm"
          className={action.className}
          onClick={action.onClick}
          title={action.label}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
}

// Import de l'icône Search
const SearchIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    strokeWidth={2} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
  </svg>
);