import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { SidebarWithSubmenus } from "../components/SidebarWithSubmenus";
import { PDFExport } from "../components/PDFExport";
import { StockView } from "../components/StockView";
import { MenuView } from "../components/MenuView";
import { AccountingView } from "../components/AccountingView";
import { FinancialAnalyticsView } from "../components/FinancialAnalyticsView";
import { InvoiceManagementView } from "../components/InvoiceManagementView";
import { TransactionsView } from "../components/TransactionsView";
import { CashClosureView } from "../components/CashClosureView";
import { VATManagementView } from "../components/VATManagementView";
import { RefundsView } from "../components/RefundsView";
import { POSView } from "../components/POSView";
import { SettingsView } from "../components/SettingsView";
import { ThemesView } from "../components/ThemesView";
import { FonctionnalitesView } from "../components/FonctionnalitesView";
import { CustomPagesView } from "../components/CustomPagesView";
import { LiveOrdersView } from "../components/LiveOrdersView";
import { KitchenView } from "../components/KitchenView";
import { ReservationView } from "../components/ReservationView";
import { AdvancedMarketingView } from "../components/AdvancedMarketingView";
import { LiveOrdersProvider, useLiveOrders } from "../contexts/LiveOrdersContext";
import { mockRestaurantData, getMenuSections, metricsData, getActionsData } from "../data/restaurantDashboardData";
import { testSound } from "../utils/soundUtils";
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
  TrendingUp,
  Menu,
  X,
  ClipboardList,
  Archive,
  CheckCircle,
  Hourglass,
  Package2,
  Trash2,
  Layers,
  Pizza,
  Drumstick,
  Cookie,
  AlertTriangle,
  Scale,
  QrCode,
  Folder,
  MapPin,
  Percent,
  Eye,
  TrendingDown,
  FilePieChart,
  Calculator
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface RestaurantDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
  onGoToAdvancedExport?: () => void;
}

