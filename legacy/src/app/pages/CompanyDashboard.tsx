import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { SidebarWithSubmenus } from "../components/SidebarWithSubmenus";
import {
  Home,
  Users,
  Truck,
  Clock,
  Star,
  BarChart3,
  MapPin,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Package,
  Timer,
  Award,
  Activity
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface CompanyDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function CompanyDashboard({ onBack, userSession }: CompanyDashboardProps) {
  const [activeSection, setActiveSection] = useState("tableau-de-bord");
  const [activeSubSection, setActiveSubSection] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const menuSections = [
    {
      id: "tableau-de-bord",
      label: "Tableau de bord",
      icon: Home,
      onClick: () => setActiveSection("tableau-de-bord")
    },
    {
      id: "equipe-livreurs",
      label: "Équipe de livreurs",
      icon: Users,
      onClick: () => setActiveSection("equipe-livreurs")
    },
    {
      id: "livraisons-actives", 
      label: "Livraisons actives",
      icon: Package,
      onClick: () => setActiveSection("livraisons-actives")
    },
    {
      id: "statistiques",
      label: "Statistiques",
      icon: BarChart3,
      onClick: () => setActiveSection("statistiques")
    },
    {
      id: "zones-couverture",
      label: "Zones de couverture",
      icon: MapPin,
      onClick: () => setActiveSection("zones-couverture")
    },
    {
      id: "parametres",
      label: "Paramètres",
      icon: Settings,
      onClick: () => setActiveSection("parametres")
    }
  ];

  const handleToggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Données de performance d'entreprise
  const performanceMetrics = [
    {
      id: "livreurs-actifs",
      value: "18/25",
      label: "Livreurs actifs",
      color: "bg-[#70070e]",
      icon: Users
    },
    {
      id: "livraisons",
      value: "286",
      label: "Livraisons",
      color: "bg-[#f4b71b]",
      icon: Package
    },
    {
      id: "temps-moyen",
      value: "22min",
      label: "Temps moyen",
      color: "bg-orange-500",
      icon: Clock
    },
    {
      id: "satisfaction",
      value: "4.6/5",
      label: "Satisfaction",
      color: "bg-green-500",
      icon: Star
    }
  ];

  const actionsRapides = [
    {
      id: "equipe",
      icon: Users,
      color: "bg-[#70070e]"
    },
    {
      id: "livraisons",
      icon: Truck,
      color: "bg-[#f4b71b]",
      badge: "18"
    },
    {
      id: "analytics",
      icon: BarChart3,
      color: "bg-blue-500"
    },
    {
      id: "zones",
      icon: MapPin,
      color: "bg-purple-500"
    },
    {
      id: "ajouter",
      icon: Plus,
      color: "bg-green-500"
    },
    {
      id: "parametres",
      icon: Settings,
      color: "bg-orange-500"
    }
  ];

  const alertesEnCours = [
    {
      message: "3 livreurs en retard sur leurs courses",
      action: "Voir détails",
      priority: "high"
    },
    {
      message: "Zone Nord: forte demande, besoin de renfort",
      action: "Assigner livreurs", 
      priority: "medium"
    }
  ];

  const topPerformers = [
    {
      name: "Marc Dupont",
      deliveries: "24 livraisons",
      rating: "4.9/5",
      earnings: "€156.80",
      avatar: "M"
    }
  ];

  const zoneRepartition = [
    {
      zone: "Centre-ville",
      coverage: "6/8 livreurs",
      percentage: 85,
      status: "Forte charge"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <SidebarWithSubmenus
          userType="company"
          menuSections={menuSections}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          userEmail={userSession?.email}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 z-50 lg:hidden"
          >
            <div className="relative">
              <SidebarWithSubmenus
                userType="company"
                menuSections={menuSections}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
                userEmail={userSession?.email}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={toggleMobileSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Entreprise</h1>
                <p className="text-gray-600">Dashboard company</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button onClick={onBack}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Performance de l'entreprise */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance de l'entreprise</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${metric.color} text-white rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                >
                  {/* Windows Phone style decorative elements */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white/10 rounded-full"></div>
                  
                  <div className="relative z-10 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between">
                      <metric.icon className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <div className="text-xl font-bold leading-tight">{metric.value}</div>
                      <div className="text-sm text-white/80 uppercase tracking-wide">{metric.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {actionsRapides.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${action.color} text-white rounded-2xl p-6 relative overflow-hidden transition-all hover:shadow-xl h-24`}
                >
                  {/* Windows Phone style decorative elements */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/10 rounded-full"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <action.icon className="w-6 h-6 text-white" />
                      {action.badge && (
                        <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{action.badge}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alertes en cours */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <CardTitle>Alertes en cours</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertesEnCours.map((alerte, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-700 mb-2">{alerte.message}</p>
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                      {alerte.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Répartition des zones */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des zones</CardTitle>
                <p className="text-sm text-gray-600">Couverture actuelle par zone</p>
              </CardHeader>
              <CardContent>
                {zoneRepartition.map((zone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{zone.zone}</span>
                      <span className="text-sm text-gray-600">{zone.coverage}</span>
                    </div>
                    <Progress value={zone.percentage} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Charge: {zone.percentage}%</span>
                      <span className="text-sm font-medium text-orange-600">{zone.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top performers du jour */}
          <Card>
            <CardHeader>
              <CardTitle>Top performers du jour</CardTitle>
              <p className="text-sm text-gray-600">Livreurs les plus performants</p>
            </CardHeader>
            <CardContent>
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {performer.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-sm text-gray-600">{performer.deliveries} • {performer.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{performer.earnings}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}