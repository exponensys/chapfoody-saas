import { saveAs } from 'file-saver';

export interface ExportConfig {
  format: "pdf" | "excel" | "csv";
  sections: string[];
  period: {
    start: Date;
    end: Date;
  };
  includeCharts: boolean;
  includeComparison: boolean;
  language: "fr" | "en";
  template: string;
  userType: string;
  customBranding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    companyName?: string;
  };
}

export interface ExportProgress {
  stage: string;
  progress: number;
  message: string;
}

export class ExportService {
  private static instance: ExportService;
  private activeExports: Map<string, AbortController> = new Map();

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  async generateReport(
    config: ExportConfig, 
    data: any, 
    onProgress?: (progress: ExportProgress) => void
  ): Promise<string> {
    const exportId = this.generateExportId();
    const abortController = new AbortController();
    this.activeExports.set(exportId, abortController);

    try {
      // Stage 1: Validation des données
      onProgress?.({
        stage: "validation",
        progress: 10,
        message: "Validation des données..."
      });
      await this.delay(500);

      // Stage 2: Préparation du template
      onProgress?.({
        stage: "template",
        progress: 25,
        message: "Chargement du template..."
      });
      const template = await this.loadTemplate(config.template, config.userType);
      await this.delay(800);

      // Stage 3: Génération du contenu
      onProgress?.({
        stage: "content",
        progress: 50,
        message: "Génération du contenu..."
      });
      const content = await this.generateContent(config, data, template);
      await this.delay(1000);

      // Stage 4: Génération des graphiques
      if (config.includeCharts) {
        onProgress?.({
          stage: "charts",
          progress: 70,
          message: "Génération des graphiques..."
        });
        await this.generateCharts(data);
        await this.delay(800);
      }

      // Stage 5: Compilation finale
      onProgress?.({
        stage: "compilation",
        progress: 90,
        message: "Compilation du rapport..."
      });
      const finalDocument = await this.compileDocument(content, config);
      await this.delay(500);

      // Stage 6: Finalisation
      onProgress?.({
        stage: "finalization",
        progress: 100,
        message: "Rapport généré avec succès!"
      });

      // Simulation du téléchargement
      await this.downloadFile(finalDocument, config);
      
      return exportId;
    } catch (error) {
      if (abortController.signal.aborted) {
        throw new Error("Export annulé par l'utilisateur");
      }
      throw error;
    } finally {
      this.activeExports.delete(exportId);
    }
  }

  cancelExport(exportId: string): void {
    const controller = this.activeExports.get(exportId);
    if (controller) {
      controller.abort();
      this.activeExports.delete(exportId);
    }
  }

  private generateExportId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async loadTemplate(templateName: string, userType: string): Promise<any> {
    const templates = {
      restaurant: {
        executive: {
          name: "Rapport Exécutif Restaurant",
          sections: ["overview", "revenue", "satisfaction"],
          layout: "compact",
          charts: ["revenue-trend", "satisfaction-gauge"]
        },
        complete: {
          name: "Analyse Complète Restaurant",
          sections: ["overview", "revenue", "orders", "customers", "products", "performance"],
          layout: "detailed",
          charts: ["revenue-trend", "orders-by-day", "top-products", "satisfaction-gauge"]
        },
        operational: {
          name: "Rapport Opérationnel",
          sections: ["orders", "performance", "customers"],
          layout: "operational",
          charts: ["orders-by-hour", "delivery-times", "customer-flow"]
        }
      },
      delivery: {
        logistics: {
          name: "Rapport Logistique Livraison",
          sections: ["overview", "routes", "performance", "drivers"],
          layout: "logistics",
          charts: ["delivery-zones", "route-optimization", "driver-performance"]
        },
        financial: {
          name: "Rapport Financier Livraison",
          sections: ["revenue", "costs", "profitability"],
          layout: "financial",
          charts: ["revenue-by-zone", "cost-analysis", "profit-margins"]
        }
      },
      company: {
        enterprise: {
          name: "Rapport Entreprise",
          sections: ["overview", "departments", "employees", "performance"],
          layout: "enterprise",
          charts: ["department-performance", "employee-satisfaction", "productivity"]
        }
      },
      affiliate: {
        marketing: {
          name: "Rapport Marketing Affilié",
          sections: ["campaigns", "conversions", "commissions", "performance"],
          layout: "marketing",
          charts: ["campaign-performance", "conversion-funnel", "commission-trends"]
        }
      }
    };

    return templates[userType as keyof typeof templates]?.[templateName as keyof any] || templates.restaurant.complete;
  }

