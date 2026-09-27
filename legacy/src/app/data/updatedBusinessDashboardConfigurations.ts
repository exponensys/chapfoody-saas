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
  Wine,
  ShoppingBag,
  Apple,
  Store,
  Building2,
  Scissors,
  Cake,
  Fish,
  Beef,
  Wheat,
  Calendar as CalendarIcon,
  Zap,
  Shield,
  Award,
  Target,
  Monitor,
  Globe,
  BookOpen,
  Megaphone,
  Tags,
  Percent,
  Archive,
  Repeat,
  Coffee,
  UtensilsCrossed,
  Calculator,
  UserCheck,
  Banknote,
  Crown,
  Mail,
  MessageSquare,
  ThumbsUp,
  Share2,
  Gift,
  Smartphone,
  PieChart,
  Send,
  Filter,
  Bell,
  Heart,
  Star as StarIcon,
  Workflow,
  UserPlus,
  RotateCcw,
  GraduationCap,
  Headphones,
  Facebook,
  FileCode
} from 'lucide-react';

export interface DashboardConfig {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  modules: ModuleConfig[];
  metrics: MetricConfig[];
  actions: ActionConfig[];
}

export interface ModuleConfig {
  id: string;
  label: string;
  icon: any;
  enabled: boolean;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
  priority?: number; // Pour l'ordre d'affichage
  isPremium?: boolean; // Fonctionnalité payante
}

export interface SubmenuItem {
  id: string;
  label: string;
  icon: any;
  enabled: boolean;
  isPremium?: boolean; // Fonctionnalité payante
}

export interface MetricConfig {
  label: string;
  value: string;
  color: string;
  icon: any;
  subtitle?: string;
  enabled: boolean;
  isPremium?: boolean; // Fonctionnalité payante
}

export interface ActionConfig {
  label: string;
  color: string;
  icon: any;
  badge?: string;
  enabled: boolean;
  isPremium?: boolean; // Fonctionnalité payante
}

