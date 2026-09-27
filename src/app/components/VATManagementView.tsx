import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { 
  Calculator, 
  Percent,
  TrendingUp,
  FileText,
  Download,
  Settings,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Euro,
  Package,
  ShoppingCart,
  Utensils,
  Coffee,
  Wine,
  Apple,
  Cake,
  Search,
  Filter,
  ArrowUpDown,
  PieChart,
  Receipt
} from "lucide-react";

interface VATRate {
  id: string;
  rate: number;
  name: string;
  description: string;
  color: string;
  isDefault?: boolean;
  applicableProducts: string[];
  monthlyAmount: number;
  transactionCount: number;
}

interface VATDeclaration {
  id: string;
  period: string;
  quarter: string;
  year: string;
  status: 'draft' | 'submitted' | 'validated' | 'paid';
  submitDate?: string;
  totalSales: number;
  totalVAT: number;
  breakdown: {
    rate: number;
    sales: number;
    vat: number;
  }[];
  dueDate: string;
}

interface ProductVAT {
  id: string;
  name: string;
  category: string;
  currentRate: number;
  suggestedRate: number;
  isCompliant: boolean;
  monthlySales: number;
  monthlyVAT: number;
}

export function VATManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("rates");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);

  // Données mockées des taux de TVA
  const [vatRates] = useState<VATRate[]>([
    {
      id: "1",
      rate: 20,
      name: "Taux normal",
      description: "Taux standard pour la plupart des produits et services",
      color: "bg-red-500",
      isDefault: true,
      applicableProducts: ["Boissons alcoolisées", "Produits manufacturés", "Services généraux"],
      monthlyAmount: 2847.50,
      transactionCount: 245
    },
    {
      id: "2", 
      rate: 10,
      name: "Taux intermédiaire",
      description: "Restauration, hôtellerie, transport de voyageurs",
      color: "bg-orange-500",
      applicableProducts: ["Plats préparés", "Restauration sur place", "Services hôteliers"],
      monthlyAmount: 1456.80,
      transactionCount: 187
    },
    {
      id: "3",
      rate: 5.5,
      name: "Taux réduit",
      description: "Produits alimentaires, livres, spectacles",
      color: "bg-green-500",
      applicableProducts: ["Produits alimentaires de base", "Livres", "Presse"],
      monthlyAmount: 567.90,
      transactionCount: 98
    },
    {
      id: "4",
      rate: 2.1,
      name: "Taux super-réduit",
      description: "Médicaments remboursables, presse quotidienne",
      color: "bg-blue-500",
      applicableProducts: ["Médicaments", "Presse quotidienne"],
      monthlyAmount: 45.20,
      transactionCount: 12
    }
  ]);

  // Données mockées des déclarations TVA
  const [vatDeclarations] = useState<VATDeclaration[]>([
    {
      id: "1",
      period: "Septembre 2025",
      quarter: "Q3",
      year: "2025",
      status: "draft",
      totalSales: 18450.75,
      totalVAT: 2891.45,
      breakdown: [
        { rate: 20, sales: 12300.50, vat: 2460.10 },
        { rate: 10, sales: 4567.80, vat: 456.78 },
        { rate: 5.5, sales: 1582.45, vat: 87.03 }
      ],
      dueDate: "2025-10-20"
    },
    {
      id: "2",
      period: "Août 2025", 
      quarter: "Q3",
      year: "2025",
      status: "submitted",
      submitDate: "2025-09-15",
      totalSales: 21567.90,
      totalVAT: 3245.80,
      breakdown: [
        { rate: 20, sales: 14230.60, vat: 2846.12 },
        { rate: 10, sales: 5890.30, vat: 589.03 },
        { rate: 5.5, sales: 1447.00, vat: 79.59 }
      ],
      dueDate: "2025-09-20"
    },
    {
      id: "3",
      period: "Juillet 2025",
      quarter: "Q3", 
      year: "2025",
      status: "validated",
      submitDate: "2025-08-18",
      totalSales: 19780.40,
      totalVAT: 3156.25,
      breakdown: [
        { rate: 20, sales: 13245.80, vat: 2649.16 },
        { rate: 10, sales: 4890.60, vat: 489.06 },
        { rate: 5.5, sales: 1644.00, vat: 90.42 }
      ],
      dueDate: "2025-08-20"
    }
  ]);

  // Données mockées des produits avec TVA
  const [productsVAT] = useState<ProductVAT[]>([
    {
      id: "1",
      name: "Burger Classic",
      category: "Restauration sur place",
      currentRate: 10,
      suggestedRate: 10,
      isCompliant: true,
      monthlySales: 1450.90,
      monthlyVAT: 145.09
    },
    {
      id: "2",
      name: "Coca-Cola 33cl",
      category: "Boissons non-alcoolisées",
      currentRate: 20,
      suggestedRate: 20,
      isCompliant: true,
      monthlySales: 890.40,
      monthlyVAT: 178.08
    },
    {
      id: "3",
      name: "Pain de campagne",
      category: "Produits alimentaires de base",
      currentRate: 5.5,
      suggestedRate: 5.5,
      isCompliant: true,
      monthlySales: 567.80,
      monthlyVAT: 31.23
    },
    {
      id: "4",
      name: "Bière artisanale",
      category: "Boissons alcoolisées",
      currentRate: 10,
      suggestedRate: 20,
      isCompliant: false,
      monthlySales: 234.50,
      monthlyVAT: 23.45
    },
    {
      id: "5",
      name: "Service traiteur",
      category: "Services généraux",
      currentRate: 20,
      suggestedRate: 20,
      isCompliant: true,
      monthlySales: 2340.60,
      monthlyVAT: 468.12
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'validated': return 'bg-green-100 text-green-700';
      case 'paid': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'submitted': return 'Soumise';
      case 'validated': return 'Validée';
      case 'paid': return 'Payée';
      default: return 'Inconnu';
    }
  };

  const handleCreateDeclaration = () => {
    toast.success("Nouvelle déclaration TVA créée pour la période en cours");
  };

  const handleSubmitDeclaration = (declaration: VATDeclaration) => {
    toast.success(`Déclaration TVA ${declaration.period} soumise avec succès`);
  };

  const handleExportDeclaration = (declaration: VATDeclaration) => {
    toast.success(`Déclaration TVA ${declaration.period} exportée en PDF`);
  };

  const handleUpdateProductVAT = (productId: string, newRate: number) => {
    toast.success(`Taux TVA mis à jour pour le produit (${newRate}%)`);
  };

  const getVATStats = () => {
    const totalVAT = vatRates.reduce((sum, rate) => sum + rate.monthlyAmount, 0);
    const totalTransactions = vatRates.reduce((sum, rate) => sum + rate.transactionCount, 0);
    const nonCompliantProducts = productsVAT.filter(p => !p.isCompliant).length;
    
    return {
      totalVAT,
      totalTransactions,
      nonCompliantProducts,
      avgVATPerTransaction: totalTransactions > 0 ? totalVAT / totalTransactions : 0
    };
  };

  const stats = getVATStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion TVA</h1>
            <p className="text-gray-600">Configuration des taux et déclarations fiscales</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter données
          </Button>
          <Button 
            className="bg-[#b70f23] hover:bg-[#70070e] gap-2"
            onClick={handleCreateDeclaration}
          >
            <Plus className="w-4 h-4" />
            Nouvelle déclaration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TVA collectée</p>
                <p className="text-2xl font-bold text-[#b70f23]">{stats.totalVAT.toFixed(2)}€</p>
              </div>
              <Euro className="w-8 h-8 text-[#b70f23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TVA moyenne</p>
                <p className="text-2xl font-bold text-green-600">{stats.avgVATPerTransaction.toFixed(2)}€</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non-conformes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.nonCompliantProducts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rates" className="gap-2">
            <Percent className="w-4 h-4" />
            Taux TVA
          </TabsTrigger>
          <TabsTrigger value="declarations" className="gap-2">
            <FileText className="w-4 h-4" />
            Déclarations
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="w-4 h-4" />
            Produits
          </TabsTrigger>
        </TabsList>

        {/* VAT Rates Tab */}
        <TabsContent value="rates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vatRates.map((rate) => (
              <Card key={rate.id} className={rate.isDefault ? 'ring-2 ring-[#b70f23]' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${rate.color}`}></div>
                      <div>
                        <h3 className="font-semibold">{rate.rate}%</h3>
                        <p className="text-sm text-gray-600">{rate.name}</p>
                      </div>
                    </div>
                    {rate.isDefault && (
                      <Badge className="bg-[#b70f23] text-white">Défaut</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{rate.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA collectée :</span>
                      <span className="font-bold text-[#b70f23]">{rate.monthlyAmount.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions :</span>
                      <span className="font-medium">{rate.transactionCount}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Produits applicables :</p>
                    <div className="flex flex-wrap gap-1">
                      {rate.applicableProducts.slice(0, 2).map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                      {rate.applicableProducts.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{rate.applicableProducts.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-1" />
                    Configurer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Répartition TVA par taux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vatRates.map((rate) => {
                  const percentage = (rate.monthlyAmount / stats.totalVAT) * 100;
                  return (
                    <div key={rate.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${rate.color}`}></div>
                        <span className="font-medium">{rate.rate}%</span>
                        <span className="text-gray-600">{rate.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{rate.monthlyAmount.toFixed(2)}€</p>
                        <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Declarations Tab */}
        <TabsContent value="declarations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Déclarations TVA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vatDeclarations.map((declaration) => (
                  <div key={declaration.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b70f23] to-[#70070e] flex items-center justify-center text-white">
                          <FileText className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{declaration.period}</h3>
                            <Badge className={getStatusColor(declaration.status)}>
                              {getStatusLabel(declaration.status)}
                            </Badge>
                            <Badge variant="outline">{declaration.quarter} {declaration.year}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Échéance : {declaration.dueDate}</span>
                            </div>
                            {declaration.submitDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Soumise le {declaration.submitDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#b70f23]">{declaration.totalVAT.toFixed(2)}€</p>
                          <p className="text-sm text-gray-600">sur {declaration.totalSales.toFixed(2)}€ de CA</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExportDeclaration(declaration)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {declaration.status === 'draft' && (
                            <Button 
                              size="sm" 
                              className="bg-[#b70f23] hover:bg-[#70070e]"
                              onClick={() => handleSubmitDeclaration(declaration)}
                            >
                              Soumettre
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* VAT Breakdown */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-3 gap-4">
                        {declaration.breakdown.map((item, index) => (
                          <div key={index} className="text-center">
                            <p className="text-sm text-gray-600">TVA {item.rate}%</p>
                            <p className="font-bold text-[#b70f23]">{item.vat.toFixed(2)}€</p>
                            <p className="text-xs text-gray-500">sur {item.sales.toFixed(2)}€</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products VAT Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border rounded-md text-sm">
                    <option value="all">Toutes catégories</option>
                    <option value="restaurant">Restauration</option>
                    <option value="retail">Vente au détail</option>
                    <option value="services">Services</option>
                  </select>
                  <select className="px-3 py-2 border rounded-md text-sm">
                    <option value="all">Tous statuts</option>
                    <option value="compliant">Conformes</option>
                    <option value="non-compliant">Non-conformes</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Produits et services - Configuration TVA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productsVAT.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                          product.isCompliant 
                            ? 'bg-gradient-to-br from-green-500 to-green-600' 
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}>
                          <Package className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <Badge variant="outline">{product.category}</Badge>
                            {!product.isCompliant && (
                              <Badge className="bg-red-100 text-red-700">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Non-conforme
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Percent className="w-4 h-4" />
                              <span>TVA actuelle : {product.currentRate}%</span>
                            </div>
                            {!product.isCompliant && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <ArrowUpDown className="w-4 h-4" />
                                <span>Suggéré : {product.suggestedRate}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-[#b70f23]">{product.monthlyVAT.toFixed(2)}€</p>
                          <p className="text-sm text-gray-600">sur {product.monthlySales.toFixed(2)}€</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!product.isCompliant && (
                            <Button 
                              size="sm" 
                              className="bg-orange-600 hover:bg-orange-700"
                              onClick={() => handleUpdateProductVAT(product.id, product.suggestedRate)}
                            >
                              Corriger
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Vérification automatique</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Analyse tous les produits pour détecter les non-conformités TVA
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Lancer vérification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <ArrowUpDown className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Mise à jour en masse</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Applique les corrections suggérées à tous les produits
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Corriger tout
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Export configuration</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Exporte la configuration TVA pour sauvegarde
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Exporter config
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}