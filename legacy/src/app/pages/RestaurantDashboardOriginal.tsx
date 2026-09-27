import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PDFExport } from "../components/PDFExport";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Home,
  Command,
  Calendar,
  List,
  ChefHat,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Clock,
  Users,
  Plus,
  Utensils,
  Box,
  ShoppingCart,
  Settings,
  Search,
  Bell,
  LogOut,
  Download,
  FileText,
  Euro,
  Star,
  TrendingUp
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface RestaurantDashboardOriginalProps {
  onBack: () => void;
  userSession: UserSession | null;
  onGoToAdvancedExport?: () => void;
}

export function RestaurantDashboardOriginal({ onBack, userSession, onGoToAdvancedExport }: RestaurantDashboardOriginalProps) {
  const [activeSection, setActiveSection] = useState("tableau-de-bord");
  const [showExportPanel, setShowExportPanel] = useState(false);

  // Mock restaurant data
  const restaurantData = {
    name: "Restaurant Demo",
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
      performance: [
        { day: "L", value: 45 },
        { day: "M", value: 52 },
        { day: "M", value: 61 },
        { day: "J", value: 78 },
        { day: "V", value: 89 },
        { day: "S", value: 92 },
        { day: "D", value: 67 }
      ]
    }
  };

  const sidebarItems = [
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home },
    { id: "commande-live", label: "Commande Live", icon: Command },
    { id: "reservation", label: "Réservation", icon: Calendar },
    { id: "liste-commandes", label: "Liste de commandes", icon: List, hasArrow: true },
    { id: "gestion-cuisine", label: "Gestion Cuisine", icon: ChefHat, hasArrow: true },
    { id: "stock-ingredients", label: "Stock d'ingrédients", icon: Package, hasArrow: true },
    { id: "entreprises-livraison", label: "Entreprises de livraison", icon: Truck, hasArrow: true },
    { id: "logiciels-caisse", label: "Logiciels Caisse", icon: CreditCard },
    { id: "rapports", label: "Rapports", icon: BarChart3 },
    { id: "historique-paiements", label: "Historique des paiements", icon: Clock },
    { id: "liste-clients", label: "Liste des clients", icon: Users },
  ];

  const metricsData = [
    { label: "Menu", value: "0/100", color: "bg-blue-500", icon: Utensils },
    { label: "Packages", value: "0/100", color: "bg-cyan-400", icon: Box },
    { label: "Spécialités", value: "0/100", color: "bg-green-500", icon: Star },
    { label: "Commandes", value: "0/5000", color: "bg-red-700", icon: ShoppingCart },
    { label: "", value: "3,300", color: "bg-orange-400", icon: Euro, subtitle: "CHAP" },
    { label: "Clients", value: "0", color: "bg-purple-500", icon: Users },
  ];

  const actionsData = [
    { label: "Nouvelle commande", color: "bg-red-700", icon: Plus },
    { label: "Gérer menu", color: "bg-blue-500", icon: Utensils },
    { label: "Stock", color: "bg-green-500", icon: Package, badge: "3" },
    { label: "Livraisons", color: "bg-gradient-to-r from-orange-500 to-orange-600", icon: Truck },
    { label: "Rapports", color: "bg-purple-500", icon: BarChart3 },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings },
  ];

  const handleExport = (config: any) => {
    console.log("Export config:", config);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#b70f23] to-[#70070e] text-white flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-medium">CHAPFOODY</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.hasArrow && <span className="text-white/60">›</span>}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Restaurateur</h1>
              <p className="text-gray-600">Dashboard restaurant</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExportPanel(!showExportPanel)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={onBack}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Export Panel */}
          {showExportPanel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Export des données
                    <div className="flex gap-2">
                      {onGoToAdvancedExport && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={onGoToAdvancedExport}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Export avancé
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowExportPanel(false)}
                      >
                        ×
                      </Button>
                    </div>
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

          {/* Metrics Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des données</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {metricsData.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${metric.color} text-white rounded-2xl p-4 relative overflow-hidden h-24 cursor-pointer hover:scale-105 transition-transform`}
                >
                  {/* Windows Phone style decorative elements */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/10 rounded-full"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <metric.icon className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                      <div className="text-lg font-bold leading-tight">{metric.value}</div>
                      <div className="text-xs text-white/80 uppercase tracking-wide">{metric.label}</div>
                      {metric.subtitle && (
                        <div className="text-xs text-white/60 font-medium">{metric.subtitle}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="mb-4">
              <h3 className="text-base font-medium text-gray-800 mb-4">Tableau de bord - Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {actionsData.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${action.color} text-white rounded-2xl p-6 text-left relative overflow-hidden transition-all hover:shadow-xl h-32`}
                  >
                    {/* Windows Phone style decorative elements */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <action.icon className="w-7 h-7 text-white" />
                        {action.badge && (
                          <div className="w-7 h-7 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">{action.badge}</span>
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-left">{action.label}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-bold text-gray-900">Premium Gold</div>
                  <div className="text-sm text-gray-600">NOM DU PACKAGE</div>
                  <div className="text-lg font-bold text-gray-900">13/13</div>
                  <div className="text-xs text-gray-600">FEATURES</div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={restaurantData.charts.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}