// Modules communs à tous les dashboards business
export const commonBusinessModules: ModuleConfig[] = [
  // Fonctionnalités de base (incluses dans tous les plans)
  {
    id: "pdv-caisse",
    label: "PDV & Caisse",
    icon: CreditCard,
    enabled: true,
    priority: 50,
    hasSubmenu: true,
    submenuItems: [
      { id: "pdv", label: "PDV", icon: Store, enabled: true },
      { id: "transactions", label: "Transactions", icon: CreditCard, enabled: true },
      { id: "modes-paiement", label: "Modes de paiement", icon: Banknote, enabled: true },
      { id: "clotures-caisse", label: "Clôtures de caisse", icon: Calculator, enabled: true },
      { id: "remboursements", label: "Remboursements", icon: RotateCcw, enabled: true },
      { id: "tva", label: "Gestion TVA", icon: Calculator, enabled: true }
    ]
  },
  {
    id: "comptabilite",
    label: "Comptabilité",
    icon: Calculator,
    enabled: true,
    priority: 51,
    hasSubmenu: true,
    submenuItems: [
      { id: "vue-ensemble", label: "Vue d'ensemble comptable", icon: Calculator, enabled: true },
      { id: "analyses-financieres", label: "Analyses financières", icon: TrendingUp, enabled: true },
      { id: "factures-devis", label: "Factures & Devis", icon: FileText, enabled: true },
      { id: "journal-ventes", label: "Journal des ventes", icon: FileText, enabled: true },
      { id: "declarations-tva", label: "Déclarations TVA", icon: Calculator, enabled: true },
      { id: "bilans", label: "Bilans", icon: BarChart3, enabled: true },
      { id: "export-comptable", label: "Export comptable", icon: Download, enabled: true }
    ]
  },
  {
    id: "personnel-paie",
    label: "Personnel & Paie",
    icon: UserCheck,
    enabled: true,
    priority: 52,
    hasSubmenu: false
  },
  
  // Infos Business - Module commun à tous les dashboards
  {
    id: "infos-business",
    label: "Infos Business",
    icon: Store,
    enabled: true,
    priority: 52.5,
    hasSubmenu: false
  },  
  // Paramètres - Module commun à tous les dashboards
  {
    id: "parametres",
    label: "Paramètres",
    icon: Settings,
    enabled: true,
    priority: 53,
    hasSubmenu: true,
    submenuItems: [
      { id: "preferences", label: "Préférences", icon: Settings, enabled: true },
      { id: "messaging", label: "Paramètres de messagerie", icon: Mail, enabled: true },
      { id: "order-types", label: "Configuration des types de commande", icon: ShoppingCart, enabled: true },
      { id: "payment-gateway", label: "Configuration du portail de paiement", icon: CreditCard, enabled: true },
      { id: "seo", label: "Paramètres de référencement", icon: Globe, enabled: true },
      { id: "icons", label: "Paramètres des icônes", icon: Star, enabled: true },
      { id: "delivery-radius", label: "Paramètres de livraison basés sur le rayon", icon: Truck, enabled: true },
      { id: "delivery-zone", label: "Zone de livraison", icon: MapPin, enabled: true },
      { id: "pwa", label: "Configuration PWA", icon: Smartphone, enabled: true },
      { id: "onesignal", label: "Configuration OneSignal", icon: Bell, enabled: true },
      { id: "extras", label: "Extras", icon: Plus, enabled: true },
      { id: "layout", label: "Mise en page", icon: Monitor, enabled: true },
      { id: "pusher", label: "Pusher", icon: Zap, enabled: true }
    ]
  },
  
  // Config Site web - Module commun à tous les dashboards
  {
    id: "config-site-web",
    label: "Config Site web",
    icon: Globe,
    enabled: true,
    priority: 54,
    hasSubmenu: true,
    submenuItems: [
      { id: "themes", label: "Thèmes", icon: Monitor, enabled: true },
      { id: "fonctionnalites", label: "Fonctionnalités", icon: Zap, enabled: true },
      { id: "custom-pages", label: "Custom Pages", icon: FileCode, enabled: true }
    ]
  },  
  // Marketing avancé (Fonctionnalités Premium) - Regroupement complet
  {
    id: "marketing-avance",
    label: "Marketing Avancé",
    icon: Megaphone,
    enabled: true,
    priority: 100,
    isPremium: true,
    hasSubmenu: true,
    submenuItems: [
      // Sondages et campagnes
      { id: "sondages-achat", label: "Sondages après-achat", icon: ClipboardList, enabled: true, isPremium: true },
      { id: "campagnes-marketing", label: "Campagnes marketing", icon: Target, enabled: true, isPremium: true },
      { id: "avis-google", label: "Avis Google", icon: ThumbsUp, enabled: true, isPremium: true },
      { id: "facebook-ads", label: "Facebook Audience Sync", icon: Facebook, enabled: true, isPremium: true },
      { id: "audiences-personnalisees", label: "Audiences personnalisées", icon: Users, enabled: true, isPremium: true },
      { id: "declencheurs", label: "Déclencheurs automatiques", icon: Workflow, enabled: true, isPremium: true },
      
      // Email Marketing
      { id: "paniers-abandonnes", label: "Paniers abandonnés", icon: ShoppingCart, enabled: true, isPremium: true },
      { id: "campagnes-reconquete", label: "Campagnes reconquête", icon: RotateCcw, enabled: true, isPremium: true },
      { id: "modeles-emails", label: "Modèles emails prédéfinis", icon: FileText, enabled: true, isPremium: true },
      { id: "automatisations-email", label: "Automatisations email", icon: Workflow, enabled: true, isPremium: true },
      { id: "newsletters", label: "Newsletters", icon: Mail, enabled: true, isPremium: true },
      
      // Fidélisation Avancée
      { id: "programme-recompenses", label: "Programme récompenses", icon: Gift, enabled: true, isPremium: true },
      { id: "anniversaires", label: "Récompenses anniversaire", icon: Cake, enabled: true, isPremium: true },
      { id: "parrainage", label: "Programme parrainage", icon: UserPlus, enabled: true, isPremium: true },
      { id: "niveaux-fidelite", label: "Niveaux de fidélité", icon: Crown, enabled: true, isPremium: true },
      { id: "points-fidelite", label: "Points de fidélité", icon: Award, enabled: true, isPremium: true },
      
      // SMS Marketing
      { id: "campagnes-sms", label: "Campagnes SMS", icon: Send, enabled: true, isPremium: true },
      { id: "sms-automatiques", label: "SMS automatiques", icon: Workflow, enabled: true, isPremium: true },
      { id: "notifications-push", label: "Notifications push", icon: Bell, enabled: true, isPremium: true },
      { id: "rapports-sms", label: "Rapports SMS", icon: BarChart3, enabled: true, isPremium: true },
      { id: "sms-mass", label: "SMS en masse", icon: Users, enabled: true, isPremium: true },
      
      // Segmentation Clients
      { id: "segmentation-auto", label: "Segmentation automatique", icon: Filter, enabled: true, isPremium: true },
      { id: "comportements", label: "Analyse comportements", icon: Eye, enabled: true, isPremium: true },
      { id: "scoring-clients", label: "Scoring clients", icon: Star, enabled: true, isPremium: true },
      { id: "ciblage-precis", label: "Ciblage précis", icon: Target, enabled: true, isPremium: true },
      { id: "cohortes", label: "Analyse cohortes", icon: Users, enabled: true, isPremium: true }
    ]
  }
];

