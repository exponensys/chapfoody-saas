import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { 
  Calculator, 
  TrendingUp, 
  FileText, 
  Receipt, 
  CreditCard, 
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Search,
  Euro,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Printer,
  Mail,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Settings
} from 'lucide-react';
import { TransactionsView } from './TransactionsView';
import { RefundsView } from './RefundsView';
import { CashClosureView } from './CashClosureView';
import { VATManagementView } from './VATManagementView';

interface AccountingViewProps {
  onBack: () => void;
}

export function AccountingView({ onBack }: AccountingViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Données simulées pour les KPIs
  const kpis = {
    revenue: { value: 45250.80, change: 12.5, trend: 'up' },
    expenses: { value: 28150.45, change: -5.2, trend: 'down' },
    netProfit: { value: 17100.35, change: 18.7, trend: 'up' },
    pendingInvoices: { value: 8750.20, change: 2.1, trend: 'up' }
  };

  // Données simulées pour les factures
  const invoices = [
    {
      id: 'INV-2024-001',
      customer: 'Restaurant Le Gourmet',
      amount: 1250.00,
      status: 'paid',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      type: 'invoice'
    },
    {
      id: 'INV-2024-002',
      customer: 'Boulangerie Martin',
      amount: 875.50,
      status: 'pending',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      type: 'invoice'
    },
    {
      id: 'QUO-2024-003',
      customer: 'Café Central',
      amount: 650.00,
      status: 'draft',
      date: '2024-01-22',
      dueDate: '2024-02-22',
      type: 'quote'
    }
  ];

  // Données simulées pour les rapports
  const reports = [
    { name: 'Bilan comptable', period: 'Janvier 2024', size: '2.4 MB', date: '2024-01-31' },
    { name: 'Compte de résultat', period: 'Janvier 2024', size: '1.8 MB', date: '2024-01-31' },
    { name: 'Déclaration TVA', period: 'T4 2023', size: '890 KB', date: '2024-01-15' },
    { name: 'Journal des ventes', period: 'Janvier 2024', size: '3.2 MB', date: '2024-01-31' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-[#b70f23]">
                  {kpis.revenue.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{kpis.revenue.change}%</span>
                </div>
              </div>
              <div className="p-3 bg-[#b70f23]/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-[#b70f23]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dépenses</p>
                <p className="text-2xl font-bold text-[#70070e]">
                  {kpis.expenses.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">{kpis.expenses.change}%</span>
                </div>
              </div>
              <div className="p-3 bg-[#70070e]/10 rounded-full">
                <Calculator className="w-6 h-6 text-[#70070e]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bénéfice net</p>
                <p className="text-2xl font-bold text-[#f4b71b]">
                  {kpis.netProfit.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{kpis.netProfit.change}%</span>
                </div>
              </div>
              <div className="p-3 bg-[#f4b71b]/10 rounded-full">
                <DollarSign className="w-6 h-6 text-[#f4b71b]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Factures impayées</p>
                <p className="text-2xl font-bold text-orange-600">
                  {kpis.pendingInvoices.value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">3 factures</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Actions rapides
          </CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités les plus utilisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={4}>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#b70f23] hover:text-white transition-colors"
              onClick={() => setActiveTab('invoices')}
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs text-center">Nouvelle facture</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setActiveTab('transactions')}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs text-center">Transactions</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#70070e] hover:text-white transition-colors"
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs text-center">Rapports</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#b70f23] hover:text-white transition-colors"
              onClick={() => setActiveTab('vat')}
            >
              <Percent className="w-6 h-6" />
              <span className="text-xs text-center">TVA</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setActiveTab('cash-closure')}
            >
              <Calculator className="w-6 h-6" />
              <span className="text-xs text-center">Clôture caisse</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-[#70070e] hover:text-white transition-colors"
              onClick={() => setActiveTab('refunds')}
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-xs text-center">Remboursements</span>
            </Button>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Graphiques financiers */}
      <ResponsiveGrid cols={{ base: 1, lg: 2 }} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Répartition des revenus
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#b70f23] rounded-full"></div>
                  <span>Ventes directes</span>
                </div>
                <span className="font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f4b71b] rounded-full"></div>
                  <span>Livraisons</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#70070e] rounded-full"></div>
                  <span>Services traiteur</span>
                </div>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Décembre 2023</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded">
                    <div className="w-20 h-2 bg-[#b70f23] rounded"></div>
                  </div>
                  <span className="text-sm">42K€</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Janvier 2024</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded">
                    <div className="w-24 h-2 bg-[#f4b71b] rounded"></div>
                  </div>
                  <span className="text-sm">45K€</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Projection Février</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded">
                    <div className="w-16 h-2 bg-[#70070e] rounded opacity-60"></div>
                  </div>
                  <span className="text-sm">38K€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col gap-4 justify-between items-start sm:items-center sm:flex-row">
        <div>
          <h3 className="text-lg font-semibold">Factures et devis</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos factures, devis et suivez les paiements
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2 flex-1 sm:flex-none">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle facture</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau devis</span>
            <span className="sm:hidden">Devis</span>
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par numéro, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les documents</SelectItem>
                <SelectItem value="invoice">Factures</SelectItem>
                <SelectItem value="quote">Devis</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Documents récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{invoice.id}</span>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      Créé le {new Date(invoice.date).toLocaleDateString('fr-FR')} • 
                      Échéance le {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="font-bold text-lg">
                      {invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Rapports comptables</h3>
          <p className="text-sm text-muted-foreground">
            Générez et téléchargez vos rapports financiers
          </p>
        </div>
        <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Générer un rapport
        </Button>
      </div>

      {/* Rapports disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ base: 1, md: 2 }} gap={4}>
            {reports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#b70f23]/10 rounded flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-[#b70f23]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.period}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.size} • Généré le {new Date(report.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Générateur de rapports */}
      <Card>
        <CardHeader>
          <CardTitle>Générer un nouveau rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-[#b70f23] hover:text-white">
              <Receipt className="w-6 h-6" />
              <span className="text-center">Bilan comptable</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-[#f4b71b] hover:text-white">
              <PieChart className="w-6 h-6" />
              <span className="text-center">Compte de résultat</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-[#70070e] hover:text-white">
              <Percent className="w-6 h-6" />
              <span className="text-center">Déclaration TVA</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-[#b70f23] hover:text-white">
              <Calendar className="w-6 h-6" />
              <span className="text-center">Journal mensuel</span>
            </Button>
          </ResponsiveGrid>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ResponsiveContainer maxWidth="6xl" className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            ← Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#b70f23] flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Comptabilité
            </h1>
            <p className="text-muted-foreground">
              Gestion financière et comptable complète
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2 flex-1 sm:flex-none">
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 min-w-fit">
            <TabsTrigger value="overview" className="gap-2 whitespace-nowrap">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
              <span className="sm:hidden">Vue</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2 whitespace-nowrap">
              <FileText className="w-4 h-4" />
              Factures
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2 whitespace-nowrap">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">Trans.</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2 whitespace-nowrap">
              <BarChart3 className="w-4 h-4" />
              Rapports
            </TabsTrigger>
            <TabsTrigger value="vat" className="gap-2 whitespace-nowrap">
              <Percent className="w-4 h-4" />
              TVA
            </TabsTrigger>
            <TabsTrigger value="cash-closure" className="gap-2 whitespace-nowrap">
              <Calculator className="w-4 h-4" />
              Clôture
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          {renderInvoices()}
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsView onBack={() => setActiveTab('overview')} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          {renderReports()}
        </TabsContent>

        <TabsContent value="vat" className="mt-6">
          <VATManagementView onBack={() => setActiveTab('overview')} />
        </TabsContent>

        <TabsContent value="cash-closure" className="mt-6">
          <CashClosureView onBack={() => setActiveTab('overview')} />
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
}