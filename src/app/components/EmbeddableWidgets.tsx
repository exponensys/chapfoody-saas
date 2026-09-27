import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Code,
  Copy,
  Eye,
  Settings,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Download,
  Link,
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Package,
  Euro,
  Clock,
  CheckCircle,
  ExternalLink,
  Maximize2,
  RefreshCw
} from "lucide-react";

interface Widget {
  id: string;
  name: string;
  description: string;
  type: "metric" | "chart" | "gauge" | "list" | "summary";
  dataSource: string[];
  customizable: {
    colors: boolean;
    size: boolean;
    period: boolean;
    styling: boolean;
  };
  previewComponent: React.ComponentType<any>;
  defaultConfig: any;
}

interface WidgetConfig {
  widget: string;
  size: "small" | "medium" | "large";
  theme: "light" | "dark" | "custom";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  period: "7d" | "30d" | "90d" | "1y";
  showTitle: boolean;
  showLegend: boolean;
  refreshInterval: number; // minutes
  customCSS: string;
}

interface EmbeddableWidgetsProps {
  userType: string;
  onGenerateCode: (config: WidgetConfig) => void;
}

// Widget Components for Preview
const MetricWidget = ({ config, data }: any) => (
  <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} border`}>
    {config.showTitle && <h3 className="font-bold mb-2">Chiffre d'affaires</h3>}
    <div className="text-3xl font-bold" style={{ color: config.colors.primary }}>
      {data?.value || '42,350€'}
    </div>
    <div className="text-sm text-gray-500 flex items-center mt-1">
      <TrendingUp className="w-4 h-4 mr-1" style={{ color: config.colors.accent }} />
      +12.5% vs période précédente
    </div>
  </div>
);

const ChartWidget = ({ config, data }: any) => (
  <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} border`}>
    {config.showTitle && <h3 className="font-bold mb-4">Évolution des ventes</h3>}
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data?.chartData || [
        { name: 'Sem 1', value: 8500 },
        { name: 'Sem 2', value: 9200 },
        { name: 'Sem 3', value: 11400 },
        { name: 'Sem 4', value: 12250 }
      ]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={config.colors.primary} 
          fill={config.colors.primary} 
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const GaugeWidget = ({ config, data }: any) => (
  <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} border text-center`}>
    {config.showTitle && <h3 className="font-bold mb-4">Satisfaction Client</h3>}
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke={config.theme === 'dark' ? '#374151' : '#e5e7eb'}
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r="56"
          stroke={config.colors.primary}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={351.86}
          strokeDashoffset={351.86 - (351.86 * (data?.satisfaction || 4.7)) / 5}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{data?.satisfaction || 4.7}/5</span>
      </div>
    </div>
    <p className="text-sm text-gray-500 mt-2">Note moyenne</p>
  </div>
);

const SummaryWidget = ({ config, data }: any) => (
  <div className={`p-4 rounded-lg ${config.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} border`}>
    {config.showTitle && <h3 className="font-bold mb-4">Résumé Performance</h3>}
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color: config.colors.primary }}>
          {data?.orders || '1,247'}
        </div>
        <p className="text-xs text-gray-500">Commandes</p>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color: config.colors.secondary }}>
          {data?.customers || '892'}
        </div>
        <p className="text-xs text-gray-500">Clients</p>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color: config.colors.accent }}>
          {data?.avgOrder || '33.95€'}
        </div>
        <p className="text-xs text-gray-500">Panier moyen</p>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color: config.colors.primary }}>
          {data?.deliveryTime || '28min'}
        </div>
        <p className="text-xs text-gray-500">Temps livraison</p>
      </div>
    </div>
  </div>
);

export function EmbeddableWidgets({ userType, onGenerateCode }: EmbeddableWidgetsProps) {
  const [selectedWidget, setSelectedWidget] = useState<string>("metric");
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    widget: "metric",
    size: "medium",
    theme: "light",
    colors: {
      primary: "#b70f23",
      secondary: "#f4b71b",
      accent: "#70070e"
    },
    period: "30d",
    showTitle: true,
    showLegend: true,
    refreshInterval: 15,
    customCSS: ""
  });
  
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState("configure");
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const widgets: Widget[] = [
    {
      id: "metric",
      name: "Métrique Simple",
      description: "Affiche une métrique clé avec tendance",
      type: "metric",
      dataSource: ["revenue", "orders", "customers", "satisfaction"],
      customizable: {
        colors: true,
        size: true,
        period: true,
        styling: true
      },
      previewComponent: MetricWidget,
      defaultConfig: {
        dataSource: "revenue",
        showTrend: true,
        showIcon: true
      }
    },
    {
      id: "chart",
      name: "Graphique Tendance",
      description: "Graphique en aires des tendances sur la période",
      type: "chart",
      dataSource: ["revenue", "orders", "satisfaction", "performance"],
      customizable: {
        colors: true,
        size: true,
        period: true,
        styling: true
      },
      previewComponent: ChartWidget,
      defaultConfig: {
        chartType: "area",
        showGrid: true,
        animated: true
      }
    },
    {
      id: "gauge",
      name: "Jauge Circulaire",
      description: "Jauge pour afficher des pourcentages ou notes",
      type: "gauge",
      dataSource: ["satisfaction", "performance", "efficiency"],
      customizable: {
        colors: true,
        size: true,
        period: false,
        styling: true
      },
      previewComponent: GaugeWidget,
      defaultConfig: {
        min: 0,
        max: 5,
        thresholds: [2, 3.5, 4.5]
      }
    },
    {
      id: "summary",
      name: "Résumé Multi-métriques",
      description: "Grille de plusieurs métriques clés",
      type: "summary",
      dataSource: ["overview"],
      customizable: {
        colors: true,
        size: true,
        period: true,
        styling: true
      },
      previewComponent: SummaryWidget,
      defaultConfig: {
        metrics: ["orders", "customers", "avgOrder", "deliveryTime"],
        layout: "grid"
      }
    }
  ];

  const selectedWidgetData = widgets.find(w => w.id === selectedWidget);

  const generateEmbedCode = () => {
    const baseUrl = "https://widget.chapfoody.com";
    const widgetUrl = `${baseUrl}/widget/${widgetConfig.widget}`;
    
    const params = new URLSearchParams({
      size: widgetConfig.size,
      theme: widgetConfig.theme,
      period: widgetConfig.period,
      colors: JSON.stringify(widgetConfig.colors),
      showTitle: widgetConfig.showTitle.toString(),
      showLegend: widgetConfig.showLegend.toString(),
      refresh: widgetConfig.refreshInterval.toString()
    });

    const iframeCode = `<!-- Widget CHAPFOODY - ${selectedWidgetData?.name} -->
