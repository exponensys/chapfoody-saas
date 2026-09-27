import { ReactNode } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Home, ArrowLeft, User, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userType: string;
  onBack: () => void;
  sidebarItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive?: boolean;
    onClick: () => void;
  }>;
}

export function DashboardLayout({ 
  children, 
  title, 
  userType, 
  onBack, 
  sidebarItems 
}: DashboardLayoutProps) {
  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "restaurant": return "bg-[#b70f23]";
      case "delivery": return "bg-[#f4b71b]";
      case "company": return "bg-[#70070e]";
      case "affiliate": return "bg-gradient-to-r from-[#b70f23] to-[#f4b71b]";
      default: return "bg-[#b70f23]";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`w-64 ${getUserTypeColor(userType)} text-white flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <Logo className="justify-start text-white [&_h1]:text-white [&_p]:text-white/80" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    item.isActive 
                      ? "bg-white/20 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
            <User className="w-8 h-8" />
            <div>
              <p className="font-medium">Mon Compte</p>
              <p className="text-sm text-white/80 capitalize">{userType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 capitalize">Dashboard {userType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}