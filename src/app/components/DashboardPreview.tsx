import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UnifiedBusinessDashboard } from "./UnifiedBusinessDashboard";
import { dashboardConfigurations } from "../data/businessDashboardConfigurations";
import { PremiumBadge } from "./PremiumBadge";
import { motion } from "motion/react";
import { ArrowLeft, Eye, Settings } from "lucide-react";

interface DashboardPreviewProps {
  onBack?: () => void;
}

export function DashboardPreview({ onBack }: DashboardPreviewProps) {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("restaurants-fastfood");
  const [showFullDashboard, setShowFullDashboard] = useState(false);

  const businessTypes = [
    { id: "restaurants-fastfood", name: "Restaurants & Fast-food", category: "Restauration" },
    { id: "bars-maquis", name: "Bars & Maquis", category: "Restauration" },
    { id: "metiers-bouche", name: "Métiers de bouche", category: "Artisanat" },
    { id: "epiceries", name: "Épiceries", category: "Commerce" },
    { id: "boutiques-superettes", name: "Boutiques & Superettes", category: "Commerce" },
    { id: "fruiteries", name: "Fruiteries", category: "Commerce" },
    { id: "producteurs-fournisseurs", name: "Producteurs & Fournisseurs", category: "Production" },
    { id: "catering", name: "Catering", category: "Services" }
  ];

  const currentConfig = dashboardConfigurations[selectedBusinessType];

  const mockUserSession = {
    email: "demo@chapfoody.com",
    userType: `business-${selectedBusinessType}`,
    isAuthenticated: true
  };

  if (showFullDashboard) {
    return (
      <UnifiedBusinessDashboard
        onBack={() => setShowFullDashboard(false)}
        userSession={mockUserSession}
      />
    );
  }

  const groupedTypes = businessTypes.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = [];
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, typeof businessTypes>);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Configurator</h1>
              <p className="text-gray-600">Prévisualisez les dashboards par type d'activité</p>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Sélecteur de type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Type d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedTypes).map(([category, types]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100">
                        {category}
                      </div>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-4">
                <Button 
                  onClick={() => setShowFullDashboard(true)}
                  className="w-full bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir le dashboard complet
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration actuelle */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>{currentConfig.title}</CardTitle>
              <p className="text-gray-600">{currentConfig.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Modules disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentConfig.modules.filter(m => m.enabled).map((module, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {module.label}
                        </Badge>
                        {module.isPremium && <PremiumBadge variant="icon-only" />}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Métriques principales</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentConfig.metrics.filter(m => m.enabled).slice(0, 6).map((metric, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {metric.label}: {metric.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu Métriques */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Aperçu des métriques - {currentConfig.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {currentConfig.metrics.filter(m => m.enabled).map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${metric.color} text-white rounded-2xl p-4 relative overflow-hidden h-24`}
                >
                  {/* Windows Phone style decorative elements */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/10 rounded-full"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <metric.icon className="w-4 h-4 text-white/70" />
                      {metric.isPremium && (
                        <PremiumBadge variant="icon-only" className="text-white/80" />
                      )}
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
          </CardContent>
        </Card>

        {/* Aperçu Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides - {currentConfig.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentConfig.actions.filter(a => a.enabled).map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${action.color} text-white rounded-2xl p-6 relative overflow-hidden transition-all hover:shadow-xl h-32 cursor-pointer`}
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
                            <span className="text-sm font-bold">{action.badge}</span>
                          </div>
                        )}
                        {action.isPremium && (
                          <PremiumBadge variant="icon-only" className="text-white/80" />
                        )}
                      </div>
                    </div>
                    <div className="font-medium text-left">{action.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}