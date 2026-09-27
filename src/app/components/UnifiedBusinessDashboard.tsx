import { GenericSectionView } from "./GenericSectionView";
import { SettingsView } from "./SettingsView";
import { BusinessInfoView } from "./BusinessInfoView";
import { RestaurantConfigView } from "./RestaurantConfigView";
import { AvailabilityDaysView } from "./AvailabilityDaysView";
import { PickupPointsView } from "./PickupPointsView";
import { TablesView } from "./TablesView";
import { EmplacementsView } from "./EmplacementsView";
import { QRBuilderView } from "./QRBuilderView";
import { RoomServicesView } from "./RoomServicesView";
import { SuppliersManagementView } from "./SuppliersManagementView";
import { DeliveryCompanyInfoView } from "./DeliveryCompanyInfoView";
import { DeliveryDriversListView } from "./DeliveryDriversListView";
import { AssignedDeliveriesView } from "./AssignedDeliveriesView";
import { CompletedDeliveriesView } from "./CompletedDeliveriesView";
import { DeliveryOverviewView } from "./DeliveryOverviewView";
import { DeliveryCompaniesListView } from "./DeliveryCompaniesListView";
import { POSView } from "./POSView";
import { TransactionsView } from "./TransactionsView";
import { PaymentMethodsView } from "./PaymentMethodsView";
import { CashClosureView } from "./CashClosureView";
import { RefundsView } from "./RefundsView";
import { VATManagementView } from "./VATManagementView";
import { AccountingView } from "./AccountingView";
import { FinancialAnalyticsView } from "./FinancialAnalyticsView";
import { InvoiceManagementView } from "./InvoiceManagementView";
import { PersonnelPayrollView } from "./PersonnelPayrollView";
import { AdvancedMarketingView } from "./AdvancedMarketingView";
import { ClientListView } from "./ClientListView";
import { ReportsView } from "./ReportsView";
import { SalesJournalView } from "./SalesJournalView";
import { VATDeclarationsView } from "./VATDeclarationsView";
import { BalanceSheetsView } from "./BalanceSheetsView";
import { AccountingExportView } from "./AccountingExportView";
import { ThemesView } from "./ThemesView";
import { FonctionnalitesView } from "./FonctionnalitesView";
import { CustomPagesView } from "./CustomPagesView";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { SidebarWithSubmenus } from "./SidebarWithSubmenus";
import { PDFExport } from "./PDFExport";
import { LiveOrdersView } from "./LiveOrdersView";
import { ReservationView } from "./ReservationView";
import { KitchenView } from "./KitchenView";
import { MenuView } from "./MenuView";
import { StockOverviewView } from "./StockOverviewView";
import { StockCategoriesView } from "./StockCategoriesView";
import { IngredientsManagementView } from "./IngredientsManagementView";
import { ProductsManagementView } from "./ProductsManagementView";
import { UtensilsManagementView } from "./UtensilsManagementView";
import { PurchaseOrdersView } from "./PurchaseOrdersView";
import {
  LiveOrdersProvider,
  useLiveOrders,
} from "../contexts/LiveOrdersContext";
import {
  useDashboardConfig,
  useActiveModules,
  useActiveMetrics,
  useActiveActions,
  convertModulesToMenuSections,
} from "../hooks/useDashboardConfig";
import { PremiumBadge } from "./PremiumBadge";
import { mockRestaurantData } from "../data/restaurantDashboardData";
import { testSound } from "../utils/soundUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Bell,
  LogOut,
  Download,
  FileText,
  Menu,
  X,
  Package,
  TrendingUp,
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface UnifiedBusinessDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
  onGoToAdvancedExport?: () => void;
  onGoToBusinessInfo?: () => void;
  onGoToSettings?: () => void;
}

