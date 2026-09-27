import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Printer,
  Copy,
  Send,
  Calendar,
  User,
  Building,
  Phone,
  MapPin,
  Euro,
  Percent,
  Calculator,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface InvoiceManagementViewProps {
  onBack: () => void;
}

interface Invoice {
  id: string;
  number: string;
  type: 'invoice' | 'quote' | 'credit';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export function InvoiceManagementView({ onBack }: InvoiceManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Données simulées
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'FAC-2024-001',
      type: 'invoice',
      customer: {
        name: 'Restaurant Le Gourmet',
        email: 'contact@legourmet.fr',
        phone: '01 23 45 67 89',
        address: '123 Rue de la Paix, 75001 Paris'
      },
      items: [
        { id: '1', description: 'Solution CHAPFOODY Pro', quantity: 1, unitPrice: 99.00, vatRate: 20 },
        { id: '2', description: 'Formation équipe', quantity: 2, unitPrice: 150.00, vatRate: 20 }
      ],
      subtotal: 399.00,
      vatAmount: 79.80,
      total: 478.80,
      status: 'paid',
      createdDate: '2024-01-15',
      dueDate: '2024-02-15',
      paidDate: '2024-01-20'
    },
    {
      id: '2',
      number: 'FAC-2024-002',
      type: 'invoice',
      customer: {
        name: 'Boulangerie Martin',
        email: 'martin@boulangerie.fr',
        phone: '01 34 56 78 90',
        address: '45 Avenue du Pain, 75002 Paris'
      },
      items: [
        { id: '1', description: 'Abonnement mensuel', quantity: 1, unitPrice: 49.00, vatRate: 20 }
      ],
      subtotal: 49.00,
      vatAmount: 9.80,
      total: 58.80,
      status: 'overdue',
      createdDate: '2024-01-10',
      dueDate: '2024-01-25'
    },
    {
      id: '3',
      number: 'DEV-2024-003',
      type: 'quote',
      customer: {
        name: 'Café Central',
        email: 'info@cafe-central.fr',
        phone: '01 45 67 89 01',
        address: '78 Boulevard Central, 75003 Paris'
      },
      items: [
        { id: '1', description: 'Solution CHAPFOODY Starter', quantity: 1, unitPrice: 29.00, vatRate: 20 },
        { id: '2', description: 'Installation', quantity: 1, unitPrice: 100.00, vatRate: 20 }
      ],
      subtotal: 129.00,
      vatAmount: 25.80,
      total: 154.80,
      status: 'sent',
      createdDate: '2024-01-22',
      dueDate: '2024-02-22'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'invoice': return 'Facture';
      case 'quote': return 'Devis';
      case 'credit': return 'Avoir';
      default: return type;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesType = filterType === 'all' || invoice.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderInvoiceDetail = (invoice: Invoice) => (
    <div className="space-y-6">
      {/* En-tête de la facture */}
      <div className="flex justify-between items-start pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-[#b70f23]">{getTypeText(invoice.type)}</h2>
          <p className="text-lg font-semibold">{invoice.number}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(invoice.status)}>
              {getStatusIcon(invoice.status)}
              {getStatusText(invoice.status)}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#b70f23]">
            {formatCurrency(invoice.total)}
          </div>
          <p className="text-sm text-muted-foreground">Total TTC</p>
        </div>
      </div>

      {/* Informations client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>{invoice.customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{invoice.customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{invoice.customer.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
              <span className="text-sm">{invoice.customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dates importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Date de création</span>
              <span className="font-medium">{formatDate(invoice.createdDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date d'échéance</span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paidDate && (
              <div className="flex justify-between">
                <span>Date de paiement</span>
                <span className="font-medium text-green-600">{formatDate(invoice.paidDate)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Détail des articles */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* En-tête du tableau */}
            <div className="grid grid-cols-6 gap-4 pb-2 border-b font-medium text-sm text-muted-foreground">
              <div className="col-span-2">Description</div>
              <div className="text-center">Quantité</div>
              <div className="text-right">Prix unitaire</div>
              <div className="text-center">TVA</div>
              <div className="text-right">Total</div>
            </div>

            {/* Lignes d'articles */}
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-4 py-2 border-b border-gray-100">
                <div className="col-span-2">{item.description}</div>
                <div className="text-center">{item.quantity}</div>
                <div className="text-right">{formatCurrency(item.unitPrice)}</div>
                <div className="text-center">{item.vatRate}%</div>
                <div className="text-right font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>
              </div>
            ))}

            {/* Totaux */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Sous-total HT</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span className="font-medium">{formatCurrency(invoice.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#b70f23] pt-2 border-t">
                <span>Total TTC</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
          <Mail className="w-4 h-4" />
          Envoyer par email
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Télécharger PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>
        <Button variant="outline" className="gap-2">
          <Copy className="w-4 h-4" />
          Dupliquer
        </Button>
        {invoice.status === 'sent' && (
          <Button variant="outline" className="gap-2 text-green-600 border-green-600 hover:bg-green-50">
            <CheckCircle className="w-4 h-4" />
            Marquer comme payée
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            ← Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#b70f23] flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Gestion des factures
            </h1>
            <p className="text-muted-foreground">
              Créez, gérez et suivez vos factures et devis
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Nouveau devis
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle facture</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle facture
                </DialogDescription>
              </DialogHeader>
              {/* Contenu du formulaire de création */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Restaurant Le Gourmet</SelectItem>
                        <SelectItem value="2">Boulangerie Martin</SelectItem>
                        <SelectItem value="3">Café Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Date d'échéance</Label>
                    <Input type="date" id="dueDate" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea id="notes" placeholder="Notes supplémentaires..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                    Créer la facture
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total factures</p>
                <p className="text-2xl font-bold text-[#b70f23]">
                  {formatCurrency(invoices.filter(i => i.type === 'invoice').reduce((sum, i) => sum + i.total, 0))}
                </p>
              </div>
              <FileText className="w-8 h-8 text-[#b70f23]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0))}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0))}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payées</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0))}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="invoice">Factures</SelectItem>
                <SelectItem value="quote">Devis</SelectItem>
                <SelectItem value="credit">Avoirs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="sent">Envoyées</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invoice.number}</span>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusIcon(invoice.status)}
                        {getStatusText(invoice.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeText(invoice.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Créée le {formatDate(invoice.createdDate)} • 
                      Échéance le {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-lg">
                      {formatCurrency(invoice.total)}
                    </span>
                    <p className="text-xs text-muted-foreground">TTC</p>
                  </div>
                  <div className="flex gap-1">
                    <Dialog open={isDetailModalOpen && selectedInvoice?.id === invoice.id} 
                           onOpenChange={(open) => {
                             setIsDetailModalOpen(open);
                             if (!open) setSelectedInvoice(null);
                           }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détail de la facture</DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && renderInvoiceDetail(selectedInvoice)}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
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
}