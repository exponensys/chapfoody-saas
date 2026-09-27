import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { SidebarWithSubmenus } from "../components/SidebarWithSubmenus";
import {
  Home,
  Euro,
  MousePointer,
  UserPlus,
  TrendingUp,
  Link2,
  BarChart3,
  Users,
  Target,
  Award,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Eye,
  Share2,
  FileText,
  Calendar
} from "lucide-react";
import { AnimatePresence } from "motion/react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface AffiliateDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function AffiliateDashboard({ onBack, userSession }: AffiliateDashboardProps) {
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
      id: "commissions",
      label: "Commissions",
      icon: Euro,
      onClick: () => setActiveSection("commissions")
    },
    {
      id: "liens-campagnes",
      label: "Liens & Campagnes",
      icon: Link2,
      onClick: () => setActiveSection("liens-campagnes")
    },
    {
      id: "statistiques",
      label: "Statistiques",
      icon: BarChart3,
      onClick: () => setActiveSection("statistiques")
    },
    {
      id: "filleuls",
      label: "Filleuls",
      icon: Users,
      onClick: () => setActiveSection("filleuls")
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

  // Données de performance d'affiliation
  const performanceMetrics = [
    {
      id: "commissions",
      value: "€1,248.50",
      label: "Commissions",
      color: "bg-[#b70f23]",
      icon: Euro
    },
    {
      id: "clics",
      value: "3,482",
      label: "Clics",
      color: "bg-[#f4b71b]",
      icon: MousePointer
    },
    {
      id: "inscriptions",
      value: "142",
      label: "Inscriptions", 
      color: "bg-green-500",
      icon: UserPlus
    },
    {
      id: "conversion",
      value: "8.4%",
      label: "Conversion",
      color: "bg-purple-500",
      icon: TrendingUp
    }
  ];

  const actionsRapides = [
    {
      id: "revenus",
      icon: Euro,
      color: "bg-[#b70f23]"
    },
    {
      id: "nouveau-lien",
      icon: Link2,
      color: "bg-[#f4b71b]"
    },
    {
      id: "partager",
      icon: Share2,
      color: "bg-blue-500"
    },
    {
      id: "analytics",
      icon: BarChart3,
      color: "bg-green-500"
    },
    {
      id: "filleuls",
      icon: Users,
      color: "bg-purple-500",
      badge: "142"
    },
    {
      id: "parametres",
      icon: Settings,
      color: "bg-orange-500"
    }
  ];

  const progressData = [
    {
      title: "Progression vers les objectifs",
      subtitle: "Vos performances ce mois par rapport aux objectifs fixés",
      items: [
        {
          label: "Commissions mensuelles",
          value: "€1,248 / €1,500",
          progress: 83,
          status: "83% de l'objectif atteint"
        },
        {
          label: "Nouvelles inscriptions", 
          value: "142 / 200",
          progress: 71,
          status: "71% de l'objectif atteint"
        },
        {
          label: "Taux de conversion",
          value: "8.4% / 10%",
          progress: 84,
          status: "84% de l'objectif atteint"
        }
      ]
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
          userType="affiliate"
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
                userType="affiliate"
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Affilié</h1>
                <p className="text-gray-600">Dashboard affilié</p>
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
          {/* Performance d'affiliation */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance d'affiliation</h2>
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

          {/* Progression vers les objectifs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <CardTitle>Progression vers les objectifs</CardTitle>
              </div>
              <p className="text-sm text-gray-600">Vos performances ce mois par rapport aux objectifs fixés</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressData[0].items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.value}</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{item.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}