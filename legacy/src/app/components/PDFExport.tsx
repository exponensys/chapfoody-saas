import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { Checkbox } from "./ui/checkbox";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Euro,
  Clock,
  Star,
  Package,
  Settings,
  Eye,
  Loader2
} from "lucide-react";

interface PDFExportProps {
  restaurantData: {
    name: string;
    type: string;
    period: {
      start: string;
      end: string;
    };
    metrics: {
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      customerSatisfaction: number;
      deliveryTime: number;
      returnRate: number;
    };
    charts: {
      revenue: Array<{ period: string; value: number }>;
      orders: Array<{ period: string; value: number }>;
      satisfaction: Array<{ period: string; value: number }>;
    };
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
      trend: number;
    }>;
    customerInsights: {
      newCustomers: number;
      returningCustomers: number;
      averageOrderFrequency: number;
      peakHours: Array<{ hour: string; orders: number }>;
    };
  };
  onExport: (config: ExportConfig) => void;
}

interface ExportConfig {
  format: "pdf" | "excel" | "csv";
  sections: string[];
  period: {
    start: Date;
    end: Date;
  };
  includeCharts: boolean;
  includeComparison: boolean;
  language: "fr" | "en";
}

export function PDFExport({ restaurantData, onExport }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: "pdf",
    sections: ["overview", "revenue", "orders", "customers"],
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    includeCharts: true,
    includeComparison: true,
    language: "fr"
  });

  const availableSections = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "revenue", label: "Chiffre d'affaires", icon: Euro },
    { id: "orders", label: "Commandes", icon: ShoppingCart },
    { id: "customers", label: "Clients", icon: Users },
    { id: "products", label: "Produits", icon: Package },
    { id: "satisfaction", label: "Satisfaction", icon: Star },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "comparison", label: "Comparaisons", icon: BarChart3 }
  ];

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    setExportConfig(prev => ({
      ...prev,
      sections: checked 
        ? [...prev.sections, sectionId]
        : prev.sections.filter(s => s !== sectionId)
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulation de l'export
    setTimeout(() => {
      onExport(exportConfig);
      setIsExporting(false);
      
      // Simulation du téléchargement
      const filename = `CHAPFOODY_Rapport_${restaurantData.name}_${
        exportConfig.period.start.toISOString().split('T')[0]
      }_${exportConfig.period.end.toISOString().split('T')[0]}.${exportConfig.format}`;
      
      // Création d'un blob fictif pour démonstration
      const blob = new Blob(['Rapport CHAPFOODY généré'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }, 2000);
  };

  const getEstimatedFileSize = () => {
    let size = 500; // Base size in KB
    size += exportConfig.sections.length * 150;
    if (exportConfig.includeCharts) size += 300;
    if (exportConfig.includeComparison) size += 200;
    return size;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Export de données</h3>
          <p className="text-gray-600 mt-1">
            Générez des rapports détaillés pour {restaurantData.name}
          </p>
        </div>
        <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
          <FileText className="w-4 h-4 mr-1" />
          Rapports avancés
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format et période */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-[#b70f23]" />
                Configuration de l'export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Format</label>
                  <Select 
                    value={exportConfig.format} 
                    onValueChange={(value: "pdf" | "excel" | "csv") => 
                      setExportConfig(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF (Recommandé)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Langue</label>
                  <Select 
                    value={exportConfig.language} 
                    onValueChange={(value: "fr" | "en") => 
                      setExportConfig(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Période d'analyse</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Du</label>
                    <input
                      type="date"
                      value={exportConfig.period.start.toISOString().split('T')[0]}
                      onChange={(e) => setExportConfig(prev => ({
                        ...prev,
                        period: { ...prev.period, start: new Date(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Au</label>
                    <input
                      type="date"
                      value={exportConfig.period.end.toISOString().split('T')[0]}
                      onChange={(e) => setExportConfig(prev => ({
                        ...prev,
                        period: { ...prev.period, end: new Date(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={exportConfig.includeCharts}
                    onCheckedChange={(checked) => 
                      setExportConfig(prev => ({ ...prev, includeCharts: checked as boolean }))
                    }
                  />
                  <label htmlFor="charts" className="text-sm">Inclure les graphiques</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comparison"
                    checked={exportConfig.includeComparison}
                    onCheckedChange={(checked) => 
                      setExportConfig(prev => ({ ...prev, includeComparison: checked as boolean }))
                    }
                  />
                  <label htmlFor="comparison" className="text-sm">Comparaisons période précédente</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections à inclure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-[#b70f23]" />
                Sections du rapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {availableSections.map((section) => (
                  <div key={section.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={section.id}
                      checked={exportConfig.sections.includes(section.id)}
                      onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                    />
                    <section.icon className="w-4 h-4 text-[#b70f23]" />
                    <label htmlFor={section.id} className="text-sm font-medium flex-1">
                      {section.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu et export */}
        <div className="space-y-6">
          {/* Aperçu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-[#b70f23]" />
                Aperçu du rapport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Restaurant:</span>
                    <span className="font-medium">{restaurantData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Période:</span>
                    <span className="font-medium">
                      {exportConfig.period.start.toLocaleDateString()} - {exportConfig.period.end.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sections:</span>
                    <span className="font-medium">{exportConfig.sections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium uppercase">{exportConfig.format}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Métriques clés incluses</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Euro className="w-3 h-3 mr-1 text-green-600" />
                    <span>{restaurantData.metrics.totalRevenue.toLocaleString()}€</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart className="w-3 h-3 mr-1 text-blue-600" />
                    <span>{restaurantData.metrics.totalOrders} cmd</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-600" />
                    <span>{restaurantData.metrics.customerSatisfaction}/5</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-purple-600" />
                    <span>{restaurantData.metrics.deliveryTime}min</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taille estimée:</span>
                  <span className="font-medium">{Math.round(getEstimatedFileSize() / 1024 * 10) / 10} MB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions d'export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2 text-[#b70f23]" />
                Générer le rapport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleExport}
                disabled={isExporting || exportConfig.sections.length === 0}
                className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le rapport
                  </>
                )}
              </Button>

              {exportConfig.sections.length === 0 && (
                <p className="text-sm text-red-600 text-center">
                  Veuillez sélectionner au moins une section
                </p>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Le rapport sera généré en {exportConfig.language === 'fr' ? 'français' : 'anglais'}</p>
                <p>• Temps de génération estimé: 30-60 secondes</p>
                <p>• Compatible avec Adobe Reader, Excel et LibreOffice</p>
              </div>
            </CardContent>
          </Card>

          {/* Templates rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Templates rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportConfig(prev => ({
                  ...prev,
                  sections: ["overview", "revenue", "orders"]
                }))}
              >
                📊 Rapport exécutif
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportConfig(prev => ({
                  ...prev,
                  sections: ["revenue", "orders", "products", "customers"]
                }))}
              >
                📈 Analyse complète
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportConfig(prev => ({
                  ...prev,
                  sections: ["satisfaction", "performance"]
                }))}
              >
                ⭐ Satisfaction client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}