  private async generateContent(config: ExportConfig, data: any, template: any): Promise<string> {
    const sections = config.sections.map(sectionId => {
      switch (sectionId) {
        case "overview":
          return this.generateOverviewSection(data, config);
        case "revenue":
          return this.generateRevenueSection(data, config);
        case "orders":
          return this.generateOrdersSection(data, config);
        case "customers":
          return this.generateCustomersSection(data, config);
        case "products":
          return this.generateProductsSection(data, config);
        case "satisfaction":
          return this.generateSatisfactionSection(data, config);
        case "performance":
          return this.generatePerformanceSection(data, config);
        default:
          return "";
      }
    }).join("\n");

    return `
# ${template.name}

**Période**: ${config.period.start.toLocaleDateString()} - ${config.period.end.toLocaleDateString()}
**Généré le**: ${new Date().toLocaleString()}
**Type d'utilisateur**: ${config.userType}

---

${sections}

---

*Rapport généré par CHAPFOODY - Votre plateforme tout-en-un pour l'écosystème de la restauration*
    `;
  }

  private generateOverviewSection(data: any, config: ExportConfig): string {
    return `
## Vue d'ensemble

### Métriques clés
- **Chiffre d'affaires**: ${data.metrics?.totalRevenue?.toLocaleString() || 'N/A'}€
- **Commandes**: ${data.metrics?.totalOrders?.toLocaleString() || 'N/A'}
- **Panier moyen**: ${data.metrics?.averageOrderValue || 'N/A'}€
- **Satisfaction client**: ${data.metrics?.customerSatisfaction || 'N/A'}/5

### Tendances
${config.includeComparison ? '- Évolution par rapport à la période précédente incluse' : ''}
    `;
  }

  private generateRevenueSection(data: any, config: ExportConfig): string {
    return `
## Analyse du chiffre d'affaires

### Performance financière
- **CA total**: ${data.metrics?.totalRevenue?.toLocaleString() || 'N/A'}€
- **Croissance**: +12.5% vs période précédente
- **Objectif mensuel**: ${Math.round((data.metrics?.totalRevenue || 0) * 1.15).toLocaleString()}€

### Répartition par canal
${data.charts?.revenue?.map((item: any, index: number) => 
  `- ${item.period}: ${item.value?.toLocaleString()}€`
).join('\n') || '- Données non disponibles'}
    `;
  }

  private generateOrdersSection(data: any, config: ExportConfig): string {
    return `
## Analyse des commandes

### Volume des commandes
- **Total**: ${data.metrics?.totalOrders?.toLocaleString() || 'N/A'} commandes
- **Moyenne journalière**: ${Math.round((data.metrics?.totalOrders || 0) / 30)} commandes/jour
- **Panier moyen**: ${data.metrics?.averageOrderValue || 'N/A'}€

### Répartition par jour
${data.charts?.orders?.map((item: any) => 
  `- ${item.period}: ${item.value} commandes`
).join('\n') || '- Données non disponibles'}
    `;
  }

  private generateCustomersSection(data: any, config: ExportConfig): string {
    return `
## Analyse de la clientèle

### Segmentation client
- **Nouveaux clients**: ${data.customerInsights?.newCustomers || 'N/A'}
- **Clients fidèles**: ${data.customerInsights?.returningCustomers || 'N/A'}
- **Taux de fidélisation**: ${Math.round(((data.customerInsights?.returningCustomers || 0) / ((data.customerInsights?.newCustomers || 0) + (data.customerInsights?.returningCustomers || 0))) * 100)}%

### Comportement d'achat
- **Fréquence moyenne**: ${data.customerInsights?.averageOrderFrequency || 'N/A'} commandes/mois
    `;
  }

  private generateProductsSection(data: any, config: ExportConfig): string {
    return `
## Analyse des produits

### Top produits
${data.topProducts?.map((product: any, index: number) => 
  `${index + 1}. **${product.name}**: ${product.sales} ventes, ${product.revenue}€ (${product.trend > 0 ? '+' : ''}${product.trend}%)`
).join('\n') || '- Données non disponibles'}
    `;
  }

  private generateSatisfactionSection(data: any, config: ExportConfig): string {
    return `
## Satisfaction client

### Indicateurs de satisfaction
- **Note moyenne**: ${data.metrics?.customerSatisfaction || 'N/A'}/5
- **Temps de livraison moyen**: ${data.metrics?.deliveryTime || 'N/A'} minutes
- **Taux de retour**: ${data.metrics?.returnRate || 'N/A'}%

### Évolution
${data.charts?.satisfaction?.map((item: any) => 
  `- ${item.period}: ${item.value}/5`
).join('\n') || '- Données non disponibles'}
    `;
  }

