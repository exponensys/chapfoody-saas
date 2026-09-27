import { useState } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { TopBar } from "./TopBar";
import { SolutionsMegamenu } from "./SolutionsMegamenu";
import { UserSession } from "../routes";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Menu,
  X,
  Home,
  Briefcase,
  Users2,
  Newspaper,
  Video,
  HelpCircle,
  MessageSquare,
  Zap,
  Store,
} from "lucide-react";

interface HeaderProps {
  onLogin?: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToAdmin?: () => void;
  onGoToSignup?: () => void;
  onGoToDashboard?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  onGoToSupport?: () => void;
  onGoToHome?: () => void;
  onGoToContact?: () => void;
  userSession?: UserSession | null;
  showAdminButton?: boolean;
  showTopBar?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({
  onLogin,
  onGoToCaseStudies,
  onGoToNews,
  onGoToVideoLibrary,
  onGoToAdmin,
  onGoToSignup,
  onGoToDashboard,
  onSolutionSelect,
  onGoToSupport,
  onGoToHome,
  onGoToContact,
  userSession,
  showAdminButton = false,
  showTopBar = true,
  title = "CHAPFOODY",
  subtitle = "Écosystème alimentaire",
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const navigationItems = [
    {
      label: "Cas d'usage",
      href: "#case-studies",
      icon: Users2,
      onClick: onGoToCaseStudies,
    },
    {
      label: "Actualités",
      href: "#news",
      icon: Newspaper,
      onClick: onGoToNews,
    },
    {
      label: "Vidéothèque",
      href: "#videos",
      icon: Video,
      onClick: onGoToVideoLibrary,
    },
    {
      label: "Contact",
      href: "#contact",
      icon: MessageSquare,
      onClick: onGoToContact,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Bar */}
      {showTopBar && (
        <TopBar
          userSession={userSession}
          onLogin={onLogin}
          onGoToDashboard={onGoToDashboard}
        />
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Logo onClick={onGoToHome} />
            <div>
              {/* <h1 className="text-xl font-bold text-[#b70f23]">
                {title}
              </h1> */}
              {/* <p className="text-xs text-gray-600">{subtitle}</p> */}
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <SolutionsMegamenu
              onSolutionSelect={onSolutionSelect}
            />

            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={item.onClick || (() => {})}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#b70f23] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              </div>
            ))}

            {/* Bouton Démarrer en rouge */}
            <Button
              onClick={onGoToSignup}
              className="bg-[#b70f23] hover:bg-[#70070e] text-white font-medium px-4 py-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              Démarrer
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            {showAdminButton && onGoToAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoToAdmin}
                className="text-gray-500 hover:text-gray-700"
              >
                Admin
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed left-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            style={{
              top: showTopBar ? "88px" : "65px",
              height: showTopBar
                ? "calc(100vh - 88px)"
                : "calc(100vh - 65px)",
            }}
          >
            {/* Mobile Menu Content - Pas de header duppliqué */}
            <div className="p-4">
              {/* User info if logged in */}
              {userSession && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#b70f23]/10 to-[#f4b71b]/10 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    Connecté en tant que :
                  </p>
                  <p className="text-sm text-[#b70f23]">
                    {userSession.email}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {userSession.userType}
                  </p>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-2">
                {/* Solutions */}
                <div className="border-l-2 border-[#f4b71b] pl-4 ml-2">
                  <div className="flex items-center gap-3 p-3 text-gray-700 font-medium">
                    <Store className="w-5 h-5 text-[#b70f23]" />
                    Solutions
                  </div>
                  <div className="space-y-1 ml-8">
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.(
                          "restaurants-fastfood",
                        );
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Restaurants & Fast-food
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.("bars-maquis");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Bars & Maquis
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.("metiers-bouche");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Métiers de bouche
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.(
                          "producteurs-fournisseurs",
                        );
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Producteurs & Fournisseurs
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.(
                          "boutiques-superettes",
                        );
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Boutiques & Superettes
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.("epiceries");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Épiceries
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.("fruiteries");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Fruiteries
                    </button>
                    <button
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        onSolutionSelect?.("catering");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Catering
                    </button>
                  </div>
                </div>

                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-[#b70f23] hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-8 space-y-3">
                {userSession ? (
                  <Button
                    onClick={() => {
                      onGoToDashboard?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Mon Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        onLogin?.();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                    >
                      Se connecter
                    </Button>
                    <Button
                      onClick={() => {
                        onGoToSignup?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Démarrer
                    </Button>
                  </>
                )}

                {showAdminButton && onGoToAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onGoToAdmin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-gray-500 hover:text-gray-700"
                  >
                    Admin
                  </Button>
                )}
              </div>

              {/* Bande colorée CHAPFOODY en bas */}
              <div className="mt-8 h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e] rounded"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}