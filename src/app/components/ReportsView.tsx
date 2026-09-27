import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText,
  Calendar as CalendarIcon,
  PieChart,
  LineChart,
  Users,
  Euro,
  ShoppingCart,
  Star,
  Clock,
  Target,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// Mock data pour les graphiques
const salesData = [
  { day: 'Lun', sales: 1200, orders: 45, customers: 38 },
  { day: 'Mar', sales: 1800, orders: 67, customers: 52 },
  { day: 'Mer', sales: 1500, orders: 58, customers: 44 },
  { day: 'Jeu', sales: 2100, orders: 78, customers: 63 },
  { day: 'Ven', sales: 2400, orders: 89, customers: 71 },
  { day: 'Sam', sales: 2800, orders: 105, customers: 84 },
  { day: 'Dim', sales: 2200, orders: 82, customers: 67 }
];

const monthlyData = [
  { month: 'Jan', sales: 28000, profit: 8400, orders: 890 },
  { month: 'Fév', sales: 32000, profit: 9600, orders: 1020 },
  { month: 'Mar', sales: 29000, profit: 8700, orders: 950 },
  { month: 'Avr', sales: 35000, profit: 10500, orders: 1150 },
  { month: 'Mai', sales: 42000, profit: 12600, orders: 1380 },
  { month: 'Jun', sales: 39000, profit: 11700, orders: 1280 }
];

const topProductsData = [
  { name: 'Pizza Margherita', sales: 580, value: 8700 },
  { name: 'Burger Classic', sales: 420, value: 6300 },
  { name: 'Salade César', sales: 340, value: 4080 },
  { name: 'Pasta Carbonara', sales: 290, value: 4350 },
  { name: 'Fish & Chips', sales: 250, value: 3750 }
];

const customerSegmentData = [
  { name: 'Nouveaux', value: 25, color: '#8884d8' },
  { name: 'Réguliers', value: 45, color: '#82ca9d' },
  { name: 'VIP', value: 20, color: '#ffc658' },
  { name: 'Inactifs', value: 10, color: '#ff7c7c' }
];

const performanceMetrics = [
  { label: 'Chiffre d\'affaires', value: '€45,280', change: '+12.5%', positive: true },
  { label: 'Nombre de commandes', value: '1,847', change: '+8.2%', positive: true },
  { label: 'Panier moyen', value: '€24.52', change: '-2.1%', positive: false },
  { label: 'Taux de conversion', value: '3.4%', change: '+0.8%', positive: true },
  { label: 'Clients uniques', value: '892', change: '+15.3%', positive: true },
  { label: 'Note moyenne', value: '4.7/5', change: '+0.2', positive: true }
];

interface ReportsViewProps {
  onBack?: () => void;
}

export function ReportsView({ onBack }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Analytics</h1>
          <p className="text-gray-600">Analyse détaillée de vos performances commerciales</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    metric.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${metric.positive ? '' : 'rotate-180'}`} />
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="sales">Ventes</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="customers">Clients</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="financial">Financier</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab}>
            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique des ventes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Évolution des ventes (7 jours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b70f23" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#b70f23" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#b70f23" 
                          fillOpacity={1} 
                          fill="url(#salesGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Répartition des clients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Répartition des clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={customerSegmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {customerSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top produits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Top 5 des produits les plus vendus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProductsData.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.sales} unités vendues</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(product.value)}</p>
                          <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ventes */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution mensuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Line type="monotone" dataKey="sales" stroke="#b70f23" strokeWidth={2} />
                        <Line type="monotone" dataKey="profit" stroke="#f4b71b" strokeWidth={2} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nombre de commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#b70f23" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Produits */}
            <TabsContent value="products" className="space-y-4">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Analyse des produits</h3>
                <p className="text-gray-500 mb-4">
                  Performances détaillées de vos produits et catégories
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <Card className="p-4">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium">Top ventes</h4>
                    <p className="text-sm text-gray-500">Produits les plus vendus</p>
                  </Card>
                  <Card className="p-4">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Tendances</h4>
                    <p className="text-sm text-gray-500">Évolution des ventes</p>
                  </Card>
                  <Card className="p-4">
                    <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Performance</h4>
                    <p className="text-sm text-gray-500">Marges et rentabilité</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Clients */}
            <TabsContent value="customers" className="space-y-4">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Analyse clientèle</h3>
                <p className="text-gray-500 mb-4">
                  Comportements et segmentation de vos clients
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <Card className="p-4">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Segmentation</h4>
                    <p className="text-sm text-gray-500">Groupes de clients</p>
                  </Card>
                  <Card className="p-4">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Acquisition</h4>
                    <p className="text-sm text-gray-500">Nouveaux clients</p>
                  </Card>
                  <Card className="p-4">
                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Rétention</h4>
                    <p className="text-sm text-gray-500">Fidélisation</p>
                  </Card>
                  <Card className="p-4">
                    <Euro className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Valeur vie</h4>
                    <p className="text-sm text-gray-500">LTV clients</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-4">
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Indicateurs de performance</h3>
                <p className="text-gray-500 mb-4">
                  KPIs et métriques opérationnelles
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <Card className="p-4">
                    <Target className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-medium">Objectifs</h4>
                    <p className="text-sm text-gray-500">Suivi des cibles</p>
                  </Card>
                  <Card className="p-4">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Efficacité</h4>
                    <p className="text-sm text-gray-500">Temps de service</p>
                  </Card>
                  <Card className="p-4">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium">Qualité</h4>
                    <p className="text-sm text-gray-500">Satisfaction client</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Financier */}
            <TabsContent value="financial" className="space-y-4">
              <div className="text-center py-12">
                <Euro className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Rapports financiers</h3>
                <p className="text-gray-500 mb-4">
                  Analyse financière détaillée et rentabilité
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <Card className="p-4">
                    <Euro className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Chiffre d'affaires</h4>
                    <p className="text-sm text-gray-500">Évolution CA</p>
                  </Card>
                  <Card className="p-4">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Marges</h4>
                    <p className="text-sm text-gray-500">Rentabilité</p>
                  </Card>
                  <Card className="p-4">
                    <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Coûts</h4>
                    <p className="text-sm text-gray-500">Structure des coûts</p>
                  </Card>
                  <Card className="p-4">
                    <PieChart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Répartition</h4>
                    <p className="text-sm text-gray-500">Analyse ABC</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}