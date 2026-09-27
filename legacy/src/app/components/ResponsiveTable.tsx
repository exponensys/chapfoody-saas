import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Column {
  key: string;
  label: string;
  hideOnMobile?: boolean;
  className?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: Record<string, any>[];
  renderCell?: (key: string, value: any, row: Record<string, any>) => ReactNode;
  onRowClick?: (row: Record<string, any>) => void;
  mobileCardView?: boolean;
  emptyState?: ReactNode;
}

export function ResponsiveTable({
  columns,
  data,
  renderCell,
  onRowClick,
  mobileCardView = true,
  emptyState
}: ResponsiveTableProps) {
  if (data.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }

  const visibleColumns = columns.filter(col => !col.hideOnMobile);
  const hiddenColumns = columns.filter(col => col.hideOnMobile);

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`text-left p-4 font-medium text-muted-foreground ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`border-b hover:bg-muted/50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`p-4 ${column.className || ''}`}>
                    {renderCell ? renderCell(column.key, row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      {mobileCardView && (
        <div className="md:hidden space-y-4">
          {data.map((row, index) => (
            <Card 
              key={index}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  {visibleColumns.map((column) => (
                    <div key={column.key} className="flex justify-between items-start">
                      <span className="font-medium text-sm text-muted-foreground">
                        {column.label}:
                      </span>
                      <span className="text-right flex-1 ml-2">
                        {renderCell ? renderCell(column.key, row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                  
                  {/* Hidden columns shown as secondary info */}
                  {hiddenColumns.length > 0 && (
                    <div className="pt-2 border-t mt-3">
                      {hiddenColumns.map((column) => (
                        <div key={column.key} className="flex justify-between items-start mb-1">
                          <span className="text-xs text-muted-foreground">
                            {column.label}:
                          </span>
                          <span className="text-xs text-right flex-1 ml-2">
                            {renderCell ? renderCell(column.key, row[column.key], row) : row[column.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

interface ResponsiveTableStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
}

export function ResponsiveTableStats({ stats }: ResponsiveTableStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-medium">{stat.value}</p>
              {stat.change && (
                <Badge 
                  variant={
                    stat.changeType === 'positive' ? 'default' : 
                    stat.changeType === 'negative' ? 'destructive' : 
                    'secondary'
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}