import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { SidebarWithSubmenus } from "../components/SidebarWithSubmenus";
import {
  Home,
  Package,
  MapPin,
  Clock,
  Euro,
  TrendingUp,
  Route,
  Star,
  Calendar,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Navigation,
  Timer,
  Wallet,
  BarChart3
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface DeliveryDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function DeliveryDashboard({ onBack, userSession }: DeliveryDashboardProps) {
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
      id: "courses-actives",
      label: "Courses actives",
      icon: Package,
      onClick: () => setActiveSection("courses-actives")
    },
    {
      id: "optimisation-gps",
      label: "Optimisation GPS",
      icon: Navigation,
      onClick: () => setActiveSection("optimisation-gps")
    },
    {
      id: "revenus",
      label: "Suivi des revenus",
      icon: Euro,
      onClick: () => setActiveSection("revenus")
    },
    {
      id: "historique",
      label: "Historique",
      icon: Calendar,
      onClick: () => setActiveSection("historique")
    },
    {
      id: "statistiques",
      label: "Statistiques",
      icon: BarChart3,
      onClick: () => setActiveSection("statistiques")
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

  // Données de performance livreur
  const performanceMetrics = [
    {
      id: "revenus-jour",
      value: "€89.50",
      label: "Revenus du jour",
      color: "bg-[#f4b71b]",
      icon: Euro
    },
    {
      id: "courses-completees",
      value: "12",
      label: "Courses complétées",
      color: "bg-green-500",
      icon: Package
    },
    {
      id: "temps-moyen",
      value: "18min",
      label: "Temps moyen",
      color: "bg-blue-500",
      icon: Clock
    },
    {
      id: "note-moyenne",
      value: "4.8/5",
      label: "Note moyenne",
      color: "bg-purple-500",
      icon: Star
    }
  ];

  const actionsRapides = [
    {
      id: "nouvelle-course",
      icon: Package,
      color: "bg-green-500",
      label: "Nouvelle course"
    },
    {
      id: "optimiser-route",
      icon: Route,
      color: "bg-blue-500",
      label: "Optimiser route"
    },
    {
      id: "revenus",
      icon: Wallet,
      color: "bg-[#f4b71b]",
      label: "Mes revenus"
    },
    {
      id: "navigation",
      icon: Navigation,
      color: "bg-purple-500",
      label: "GPS"
    },
    {
      id: "historique",
      icon: Calendar,
      color: "bg-orange-500",
      label: "Historique"
    },
    {
      id: "parametres",
      icon: Settings,
      color: "bg-gray-600",
      label: "Paramètres"
    }
  ];

  const coursesEnCours = [
    {
      id: "C001",
      restaurant: "Bistrot du Marché",
      client: "Marie D.",
      address: "12 Rue de la Paix",
      time: "15min",
      amount: "€7.50",
      status: "En cours",
      priority: "normal"
    }
  ];

  const statsJour = {
    distance: "48.2 km",
    tempsTotal: "4h 20min",
    pausesTotales: "45min",
    efficacite: "92%"
  };

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
          userType="delivery"
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
                userType="delivery"
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Livreur</h1>
                <p className="text-gray-600">Dashboard livreur indépendant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                En ligne
              </Badge>
              <Button onClick={onBack}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Performance du jour */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance du jour</h2>
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
                  className={`${action.color} text-white rounded-2xl p-4 relative overflow-hidden transition-all hover:shadow-xl h-20 flex flex-col justify-center items-center text-center`}
                >
                  <action.icon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Courses en cours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Courses en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coursesEnCours.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{course.restaurant}</div>
                      <Badge className="bg-blue-100 text-blue-700">{course.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {course.address}
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {course.time}
                        </span>
                        <span className="font-bold text-green-600">{course.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Statistiques de la journée */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de la journée</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Distance parcourue</span>
                  <span className="font-medium">{statsJour.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps total</span>
                  <span className="font-medium">{statsJour.tempsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pauses totales</span>
                  <span className="font-medium">{statsJour.pausesTotales}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficacité</span>
                  <span className="font-medium text-green-600">{statsJour.efficacite}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}