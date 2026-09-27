import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  User, 
  LogOut, 
  Home,
  Bell,
  Search,
  Settings
} from "lucide-react";
import { cn } from "./ui/utils";

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface MenuSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItem[];
  isActive?: boolean;
  onClick?: () => void;
}

interface ResponsiveDashboardLayoutProps {
  title?: string;
  userType: string;
  menuSections?: MenuSection[];
  activeSection?: string;
  activeSubSection?: string;
  onLogout: () => void;
  userSession?: {
    email: string;
    userType: string;
    isAuthenticated: boolean;
  } | null;
  children?: React.ReactNode;
}

export function ResponsiveDashboardLayout({
  title = "Dashboard",
  userType,
  menuSections = [],
  activeSection = "",
  activeSubSection = "",
  onLogout,
  userSession,
  children
}: ResponsiveDashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "restaurant": return "bg-[#b70f23]";
      case "delivery": return "bg-[#f4b71b]";
      case "company": return "bg-[#70070e]";
      case "affiliate": return "bg-gradient-to-r from-[#b70f23] to-[#f4b71b]";
      default: return "bg-[#b70f23]";
    }
  };

  const getUserTypeGradient = (type: string) => {
    switch (type) {
      case "restaurant": return "from-[#b70f23] to-[#70070e]";
      case "delivery": return "from-[#f4b71b] to-[#b70f23]";
      case "company": return "from-[#70070e] to-[#b70f23]";
      case "affiliate": return "from-[#b70f23] via-[#f4b71b] to-[#70070e]";
      default: return "from-[#b70f23] to-[#70070e]";
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderMenuItem = (section: MenuSection) => {
    const Icon = section.icon;
    const sectionIsActive = activeSection === section.id;
    const hasSubmenu = section.hasSubmenu && section.submenuItems && section.submenuItems.length > 0;
    const expanded = isExpanded(section.id);

    return (
      <div key={section.id} className="mb-1">
        {/* Menu Principal */}
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleSection(section.id);
            }
            if (section.onClick) {
              section.onClick();
              if (isMobile) closeMobileMenu();
            }
          }}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98]", // Windows Phone style animations
            sectionIsActive && !hasSubmenu
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium">{section.label}</span>
          </div>
          {hasSubmenu && (
            <div className="ml-auto">
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {/* Sous-menus avec animation Windows Phone */}
        {hasSubmenu && (
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="ml-6 mt-2 space-y-1 border-l-2 border-white/20 pl-4">
              {section.submenuItems?.map((subItem) => {
                const SubIcon = subItem.icon;
                const subIsActive = activeSubSection === subItem.id;
                
                return (
                  <button
                    key={subItem.id}
                    onClick={() => {
                      subItem.onClick();
                      if (isMobile) closeMobileMenu();
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      subIsActive
                        ? "bg-white/15 text-white font-medium shadow-md backdrop-blur-sm" 
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {SubIcon && (
                      <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
                        <SubIcon className="w-3 h-3" />
                      </div>
                    )}
                    <span className="text-sm">{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <div className={cn(
        "hidden md:flex md:w-72 lg:w-80 flex-col",
        `bg-gradient-to-br ${getUserTypeGradient(userType)}`,
        "shadow-2xl relative overflow-hidden"
      )}>
        {/* Background Pattern - Windows Phone Style */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/3 right-0 w-16 h-16 bg-white rounded-full translate-x-8"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/20">
          <Logo className="justify-start text-white [&_h1]:text-white [&_p]:text-white/80" />
          <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <h3 className="text-white font-medium">Tableau de bord</h3>
            <p className="text-white/80 text-sm capitalize">{userType}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuSections.map(renderMenuItem)}
          </div>
        </nav>

        {/* User Info */}
        <div className="relative z-10 p-4 border-t border-white/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">Mon Compte</p>
              <p className="text-sm text-white/80 truncate">
                {userSession?.email || 'Non connecté'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Mobile/Desktop */}
        <div className={cn(
          "bg-white border-b border-gray-200 shadow-sm",
          "sticky top-0 z-40 backdrop-blur-md bg-white/90"
        )}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                  {title}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  {activeSubSection ? 
                    `${menuSections.find(s => s.id === activeSection)?.label} - ${
                      menuSections.find(s => s.id === activeSection)?.submenuItems?.find(sub => sub.id === activeSubSection)?.label
                    }` 
                    : `Dashboard ${userType}`
                  }
                </p>
              </div>
            </div>

            {/* Top Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children || (
            <div className="space-y-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bienvenue sur votre tableau de bord {userType}
                </h2>
                <p className="text-gray-600">
                  Utilisez le menu de navigation pour accéder aux différentes sections.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Sidebar */}
          <div className={cn(
            "absolute left-0 top-0 h-full w-80 max-w-[85vw]",
            `bg-gradient-to-br ${getUserTypeGradient(userType)}`,
            "shadow-2xl transform transition-transform duration-300",
            "flex flex-col overflow-hidden"
          )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>

            {/* Mobile Header */}
            <div className="relative z-10 p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-4">
                <Logo className="justify-start text-white [&_h1]:text-white [&_p]:text-white/80" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <h3 className="text-white font-medium">Tableau de bord</h3>
                <p className="text-white/80 text-sm capitalize">{userType}</p>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="relative z-10 flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {menuSections.map(renderMenuItem)}
              </div>
            </nav>

            {/* Mobile User Info */}
            <div className="relative z-10 p-4 border-t border-white/20">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">Mon Compte</p>
                  <p className="text-sm text-white/80 truncate">
                    {userSession?.email || 'Non connecté'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}