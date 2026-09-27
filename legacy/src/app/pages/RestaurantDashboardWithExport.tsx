import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { PDFExport } from "../components/PDFExport";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Euro,
  ShoppingCart,
  Users,
  Star,
  Clock,
  Package,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Target,
  Zap,
  Eye,
  Share2,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface RestaurantDashboardWithExportProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function RestaurantDashboardWithExport({ onBack, userSession }: RestaurantDashboardWithExportProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showExportPanel, setShowExportPanel] = useState(false);

  // Mock restaurant data
  const restaurantData = {
    name: "Bistrot du Marché",
    type: "Restaurant",
    period: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    metrics: {
      totalRevenue: 42350,
      totalOrders: 1247,
      averageOrderValue: 33.95,
      customerSatisfaction: 4.7,
      deliveryTime: 28,
      returnRate: 12.5
    },
    charts: {
      revenue: [
        { period: "Sem 1", value: 8500 },
        { period: "Sem 2", value: 9200 },
        { period: "Sem 3", value: 11400 },
        { period: "Sem 4", value: 12250 }
      ],
      orders: [
        { period: "Lun", value: 45 },
        { period: "Mar", value: 52 },
        { period: "Mer", value: 61 },
        { period: "Jeu", value: 48 },
        { period: "Ven", value: 78 },
        { period: "Sam", value: 92 },
        { period: "Dim", value: 67 }
      ],
      satisfaction: [
        { period: "Jan", value: 4.5 },
        { period: "Fév", value: 4.6 },
        { period: "Mar", value: 4.7 },
        { period: "Avr", value: 4.8 }
      ]
    },
    topProducts: [
      { name: "Burger Signature", sales: 234, revenue: 3276, trend: 12 },
      { name: "Salade César", sales: 189, revenue: 2456, trend: 8 },
      { name: "Pizza Margherita", sales: 156, revenue: 2184, trend: -3 },
      { name: "Pâtes Carbonara", sales: 134, revenue: 1876, trend: 15 }
    ],
    customerInsights: {
      newCustomers: 156,
      returningCustomers: 892,
      averageOrderFrequency: 2.3,
      peakHours: [
        { hour: "12h", orders: 45 },
        { hour: "13h", orders: 67 },
        { hour: "19h", orders: 78 },
        { hour: "20h", orders: 89 }
      ]
    }
  };

  const stats = [
    {
      title: "Chiffre d'affaires",
      value: `${restaurantData.metrics.totalRevenue.toLocaleString()}€`,
      change: "+12.5%",
      trend: "up",
      icon: Euro,
      color: "text-green-600"
    },
    {
      title: "Commandes",
      value: restaurantData.metrics.totalOrders.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Panier moyen",
      value: `${restaurantData.metrics.averageOrderValue}€`,
      change: "+4.1%",
      trend: "up",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Satisfaction",
      value: `${restaurantData.metrics.customerSatisfaction}/5`,
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const handleExport = (config: any) => {
    console.log("Export config:", config);
    // Ici, l'export serait traité côté serveur
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Restaurant</h1>
            <p className="text-gray-600">{restaurantData.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowExportPanel(!showExportPanel)}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={onBack}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showExportPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <PDFExport
                  restaurantData={restaurantData}
                  onExport={handleExport}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <div className={`flex items-center mt-2 text-sm ${stat.color}`}>
                            {stat.trend === "up" ? (
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            {stat.change}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gray-100`}>
                          <stat.icon className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={restaurantData.charts.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}€`, "CA"]} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#b70f23" 
                        fill="#b70f23" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commandes par jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={restaurantData.charts.orders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f4b71b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {restaurantData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.sales} ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{product.revenue}€</p>
                        <div className={`flex items-center text-sm ${
                          product.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(product.trend)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction client</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={restaurantData.charts.satisfaction}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#b70f23" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heures de pointe</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={restaurantData.customerInsights.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#70070e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Interface de gestion des commandes à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {restaurantData.customerInsights.newCustomers}
                  </div>
                  <p className="text-sm text-gray-600">Nouveaux clients</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {restaurantData.customerInsights.returningCustomers}
                  </div>
                  <p className="text-sm text-gray-600">Clients fidèles</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {restaurantData.customerInsights.averageOrderFrequency}
                  </div>
                  <p className="text-sm text-gray-600">Fréquence moyenne</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}