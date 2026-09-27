import { useMemo } from 'react';
import { dashboardConfigurations, defaultDashboardConfig, DashboardConfig, ModuleConfig, MetricConfig, ActionConfig } from '../data/updatedBusinessDashboardConfigurations';
import { Home, Folder, ChefHat, Package2, Utensils, ShoppingCart, Building2, Eye, Users, Package, CheckCircle, Settings, Store, MapPin, Calendar as CalendarIcon, QrCode } from 'lucide-react';

export function useDashboardConfig(userType: string): DashboardConfig {
  return useMemo(() => {
    // Extraire le type d'activité depuis le userType
    // Format attendu: "business-restaurants-fastfood" ou "restaurant" (legacy)
    
    let businessType = '';
    
    if (userType.startsWith('business-')) {
      // Nouveau format: "business-restaurants-fastfood"
      businessType = userType.replace('business-', '');
    } else if (userType === 'restaurant') {
      // Legacy format pour compatibilité
      businessType = 'restaurants-fastfood';
    } else {
      // Types non business (delivery, company, affiliate)
      return defaultDashboardConfig;
    }
    
    // Retourner la configuration correspondante ou la configuration par défaut
    return dashboardConfigurations[businessType] || defaultDashboardConfig;
  }, [userType]);
}

// Hook pour obtenir les modules actifs triés par priorité
export function useActiveModules(config: DashboardConfig) {
  return useMemo(() => {
    return config.modules
      .filter(module => module.enabled)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }, [config.modules]);
}

// Hook pour obtenir les métriques actives
export function useActiveMetrics(config: DashboardConfig) {
  return useMemo(() => {
    return config.metrics.filter(metric => metric.enabled);
  }, [config.metrics]);
}

// Hook pour obtenir les actions actives  
export function useActiveActions(config: DashboardConfig) {
  return useMemo(() => {
    return config.actions.filter(action => action.enabled);
  }, [config.actions]);
}

// Hook pour filtrer seulement les modules gratuits
export function useFreeModules(config: DashboardConfig) {
  return useMemo(() => {
    return config.modules
      .filter(module => module.enabled && !module.isPremium)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }, [config.modules]);
}

// Hook pour filtrer seulement les modules premium
export function usePremiumModules(config: DashboardConfig) {
  return useMemo(() => {
    return config.modules
      .filter(module => module.enabled && module.isPremium)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }, [config.modules]);
}

// Hook pour obtenir les métriques gratuites
export function useFreeMetrics(config: DashboardConfig) {
  return useMemo(() => {
    return config.metrics.filter(metric => metric.enabled && !metric.isPremium);
  }, [config.metrics]);
}

// Hook pour obtenir les métriques premium
export function usePremiumMetrics(config: DashboardConfig) {
  return useMemo(() => {
    return config.metrics.filter(metric => metric.enabled && metric.isPremium);
  }, [config.metrics]);
}

