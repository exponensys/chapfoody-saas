import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { PDFExport } from "../components/PDFExport";
import { ExportTemplateSelector } from "../components/ExportTemplateSelector";
import { ScheduledExports } from "../components/ScheduledExports";
import { EmbeddableWidgets } from "../components/EmbeddableWidgets";
import { ExportService, ExportProgress } from "../services/ExportService";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Download,
  FileText,
  Calendar,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Euro,
  Clock,
  Package,
  Settings,
  Zap,
  Eye,
  Share2,
  Target,
  Award,
  Smartphone,
  Monitor,
  Bell,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X
} from "lucide-react";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface AdvancedExportDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function AdvancedExportDashboard({ onBack, userSession }: AdvancedExportDashboardProps) {
  const [activeTab, setActiveTab] = useState("templates");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  
  // Template selector state
  const [selectedTemplate, setSelectedTemplate] = useState("complete");
  const [selectedSections, setSelectedSections] = useState(["overview", "revenue", "orders", "customers"]);

  const exportService = ExportService.getInstance();

  // Mock restaurant data - en production, ceci viendrait d'une API
  const restaurantData = {
    name: "Bistrot du Marché",
    type: "Restaurant",
    period: {
      start: "2025-01-01",
      end: "2025-01-31"
    },
    metrics: {
      totalRevenue: 42350,
      totalOrders: 1247,
      averageOrderValue: 33.95,
      customerSatisfaction: 4.7,
      deliveryTime: 28,
      returnRate: 12.5
    },
    charts: {
      revenue: [
        { period: "Sem 1", value: 8500 },
        { period: "Sem 2", value: 9200 },
        { period: "Sem 3", value: 11400 },
        { period: "Sem 4", value: 12250 }
      ],
      orders: [
        { period: "Lun", value: 45 },
        { period: "Mar", value: 52 },
        { period: "Mer", value: 61 },
        { period: "Jeu", value: 48 },
        { period: "Ven", value: 78 },
        { period: "Sam", value: 92 },
        { period: "Dim", value: 67 }
      ],
      satisfaction: [
        { period: "Jan", value: 4.5 },
        { period: "Fév", value: 4.6 },
        { period: "Mar", value: 4.7 },
        { period: "Avr", value: 4.8 }
      ]
    },
    topProducts: [
      { name: "Burger Signature", sales: 234, revenue: 3276, trend: 12 },
      { name: "Salade César", sales: 189, revenue: 2456, trend: 8 },
      { name: "Pizza Margherita", sales: 156, revenue: 2184, trend: -3 },
      { name: "Pâtes Carbonara", sales: 134, revenue: 1876, trend: 15 }
    ],
    customerInsights: {
      newCustomers: 156,
      returningCustomers: 892,
      averageOrderFrequency: 2.3,
      peakHours: [
        { hour: "12h", orders: 45 },
        { hour: "13h", orders: 67 },
        { hour: "19h", orders: 78 },
        { hour: "20h", orders: 89 }
      ]
    }
  };

  const stats = [
    {
      title: "Rapports générés",
      value: "247",
      change: "+23 ce mois",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Exports programmés",
      value: "12",
      change: "3 actifs",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Widgets déployés",
      value: "8",
      change: "2 sites externes",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Temps d'export moyen",
      value: "45s",
      change: "-12s optimisé",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  const handleAdvancedExport = async (config: any) => {
    setIsExporting(true);
    setShowProgressDialog(true);
    setExportProgress(null);

    try {
      await exportService.generateReport(
        {
          ...config,
          template: selectedTemplate,
          sections: selectedSections,
          userType: userSession?.userType || "restaurant"
        },
        restaurantData,
        (progress) => {
          setExportProgress(progress);
        }
      );
    } catch (error) {
      console.error("Erreur d'export:", error);
      // Gestion d'erreur
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setShowProgressDialog(false);
        setExportProgress(null);
      }, 2000);
    }
  };

  const handleCreateSchedule = (schedule: any) => {
    console.log("Nouveau planning créé:", schedule);
    // En production, ceci sauvegarderait dans la base de données
  };

  const handleUpdateSchedule = (id: string, updates: any) => {
    console.log("Planning mis à jour:", id, updates);
  };

  const handleDeleteSchedule = (id: string) => {
    console.log("Planning supprimé:", id);
  };

  const handleToggleSchedule = (id: string, active: boolean) => {
    console.log("Planning basculé:", id, active);
  };

  const handleRunNow = (id: string) => {
    console.log("Exécution immédiate:", id);
  };

  const handleGenerateWidgetCode = (config: any) => {
    console.log("Code widget généré:", config);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centre d'Export Avancé</h1>
            <p className="text-gray-600">
              Générez, programmez et intégrez vos rapports CHAPFOODY
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
              <Award className="w-4 h-4 mr-1" />
              Export Pro
            </Badge>
            <Button onClick={onBack} variant="outline">
              Retour au dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color} mt-2`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Programmés
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#b70f23]" />
                  Sélection et génération de rapports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExportTemplateSelector
                  userType={userSession?.userType as any || "restaurant"}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                  onSectionsChange={setSelectedSections}
                  selectedSections={selectedSections}
                />
                
                <div className="mt-8 pt-6 border-t">
                  <PDFExport
                    restaurantData={restaurantData}
                    onExport={handleAdvancedExport}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <ScheduledExports
              userType={userSession?.userType || "restaurant"}
              onCreateSchedule={handleCreateSchedule}
              onUpdateSchedule={handleUpdateSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onToggleSchedule={handleToggleSchedule}
              onRunNow={handleRunNow}
            />
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <EmbeddableWidgets
              userType={userSession?.userType || "restaurant"}
              onGenerateCode={handleGenerateWidgetCode}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des exports</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'PDF', value: 156 },
                      { name: 'Excel', value: 67 },
                      { name: 'CSV', value: 24 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#b70f23" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Widget Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance des widgets</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { name: 'Sem 1', views: 2400, interactions: 800 },
                      { name: 'Sem 2', views: 3200, interactions: 1200 },
                      { name: 'Sem 3', views: 2800, interactions: 900 },
                      { name: 'Sem 4', views: 3600, interactions: 1400 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#b70f23" strokeWidth={2} />
                      <Line type="monotone" dataKey="interactions" stroke="#f4b71b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Rapports les plus générés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Rapport Exécutif", count: 89, percentage: 85 },
                      { name: "Analyse Complète", count: 67, percentage: 64 },
                      { name: "Rapport Opérationnel", count: 45, percentage: 43 },
                      { name: "Rapport Marketing", count: 23, percentage: 22 }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-500">{report.count} générations</p>
                        </div>
                        <div className="w-24">
                          <Progress value={report.percentage} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Export PDF généré",
                        template: "Rapport Exécutif",
                        time: "Il y a 5 minutes",
                        status: "success"
                      },
                      {
                        action: "Planning activé",
                        template: "Rapport Mensuel",
                        time: "Il y a 2 heures",
                        status: "info"
                      },
                      {
                        action: "Widget intégré",
                        template: "Métrique Revenue",
                        time: "Il y a 1 jour",
                        status: "success"
                      },
                      {
                        action: "Export échoué",
                        template: "Analyse Complète",
                        time: "Il y a 2 jours",
                        status: "error"
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.template}</p>
                        </div>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Génération du rapport</DialogTitle>
                <DialogDescription>
                  Suivi de la progression de génération de votre rapport personnalisé.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProgressDialog(false)}
                disabled={isExporting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {exportProgress && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{exportProgress.message}</span>
                    <span>{exportProgress.progress}%</span>
                  </div>
                  <Progress value={exportProgress.progress} className="h-2" />
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span>
                    {isExporting ? "Génération en cours..." : "Rapport généré avec succès!"}
                  </span>
                </div>

                {exportProgress.progress === 100 && !isExporting && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">Export terminé</p>
                        <p className="text-sm text-green-600">
                          Le fichier a été téléchargé automatiquement
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!exportProgress && isExporting && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#b70f23]" />
                <span className="ml-3 text-gray-600">Initialisation de l'export...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}