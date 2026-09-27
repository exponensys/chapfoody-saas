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
  Euro,
  Star,
  ClipboardList,
  CheckCircle,
  Hourglass,
  Package2,
  Trash2,
  Layers,
  AlertTriangle,
  Scale,
  QrCode,
  Folder,
  MapPin,
  Eye,
  TrendingUp,
  FileText,
  Download,
  Calculator,
  Globe,
  Monitor,
  Zap,
  FileCode,
  TrendingUp as Marketing
} from 'lucide-react';

export const mockRestaurantData = {
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

export const getMenuSections = (hasNewOrders: boolean, unreadOrdersCount: number, activeSection: string, handleActiveSection: (section: string) => void, setActiveSubSection: (section: string) => void, handleSubSectionNavigation?: (section: string, subSection: string) => void) => [
  {
    id: "tableau-de-bord",
    label: "Tableau de bord",
    icon: Home,
    onClick: () => handleActiveSection("tableau-de-bord")
  },
  {
    id: "commande-live",
    label: "Commande Live",
    icon: Command,
    onClick: () => handleActiveSection("commande-live"),
    hasNotification: hasNewOrders && activeSection !== "commande-live",
    notificationCount: unreadOrdersCount
  },
  {
    id: "vue-cuisine",
    label: "Vue Cuisine",
    icon: ChefHat,
    onClick: () => handleActiveSection("vue-cuisine")
  },
  {
    id: "reservation",
    label: "Réservation",
    icon: Calendar,
    onClick: () => handleActiveSection("reservation")
  },
  {
    id: "liste-commandes",
    label: "Liste de commandes",
    icon: List,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "toutes-commandes",
        label: "Toutes les commandes",
        icon: ClipboardList,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("toutes-commandes");
        }
      },
      {
        id: "en-attente",
        label: "En attente",
        icon: Clock,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("en-attente");
        }
      },
      {
        id: "en-preparation",
        label: "En préparation",
        icon: Hourglass,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("en-preparation");
        }
      },
      {
        id: "pretes",
        label: "Prêtes",
        icon: CheckCircle,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("pretes");
        }
      },
      {
        id: "livrees",
        label: "Livrées",
        icon: Package2,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("livrees");
        }
      },
      {
        id: "annulees",
        label: "Annulées",
        icon: Trash2,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("annulees");
        }
      },
      {
        id: "exporter",
        label: "Exporter",
        icon: Download,
        onClick: () => {
          handleActiveSection("liste-commandes");
          setActiveSubSection("exporter");
        }
      }
    ]
  },
  {
    id: "gestion-cuisine",
    label: "Gestion Cuisine",
    icon: ChefHat,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "menu",
        label: "Menu",
        icon: Utensils,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("menu");
        }
      },
      {
        id: "categories",
        label: "Catégories",
        icon: Layers,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("categories");
        }
      },
      {
        id: "packages",
        label: "Packages",
        icon: Package,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("packages");
        }
      },
      {
        id: "specialites",
        label: "Spécialités",
        icon: Star,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("specialites");
        }
      },
      {
        id: "extras",
        label: "Extras",
        icon: Plus,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("extras");
        }
      },
      {
        id: "allergies",
        label: "Allergies",
        icon: AlertTriangle,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("allergies");
        }
      },
      {
        id: "unites",
        label: "Unités",
        icon: Scale,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("unites");
        }
      },
      {
        id: "generateur-qr",
        label: "Générateur QR",
        icon: QrCode,
        onClick: () => {
          handleActiveSection("gestion-cuisine");
          setActiveSubSection("generateur-qr");
        }
      }
    ]
  },
  {
    id: "stock-ingredients",
    label: "Stock & Ingrédients",
    icon: Package,
    hasSubmenu: true,
    onClick: () => {
      if (handleSubSectionNavigation) {
        handleSubSectionNavigation("stock-ingredients", "overview");
      } else {
        handleActiveSection("stock-ingredients");
        setActiveSubSection("overview");
      }
    },
    submenuItems: [
      {
        id: "overview",
        label: "Vue d'ensemble",
        icon: Home,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "overview");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("overview");
          }
        }
      },
      {
        id: "categories",
        label: "Catégories",
        icon: Folder,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "categories");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("categories");
          }
        }
      },
      {
        id: "ingredients",
        label: "Ingrédients",
        icon: ChefHat,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "ingredients");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("ingredients");
          }
        }
      },
      {
        id: "produits",
        label: "Produits à vendre",
        icon: Package2,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "produits");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("produits");
          }
        }
      },
      {
        id: "ustensiles",
        label: "Ustensiles",
        icon: Utensils,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "ustensiles");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("ustensiles");
          }
        }
      },
      {
        id: "achats",
        label: "Achats/Commandes",
        icon: ShoppingCart,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("stock-ingredients", "achats");
          } else {
            handleActiveSection("stock-ingredients");
            setActiveSubSection("achats");
          }
        }
      }
    ]
  },
  {
    id: "entreprises-livraison",
    label: "Entreprises de livraison",
    icon: Truck,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "liste-entreprises",
        label: "Liste des entreprises",
        icon: ClipboardList,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("liste-entreprises");
        }
      },
      {
        id: "partenaires-actifs",
        label: "Partenaires actifs",
        icon: Star,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("partenaires-actifs");
        }
      },
      {
        id: "zones-livraison",
        label: "Zones de livraison",
        icon: MapPin,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("zones-livraison");
        }
      },
      {
        id: "tarifs-livraison",
        label: "Tarifs livraison",
        icon: Euro,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("tarifs-livraison");
        }
      },
      {
        id: "suivi-livraisons",
        label: "Suivi livraisons",
        icon: Eye,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("suivi-livraisons");
        }
      },
      {
        id: "performance",
        label: "Performance",
        icon: TrendingUp,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("performance");
        }
      },
      {
        id: "contrats",
        label: "Contrats",
        icon: FileText,
        onClick: () => {
          handleActiveSection("entreprises-livraison");
          setActiveSubSection("contrats");
        }
      }
    ]
  },
  {
    id: "comptabilite",
    label: "Comptabilité",
    icon: Euro,
    hasSubmenu: true,
    onClick: () => {
      if (handleSubSectionNavigation) {
        handleSubSectionNavigation("comptabilite", "overview");
      } else {
        handleActiveSection("comptabilite");
        setActiveSubSection("overview");
      }
    },
    submenuItems: [
      {
        id: "overview",
        label: "Vue d'ensemble",
        icon: BarChart3,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "overview");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("overview");
          }
        }
      },
      {
        id: "factures",
        label: "Factures & Devis",
        icon: FileText,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "factures");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("factures");
          }
        }
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: CreditCard,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "transactions");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("transactions");
          }
        }
      },
      {
        id: "analytics",
        label: "Analyses financières",
        icon: TrendingUp,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "analytics");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("analytics");
          }
        }
      },
      {
        id: "cash-closure",
        label: "Clôture de caisse",
        icon: CreditCard,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "cash-closure");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("cash-closure");
          }
        }
      },
      {
        id: "vat",
        label: "Gestion TVA",
        icon: Euro,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "vat");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("vat");
          }
        }
      },
      {
        id: "refunds",
        label: "Remboursements",
        icon: Download,
        onClick: () => {
          if (handleSubSectionNavigation) {
            handleSubSectionNavigation("comptabilite", "refunds");
          } else {
            handleActiveSection("comptabilite");
            setActiveSubSection("refunds");
          }
        }
      }
    ]
  },
  {
    id: "logiciels-caisse",
    label: "Logiciels Caisse",
    icon: CreditCard,
    onClick: () => handleActiveSection("logiciels-caisse")
  },
  {
    id: "rapports",
    label: "Rapports",
    icon: BarChart3,
    onClick: () => handleActiveSection("rapports")
  },
  {
    id: "historique-paiements",
    label: "Historique des paiements",
    icon: Clock,
    onClick: () => handleActiveSection("historique-paiements")
  },
  {
    id: "liste-clients",
    label: "Liste des clients",
    icon: Users,
    onClick: () => handleActiveSection("liste-clients")
  },
  {
    id: "parametres",
    label: "Paramètres",
    icon: Settings,
    onClick: () => handleActiveSection("parametres")
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Marketing,
    onClick: () => handleActiveSection("marketing")
  },
  {
    id: "config-site-web",
    label: "Config Site web",
    icon: Globe,
    hasSubmenu: true,
    submenuItems: [
      {
        id: "themes",
        label: "Thèmes",
        icon: Monitor,
        onClick: () => {
          handleActiveSection("config-site-web");
          setActiveSubSection("themes");
        }
      },
      {
        id: "fonctionnalites",
        label: "Fonctionnalités",
        icon: Zap,
        onClick: () => {
          handleActiveSection("config-site-web");
          setActiveSubSection("fonctionnalites");
        }
      },
      {
        id: "custom-pages",
        label: "Custom Pages",
        icon: FileCode,
        onClick: () => {
          handleActiveSection("config-site-web");
          setActiveSubSection("custom-pages");
        }
      }
    ]
  }
];