<div class="chapfoody-widget-container">
  <iframe 
    src="${widgetUrl}?${params.toString()}"
    width="${getSizePixels(widgetConfig.size).width}"
    height="${getSizePixels(widgetConfig.size).height}"
    frameborder="0"
    scrolling="no"
    style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
    loading="lazy">
  </iframe>
</div>

${widgetConfig.customCSS ? `<style>\n${widgetConfig.customCSS}\n</style>` : ''}

<!-- Optionnel: Mise à jour automatique -->
<script>
  // Rafraîchissement automatique toutes les ${widgetConfig.refreshInterval} minutes
  setInterval(() => {
    const iframe = document.querySelector('.chapfoody-widget-container iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  }, ${widgetConfig.refreshInterval * 60 * 1000});
</script>`;

    const jsCode = `// Widget CHAPFOODY - Intégration JavaScript
(function() {
  const widget = document.createElement('div');
  widget.innerHTML = \`<iframe 
    src="${widgetUrl}?${params.toString()}"
    width="${getSizePixels(widgetConfig.size).width}"
    height="${getSizePixels(widgetConfig.size).height}"
    frameborder="0"
    scrolling="no"
    style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
    loading="lazy">
  </iframe>\`;
  
  document.getElementById('chapfoody-widget').appendChild(widget);
})();`;

    const reactCode = `// Composant React Widget CHAPFOODY
import React from 'react';

export const ChapfoodyWidget = () => {
  return (
    <div className="chapfoody-widget-container">
      <iframe 
        src="${widgetUrl}?${params.toString()}"
        width="${getSizePixels(widgetConfig.size).width}"
        height="${getSizePixels(widgetConfig.size).height}"
        frameBorder="0"
        scrolling="no"
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        loading="lazy"
      />
    </div>
  );
};`;

    const code = activeTab === "html" ? iframeCode : 
                activeTab === "javascript" ? jsCode : 
                reactCode;

    setGeneratedCode(code);
    onGenerateCode(widgetConfig);
  };

  const getSizePixels = (size: string) => {
    switch (size) {
      case "small": return { width: "280", height: "200" };
      case "medium": return { width: "400", height: "300" };
      case "large": return { width: "600", height: "400" };
      default: return { width: "400", height: "300" };
    }
  };

  const copyToClipboard = async () => {
    if (codeRef.current) {
      await navigator.clipboard.writeText(generatedCode);
      // Feedback visuel
    }
  };

  const PreviewComponent = selectedWidgetData?.previewComponent || MetricWidget;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Widgets embarquables</h3>
          <p className="text-gray-600 mt-1">
            Intégrez vos métriques CHAPFOODY sur votre site web
          </p>
        </div>
        <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
          <Globe className="w-4 h-4 mr-1" />
          Intégration externe
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-[#b70f23]" />
                    Sélection du widget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {widgets.map((widget) => (
                      <div 
                        key={widget.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedWidget === widget.id 
                            ? 'border-[#b70f23] bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedWidget(widget.id);
                          setWidgetConfig(prev => ({ ...prev, widget: widget.id }));
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{widget.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {widget.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {widget.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(widget.customizable)
                            .filter(([, enabled]) => enabled)
                            .map(([feature]) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-[#b70f23]" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Taille et apparence */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Taille</Label>
                      <Select 
                        value={widgetConfig.size} 
                        onValueChange={(value: any) => setWidgetConfig(prev => ({ ...prev, size: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">
                            <div className="flex items-center">
                              <Smartphone className="w-4 h-4 mr-2" />
                              Petit (280x200)
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center">
                              <Tablet className="w-4 h-4 mr-2" />
                              Moyen (400x300)
                            </div>
                          </SelectItem>
                          <SelectItem value="large">
                            <div className="flex items-center">
                              <Monitor className="w-4 h-4 mr-2" />
                              Grand (600x400)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="theme">Thème</Label>
                      <Select 
                        value={widgetConfig.theme} 
                        onValueChange={(value: any) => setWidgetConfig(prev => ({ ...prev, theme: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                          <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Couleurs */}
                  <div>
                    <Label className="mb-3 block">Couleurs personnalisées</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="primary" className="text-sm">Primaire</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            id="primary"
                            value={widgetConfig.colors.primary}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, primary: e.target.value }
                            }))}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={widgetConfig.colors.primary}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, primary: e.target.value }
                            }))}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary" className="text-sm">Secondaire</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            id="secondary"
                            value={widgetConfig.colors.secondary}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, secondary: e.target.value }
                            }))}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={widgetConfig.colors.secondary}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, secondary: e.target.value }
                            }))}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accent" className="text-sm">Accent</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            id="accent"
                            value={widgetConfig.colors.accent}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, accent: e.target.value }
                            }))}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={widgetConfig.colors.accent}
                            onChange={(e) => setWidgetConfig(prev => ({
                              ...prev,
                              colors: { ...prev.colors, accent: e.target.value }
                            }))}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="period">Période des données</Label>
                      <Select 
                        value={widgetConfig.period} 
                        onValueChange={(value: any) => setWidgetConfig(prev => ({ ...prev, period: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">7 derniers jours</SelectItem>
                          <SelectItem value="30d">30 derniers jours</SelectItem>
                          <SelectItem value="90d">90 derniers jours</SelectItem>
                          <SelectItem value="1y">1 an</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="refresh">Actualisation (minutes)</Label>
                      <Select 
                        value={widgetConfig.refreshInterval.toString()} 
                        onValueChange={(value) => setWidgetConfig(prev => ({ ...prev, refreshInterval: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 heure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showTitle"
                        checked={widgetConfig.showTitle}
                        onCheckedChange={(checked) => setWidgetConfig(prev => ({ ...prev, showTitle: checked as boolean }))}
                      />
                      <Label htmlFor="showTitle">Afficher le titre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showLegend"
                        checked={widgetConfig.showLegend}
                        onCheckedChange={(checked) => setWidgetConfig(prev => ({ ...prev, showLegend: checked as boolean }))}
                      />
                      <Label htmlFor="showLegend">Afficher la légende</Label>
                    </div>
                  </div>

                  {/* CSS personnalisé */}
                  <div>
                    <Label htmlFor="customCSS">CSS personnalisé (optionnel)</Label>
                    <Textarea
                      id="customCSS"
                      value={widgetConfig.customCSS}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, customCSS: e.target.value }))}
                      placeholder=".chapfoody-widget-container { margin: 20px; }"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-[#b70f23]" />
                    Aperçu en temps réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <PreviewComponent config={widgetConfig} />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Taille:</span>
                      <span>{getSizePixels(widgetConfig.size).width}x{getSizePixels(widgetConfig.size).height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thème:</span>
                      <span>{widgetConfig.theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actualisation:</span>
                      <span>{widgetConfig.refreshInterval}min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={generateEmbedCode}
              className="bg-[#b70f23] hover:bg-[#70070e] text-white"
              size="lg"
            >
              <Code className="w-4 h-4 mr-2" />
              Générer le code d'intégration
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu du widget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="border rounded-lg shadow-lg"
                  style={{
                    width: getSizePixels(widgetConfig.size).width + "px",
                    height: getSizePixels(widgetConfig.size).height + "px"
                  }}
                >
                  <PreviewComponent config={widgetConfig} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Code d'intégration</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="html">HTML/iframe</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="react">React</TabsTrigger>
                </TabsList>

                <TabsContent value="html">
                  <Textarea
                    ref={codeRef}
                    value={generatedCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <Textarea
                    ref={codeRef}
                    value={generatedCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="react">
                  <Textarea
                    ref={codeRef}
                    value={generatedCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide d'intégration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Intégration HTML simple</h4>
                  <p className="text-sm text-gray-600">
                    Copiez-collez le code iframe directement dans votre HTML.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Intégration JavaScript</h4>
                  <p className="text-sm text-gray-600">
                    Utilisez le script JavaScript pour une intégration dynamique.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Composant React</h4>
                  <p className="text-sm text-gray-600">
                    Intégrez le widget comme composant React dans votre application.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration avancée</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Authentification</h4>
                  <p className="text-gray-600">
                    Les widgets sont protégés par clé API. Contactez-nous pour obtenir votre clé.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">CORS et domaines</h4>
                  <p className="text-gray-600">
                    Configurez les domaines autorisés dans vos paramètres CHAPFOODY.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Limites de taux</h4>
                  <p className="text-gray-600">
                    1000 requêtes par heure par widget pour éviter la surcharge.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}