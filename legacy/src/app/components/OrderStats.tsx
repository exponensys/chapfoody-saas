import { Card, CardContent } from './ui/card';
import { AlertCircle, Timer, Euro } from 'lucide-react';

interface OrderStatsProps {
  pendingCount: number;
  activeCount: number;
  totalAmount: number;
}

export function OrderStats({ pendingCount, activeCount, totalAmount }: OrderStatsProps) {
  const stats = [
    {
      title: 'En attente',
      value: pendingCount,
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      textSecondaryColor: 'text-yellow-600'
    },
    {
      title: 'En cours',
      value: activeCount,
      icon: Timer,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'bg-blue-500',
      textColor: 'text-blue-700',
      textSecondaryColor: 'text-blue-600'
    },
    {
      title: 'Total journée',
      value: `${totalAmount.toFixed(2)} €`,
      icon: Euro,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'bg-green-500',
      textColor: 'text-green-700',
      textSecondaryColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.borderColor} ${stat.bgColor}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${stat.iconColor} rounded-full flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </div>
                <div className={`text-sm ${stat.textSecondaryColor}`}>{stat.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}