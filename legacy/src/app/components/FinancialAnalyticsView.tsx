import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface FinancialAnalyticsViewProps {
  onBack: () => void;
}

export function FinancialAnalyticsView({ onBack }: FinancialAnalyticsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Données de performance financière
  const performanceMetrics = {
    revenue: {
      current: 45250.80,
      previous: 40125.50,
      change: 12.8,
      trend: 'up',
      target: 50000,
      targetProgress: 90.5
    },
    avgOrderValue: {
      current: 28.75,
      previous: 26.50,
      change: 8.5,
      trend: 'up',
      target: 30,
      targetProgress: 95.8
    },
    profitMargin: {
      current: 37.8,
      previous: 35.2,
      change: 2.6,
      trend: 'up',
      target: 40,
      targetProgress: 94.5
    },
    customerCount: {
      current: 1574,
      previous: 1425,
      change: 10.5,
      trend: 'up',
      target: 1800,
      targetProgress: 87.4
    }
  };

  // Données pour les graphiques
  const monthlyData = [
    { month: 'Sep', revenue: 38200, expenses: 24500, profit: 13700 },
    { month: 'Oct', revenue: 42100, expenses: 26800, profit: 15300 },
    { month: 'Nov', revenue: 39800, expenses: 25200, profit: 14600 },
    { month: 'Déc', revenue: 45600, expenses: 28900, profit: 16700 },
    { month: 'Jan', revenue: 45250, expenses: 28150, profit: 17100 }
  ];

  const categoryBreakdown = [
    { category: 'Plats principaux', revenue: 18100, percentage: 40, color: '#b70f23' },
    { category: 'Boissons', revenue: 11325, percentage: 25, color: '#f4b71b' },
    { category: 'Desserts', revenue: 7237, percentage: 16, color: '#70070e' },
    { category: 'Entrées', revenue: 5427, percentage: 12, color: '#8b5cf6' },
    { category: 'Accompagnements', revenue: 3161, percentage: 7, color: '#06b6d4' }
  ];

  const hourlyPerformance = [
    { hour: '11h', orders: 15, revenue: 427 },
    { hour: '12h', orders: 45, revenue: 1285 },
    { hour: '13h', orders: 62, revenue: 1764 },
    { hour: '14h', orders: 38, revenue: 1092 },
    { hour: '18h', orders: 28, revenue: 798 },
    { hour: '19h', orders: 55, revenue: 1567 },
    { hour: '20h', orders: 71, revenue: 2014 },
    { hour: '21h', orders: 49, revenue: 1389 }
  ];

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  };

  const renderKPICard = (title: string, metric: any, icon: React.ReactNode, unit: string = '€') => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            {icon}
          </div>
          <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="gap-1">
            {getTrendIcon(metric.trend, metric.change)}
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {unit === '€' ? formatCurrency(metric.current) : metric.current.toLocaleString('fr-FR')}
              {unit !== '€' && unit}
            </span>
            <span className={`text-sm ${getTrendColor(metric.trend)}`}>
              {unit === '€' ? formatCurrency(metric.previous) : metric.previous.toLocaleString('fr-FR')}
              {unit !== '€' && unit}
            </span>
          </div>
          
          {metric.target && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Objectif</span>
                <span>{metric.targetProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#b70f23] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metric.targetProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            ← Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#b70f23] flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analyses financières
            </h1>
            <p className="text-muted-foreground">
              Tableaux de bord et métriques de performance
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderKPICard(
          'Chiffre d\'affaires',
          performanceMetrics.revenue,
          <DollarSign className="w-6 h-6 text-[#b70f23]" />
        )}
        {renderKPICard(
          'Panier moyen',
          performanceMetrics.avgOrderValue,
          <ShoppingCart className="w-6 h-6 text-[#f4b71b]" />
        )}
        {renderKPICard(
          'Marge bénéficiaire',
          performanceMetrics.profitMargin,
          <Target className="w-6 h-6 text-[#70070e]" />,
          '%'
        )}
        {renderKPICard(
          'Nombre de clients',
          performanceMetrics.customerCount,
          <Users className="w-6 h-6 text-[#8b5cf6]" />,
          ''
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Évolution mensuelle
            </CardTitle>
            <CardDescription>
              Comparaison revenus, dépenses et bénéfices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(data.revenue)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                      <div 
                        className="bg-[#b70f23]"
                        style={{ width: `${(data.revenue / 50000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                      <div 
                        className="bg-[#70070e]"
                        style={{ width: `${(data.expenses / 50000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                      <div 
                        className="bg-[#f4b71b]"
                        style={{ width: `${(data.profit / 50000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#b70f23] rounded"></div>
                  <span>Revenus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#70070e] rounded"></div>
                  <span>Dépenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f4b71b] rounded"></div>
                  <span>Bénéfices</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Répartition par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Revenus par catégorie
            </CardTitle>
            <CardDescription>
              Analyse des ventes par type de produit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(category.revenue)}</div>
                      <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${category.percentage * 4}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance par heure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Performance par créneaux horaires
          </CardTitle>
          <CardDescription>
            Analyse des commandes et revenus par heure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {hourlyPerformance.map((slot, index) => (
              <div key={index} className="text-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-lg font-bold text-[#b70f23]">{slot.hour}</div>
                <div className="text-sm text-muted-foreground">{slot.orders} cmd</div>
                <div className="text-xs font-medium">{formatCurrency(slot.revenue)}</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-[#b70f23] h-1 rounded-full transition-all duration-500"
                    style={{ width: `${(slot.revenue / 2100) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs de santé financière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Points forts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Croissance CA +12.8%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-600" />
                <span>Marge en amélioration</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                <span>Fidélisation client +10.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              Points d'attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>Pic de charges en janvier</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Délais de paiement longs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span>Baisse ventes 14h-18h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Target className="w-5 h-5" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-[#b70f23]" />
                <span>Promouvoir desserts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#b70f23]" />
                <span>Happy hour 14h-18h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[#b70f23]" />
                <span>Programme fidélité</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}