import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ExportService } from "../services/ExportService";
import { 
  FileText, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Package, 
  Truck, 
  Building2, 
  Target,
  Crown,
  Zap,
  Clock,
  Eye,
  CheckCircle2,
  Star
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  sections: string[];
  estimatedPages: number;
  complexity: "simple" | "moderate" | "advanced";
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  features: string[];
  previewUrl?: string;
}

interface ExportTemplateSelectorProps {
  userType: "restaurant" | "delivery" | "company" | "affiliate";
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onSectionsChange: (sections: string[]) => void;
  selectedSections: string[];
}

export function ExportTemplateSelector({
  userType,
  selectedTemplate,
  onTemplateSelect,
  onSectionsChange,
  selectedSections
}: ExportTemplateSelectorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const exportService = ExportService.getInstance();

  const getTemplatesByUserType = (type: string): Template[] => {
    const allTemplates = {
      restaurant: [
        {
          id: "executive",
          name: "Rapport Exécutif",
          description: "Vue d'ensemble concise pour la direction avec les KPI essentiels",
          sections: ["overview", "revenue", "satisfaction"],
          estimatedPages: 3,
          complexity: "simple",
          icon: Crown,
          badge: "Recommandé",
          features: [
            "Métriques clés en un coup d'œil",
            "Graphiques de tendances",
            "Résumé exécutif",
            "Actions recommandées"
          ]
        },
        {
          id: "complete",
          name: "Analyse Complète",
          description: "Rapport détaillé avec toutes les métriques et analyses approfondies",
          sections: ["overview", "revenue", "orders", "customers", "products", "performance", "satisfaction"],
          estimatedPages: 12,
          complexity: "advanced",
          icon: BarChart3,
          badge: "Populaire",
          features: [
            "Analyse complète multi-sections",
            "Graphiques détaillés",
            "Comparaisons période précédente",
            "Recommandations personnalisées",
            "Données clients approfondies"
          ]
        },
        {
          id: "operational",
          name: "Rapport Opérationnel",
          description: "Focus sur les opérations quotidiennes et la performance",
          sections: ["orders", "performance", "customers"],
          estimatedPages: 6,
          complexity: "moderate",
          icon: Zap,
          features: [
            "Métriques opérationnelles",
            "Gestion des commandes",
            "Performance des livraisons",
            "Optimisations suggérées"
          ]
        },
        {
          id: "marketing",
          name: "Rapport Marketing",
          description: "Analyse des performances marketing et acquisition client",
          sections: ["customers", "products", "satisfaction"],
          estimatedPages: 8,
          complexity: "moderate",
          icon: Target,
          features: [
            "Analyse de l'acquisition client",
            "Performance des produits",
            "Satisfaction et fidélisation",
            "ROI des campagnes"
          ]
        }
      ],
      delivery: [
        {
          id: "logistics",
          name: "Rapport Logistique",
          description: "Analyse des routes, zones de livraison et performance des livreurs",
          sections: ["overview", "routes", "performance", "drivers"],
          estimatedPages: 10,
          complexity: "advanced",
          icon: Truck,
          badge: "Spécialisé",
          features: [
            "Optimisation des routes",
            "Analyse des zones de livraison",
            "Performance des livreurs",
            "Coûts logistiques"
          ]
        },
        {
          id: "financial",
          name: "Rapport Financier",
          description: "Focus sur la rentabilité, coûts et marges de livraison",
          sections: ["revenue", "costs", "profitability"],
          estimatedPages: 7,
          complexity: "moderate",
          icon: TrendingUp,
          badge: "Recommandé",
          features: [
            "Analyse de rentabilité",
            "Coûts par livraison",
            "Marges par zone",
            "Prévisions financières"
          ]
        },
        {
          id: "customer-satisfaction",
          name: "Satisfaction Client",
          description: "Analyse de la satisfaction et qualité de service",
          sections: ["satisfaction", "performance", "customers"],
          estimatedPages: 5,
          complexity: "simple",
          icon: Star,
          features: [
            "Notes de satisfaction",
            "Temps de livraison",
            "Réclamations clients",
            "Plans d'amélioration"
          ]
        }
      ],
      company: [
        {
          id: "enterprise",
          name: "Rapport Entreprise",
          description: "Vue d'ensemble pour grandes entreprises et directions",
          sections: ["overview", "departments", "employees", "performance"],
          estimatedPages: 15,
          complexity: "advanced",
          icon: Building2,
          badge: "Enterprise",
          features: [
            "Vue multi-départements",
            "Performance des équipes",
            "Métriques RH",
            "Tableaux de bord directionnels"
          ]
        },
        {
          id: "departmental",
          name: "Rapport Départemental",
          description: "Analyse spécifique par département ou service",
          sections: ["department", "employees", "performance"],
          estimatedPages: 8,
          complexity: "moderate",
          icon: Users,
          features: [
            "Performance par département",
            "Analyse des équipes",
            "Objectifs et réalisations",
            "Plans d'action"
          ]
        }
      ],
      affiliate: [
        {
          id: "marketing",
          name: "Rapport Marketing Affilié",
          description: "Performance des campagnes, conversions et commissions",
          sections: ["campaigns", "conversions", "commissions", "performance"],
          estimatedPages: 9,
          complexity: "advanced",
          icon: Target,
          badge: "Spécialisé",
          features: [
            "Performance des campagnes",
            "Taux de conversion",
            "Calcul des commissions",
            "ROI par canal"
          ]
        },
        {
          id: "financial-affiliate",
          name: "Rapport Financier Affilié",
          description: "Focus sur les revenus, commissions et rentabilité",
          sections: ["commissions", "revenue", "performance"],
          estimatedPages: 6,
          complexity: "moderate",
          icon: TrendingUp,
          features: [
            "Revenus par affiliation",
            "Commissions détaillées",
            "Tendances de performance",
            "Prévisions de gains"
          ]
        }
      ]
    };

    return allTemplates[type] || allTemplates.restaurant;
  };

  const templates = getTemplatesByUserType(userType);
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "text-green-600 bg-green-50";
      case "moderate": return "text-blue-600 bg-blue-50";
      case "advanced": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "simple": return "Simple";
      case "moderate": return "Modéré";
      case "advanced": return "Avancé";
      default: return "Standard";
    }
  };

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    const newSections = checked 
      ? [...selectedSections, sectionId]
      : selectedSections.filter(s => s !== sectionId);
    onSectionsChange(newSections);
  };

  const availableSections = [
    { id: "overview", label: "Vue d'ensemble", icon: Eye },
    { id: "revenue", label: "Chiffre d'affaires", icon: TrendingUp },
    { id: "orders", label: "Commandes", icon: Package },
    { id: "customers", label: "Clients", icon: Users },
    { id: "products", label: "Produits", icon: Package },
    { id: "satisfaction", label: "Satisfaction", icon: Star },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "routes", label: "Routes", icon: Truck },
    { id: "drivers", label: "Livreurs", icon: Users },
    { id: "costs", label: "Coûts", icon: TrendingUp },
    { id: "departments", label: "Départements", icon: Building2 },
    { id: "employees", label: "Employés", icon: Users },
    { id: "campaigns", label: "Campagnes", icon: Target },
    { id: "conversions", label: "Conversions", icon: Target },
    { id: "commissions", label: "Commissions", icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Templates de rapport</h3>
          <p className="text-gray-600">
            Choisissez un template adapté à vos besoins ({userType})
          </p>
        </div>
        <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
          <FileText className="w-4 h-4 mr-1" />
          {templates.length} templates disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Selection */}
        <div className="lg:col-span-2">
          <RadioGroup 
            value={selectedTemplate} 
            onValueChange={onTemplateSelect}
            className="space-y-4"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Label 
                  htmlFor={template.id}
                  className="cursor-pointer"
                >
                  <Card className={`transition-all duration-200 ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-[#b70f23] bg-red-50/50' 
                      : 'hover:shadow-md'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={template.id} id={template.id} />
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-[#b70f23]/10 rounded-lg">
                              <template.icon className="w-5 h-5 text-[#b70f23]" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-base">{template.name}</CardTitle>
                                {template.badge && (
                                  <Badge className="text-xs bg-[#f4b71b] text-white">
                                    {template.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={`text-xs ${getComplexityColor(template.complexity)}`}>
                            {getComplexityLabel(template.complexity)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ~{template.estimatedPages} pages
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Sections incluses:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.sections.map((section) => (
                              <Badge 
                                key={section} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {availableSections.find(s => s.id === section)?.label || section}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Fonctionnalités:
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {template.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle2 className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {template.features.length > 3 && (
                              <li className="text-gray-500">
                                + {template.features.length - 3} autres fonctionnalités
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </div>

        {/* Preview and Customization */}
        <div className="space-y-6">
          {/* Template Preview */}
          {selectedTemplateData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-[#b70f23]" />
                  Aperçu du template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {selectedTemplateData.name}
                    </h4>
                    <selectedTemplateData.icon className="w-5 h-5 text-[#b70f23]" />
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Complexité:</span>
                      <Badge className={`text-xs ${getComplexityColor(selectedTemplateData.complexity)}`}>
                        {getComplexityLabel(selectedTemplateData.complexity)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pages estimées:</span>
                      <span className="font-medium">{selectedTemplateData.estimatedPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sections:</span>
                      <span className="font-medium">{selectedTemplateData.sections.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Toutes les fonctionnalités:</h5>
                  {selectedTemplateData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-[#b70f23]" />
                Personnaliser les sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableSections
                  .filter(section => 
                    userType === 'restaurant' ? 
                      ['overview', 'revenue', 'orders', 'customers', 'products', 'satisfaction', 'performance'].includes(section.id) :
                    userType === 'delivery' ?
                      ['overview', 'routes', 'performance', 'drivers', 'costs', 'satisfaction', 'customers'].includes(section.id) :
                    userType === 'company' ?
                      ['overview', 'departments', 'employees', 'performance'].includes(section.id) :
                      ['campaigns', 'conversions', 'commissions', 'performance'].includes(section.id)
                  )
                  .map((section) => (
                    <div key={section.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                      />
                      <section.icon className="w-4 h-4 text-[#b70f23]" />
                      <label htmlFor={section.id} className="text-sm font-medium flex-1 cursor-pointer">
                        {section.label}
                      </label>
                    </div>
                  ))
                }
              </div>

              <Separator className="my-4" />

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Les sections cochées seront incluses dans le rapport</p>
                <p>• Minimum 1 section requise pour générer le rapport</p>
                <p>• Plus de sections = rapport plus complet mais plus volumineux</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  if (selectedTemplateData) {
                    onSectionsChange(selectedTemplateData.sections);
                  }
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Utiliser sections du template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onSectionsChange(availableSections.slice(0, 4).map(s => s.id))}
              >
                <Zap className="w-4 h-4 mr-2" />
                Sélection rapide (4 sections)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => onSectionsChange([])}
              >
                <Clock className="w-4 h-4 mr-2" />
                Tout désélectionner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}