// Fonction utilitaire pour convertir les modules en format menu attendu par SidebarWithSubmenus
export function convertModulesToMenuSections(
  modules: any[], 
  hasNewOrders: boolean, 
  hasNewReservations: boolean,
  unreadOrdersCount: number, 
  unreadReservationsCount: number,
  activeSection: string, 
  handleActiveSection: (section: string) => void, 
  setActiveSubSection: (section: string) => void
) {
  // Filtrer les modules pour éviter les doublons avec les sections fixes
  const filteredModules = modules.filter(module => 
    module.id !== 'parametres' && 
    module.id !== 'business-info' &&
    module.id !== 'settings'
  );

  const menuItems = filteredModules.map(module => {
    const menuItem: any = {
      id: module.id,
      label: module.label,
      icon: module.icon,
      onClick: () => handleActiveSection(module.id),
      isPremium: module.isPremium
    };

    // Ajouter les notifications pour les commandes live
    if (module.id === 'commande-live' || module.id === 'commandes-b2b') {
      menuItem.hasNotification = hasNewOrders && activeSection !== module.id;
      menuItem.notificationCount = unreadOrdersCount;
    }
    
    // Ajouter les notifications pour les réservations
    if (module.id === 'reservation' || module.id === 'reservations') {
      menuItem.hasNotification = hasNewReservations && activeSection !== module.id;
      menuItem.notificationCount = unreadReservationsCount;
    }

    // Ajouter les sous-menus si nécessaire
    if (module.hasSubmenu && module.submenuItems) {
      menuItem.hasSubmenu = true;
      
      // Patch spécial pour entreprises-livraison : sous-menus personnalisés avec nouvelle approche
      if (module.id === 'entreprises-livraison') {
        menuItem.submenuItems = [
          {
            id: "companies-list",
            label: "Entreprises partenaires",
            icon: Building2,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("companies-list");
            }
          },
          {
            id: "overview",
            label: "Aperçu livraisons",
            icon: Eye,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("overview");
            }
          },
          {
            id: "company-info",
            label: "Infos de l'entreprise",
            icon: Building2,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("company-info");
            }
          },
          {
            id: "drivers-list",
            label: "Liste des livreurs",
            icon: Users,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("drivers-list");
            }
          },
          {
            id: "assigned-deliveries",
            label: "Commandes attribuées",
            icon: Package,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("assigned-deliveries");
            }
          },
          {
            id: "completed-deliveries",
            label: "Commandes livrées",
            icon: CheckCircle,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("completed-deliveries");
            }
          }
        ];
      }
      // Patch spécial pour stock-ingredients pour avoir les bons sous-menus
      else if (module.id === 'stock-ingredients') {
        menuItem.submenuItems = [
          {
            id: "overview",
            label: "Vue d'ensemble",
            icon: Home,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("overview");
            }
          },
          {
            id: "categories",
            label: "Catégories",
            icon: Folder,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("categories");
            }
          },
          {
            id: "ingredients",
            label: "Ingrédients",
            icon: ChefHat,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("ingredients");
            }
          },
          {
            id: "products",
            label: "Produits à vendre",
            icon: Package2,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("products");
            }
          },
          {
            id: "ustensiles",
            label: "Ustensiles",
            icon: Utensils,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("ustensiles");
            }
          },
          {
            id: "commandes-achat",
            label: "Achats/Commandes",
            icon: ShoppingCart,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("commandes-achat");
            }
          },
          {
            id: "fournisseurs",
            label: "Fournisseurs",
            icon: Building2,
            isPremium: true,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection("fournisseurs");
            }
          }
        ];
      }
      // Patch spécial pour tables-emplacements avec navigation directe
      else if (module.id === 'tables-emplacements') {
        menuItem.submenuItems = [
          {
            id: "config-restaurant",
            label: "Config restaurant",
            icon: Store,
            isPremium: false,
            onClick: () => {
              handleActiveSection("config-restaurant");
              setActiveSubSection("");
            }
          },
          {
            id: "jours-dispos",
            label: "Jours dispos",
            icon: CalendarIcon,
            isPremium: false,
            onClick: () => {
              handleActiveSection("jours-dispos");
              setActiveSubSection("");
            }
          },
          {
            id: "points-retrait",
            label: "Points de retrait",
            icon: MapPin,
            isPremium: false,
            onClick: () => {
              handleActiveSection("points-retrait");
              setActiveSubSection("");
            }
          },
          {
            id: "tables",
            label: "Tables",
            icon: Users,
            isPremium: false,
            onClick: () => {
              handleActiveSection("tables");
              setActiveSubSection("");
            }
          },
          {
            id: "emplacements",
            label: "Emplacements",
            icon: MapPin,
            isPremium: false,
            onClick: () => {
              handleActiveSection("emplacements");
              setActiveSubSection("");
            }
          },
          {
            id: "qr-builder",
            label: "QR Builder",
            icon: QrCode,
            isPremium: false,
            onClick: () => {
              handleActiveSection("qr-builder");
              setActiveSubSection("");
            }
          },
          {
            id: "room-services",
            label: "Services de chambres",
            icon: Building2,
            isPremium: false,
            onClick: () => {
              handleActiveSection("room-services");
              setActiveSubSection("");
            }
          }
        ];
      } else {
        menuItem.submenuItems = module.submenuItems
          .filter((item: any) => item.enabled)
          .map((item: any) => ({
            id: item.id,
            label: item.label,
            icon: item.icon,
            isPremium: item.isPremium,
            onClick: () => {
              handleActiveSection(module.id);
              setActiveSubSection(item.id);
            }
          }));
      }
    }

    return menuItem;
  });

  // Ajouter les sections fixes à la fin avec des IDs uniques
  const fixedSections = [];

  // Ajouter le menu "Paramètres"
  fixedSections.push({
    id: 'settings-menu',
    label: 'Paramètres',
    icon: Settings,
    onClick: () => handleActiveSection('settings'),
    isPremium: false
  });

  return [...menuItems, ...fixedSections];
}