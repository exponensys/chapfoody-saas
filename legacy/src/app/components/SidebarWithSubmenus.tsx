import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { BlinkingIndicator } from "./BlinkingIndicator";
import { PremiumBadge } from "./PremiumBadge";
import { ChevronDown, ChevronRight, User } from "lucide-react";

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
  hasNotification?: boolean;
  notificationCount?: number;
  isPremium?: boolean;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isPremium?: boolean;
}

interface SidebarWithSubmenusProps {
  userType: string;
  menuSections: MenuSection[];
  activeSection: string;
  activeSubSection?: string;
  userEmail?: string;
  expandedSections?: Set<string>;
  onToggleSection?: (sectionId: string) => void;
}

export function SidebarWithSubmenus({ 
  userType, 
  menuSections, 
  activeSection,
  activeSubSection,
  userEmail,
  expandedSections: externalExpandedSections,
  onToggleSection
}: SidebarWithSubmenusProps) {
  const [internalExpandedSections, setInternalExpandedSections] = useState<Set<string>>(new Set());
  const expandedSections = externalExpandedSections || internalExpandedSections;

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "restaurant": return "bg-gradient-to-br from-[#b70f23] to-[#70070e]";
      case "business": return "bg-gradient-to-br from-[#b70f23] to-[#70070e]";
      case "delivery": return "bg-[#f4b71b]";
      case "company": return "bg-[#70070e]";
      case "affiliate": return "bg-gradient-to-r from-[#b70f23] to-[#f4b71b]";
      default: return "bg-gradient-to-br from-[#b70f23] to-[#70070e]";
    }
  };

  const toggleSection = (sectionId: string) => {
    if (onToggleSection) {
      onToggleSection(sectionId);
    } else {
      const newExpanded = new Set(internalExpandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      setInternalExpandedSections(newExpanded);
    }
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  return (
    <div className={`w-64 min-h-screen ${getUserTypeColor(userType)} text-white flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-white/20 flex-shrink-0">
        <Logo 
          variant="white" 
          className="justify-start text-white [&_h1]:text-white [&_p]:text-white/80" 
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 min-h-full">
          {menuSections.map((section) => {
            const Icon = section.icon;
            const sectionIsActive = activeSection === section.id;
            const hasSubmenu = section.hasSubmenu && section.submenuItems && section.submenuItems.length > 0;
            const expanded = isExpanded(section.id);

            return (
              <div key={section.id}>
                {/* Menu Principal */}
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSection(section.id);
                      // Ne pas appeler onClick si c'est juste pour toggle le submenu
                    } else if (section.onClick) {
                      section.onClick();
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    sectionIsActive
                      ? "bg-white/20 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 relative">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{section.label}</span>
                    {section.isPremium && (
                      <PremiumBadge variant="icon-only" className="ml-1" />
                    )}
                    {section.hasNotification && (
                      <div className="absolute -right-2 -top-1">
                        <BlinkingIndicator 
                          isActive={section.hasNotification}
                          count={section.notificationCount}
                          size="sm"
                          color="green"
                        />
                      </div>
                    )}
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

                {/* Sous-menus */}
                <AnimatePresence>
                  {hasSubmenu && expanded && section.submenuItems && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      {section.submenuItems.map((subItem, index) => {
                        const SubIcon = subItem.icon;
                        const subIsActive = activeSubSection === subItem.id;
                        
                        return (
                          <motion.button
                            key={subItem.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={subItem.onClick}
                            className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors text-sm ${
                              subIsActive
                                ? "bg-white/15 text-white font-medium" 
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4" />}
                            <span>{subItem.label}</span>
                            {subItem.isPremium && (
                              <PremiumBadge variant="icon-only" className="ml-1" />
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/20 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
          <User className="w-8 h-8" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Mon Compte</p>
            <p className="text-sm text-white/80 truncate">
              {userEmail || "demo@chapfoody.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}