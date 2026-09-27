import { useState } from "react";
import { motion } from "motion/react";
import { ResponsiveDashboardLayout } from "../components/ResponsiveDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  BarChart3,
  FileText,
  Settings
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface RestaurantDashboardCompleteProps {
  onBack: () => void;
  userSession: UserSession | null;
  onGoToAdvancedExport?: () => void;
}

export function RestaurantDashboardComplete({ onBack, userSession, onGoToAdvancedExport }: RestaurantDashboardCompleteProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubSection, setActiveSubSection] = useState("");
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

  const menuSections = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: Home,
      onClick: () => {
        setActiveSection("overview");
        setActiveSubSection("");
      }
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      hasSubmenu: true,
      submenuItems: [
        {
          id: "performance",
          label: "Performance",
          icon: TrendingUp,
          onClick: () => {
            setActiveSection("analytics");
            setActiveSubSection("performance");
          }
        },
        {
          id: "customers",
          label: "Clients",
          icon: Users,
          onClick: () => {
            setActiveSection("analytics");
            setActiveSubSection("customers");
          }
        },
        {
          id: "products",
          label: "Produits",
          icon: Package,
          onClick: () => {
            setActiveSection("analytics");
            setActiveSubSection("products");
          }
        }
      ]
    },
    {
      id: "orders",
      label: "Commandes",
      icon: ShoppingCart,
      onClick: () => {
        setActiveSection("orders");
        setActiveSubSection("");
      }
    },
    {
      id: "export",
      label: "Export",
      icon: Download,
      hasSubmenu: true,
      submenuItems: [
        {
          id: "quick-export",
          label: "Export rapide",
          icon: Download,
          onClick: () => {
            setActiveSection("export");
            setActiveSubSection("quick-export");
            setShowExportPanel(true);
          }
        },
        {
          id: "advanced-export",
          label: "Export avancé",
          icon: FileText,
          onClick: () => {
            if (onGoToAdvancedExport) {
              onGoToAdvancedExport();
            }
          }
        }
      ]
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      onClick: () => {
        setActiveSection("settings");
        setActiveSubSection("");
      }
    }
  ];

  const handleExport = (config: any) => {
    console.log("Export config:", config);
    // Ici, l'export serait traité côté serveur
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Export Panel */}
      {showExportPanel && activeSubSection === "quick-export" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Export rapide
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowExportPanel(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PDFExport
                restaurantData={restaurantData}
                onExport={handleExport}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

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
    </div>
  );

  const renderAnalytics = () => {
    if (activeSubSection === "performance") {
      return (
        <div className="space-y-6">
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
      );
    }

    if (activeSubSection === "customers") {
      return (
        <div className="space-y-6">
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
        </div>
      );
    }

    if (activeSubSection === "products") {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Interface d'analyse des produits à venir...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Sélectionnez une section dans le menu de gauche.</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Interface de gestion des commandes à venir...</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderExport = () => {
    if (activeSubSection === "quick-export") {
      return renderOverview(); // L'export panel sera affiché dans l'overview
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Options d'export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => {
                  setActiveSubSection("quick-export");
                  setShowExportPanel(true);
                }}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export rapide PDF
              </Button>
              <Button 
                onClick={() => onGoToAdvancedExport && onGoToAdvancedExport()}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export avancé et programmé
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Interface de paramètres à venir...</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "analytics":
        return renderAnalytics();
      case "orders":
        return renderOrders();
      case "export":
        return renderExport();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const getPageTitle = () => {
    if (activeSubSection) {
      const section = menuSections.find(s => s.id === activeSection);
      const subSection = section?.submenuItems?.find(sub => sub.id === activeSubSection);
      return `${section?.label} - ${subSection?.label}`;
    }
    const section = menuSections.find(s => s.id === activeSection);
    return section?.label || "Dashboard Restaurant";
  };

  return (
    <ResponsiveDashboardLayout
      title={getPageTitle()}
      userType="restaurant"
      menuSections={menuSections}
      activeSection={activeSection}
      activeSubSection={activeSubSection}
      onLogout={onBack}
      userSession={userSession}
    >
      {renderContent()}
    </ResponsiveDashboardLayout>
  );
}