import { Button } from "./ui/button";
import { UserSession } from "../routes";
import {
  Globe,
  Euro,
  ChevronDown,
  HelpCircle,
  User,
} from "lucide-react";

interface TopBarProps {
  userSession: UserSession | null;
  onLogin?: () => void;
  onGoToDashboard?: () => void;
}

export function TopBar({
  userSession,
  onLogin,
  onGoToDashboard,
}: TopBarProps) {
  const handleUserAction = () => {
    if (userSession?.isAuthenticated) {
      onGoToDashboard?.();
    } else {
      onLogin?.();
    }
  };

  return (
    <div className="relative">
      {/* Bande colorée dégradée CHAPFOODY */}
      <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>

      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-10 gap-4 text-sm">
            {/* Language and Currency Selectors */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <Globe className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">FR</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                <Euro className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">EUR</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </div>

            {/* Support Link */}
            {/* <a 
            href="#support"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 hover:text-[#b70f23] transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Support</span>
          </a> */}

            {/* Login/Dashboard Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUserAction}
              className="flex items-center gap-1 px-2 py-1 h-auto text-gray-600 hover:text-[#b70f23] hover:bg-gray-100 transition-colors"
            >
              <User className="w-3 h-3" />
              <span>
                {userSession?.isAuthenticated
                  ? "Dashboard"
                  : "Se connecter"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}