// Métriques communes à tous les dashboards
export const commonBusinessMetrics: MetricConfig[] = [
  { label: "CA mensuel", value: "€ 0", color: "bg-green-600", icon: Euro, subtitle: "Ce mois", enabled: true },
  { label: "Employés", value: "0", color: "bg-blue-500", icon: UserCheck, subtitle: "Actifs", enabled: true },
  { label: "Taux fidélité", value: "0%", color: "bg-purple-500", icon: Heart, subtitle: "Clients", enabled: true, isPremium: true },
  { label: "ROI Marketing", value: "+0%", color: "bg-indigo-500", icon: Target, subtitle: "Premium", enabled: true, isPremium: true }
];

// Actions communes à tous les dashboards
export const commonBusinessActions: ActionConfig[] = [
  { label: "Campagne marketing", color: "bg-gradient-to-r from-purple-500 to-indigo-600", icon: Megaphone, enabled: true, isPremium: true },
  { label: "Fidélisation", color: "bg-gradient-to-r from-pink-500 to-red-500", icon: Crown, enabled: true, isPremium: true },
  { label: "SMS Marketing", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: Smartphone, enabled: true, isPremium: true }
];

// Fonction pour fusionner les modules spécifiques avec les modules communs
export function mergeWithCommonModules(specificModules: ModuleConfig[]): ModuleConfig[] {
  return [...specificModules, ...commonBusinessModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner avec modules communs en appliquant premium pour Bars & Maquis
export function mergeWithCommonModulesBarsMaquis(specificModules: ModuleConfig[]): ModuleConfig[] {
  const premiumCommonModules = commonBusinessModules.map(module => {
    if (module.id === "pdv-caisse" || module.id === "comptabilite" || module.id === "personnel-paie") {
      return {
        ...module,
        isPremium: true,
        submenuItems: module.submenuItems?.map(item => ({ ...item, isPremium: true }))
      };
    }
    return module;
  });
  
  return [...specificModules, ...premiumCommonModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner avec modules communs en appliquant premium pour Restaurants/Fastfood
export function mergeWithCommonModulesRestaurants(specificModules: ModuleConfig[]): ModuleConfig[] {
  const premiumCommonModules = commonBusinessModules.map(module => {
    if (module.id === "pdv-caisse" || module.id === "comptabilite" || module.id === "personnel-paie") {
      return {
        ...module,
        isPremium: true,
        submenuItems: module.submenuItems?.map(item => ({ ...item, isPremium: true }))
      };
    }
    return module;
  });
  
  return [...specificModules, ...premiumCommonModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner avec modules communs en appliquant premium pour Épiceries
export function mergeWithCommonModulesEpiceries(specificModules: ModuleConfig[]): ModuleConfig[] {
  const premiumCommonModules = commonBusinessModules.map(module => {
    if (module.id === "pdv-caisse" || module.id === "comptabilite" || module.id === "personnel-paie") {
      return {
        ...module,
        isPremium: true,
        submenuItems: module.submenuItems?.map(item => ({ ...item, isPremium: true }))
      };
    }
    return module;
  });
  
  return [...specificModules, ...premiumCommonModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner avec modules communs en appliquant premium pour Fruiteries
export function mergeWithCommonModulesFruiteries(specificModules: ModuleConfig[]): ModuleConfig[] {
  const premiumCommonModules = commonBusinessModules.map(module => {
    if (module.id === "pdv-caisse" || module.id === "comptabilite") {
      return {
        ...module,
        isPremium: true,
        submenuItems: module.submenuItems?.map(item => ({ ...item, isPremium: true }))
      };
    }
    return module;
  });
  
  return [...specificModules, ...premiumCommonModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner avec modules communs en appliquant premium pour Métiers de Bouche
export function mergeWithCommonModulesMetiersBouche(specificModules: ModuleConfig[]): ModuleConfig[] {
  const premiumCommonModules = commonBusinessModules.map(module => {
    if (module.id === "pdv-caisse" || module.id === "comptabilite") {
      return {
        ...module,
        isPremium: true,
        submenuItems: module.submenuItems?.map(item => ({ ...item, isPremium: true }))
      };
    }
    return module;
  });
  
  return [...specificModules, ...premiumCommonModules]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999));
}

// Fonction pour fusionner les métriques spécifiques avec les métriques communes
export function mergeWithCommonMetrics(specificMetrics: MetricConfig[]): MetricConfig[] {
  return [...specificMetrics, ...commonBusinessMetrics];
}

// Fonction pour fusionner les actions spécifiques avec les actions communes
export function mergeWithCommonActions(specificActions: ActionConfig[]): ActionConfig[] {
  return [...specificActions, ...commonBusinessActions];
}

// ===========================================
// CONFIGURATIONS SPÉCIFIQUES PAR SECTEUR
// ===========================================

// Modules spécifiques aux Restaurants & Fast-food
const restaurantsFastfoodSpecificModules: ModuleConfig[] = [
  {
    id: "tableau-de-bord",
    label: "Tableau de bord",
    icon: Home,
    enabled: true,
    priority: 1
  },
  {
    id: "commande-live",
    label: "Commandes Live",
    icon: Command,
    enabled: true,
    priority: 2
  },
  {
    id: "vue-cuisine",
    label: "Vue Cuisine (KDS)",
    icon: ChefHat,
    enabled: true,
    priority: 3
  },
  {
    id: "reservation",
    label: "Réservations",
    icon: Calendar,
    enabled: true,
    priority: 4
  },
  {
    id: "gestion-menu",
    label: "Gestion Menu",
    icon: Utensils,
    enabled: true,
    priority: 5,
    hasSubmenu: true,
    submenuItems: [
      { id: "menu", label: "Menu", icon: Utensils, enabled: true },
      { id: "categories", label: "Catégories", icon: Layers, enabled: true },
      { id: "specialites", label: "Spécialités", icon: Star, enabled: true },
      { id: "extras", label: "Extras", icon: Plus, enabled: true },
      { id: "packages", label: "Packages", icon: Box, enabled: true },
      { id: "allergies", label: "Allergènes", icon: AlertTriangle, enabled: true },
      { id: "generateur-qr", label: "QR Menu", icon: QrCode, enabled: true }
    ]
  },
  {
    id: "stock-ingredients",
    label: "Stock & Ingrédients",
    icon: Package,
    enabled: true,
    priority: 6,
    isPremium: true, // Premium pour Restaurants/Fastfood
    hasSubmenu: true,
    submenuItems: [
      { id: "overview", label: "Aperçu Stock", icon: Eye, enabled: true, isPremium: true },
      { id: "ingredients", label: "Ingrédients", icon: Apple, enabled: true, isPremium: true },
      { id: "products", label: "Produits", icon: Box, enabled: true, isPremium: true },
      { id: "categories", label: "Catégories", icon: Folder, enabled: true, isPremium: true },
      { id: "ustensiles", label: "Ustensiles", icon: Utensils, enabled: true, isPremium: true },
      { id: "commandes-achat", label: "Commandes d'achat", icon: ShoppingCart, enabled: true, isPremium: true },
      { id: "fournisseurs", label: "Fournisseurs", icon: Building2, enabled: true, isPremium: true },
      { id: "provisions", label: "Provisions", icon: Folder, enabled: true, isPremium: true },
      { id: "alertes-stock", label: "Alertes Stock", icon: AlertTriangle, enabled: true, isPremium: true }
    ]
  },
  {
    id: "entreprises-livraison",
    label: "Livraisons",
    icon: Truck,
    enabled: true,
    priority: 7,
    isPremium: true, // Premium pour Restaurants/Fastfood
    hasSubmenu: true,
    submenuItems: [
      { id: "companies-list", label: "Entreprises partenaires", icon: Building2, enabled: true, isPremium: true },
      { id: "overview", label: "Aperçu livraisons", icon: Eye, enabled: true, isPremium: true },
      { id: "company-info", label: "Infos de l'entreprise", icon: Building2, enabled: true, isPremium: true },
      { id: "drivers-list", label: "Liste des livreurs", icon: Users, enabled: true, isPremium: true },
      { id: "assigned-deliveries", label: "Commandes attribuées", icon: Package, enabled: true, isPremium: true },
      { id: "completed-deliveries", label: "Commandes livrées", icon: CheckCircle, enabled: true, isPremium: true }
    ]
  },
  {
    id: "liste-clients",
    label: "Clients",
    icon: Users,
    enabled: true,
    priority: 9
  },
  {
    id: "rapports",
    label: "Rapports",
    icon: BarChart3,
    enabled: true,
    priority: 10
  }
];

// Métriques spécifiques aux Restaurants & Fast-food
const restaurantsFastfoodSpecificMetrics: MetricConfig[] = [
  { label: "Plats Menu", value: "0/200", color: "bg-blue-500", icon: Utensils, enabled: true },
  { label: "Commandes/jour", value: "0/5000", color: "bg-red-700", icon: ShoppingCart, enabled: true },
  { label: "Tables", value: "12/12", color: "bg-green-500", icon: Calendar, enabled: true },
  { label: "Revenus/jour", value: "3,300€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
  { label: "Clients", value: "847", color: "bg-purple-500", icon: Users, enabled: true },
  { label: "Note Moyenne", value: "4.8/5", color: "bg-yellow-500", icon: Star, enabled: true }
];

// Actions spécifiques aux Restaurants & Fast-food
const restaurantsFastfoodSpecificActions: ActionConfig[] = [
  { label: "Nouvelle commande", color: "bg-red-700", icon: Plus, enabled: true },
  { label: "Gestion de menu", color: "bg-blue-500", icon: Utensils, enabled: true },
  { label: "Stock", color: "bg-green-500", icon: Package, badge: "3", enabled: true },
  { label: "Comptabilité", color: "bg-gradient-to-r from-indigo-500 to-purple-600", icon: Calculator, enabled: true },
  { label: "Livraisons", color: "bg-gradient-to-r from-orange-500 to-orange-600", icon: Truck, enabled: true },
  { label: "Réservations", color: "bg-cyan-500", icon: Calendar, enabled: true },
  { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
];

// Configuration complète pour Restaurants & Fast-food
export const restaurantsFastfoodConfig: DashboardConfig = {
  title: "Dashboard Restaurant",
  subtitle: "Gestion complète de votre restaurant",
  description: "Gérez commandes, menu, cuisine et livraisons + Marketing avancé",
  color: "from-[#b70f23] to-[#70070e]",
  modules: mergeWithCommonModulesRestaurants(restaurantsFastfoodSpecificModules),
  metrics: mergeWithCommonMetrics(restaurantsFastfoodSpecificMetrics),
  actions: mergeWithCommonActions(restaurantsFastfoodSpecificActions)
};

// ===========================================
// Configuration pour Bars & Maquis
// ===========================================
const barsMaquisSpecificModules: ModuleConfig[] = [
  {
    id: "tableau-de-bord",
    label: "Tableau de bord",
    icon: Home,
    enabled: true,
    priority: 1
  },
  {
    id: "commande-live",
    label: "Commandes Live",
    icon: Command,
    enabled: true,
    priority: 2
  },
  {
    id: "gestion-carte",
    label: "Carte Boissons",
    icon: Wine,
    enabled: true,
    priority: 3,
    hasSubmenu: true,
    submenuItems: [
      { id: "boissons", label: "Boissons", icon: Wine, enabled: true },
      { id: "cocktails", label: "Cocktails", icon: Coffee, enabled: true },
      { id: "snacking", label: "Snacking", icon: UtensilsCrossed, enabled: true },
      { id: "categories", label: "Catégories", icon: Layers, enabled: true }
    ]
  },
  {
    id: "evenements",
    label: "Événements",
    icon: CalendarIcon,
    enabled: true,
    priority: 4,
    isPremium: true, // Premium pour Bars & Maquis
    hasSubmenu: true,
    submenuItems: [
      { id: "soirees", label: "Soirées", icon: Star, enabled: true, isPremium: true },
      { id: "reservations", label: "Réservations", icon: Calendar, enabled: true, isPremium: true },
      { id: "privatisations", label: "Privatisations", icon: Building2, enabled: true, isPremium: true }
    ]
  },
  {
    id: "stock-boissons",
    label: "Stock Boissons",
    icon: Package,
    enabled: true,
    priority: 5
  },
  {
    id: "programme-fidelite",
    label: "Fidélité",
    icon: Award,
    enabled: true,
    priority: 6,
    isPremium: true // Premium pour Bars & Maquis
  },
  {
    id: "liste-clients",
    label: "Clients",
    icon: Users,
    enabled: true,
    priority: 8
  },
  {
    id: "rapports",
    label: "Rapports",
    icon: BarChart3,
    enabled: true,
    priority: 9
  }
];

const barsMaquisSpecificMetrics: MetricConfig[] = [
  { label: "Boissons", value: "0/500", color: "bg-amber-500", icon: Wine, enabled: true },
  { label: "Commandes/jour", value: "0/1000", color: "bg-red-700", icon: ShoppingCart, enabled: true },
  { label: "Événements", value: "3", color: "bg-purple-500", icon: CalendarIcon, subtitle: "Ce mois", enabled: true },
  { label: "Revenus/jour", value: "2,100€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
  { label: "Clients fidèles", value: "234", color: "bg-green-500", icon: Users, enabled: true },
  { label: "Ambiance", value: "🎵 Live", color: "bg-indigo-500", icon: Star, enabled: true }
];

const barsMaquisSpecificActions: ActionConfig[] = [
  { label: "Nouvelle commande", color: "bg-red-700", icon: Plus, enabled: true },
  { label: "Gérer carte", color: "bg-amber-500", icon: Wine, enabled: true },
  { label: "Stock boissons", color: "bg-green-500", icon: Package, enabled: true },
  { label: "Comptabilité", color: "bg-gradient-to-r from-indigo-500 to-purple-600", icon: Calculator, enabled: true },
  { label: "Événement", color: "bg-purple-500", icon: CalendarIcon, enabled: true },
  { label: "Ambiance", color: "bg-indigo-500", icon: Star, enabled: true },
  { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
];

export const barsMaquisConfig: DashboardConfig = {
  title: "Dashboard Bar & Maquis",
  subtitle: "Gestion de votre établissement de boissons",
  description: "Gérez boissons, événements et ambiance + Marketing avancé",
  color: "from-[#f4b71b] to-[#e09900]",
  modules: mergeWithCommonModulesBarsMaquis(barsMaquisSpecificModules),
  metrics: mergeWithCommonMetrics(barsMaquisSpecificMetrics),
  actions: mergeWithCommonActions(barsMaquisSpecificActions)
};

// ===========================================
// Configurations pour les autres secteurs (simplifiées)
// ===========================================

export const metiersBoucheConfig: DashboardConfig = {
  title: "Dashboard Métiers de Bouche",
  subtitle: "Artisan de l'alimentation",
  description: "Traçabilité, qualité et conformité + Marketing avancé",
  color: "from-[#b70f23] to-[#f4b71b]",
  modules: mergeWithCommonModulesMetiersBouche([
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "commande-live", label: "Commandes", icon: Command, enabled: true, priority: 2 },
    { id: "production", label: "Production", icon: ChefHat, enabled: true, priority: 3 },
    { id: "tracabilite", label: "Traçabilité HACCP", icon: Shield, enabled: true, priority: 4, isPremium: true }, // Premium pour Métiers de Bouche
    { id: "gestion-produits", label: "Produits", icon: Package, enabled: true, priority: 5 },
    { id: "liste-clients", label: "Clients", icon: Users, enabled: true, priority: 9 },
    { id: "rapports", label: "Rapports", icon: BarChart3, enabled: true, priority: 10 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Produits", value: "0/100", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Production/jour", value: "0/500", color: "bg-green-600", icon: ChefHat, enabled: true },
    { label: "Conformité", value: "100%", color: "bg-green-500", icon: Shield, subtitle: "HACCP", enabled: true },
    { label: "Revenus/jour", value: "1,850€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
    { label: "Clients", value: "156", color: "bg-purple-500", icon: Users, enabled: true },
    { label: "Qualité", value: "4.9/5", color: "bg-yellow-500", icon: Star, enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvelle production", color: "bg-green-600", icon: Plus, enabled: true },
    { label: "Gérer produits", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Contrôle HACCP", color: "bg-red-600", icon: Shield, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

export const epiceriesConfig: DashboardConfig = {
  title: "Dashboard Épicerie",
  subtitle: "Commerce alimentaire de proximité",
  description: "Gestion complète de votre épicerie + Marketing avancé",
  color: "from-[#b70f23] to-[#f4b71b]",
  modules: mergeWithCommonModulesEpiceries([
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "commande-live", label: "Commandes", icon: Command, enabled: true, priority: 2 },
    { id: "gestion-produits", label: "Catalogue Alimentaire", icon: Store, enabled: true, priority: 3 },
    { id: "stock-inventaire", label: "Stock & Inventaire", icon: ClipboardList, enabled: true, priority: 4 },
    { id: "click-collect", label: "Click & Collect", icon: ShoppingBag, enabled: true, priority: 5, isPremium: true }, // Premium pour Épiceries
    { id: "programme-fidelite", label: "Programme Fidélité", icon: Award, enabled: true, priority: 6, isPremium: true }, // Premium pour Épiceries
    { id: "liste-clients", label: "Clients", icon: Users, enabled: true, priority: 8 },
    { id: "rapports", label: "Rapports", icon: BarChart3, enabled: true, priority: 9 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Produits alimentaires", value: "0/2000", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Commandes/jour", value: "0/200", color: "bg-red-700", icon: ShoppingCart, enabled: true },
    { label: "Click & Collect", value: "45%", color: "bg-green-500", icon: ShoppingBag, subtitle: "des ventes", enabled: true },
    { label: "Revenus/jour", value: "980€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
    { label: "Clients fidèles", value: "89", color: "bg-purple-500", icon: Users, enabled: true },
    { label: "Satisfaction", value: "4.6/5", color: "bg-yellow-500", icon: Star, enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvelle commande", color: "bg-red-700", icon: Plus, enabled: true },
    { label: "Gérer catalogue", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Stock", color: "bg-green-500", icon: Package, badge: "5", enabled: true },
    { label: "Click & Collect", color: "bg-cyan-500", icon: ShoppingBag, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

export const boutiquesConfig: DashboardConfig = {
  title: "Dashboard Boutique",
  subtitle: "Commerce spécialisé",
  description: "Gestion de votre boutique et collections + Marketing avancé",
  color: "from-[#70070e] to-[#f4b71b]",
  modules: mergeWithCommonModulesEpiceries([ // Même premium que épiceries pour l'instant
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "commande-live", label: "Commandes", icon: Command, enabled: true, priority: 2 },
    { id: "gestion-produits", label: "Collections & Produits", icon: Tags, enabled: true, priority: 3 },
    { id: "stock-inventaire", label: "Stock & Inventaire", icon: ClipboardList, enabled: true, priority: 4 },
    { id: "gestion-collections", label: "Collections Saisonnières", icon: Layers, enabled: true, priority: 5 },
    { id: "programme-fidelite", label: "Programme Fidélité", icon: Award, enabled: true, priority: 6, isPremium: true }, // Premium pour Boutiques
    { id: "liste-clients", label: "Clients", icon: Users, enabled: true, priority: 8 },
    { id: "rapports", label: "Rapports", icon: BarChart3, enabled: true, priority: 9 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Références", value: "0/800", color: "bg-blue-500", icon: Tags, enabled: true },
    { label: "Commandes/jour", value: "0/80", color: "bg-red-700", icon: ShoppingCart, enabled: true },
    { label: "Collections", value: "4", color: "bg-purple-500", icon: Layers, subtitle: "Saisons", enabled: true },
    { label: "Revenus/jour", value: "1,250€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
    { label: "Clients fidèles", value: "156", color: "bg-green-500", icon: Users, enabled: true },
    { label: "Panier moyen", value: "85€", color: "bg-indigo-500", icon: ShoppingBag, enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvelle vente", color: "bg-red-700", icon: Plus, enabled: true },
    { label: "Gérer collections", color: "bg-purple-500", icon: Tags, enabled: true },
    { label: "Stock", color: "bg-green-500", icon: Package, badge: "2", enabled: true },
    { label: "Nouvelle collection", color: "bg-indigo-500", icon: Layers, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

export const fruiteriesConfig: DashboardConfig = {
  title: "Dashboard Fruiterie",
  subtitle: "Fruits et légumes frais",
  description: "Gestion optimisée des produits frais + Marketing avancé",
  color: "from-[#70070e] to-[#f4b71b]",
  modules: mergeWithCommonModulesFruiteries([
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "commande-live", label: "Commandes", icon: Command, enabled: true, priority: 2 },
    { id: "gestion-produits", label: "Fruits & Légumes", icon: Apple, enabled: true, priority: 3 },
    { id: "fraicheur", label: "Gestion Fraîcheur", icon: Zap, enabled: true, priority: 4 },
    { id: "stock-rotation", label: "Stock & Rotation", icon: Repeat, enabled: true, priority: 5 },
    { id: "promotions-flash", label: "Promotions Flash", icon: Percent, enabled: true, priority: 6, isPremium: true }, // Premium pour Fruiteries
    { id: "liste-clients", label: "Clients", icon: Users, enabled: true, priority: 9 },
    { id: "rapports", label: "Rapports", icon: BarChart3, enabled: true, priority: 10 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Produits frais", value: "0/300", color: "bg-green-600", icon: Apple, enabled: true },
    { label: "Commandes/jour", value: "0/150", color: "bg-red-700", icon: ShoppingCart, enabled: true },
    { label: "Fraîcheur", value: "98%", color: "bg-green-500", icon: Zap, subtitle: "Qualité", enabled: true },
    { label: "Revenus/jour", value: "720€", color: "bg-orange-400", icon: Euro, subtitle: "Aujourd'hui", enabled: true },
    { label: "Clients", value: "67", color: "bg-purple-500", icon: Users, enabled: true },
    { label: "Gaspillage", value: "-45%", color: "bg-emerald-500", icon: TrendingUp, enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvelle commande", color: "bg-red-700", icon: Plus, enabled: true },
    { label: "Gérer produits", color: "bg-green-600", icon: Apple, enabled: true },
    { label: "Contrôle fraîcheur", color: "bg-blue-500", icon: Zap, enabled: true },
    { label: "Anti-gaspillage", color: "bg-emerald-500", icon: AlertTriangle, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

export const producteursConfig: DashboardConfig = {
  title: "Dashboard Producteur",
  subtitle: "Production et distribution",
  description: "Gestion B2B et logistique + Marketing avancé",
  color: "from-[#70070e] to-[#b70f23]",
  modules: mergeWithCommonModules([
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "commandes-b2b", label: "Commandes B2B", icon: Building2, enabled: true, priority: 2 },
    { id: "catalogue-b2b", label: "Catalogue B2B", icon: Store, enabled: true, priority: 3 },
    { id: "production", label: "Production", icon: ChefHat, enabled: true, priority: 4 },
    { id: "logistique", label: "Logistique", icon: Truck, enabled: true, priority: 5 },
    { id: "clients-b2b", label: "Clients Professionnels", icon: Building2, enabled: true, priority: 6 },
    { id: "rapports", label: "Rapports", icon: FileText, enabled: true, priority: 9 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Produits B2B", value: "0/50", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Commandes/mois", value: "0/500", color: "bg-red-700", icon: Building2, enabled: true },
    { label: "Production", value: "85%", color: "bg-green-500", icon: ChefHat, subtitle: "Capacité", enabled: true },
    { label: "CA mensuel", value: "45,300€", color: "bg-orange-400", icon: Euro, subtitle: "Ce mois", enabled: true },
    { label: "Clients B2B", value: "23", color: "bg-purple-500", icon: Building2, enabled: true },
    { label: "Livraisons", value: "98%", color: "bg-emerald-500", icon: Truck, subtitle: "A temps", enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvelle commande B2B", color: "bg-red-700", icon: Plus, enabled: true },
    { label: "Gérer catalogue", color: "bg-blue-500", icon: Store, enabled: true },
    { label: "Production", color: "bg-green-500", icon: ChefHat, enabled: true },
    { label: "Logistique", color: "bg-indigo-500", icon: Truck, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

export const cateringConfig: DashboardConfig = {
  title: "Dashboard Catering",
  subtitle: "Services traiteur événementiel",
  description: "Gestion événements et prestations + Marketing avancé",
  color: "from-[#f4b71b] to-[#b70f23]",
  modules: mergeWithCommonModules([
    { id: "tableau-de-bord", label: "Tableau de bord", icon: Home, enabled: true, priority: 1 },
    { id: "evenements", label: "Événements", icon: CalendarIcon, enabled: true, priority: 2 },
    { id: "menus-prestations", label: "Menus & Prestations", icon: Utensils, enabled: true, priority: 3 },
    { id: "production-cuisine", label: "Production", icon: ChefHat, enabled: true, priority: 4 },
    { id: "logistique-evenements", label: "Logistique", icon: Truck, enabled: true, priority: 5 },
    { id: "equipes", label: "Équipes", icon: Users, enabled: true, priority: 6 },
    { id: "clients-entreprises", label: "Clients Entreprises", icon: Building2, enabled: true, priority: 7 },
    { id: "rapports", label: "Rapports", icon: BarChart3, enabled: true, priority: 9 }
  ]),
  metrics: mergeWithCommonMetrics([
    { label: "Événements", value: "12/50", color: "bg-purple-500", icon: CalendarIcon, subtitle: "Ce mois", enabled: true },
    { label: "Prestations", value: "8", color: "bg-blue-500", icon: Star, subtitle: "Types", enabled: true },
    { label: "Équipe", value: "15", color: "bg-green-500", icon: Users, subtitle: "Personnes", enabled: true },
    { label: "CA mensuel", value: "23,500€", color: "bg-orange-400", icon: Euro, subtitle: "Ce mois", enabled: true },
    { label: "Clients", value: "45", color: "bg-red-500", icon: Building2, subtitle: "Entreprises", enabled: true },
    { label: "Satisfaction", value: "4.9/5", color: "bg-yellow-500", icon: Star, enabled: true }
  ]),
  actions: mergeWithCommonActions([
    { label: "Nouvel événement", color: "bg-purple-500", icon: Plus, enabled: true },
    { label: "Gérer menus", color: "bg-blue-500", icon: Utensils, enabled: true },
    { label: "Production", color: "bg-green-500", icon: ChefHat, enabled: true },
    { label: "Équipes", color: "bg-indigo-500", icon: Users, enabled: true },
    { label: "Paramètres", color: "bg-orange-600", icon: Settings, enabled: true }
  ])
};

// Configurations par type d'activité
export const dashboardConfigurations: { [key: string]: DashboardConfig } = {
  "restaurants-fastfood": restaurantsFastfoodConfig,
  "bars-maquis": barsMaquisConfig,
  "metiers-bouche": metiersBoucheConfig,
  "epiceries": epiceriesConfig,
  "boutiques-superettes": epiceriesConfig, // Réutilise la config épicerie
  "fruiteries": fruiteriesConfig,
  "producteurs-fournisseurs": producteursConfig,
  "catering": cateringConfig
};

// Configuration par défaut (fallback)
export const defaultDashboardConfig: DashboardConfig = restaurantsFastfoodConfig;