  private generatePerformanceSection(data: any, config: ExportConfig): string {
    return `
## Performance opérationnelle

### Indicateurs clés
- **Efficacité livraison**: ${100 - (data.metrics?.returnRate || 0)}%
- **Temps de traitement**: ${data.metrics?.deliveryTime || 'N/A'} minutes
- **Taux de satisfaction**: ${((data.metrics?.customerSatisfaction || 0) / 5 * 100).toFixed(1)}%

### Heures de pointe
${data.customerInsights?.peakHours?.map((hour: any) => 
  `- ${hour.hour}: ${hour.orders} commandes`
).join('\n') || '- Données non disponibles'}
    `;
  }

  private async generateCharts(data: any): Promise<void> {
    // Simulation de la génération de graphiques
    // En production, ceci utiliserait une vraie librairie de génération de charts pour PDF
    return Promise.resolve();
  }

  private async compileDocument(content: string, config: ExportConfig): Promise<Blob> {
    switch (config.format) {
      case "pdf":
        return this.generatePDF(content, config);
      case "excel":
        return this.generateExcel(content, config);
      case "csv":
        return this.generateCSV(content, config);
      default:
        throw new Error(`Format non supporté: ${config.format}`);
    }
  }

  private async generatePDF(content: string, config: ExportConfig): Promise<Blob> {
    // Simulation d'un PDF généré
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport CHAPFOODY</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 40px;
            color: #333;
        }
        h1 { 
            color: #b70f23; 
            border-bottom: 2px solid #f4b71b;
            padding-bottom: 10px;
        }
        h2 { 
            color: #70070e; 
            margin-top: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #b70f23, #f4b71b);
            color: white;
            border-radius: 10px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric-card {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CHAPFOODY</h1>
        <p>Rapport d'analyse - ${config.userType}</p>
    </div>
    
    ${content.replace(/\n/g, '<br>').replace(/#{2,}/g, (match) => {
      const level = match.length;
      return `<h${Math.min(level, 6)}>`;
    }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
</body>
</html>
    `;

    return new Blob([htmlContent], { type: 'text/html' });
  }

  private async generateExcel(content: string, config: ExportConfig): Promise<Blob> {
    // Simulation d'un fichier Excel
    const csvContent = content
      .replace(/#{1,}/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n/g, '\r\n');

    return new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  private async generateCSV(content: string, config: ExportConfig): Promise<Blob> {
    // Simulation d'un fichier CSV
    const csvContent = content
      .replace(/#{1,}/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n/g, '\r\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private async downloadFile(document: Blob, config: ExportConfig): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CHAPFOODY_Rapport_${config.userType}_${timestamp}.${config.format}`;
    
    // Création d'un lien de téléchargement
    const url = URL.createObjectURL(document);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Méthodes pour les templates spécialisés
  getAvailableTemplates(userType: string): Array<{id: string, name: string, description: string}> {
    const templates = {
      restaurant: [
        {
          id: "executive",
          name: "Rapport Exécutif",
          description: "Vue d'ensemble concise pour la direction"
        },
        {
          id: "complete",
          name: "Analyse Complète",
          description: "Rapport détaillé avec toutes les métriques"
        },
        {
          id: "operational",
          name: "Rapport Opérationnel",
          description: "Focus sur les opérations quotidiennes"
        }
      ],
      delivery: [
        {
          id: "logistics",
          name: "Rapport Logistique",
          description: "Analyse des routes et performances de livraison"
        },
        {
          id: "financial",
          name: "Rapport Financier",
          description: "Focus sur la rentabilité et les coûts"
        }
      ],
      company: [
        {
          id: "enterprise",
          name: "Rapport Entreprise",
          description: "Vue d'ensemble pour grandes entreprises"
        }
      ],
      affiliate: [
        {
          id: "marketing",
          name: "Rapport Marketing",
          description: "Performance des campagnes et commissions"
        }
      ]
    };

    return templates[userType as keyof typeof templates] || templates.restaurant;
  }

  // Estimation de la taille du fichier
  estimateFileSize(config: ExportConfig, dataSize: number): number {
    let baseSize = 500; // KB
    
    // Ajout par section
    baseSize += config.sections.length * 150;
    
    // Ajout pour les graphiques
    if (config.includeCharts) {
      baseSize += 300;
    }
    
    // Ajout pour les comparaisons
    if (config.includeComparison) {
      baseSize += 200;
    }
    
    // Facteur par format
    const formatMultiplier = {
      pdf: 1.5,
      excel: 0.8,
      csv: 0.3
    };
    
    baseSize *= formatMultiplier[config.format];
    
    return Math.round(baseSize);
  }
}