function UnifiedBusinessDashboardContent({
  onBack,
  userSession,
  onGoToAdvancedExport,
  onGoToBusinessInfo,
  onGoToSettings,
}: UnifiedBusinessDashboardProps) {
  const [activeSection, setActiveSection] = useState(
    "tableau-de-bord",
  );
  const [activeSubSection, setActiveSubSection] = useState("");
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] =
    useState("");
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Set<string>
  >(new Set());

  // Hook pour les commandes live et réservations
  const {
    pendingOrders,
    hasNewOrders,
    hasNewReservations,
    unreadOrdersCount,
    unreadReservationsCount,
    notificationType,
    soundEnabled,
    toggleSound,
    stopNotifications,
    markAsRead,
  } = useLiveOrders();

  // Configuration du dashboard selon le type d'utilisateur
  const config = useDashboardConfig(
    userSession?.userType || "restaurant",
  );
  const activeModules = useActiveModules(config);
  const activeMetrics = useActiveMetrics(config);
  const activeActions = useActiveActions(config);

  console.log(
    "🔍 Debug Dashboard - activeSection:",
    activeSection,
  );

  // Fonction pour obtenir les informations d'une section
  const getSectionInfo = (sectionId: string) => {
    const module = activeModules.find(
      (m) => m.id === sectionId,
    );
    return {
      title: module?.label || sectionId,
      description: `Gestion complète de ${module?.label?.toLowerCase() || sectionId}`,
    };
  };

  // Fonction pour gérer le changement de section active
  const handleActiveSection = (section: string) => {
    setActiveSection(section);
    // Réinitialiser la sous-section et l'entreprise sélectionnée quand on change de section
    setActiveSubSection("");
    setSelectedDeliveryCompany("");
    // Si on va vers les commandes ou réservations, marquer comme lues
    if (
      section === "commande-live" ||
      section === "commandes-b2b" ||
      section === "reservation" ||
      section === "reservations"
    ) {
      markAsRead();
    }
  };

  // Fonction pour gérer la sélection d'une entreprise de livraison
  const handleSelectDeliveryCompany = (companyId: string) => {
    setSelectedDeliveryCompany(companyId);
    setActiveSubSection("company-details");
  };

  // Convertir les modules en sections de menu
  const menuSections = convertModulesToMenuSections(
    activeModules,
    hasNewOrders,
    hasNewReservations,
    unreadOrdersCount,
    unreadReservationsCount,
    activeSection,
    handleActiveSection,
    setActiveSubSection,
  );

  const handleExport = (config: any) => {
    console.log("Export config:", config);
  };

  // Fonction pour gérer les clics sur les actions rapides
  const handleActionClick = (actionLabel: string) => {
    switch (actionLabel) {
      case "Gestion de menu":
      case "Gérer menu":
        setActiveSection("gestion-menu");
        break;
      case "Nouvelle commande":
        setActiveSection("commande-live");
        break;
      case "Réservations":
        setActiveSection("reservation");
        break;
      case "Stock":
        setActiveSection("stock-ingredients");
        break;
      case "Livraisons":
        setActiveSection("entreprises-livraison");
        break;
      case "Comptabilité":
      case "Gestion comptable":
        setActiveSection("comptabilite");
        break;
      case "PDV & Caisse":
      case "Caisse":
        setActiveSection("pdv-caisse");
        break;
      case "Paramètres":
        // À implémenter
        break;
      default:
        console.log("Action non gérée:", actionLabel);
    }
  };

  const handleNotificationToggle = () => {
    // Logique de navigation intelligente basée sur le type de notification
    // if (hasNewOrders || hasNewReservations) {
    //   if (notificationType === 'orders' || (notificationType === 'both' && hasNewOrders)) {
    //     handleActiveSection("commande-live");
    //   } else if (notificationType === 'reservations') {
    //     handleActiveSection("reservations");
    //   } else if (notificationType === 'both' && hasNewReservations && !hasNewOrders) {
    //     handleActiveSection("reservations");
    //   } else {
    //     // Par défaut, aller aux commandes si les deux sont présentes
    //     handleActiveSection("commande-live");
    //   }
    //   stopNotifications();
    //   return;
    // }
    stopNotifications();
    return;

    // Sinon, basculer les préférences sonores
    const newState = toggleSound();
    // Test du son quand on l'active
    if (newState) {
      setTimeout(() => testSound("notification"), 100);
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
          userType={
            userSession?.userType?.includes("business")
              ? "business"
              : userSession?.userType || "restaurant"
          }
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
                userType={
                  userSession?.userType?.includes("business")
                    ? "business"
                    : userSession?.userType || "restaurant"
                }
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {config.title}
                </h1>
                <p className="text-gray-600">
                  {config.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNotificationToggle}
                className={`relative ${hasNewOrders || hasNewReservations ? "text-[#b70f23] border-[#b70f23] bg-red-50" : "text-gray-400"}`}
                title={
                  hasNewOrders || hasNewReservations
                    ? `Nouvelles ${notificationType === "orders" ? "commandes" : notificationType === "reservations" ? "réservations" : "notifications"} ! Cliquer pour voir`
                    : soundEnabled
                      ? "Notifications sonores activées"
                      : "Notifications sonores désactivées - Cliquer pour activer"
                }
              >
                <Bell className="w-4 h-4" />
                {(hasNewOrders || hasNewReservations) && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-[#b70f23] rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
                {unreadOrdersCount + unreadReservationsCount >
                  0 && (
                  <motion.div
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#b70f23] text-white text-[10px] rounded-full flex items-center justify-center px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {unreadOrdersCount +
                      unreadReservationsCount >
                    9
                      ? "9+"
                      : unreadOrdersCount +
                        unreadReservationsCount}
                  </motion.div>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setShowExportPanel(!showExportPanel)
                }
                className="hidden sm:inline-flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={onBack}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  Déconnexion
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Live Orders View */}
          {(activeSection === "commande-live" ||
            activeSection === "commandes-b2b") && (
            <LiveOrdersView />
          )}

          {/* Reservations View */}
          {(activeSection === "reservation" ||
            activeSection === "reservations") && (
            <ReservationView />
          )}

          {/* Kitchen View */}
          {activeSection === "vue-cuisine" && <KitchenView />}

          {/* Menu View */}
          {activeSection === "gestion-menu" && (
            <MenuView
              onBack={() => setActiveSection("tableau-de-bord")}
              activeSubSection={activeSubSection}
            />
          )}

          {/* Stock & Ingredients Views */}
          {activeSection === "stock-ingredients" && (
            <>
              {(activeSubSection === "overview" ||
                activeSubSection === "") && (
                <StockOverviewView />
              )}
              {activeSubSection === "categories" && (
                <StockCategoriesView />
              )}
              {activeSubSection === "ingredients" && (
                <IngredientsManagementView />
              )}
              {activeSubSection === "products" && (
                <ProductsManagementView />
              )}
              {activeSubSection === "ustensiles" && (
                <UtensilsManagementView />
              )}
              {activeSubSection === "commandes-achat" && (
                <PurchaseOrdersView />
              )}
              {activeSubSection === "fournisseurs" && (
                <SuppliersManagementView />
              )}
            </>
          )}

          {/* Personnel & Payroll Management Views */}
          {/* {activeSection === "personnel-paie" && (
            <PersonnelPayrollView />
          )} */}

          {/* Delivery Management Views */}
          {activeSection === "entreprises-livraison" && (
            <>
              {/* Vue par défaut : Liste des entreprises de livraison */}
              {(activeSubSection === "" ||
                activeSubSection === "companies-list") && (
                <DeliveryCompaniesListView
                  onSelectCompany={handleSelectDeliveryCompany}
                />
              )}

              {/* Vue détails d'une entreprise depuis la liste */}
              {activeSubSection === "company-details" &&
                selectedDeliveryCompany && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveSubSection("companies-list");
                          setSelectedDeliveryCompany("");
                        }}
                        className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                      >
                        ← Retour à la liste
                      </Button>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Détails de l'entreprise
                        </h2>
                        <p className="text-gray-600">
                          Gestion complète du partenaire{" "}
                          {selectedDeliveryCompany}
                        </p>
                      </div>
                    </div>

                    {/* Navigation rapide vers les autres sections */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSubSection("company-info")
                        }
                        className="gap-2"
                      >
                        Informations générales
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSubSection("drivers-list")
                        }
                        className="gap-2"
                      >
                        Liste des livreurs
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSubSection(
                            "assigned-deliveries",
                          )
                        }
                        className="gap-2"
                      >
                        Livraisons assignées
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSubSection(
                            "completed-deliveries",
                          )
                        }
                        className="gap-2"
                      >
                        Livraisons terminées
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSubSection("overview")
                        }
                        className="gap-2"
                      >
                        Statistiques
                      </Button>
                    </div>

                    {/* Contenu par défaut pour les détails d'entreprise */}
                    <DeliveryCompanyInfoView />
                  </div>
                )}

              {/* Sous-vues accessibles directement par la sidebar */}
              {activeSubSection === "overview" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveSubSection("companies-list")
                      }
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour aux entreprises
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Aperçu des livraisons
                      </h2>
                      <p className="text-gray-600">
                        Statistiques globales de vos livraisons
                      </p>
                    </div>
                  </div>
                  <DeliveryOverviewView />
                </div>
              )}

              {activeSubSection === "company-info" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveSubSection("companies-list")
                      }
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour aux entreprises
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informations de l'entreprise
                      </h2>
                      <p className="text-gray-600">
                        Gestion des informations de votre
                        entreprise de livraison
                      </p>
                    </div>
                  </div>
                  <DeliveryCompanyInfoView />
                </div>
              )}

              {activeSubSection === "drivers-list" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveSubSection("companies-list")
                      }
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour aux entreprises
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Liste des livreurs
                      </h2>
                      <p className="text-gray-600">
                        Gestion de tous vos livreurs partenaires
                      </p>
                    </div>
                  </div>
                  <DeliveryDriversListView />
                </div>
              )}

              {activeSubSection === "assigned-deliveries" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveSubSection("companies-list")
                      }
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour aux entreprises
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Commandes attribuées
                      </h2>
                      <p className="text-gray-600">
                        Suivi des commandes en cours de
                        livraison
                      </p>
                    </div>
                  </div>
                  <AssignedDeliveriesView />
                </div>
              )}

              {activeSubSection === "completed-deliveries" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setActiveSubSection("companies-list")
                      }
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour aux entreprises
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Commandes livrées
                      </h2>
                      <p className="text-gray-600">
                        Historique des livraisons terminées
                      </p>
                    </div>
                  </div>
                  <CompletedDeliveriesView />
                </div>
              )}
            </>
          )}

          {/* Business Info View */}
          {activeSection === "infos-business" && (
            <BusinessInfoView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Configuration Restaurant */}
          {activeSection === "config-restaurant" && (
            <RestaurantConfigView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Jours Disponibles */}
          {activeSection === "jours-dispos" && (
            <AvailabilityDaysView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Points de Retrait */}
          {activeSection === "points-retrait" && (
            <PickupPointsView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Gestion des Tables */}
          {activeSection === "tables" && (
            <TablesView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Emplacements */}
          {activeSection === "emplacements" && (
            <EmplacementsView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* QR Builder */}
          {activeSection === "qr-builder" && (
            <QRBuilderView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Services de Chambres */}
          {activeSection === "room-services" && (
            <RoomServicesView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Settings View */}
          {activeSection === "settings" && (
            <SettingsView
              onBack={() => setActiveSection("tableau-de-bord")}
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
                            onClick={() =>
                              setShowExportPanel(false)
                            }
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Aperçu des données
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {activeMetrics.map((metric, index) => (
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
                          {metric.isPremium && (
                            <PremiumBadge
                              variant="icon-only"
                              className="text-white/80"
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-lg font-bold leading-tight">
                            {metric.value}
                          </div>
                          <div className="text-xs text-white/80 uppercase tracking-wide">
                            {metric.label}
                          </div>
                          {metric.subtitle && (
                            <div className="text-xs text-white/60 font-medium">
                              {metric.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h2>
                <div className="mb-4">
                  <h3 className="text-base font-medium text-gray-800 mb-4">
                    {config.title} - Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activeActions.map((action, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          handleActionClick(action.label)
                        }
                        className={`${action.color} text-white rounded-2xl p-6 text-left relative overflow-hidden transition-all hover:shadow-xl h-32`}
                      >
                        {/* Windows Phone style decorative elements */}
                        <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full opacity-50"></div>
                        <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white/10 rounded-full"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <action.icon className="w-7 h-7 text-white" />
                            <div className="flex flex-col items-end gap-1">
                              {action.badge && (
                                <div className="w-7 h-7 bg-white/30 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">
                                    {action.badge}
                                  </span>
                                </div>
                              )}
                              {action.isPremium && (
                                <PremiumBadge
                                  variant="icon-only"
                                  className="text-white/80"
                                />
                              )}
                            </div>
                          </div>
                          <div className="font-medium text-left">
                            {action.label}
                          </div>
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
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {config.title.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        Premium Gold
                      </div>
                      <div className="text-sm text-gray-600">
                        PACKAGE ACTIVÉ
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        Complet
                      </div>
                      <div className="text-xs text-gray-600">
                        FONCTIONNALITÉS
                      </div>
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
                    <ResponsiveContainer
                      width="100%"
                      height={200}
                    >
                      <BarChart
                        data={
                          mockRestaurantData.charts.performance
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* PDV & Caisse Views */}
          {activeSection === "pdv-caisse" && (
            <>
              {(activeSubSection === "" ||
                activeSubSection === "pdv") && <POSView />}
              {activeSubSection === "transactions" && (
                <TransactionsView />
              )}
              {activeSubSection === "modes-paiement" && (
                <PaymentMethodsView />
              )}
              {activeSubSection === "clotures-caisse" && (
                <CashClosureView />
              )}
              {activeSubSection === "remboursements" && (
                <RefundsView />
              )}
              {activeSubSection === "tva" && (
                <VATManagementView />
              )}
            </>
          )}

          {/* Comptabilité Views */}
          {activeSection === "comptabilite" && (
            <>
              {(activeSubSection === "" ||
                activeSubSection === "vue-ensemble") && (
                <AccountingView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "analyses-financieres" && (
                <FinancialAnalyticsView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "factures-devis" && (
                <InvoiceManagementView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "journal-ventes" && (
                <SalesJournalView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "declarations-tva" && (
                <VATDeclarationsView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "bilans" && (
                <BalanceSheetsView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
              {activeSubSection === "export-comptable" && (
                <AccountingExportView
                  onBack={() =>
                    setActiveSection("tableau-de-bord")
                  }
                />
              )}
            
            </>
          )}

          {/* Personnel & Paie Views */}
          {activeSection === "personnel-paie" && (
            <PersonnelPayrollView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Marketing Avancé Views */}
          {activeSection === "marketing-avance" && (
            <AdvancedMarketingView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Clients Views */}
          {activeSection === "liste-clients" && (
            <ClientListView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Rapports Views */}
          {activeSection === "rapports" && (
            <ReportsView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Marketing Avancé Views */}
          {activeSection === "parametres" && (
            <SettingsView
              onBack={() => setActiveSection("tableau-de-bord")}
            />
          )}

          {/* Config Site Web Views */}
          {activeSection === "config-site-web" && (
            <>
              {/* Themes Sub-section */}
              {activeSubSection === "themes" && (
                <ThemesView
                  onBack={() => setActiveSection("tableau-de-bord")}
                />
              )}

              {/* Fonctionnalites Sub-section */}
              {activeSubSection === "fonctionnalites" && (
                <FonctionnalitesView
                  onBack={() => setActiveSection("tableau-de-bord")}
                />
              )}

              {/* Custom Pages Sub-section */}
              {activeSubSection === "custom-pages" && (
                <CustomPagesView
                  onBack={() => setActiveSection("tableau-de-bord")}
                />
              )}

              {/* Default view when no sub-section is selected */}
              {(activeSubSection === "" || activeSubSection === "overview") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setActiveSection("tableau-de-bord")}
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      ← Retour au tableau de bord
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Configuration Site Web
                      </h2>
                      <p className="text-gray-600">
                        Gérez l'apparence et les fonctionnalités de votre site web
                      </p>
                    </div>
                  </div>

                  {/* Quick Navigation to Sub-sections */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#b70f23]"
                      onClick={() => setActiveSubSection("themes")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#b70f23] rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded" />
                          </div>
                          Thèmes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Choisissez et personnalisez l'apparence de votre site web
                        </p>
                      </CardContent>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#f4b71b]"
                      onClick={() => setActiveSubSection("fonctionnalites")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f4b71b] rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded" />
                          </div>
                          Fonctionnalités
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Activez ou désactivez les fonctionnalités de votre site
                        </p>
                      </CardContent>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-[#70070e]"
                      onClick={() => setActiveSubSection("custom-pages")}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#70070e] rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded" />
                          </div>
                          Custom Pages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Créez et gérez vos pages personnalisées
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Generic sections fallback */}
          {activeSection !== "tableau-de-bord" &&
            activeSection !== "commande-live" &&
            activeSection !== "commandes-b2b" &&
            activeSection !== "vue-cuisine" &&
            activeSection !== "gestion-menu" &&
            activeSection !== "reservation" &&
            activeSection !== "reservations" &&
            activeSection !== "stock-ingredients" &&
            activeSection !== "entreprises-livraison" &&
            activeSection !== "pdv-caisse" &&
            activeSection !== "comptabilite" &&
            activeSection !== "personnel-paie" &&
            activeSection !== "marketing-avance" &&
            activeSection !== "parametres" &&
            activeSection !== "liste-clients" &&
            activeSection !== "rapports" &&
            activeSection !== "infos-business" &&
            activeSection !== "config-restaurant" &&
            activeSection !== "jours-dispos" &&
            activeSection !== "points-retrait" &&
            activeSection !== "tables" &&
            activeSection !== "emplacements" &&
            activeSection !== "qr-builder" &&
            activeSection !== "config-site-web" &&
            activeSection !== "room-services" &&
            activeSection !== "settings" && (
              <GenericSectionView
                sectionId={activeSection}
                sectionTitle={
                  getSectionInfo(activeSection).title
                }
                sectionDescription={
                  getSectionInfo(activeSection).description
                }
                onBack={() =>
                  setActiveSection("tableau-de-bord")
                }
              />
            )}
        </div>
      </div>
    </div>
  );
}

export function UnifiedBusinessDashboard({
  onBack,
  userSession,
  onGoToAdvancedExport,
  onGoToBusinessInfo,
  onGoToSettings,
}: UnifiedBusinessDashboardProps) {
  return (
    <LiveOrdersProvider>
      <UnifiedBusinessDashboardContent
        onBack={onBack}
        userSession={userSession}
        onGoToAdvancedExport={onGoToAdvancedExport}
        onGoToBusinessInfo={onGoToBusinessInfo}
        onGoToSettings={onGoToSettings}
      />
    </LiveOrdersProvider>
  );
}