export const metricsData = [
  { label: "Menu", value: "0/100", color: "bg-blue-500", icon: Utensils },
  { label: "Packages", value: "0/100", color: "bg-cyan-400", icon: Box },
  { label: "Spécialités", value: "0/100", color: "bg-green-500", icon: Star },
  { label: "Commandes", value: "0/5000", color: "bg-red-700", icon: ShoppingCart },
  { label: "", value: "3,300", color: "bg-orange-400", icon: Euro, subtitle: "CHAP" },
  { label: "Clients", value: "0", color: "bg-purple-500", icon: Users },
];

export const getActionsData = (handleActiveSection: (section: string) => void, handleSubSectionNavigation?: (section: string, subSection: string) => void) => [
  { 
    label: "Nouvelle commande", 
    color: "bg-red-700", 
    icon: Plus, 
    onClick: () => handleActiveSection("logiciels-caisse") 
  },
  { 
    label: "Gérer menu", 
    color: "bg-blue-500", 
    icon: Utensils, 
    onClick: () => {
      if (handleSubSectionNavigation) {
        handleSubSectionNavigation("gestion-cuisine", "menu");
      } else {
        handleActiveSection("gestion-cuisine");
      }
    }
  },
  { 
    label: "Stock", 
    color: "bg-green-500", 
    icon: Package, 
    badge: "3", 
    onClick: () => {
      if (handleSubSectionNavigation) {
        handleSubSectionNavigation("stock-ingredients", "overview");
      } else {
        handleActiveSection("stock-ingredients");
      }
    }
  },
  { 
    label: "Livraisons", 
    color: "bg-gradient-to-r from-orange-500 to-orange-600", 
    icon: Truck, 
    onClick: () => handleActiveSection("entreprises-livraison") 
  },
  { 
    label: "Comptabilité", 
    color: "bg-[#b70f23]", 
    icon: Calculator, 
    onClick: () => {
      if (handleSubSectionNavigation) {
        handleSubSectionNavigation("comptabilite", "overview");
      } else {
        handleActiveSection("comptabilite");
      }
    }
  },
  { 
    label: "Paramètres", 
    color: "bg-orange-600", 
    icon: Settings, 
    onClick: () => handleActiveSection("parametres") 
  },
];