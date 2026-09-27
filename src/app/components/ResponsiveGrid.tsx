import { ReactNode } from 'react';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { base: 1, md: 2, lg: 3 },
  gap = 6,
  className = ''
}: ResponsiveGridProps) {
  const gridClasses = [
    // Base columns
    cols.base && `grid-cols-${cols.base}`,
    // Small screens
    cols.sm && `sm:grid-cols-${cols.sm}`,
    // Medium screens  
    cols.md && `md:grid-cols-${cols.md}`,
    // Large screens
    cols.lg && `lg:grid-cols-${cols.lg}`,
    // Extra large screens
    cols.xl && `xl:grid-cols-${cols.xl}`,
    // Gap
    `gap-${gap}`,
    // Additional classes
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridClasses}`}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

export function ResponsiveContainer({ 
  children, 
  className = '',
  maxWidth = '6xl'
}: ResponsiveContainerProps) {
  const maxWidthClass = maxWidth !== 'full' ? `max-w-${maxWidth}` : '';
  
  return (
    <div className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: ReactNode;
  spacing?: number;
  className?: string;
}

export function ResponsiveStack({ 
  children, 
  spacing = 6,
  className = ''
}: ResponsiveStackProps) {
  return (
    <div className={`space-y-${spacing} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveFlexProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  gap?: number;
  className?: string;
}

export function ResponsiveFlex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 4,
  className = ''
}: ResponsiveFlexProps) {
  const flexClasses = [
    'flex',
    direction === 'col' ? 'flex-col' : 'flex-row',
    `items-${align}`,
    `justify-${justify}`,
    wrap && 'flex-wrap',
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
}