function RestaurantDashboardContent({ onBack, userSession, onGoToAdvancedExport }: RestaurantDashboardProps) {
  const [activeSection, setActiveSection] = useState("tableau-de-bord");
  const [activeSubSection, setActiveSubSection] = useState("");
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['stock-ingredients', 'gestion-cuisine', 'comptabilite']));
  
  // Hook pour les commandes live
  const { pendingOrders, hasNewOrders, unreadOrdersCount, soundEnabled, toggleSound, stopNotifications, markAsRead } = useLiveOrders();

  // L'effet d'auto-expansion a été retiré pour permettre à l'utilisateur de contrôler manuellement les dropdowns

  // Fonction pour gérer la navigation vers les sous-sections
  const handleSubSectionNavigation = (section: string, subSection: string) => {
    setActiveSection(section);
    setActiveSubSection(subSection);
    // Étendre automatiquement la section parente
    setExpandedSections(prev => new Set([...prev, section]));
  };

  // Fonction pour gérer le changement de section active
  const handleActiveSection = (section: string) => {
    setActiveSection(section);
    // Si on va vers "commande-live", marquer les commandes comme lues
    if (section === "commande-live") {
      markAsRead();
    }
    // Ne plus auto-étendre pour permettre à l'utilisateur de contrôler l'état des dropdowns
  };

  const menuSections = getMenuSections(hasNewOrders, unreadOrdersCount, activeSection, handleActiveSection, setActiveSubSection, handleSubSectionNavigation);

  const handleExport = (config: any) => {
    console.log("Export config:", config);
  };

  const handleNotificationToggle = () => {
    // Arrêter les bips persistants d'abord si il y a des nouvelles commandes
    if (hasNewOrders) {
      stopNotifications();
      // Jouer un bip de confirmation d'arrêt
      setTimeout(() => testSound('notification'), 100);
      return;
    }
    
    // Sinon, basculer les préférences sonores
    const newState = toggleSound();
    // Test du son quand on l'active
    if (newState) {
      setTimeout(() => testSound('notification'), 100);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleToggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
          userType="restaurant"
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
                userType="restaurant"
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Restaurateur</h1>
                <p className="text-gray-600">Dashboard restaurant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNotificationToggle}
                className={`relative ${hasNewOrders ? 'text-[#b70f23] border-[#b70f23] bg-red-50' : 'text-gray-400'}`}
                title={hasNewOrders ? "Nouvelles commandes ! Cliquer pour arrêter les notifications" : soundEnabled ? "Notifications sonores activées" : "Notifications sonores désactivées - Cliquer pour activer"}
              >
                <Bell className="w-4 h-4" />
                {hasNewOrders && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-[#b70f23] rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {unreadOrdersCount > 0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#b70f23] text-white text-[10px] rounded-full flex items-center justify-center px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {unreadOrdersCount > 9 ? '9+' : unreadOrdersCount}
                  </motion.div>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExportPanel(!showExportPanel)}
                className="hidden sm:inline-flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={onBack}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Stock & Ingredients View */}
          {activeSection === "stock-ingredients" && (
            <StockView 
              onBack={() => {
                setActiveSection("tableau-de-bord");
                setActiveSubSection("");
              }} 
              activeSubSection={activeSubSection}
            />
          )}

          {/* Menu Management View */}
          {activeSection === "gestion-cuisine" && (
            <MenuView 
              onBack={() => {
                setActiveSection("tableau-de-bord");
                setActiveSubSection("");
              }} 
              activeSubSection={activeSubSection}
            />
          )}
          
          {/* Default Dashboard Content */}
          {activeSection === "tableau-de-bord" && (
            <>
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
                        restaurantData={mockRestaurantData}
                        onExport={handleExport}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

          {/* Metrics Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des données</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
                {getActionsData(handleActiveSection, handleSubSectionNavigation).map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
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
                  <BarChart data={mockRestaurantData.charts.performance}>
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
            </>
          )}
          
          {/* Section Comptabilité */}
          {activeSection === "comptabilite" && (
            <>
              {activeSubSection === "overview" && (
                <AccountingView onBack={() => setActiveSection("tableau-de-bord")} />
              )}
              {activeSubSection === "factures" && (
                <InvoiceManagementView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
              {activeSubSection === "transactions" && (
                <TransactionsView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
              {activeSubSection === "analytics" && (
                <FinancialAnalyticsView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
              {activeSubSection === "cash-closure" && (
                <CashClosureView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
              {activeSubSection === "vat" && (
                <VATManagementView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
              {activeSubSection === "refunds" && (
                <RefundsView onBack={() => handleSubSectionNavigation("comptabilite", "overview")} />
              )}
            </>
          )}

          {/* Section Logiciels Caisse (PDV) */}
          {activeSection === "logiciels-caisse" && (
            <POSView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Section Paramètres */}
          {activeSection === "parametres" && (
            <SettingsView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Section Commande Live */}
          {activeSection === "commande-live" && (
            <LiveOrdersView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Section Vue Cuisine */}
          {activeSection === "vue-cuisine" && (
            <KitchenView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Section Réservation */}
          {activeSection === "reservation" && (
            <ReservationView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Section Config Site web */}
          {activeSection === "config-site-web" && (
            <>
              {activeSubSection === "themes" && (
                <ThemesView onBack={() => setActiveSection("tableau-de-bord")} />
              )}
              {activeSubSection === "fonctionnalites" && (
                <FonctionnalitesView onBack={() => setActiveSection("tableau-de-bord")} />
              )}
              {activeSubSection === "custom-pages" && (
                <CustomPagesView onBack={() => setActiveSection("tableau-de-bord")} />
              )}
            </>
          )}

          {/* Section Marketing */}
          {activeSection === "marketing" && (
            <AdvancedMarketingView onBack={() => setActiveSection("tableau-de-bord")} />
          )}

          {/* Other sections can be added here */}
          {activeSection !== "tableau-de-bord" && 
           activeSection !== "stock-ingredients" && 
           activeSection !== "gestion-cuisine" && 
           activeSection !== "comptabilite" && 
           activeSection !== "logiciels-caisse" && 
           activeSection !== "parametres" && 
           activeSection !== "commande-live" && 
           activeSection !== "vue-cuisine" && 
           activeSection !== "reservation" && 
           activeSection !== "config-site-web" && 
           activeSection !== "marketing" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Package className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Section en développement</h3>
                <p className="text-gray-500">Cette section sera bientôt disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RestaurantDashboard({ onBack, userSession, onGoToAdvancedExport }: RestaurantDashboardProps) {
  return (
    <LiveOrdersProvider>
      <RestaurantDashboardContent 
        onBack={onBack} 
        userSession={userSession} 
        onGoToAdvancedExport={onGoToAdvancedExport} 
      />
    </LiveOrdersProvider>
  );
}