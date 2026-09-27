import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  RotateCcw, 
  Search,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Euro,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  TrendingDown,
  BarChart3,
  Printer,
  Download,
  Filter,
  RefreshCw,
  ShoppingCart,
  Package
} from "lucide-react";

interface Refund {
  id: string;
  originalTransactionId: string;
  originalTransactionNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  originalAmount: number;
  refundAmount: number;
  partialRefund: boolean;
  paymentMethod: 'cash' | 'card' | 'check' | 'apple_pay' | 'lydia' | 'transfer';
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled';
  reason: string;
  reasonCategory: 'customer_request' | 'product_issue' | 'service_issue' | 'error' | 'other';
  processedBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  refundedItems?: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  processingTime?: string;
  refundMethod: 'same' | 'cash' | 'bank_transfer' | 'credit_note';
}

export function RefundsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewRefundModalOpen, setIsNewRefundModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);

  // Données mockées des remboursements
  const [refunds] = useState<Refund[]>([
    {
      id: "1",
      originalTransactionId: "T2025-001",
      originalTransactionNumber: "T2025-001",
      date: "2025-09-13",
      time: "16:25",
      customer: {
        name: "Marie Dubois",
        email: "marie.dubois@email.fr",
        phone: "06 12 34 56 78"
      },
      originalAmount: 43.30,
      refundAmount: 15.90,
      partialRefund: true,
      paymentMethod: 'card',
      status: 'completed',
      reason: "Burger mal cuit selon le client",
      reasonCategory: 'product_issue',
      processedBy: "Sophie Martin",
      approvedBy: "Marc Dubois",
      notes: "Client régulier, geste commercial accepté",
      refundedItems: [
        { name: "Menu Burger Complet", quantity: 1, unitPrice: 15.90, total: 15.90 }
      ],
      processingTime: "2 min",
      refundMethod: 'same'
    },
    {
      id: "2",
      originalTransactionId: "T2025-004", 
      originalTransactionNumber: "T2025-004",
      date: "2025-09-13",
      time: "15:45",
      customer: {
        name: "Pierre Moreau",
        phone: "06 45 67 89 12"
      },
      originalAmount: 24.30,
      refundAmount: 24.30,
      partialRefund: false,
      paymentMethod: 'card',
      status: 'completed',
      reason: "Commande préparée incorrectement",
      reasonCategory: 'error',
      processedBy: "Marc Dubois",
      approvedBy: "Sophie Martin",
      notes: "Erreur de cuisine, remboursement intégral justifié",
      refundedItems: [
        { name: "Menu Enfant", quantity: 2, unitPrice: 9.90, total: 19.80 },
        { name: "Glace Vanille", quantity: 1, unitPrice: 4.50, total: 4.50 }
      ],
      processingTime: "1 min",
      refundMethod: 'same'
    },
    {
      id: "3",
      originalTransactionId: "T2025-015",
      originalTransactionNumber: "T2025-015", 
      date: "2025-09-12",
      time: "19:15",
      customer: {
        name: "Julie Lecomte",
        email: "julie.lecomte@email.fr"
      },
      originalAmount: 67.80,
      refundAmount: 67.80,
      partialRefund: false,
      paymentMethod: 'cash',
      status: 'pending',
      reason: "Temps d'attente excessif (plus de 45 minutes)",
      reasonCategory: 'service_issue',
      processedBy: "Ahmed Hassan",
      notes: "En attente validation manager pour remboursement intégral",
      refundedItems: [
        { name: "Pizza 4 fromages", quantity: 2, unitPrice: 16.90, total: 33.80 },
        { name: "Salade César", quantity: 2, unitPrice: 13.90, total: 27.80 },
        { name: "Dessert tiramisu", quantity: 2, unitPrice: 6.90, total: 13.80 }
      ],
      refundMethod: 'cash'
    },
    {
      id: "4",
      originalTransactionId: "T2025-008",
      originalTransactionNumber: "T2025-008",
      date: "2025-09-12", 
      time: "14:30",
      customer: {
        name: "Sophie Durand",
        email: "sophie.durand@email.fr",
        phone: "06 77 88 99 00"
      },
      originalAmount: 23.40,
      refundAmount: 23.40,
      partialRefund: false,
      paymentMethod: 'apple_pay',
      status: 'rejected',
      reason: "Plat froid à l'arrivée",
      reasonCategory: 'service_issue',
      processedBy: "Julie Lecomte",
      rejectedBy: "Marc Dubois",
      notes: "Réchauffage proposé et accepté par le client. Remboursement non justifié.",
      refundMethod: 'same'
    },
    {
      id: "5",
      originalTransactionId: "T2025-022",
      originalTransactionNumber: "T2025-022",
      date: "2025-09-11",
      time: "20:45", 
      customer: {
        name: "Thomas Martin",
        phone: "06 33 44 55 66"
      },
      originalAmount: 89.50,
      refundAmount: 35.60,
      partialRefund: true,
      paymentMethod: 'card',
      status: 'approved',
      reason: "Allergène non signalé dans un plat",
      reasonCategory: 'product_issue',
      processedBy: "Sophie Martin",
      approvedBy: "Marc Dubois",
      notes: "Incident grave, remboursement partiel des plats concernés + geste commercial",
      refundedItems: [
        { name: "Salade aux noix", quantity: 2, unitPrice: 14.90, total: 29.80 },
        { name: "Café gourmand", quantity: 1, unitPrice: 5.80, total: 5.80 }
      ],
      processingTime: "En cours",
      refundMethod: 'same'
    }
  ]);

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.originalTransactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.refundAmount.toString().includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || refund.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || refund.reasonCategory === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'completed': return 'Terminé';
      case 'rejected': return 'Refusé';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'customer_request': return 'Demande client';
      case 'product_issue': return 'Problème produit';
      case 'service_issue': return 'Problème service';
      case 'error': return 'Erreur interne';
      case 'other': return 'Autre';
      default: return 'Non spécifié';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'apple_pay': return <CreditCard className="w-4 h-4" />;
      case 'lydia': return <CreditCard className="w-4 h-4" />;
      case 'transfer': return <FileText className="w-4 h-4" />;
      case 'check': return <FileText className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (refund: Refund) => {
    setSelectedRefund(refund);
    setIsDetailModalOpen(true);
  };

  const handleApproveRefund = (refund: Refund) => {
    toast.success(`Remboursement ${refund.id} approuvé pour traitement`);
  };

  const handleRejectRefund = (refund: Refund) => {
    toast.error(`Remboursement ${refund.id} refusé`);
  };

  const handleProcessRefund = (refund: Refund) => {
    toast.success(`Remboursement ${refund.id} traité avec succès - ${refund.refundAmount.toFixed(2)}€`);
  };

  const handlePrintRefund = (refund: Refund) => {
    toast.success(`Bon de remboursement ${refund.id} envoyé à l'impression`);
  };

  const getStats = () => {
    const completed = filteredRefunds.filter(r => r.status === 'completed');
    const pending = filteredRefunds.filter(r => r.status === 'pending');
    const totalRefunded = completed.reduce((sum, r) => sum + r.refundAmount, 0);
    const avgRefund = completed.length > 0 ? totalRefunded / completed.length : 0;
    
    return {
      totalRefunds: filteredRefunds.length,
      pendingCount: pending.length,
      completedCount: completed.length,
      totalAmount: totalRefunded,
      avgAmount: avgRefund
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Remboursements</h1>
            <p className="text-gray-600">Gestion des retours et remboursements clients</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Dialog open={isNewRefundModalOpen} onOpenChange={setIsNewRefundModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
                <Plus className="w-4 h-4" />
                Nouveau remboursement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouveau remboursement</DialogTitle>
                <DialogDescription>
                  Créer une demande de remboursement pour un client
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Numéro de transaction</Label>
                    <Input placeholder="T2025-XXX" />
                  </div>
                  <div>
                    <Label>Montant à rembourser (€)</Label>
                    <Input type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                
                <div>
                  <Label>Motif du remboursement</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un motif" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer_request">Demande client</SelectItem>
                      <SelectItem value="product_issue">Problème produit</SelectItem>
                      <SelectItem value="service_issue">Problème service</SelectItem>
                      <SelectItem value="error">Erreur interne</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description détaillée</Label>
                  <Textarea placeholder="Décrivez la raison du remboursement..." />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                    Créer la demande
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewRefundModalOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total demandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRefunds}</p>
              </div>
              <RotateCcw className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalAmount.toFixed(2)}€</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant moyen</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgAmount.toFixed(2)}€</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par transaction, client, motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="completed">Terminés</option>
                <option value="rejected">Refusés</option>
                <option value="cancelled">Annulés</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Toutes catégories</option>
                <option value="customer_request">Demande client</option>
                <option value="product_issue">Problème produit</option>
                <option value="service_issue">Problème service</option>
                <option value="error">Erreur interne</option>
                <option value="other">Autre</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refunds List */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de remboursement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRefunds.map((refund) => (
              <div key={refund.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b70f23] to-[#70070e] flex items-center justify-center text-white">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Remboursement #{refund.id}
                        </h3>
                        <Badge className={getStatusColor(refund.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(refund.status)}
                            {getStatusLabel(refund.status)}
                          </div>
                        </Badge>
                        <Badge variant="outline">
                          {getCategoryLabel(refund.reasonCategory)}
                        </Badge>
                        {refund.partialRefund && (
                          <Badge variant="secondary">Partiel</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Receipt className="w-4 h-4" />
                          <span>Transaction {refund.originalTransactionNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{refund.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{refund.date} à {refund.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(refund.paymentMethod)}
                          <span>Traité par {refund.processedBy}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-700 italic">"{refund.reason}"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#b70f23]">-{refund.refundAmount.toFixed(2)}€</p>
                      <p className="text-sm text-gray-600">
                        sur {refund.originalAmount.toFixed(2)}€
                      </p>
                      {refund.processingTime && (
                        <p className="text-xs text-gray-500">
                          {refund.processingTime}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(refund)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {refund.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApproveRefund(refund)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRejectRefund(refund)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {refund.status === 'approved' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleProcessRefund(refund)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {(refund.status === 'completed' || refund.status === 'approved') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrintRefund(refund)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {refund.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-orange-800">Note :</span>
                        <span className="text-gray-600 ml-1">{refund.notes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {refund.approvedBy && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-green-600">
                      ✓ Approuvé par {refund.approvedBy}
                    </p>
                  </div>
                )}

                {refund.rejectedBy && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-red-600">
                      ✗ Refusé par {refund.rejectedBy}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {filteredRefunds.length === 0 && (
              <div className="text-center py-8">
                <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun remboursement trouvé</h3>
                <p className="text-gray-500">Aucun remboursement ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du remboursement #{selectedRefund?.id}</DialogTitle>
            <DialogDescription>
              Informations complètes de la demande de remboursement
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transaction originale</label>
                  <p>{selectedRefund.originalTransactionNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Heure</label>
                  <p>{selectedRefund.date} à {selectedRefund.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Client</label>
                  <p>{selectedRefund.customer.name}</p>
                  {selectedRefund.customer.email && (
                    <p className="text-sm text-gray-600">{selectedRefund.customer.email}</p>
                  )}
                  {selectedRefund.customer.phone && (
                    <p className="text-sm text-gray-600">{selectedRefund.customer.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Traité par</label>
                  <p>{selectedRefund.processedBy}</p>
                </div>
              </div>

              {/* Status and Category */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <Badge className={getStatusColor(selectedRefund.status)}>
                    {getStatusLabel(selectedRefund.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Catégorie</label>
                  <p>{getCategoryLabel(selectedRefund.reasonCategory)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p>{selectedRefund.partialRefund ? 'Remboursement partiel' : 'Remboursement total'}</p>
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Montant original</p>
                    <p className="text-xl font-bold text-gray-900">{selectedRefund.originalAmount.toFixed(2)}€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Montant remboursé</p>
                    <p className="text-xl font-bold text-red-600">{selectedRefund.refundAmount.toFixed(2)}€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600">Pourcentage</p>
                    <p className="text-xl font-bold text-orange-600">
                      {((selectedRefund.refundAmount / selectedRefund.originalAmount) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Motif du remboursement</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedRefund.reason}</p>
                </div>
              </div>

              {/* Refunded Items */}
              {selectedRefund.refundedItems && selectedRefund.refundedItems.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-3">Articles remboursés</label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Article</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Qté</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">P.U.</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRefund.refundedItems.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-3">{item.name}</td>
                            <td className="px-4 py-3 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">{item.unitPrice.toFixed(2)}€</td>
                            <td className="px-4 py-3 text-right font-medium">{item.total.toFixed(2)}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRefund.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Notes internes</label>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm">{selectedRefund.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedRefund.status === 'pending' && (
                  <>
                    <Button 
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveRefund(selectedRefund)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => handleRejectRefund(selectedRefund)}
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </Button>
                  </>
                )}
                
                {selectedRefund.status === 'approved' && (
                  <Button 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleProcessRefund(selectedRefund)}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Traiter le remboursement
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handlePrintRefund(selectedRefund)}
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}