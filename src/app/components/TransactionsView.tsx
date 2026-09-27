import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { 
  CreditCard, 
  Search,
  Eye,
  Printer,
  RotateCcw,
  Copy,
  Euro,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  User,
  Clock,
  Banknote,
  Smartphone,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Receipt,
  ArrowUpDown,
  RefreshCw,
  X
} from "lucide-react";

interface Transaction {
  id: string;
  number: string;
  date: string;
  time: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    vat: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'check' | 'apple_pay' | 'lydia' | 'transfer';
  status: 'completed' | 'pending' | 'refunded' | 'cancelled';
  cashier: string;
  tips?: number;
  refundAmount?: number;
  refundReason?: string;
}

export function TransactionsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);

  // États pour la nouvelle transaction
  const [newTransaction, setNewTransaction] = useState({
    customer: { name: "", email: "", phone: "" },
    items: [] as { name: string; quantity: number; unitPrice: number; vat: number }[],
    paymentMethod: 'cash' as const,
    cashier: "Utilisateur actuel",
    tips: 0
  });
  
  const [availableProducts] = useState([
    { id: "1", name: "Menu Burger Complet", price: 15.90, vat: 20, category: "Plats" },
    { id: "2", name: "Pizza Margherita", price: 12.50, vat: 10, category: "Plats" },
    { id: "3", name: "Salade César", price: 13.90, vat: 10, category: "Salades" },
    { id: "4", name: "Menu Enfant", price: 9.90, vat: 10, category: "Menus" },
    { id: "5", name: "Coca-Cola 33cl", price: 3.50, vat: 20, category: "Boissons" },
    { id: "6", name: "Café Espresso", price: 2.20, vat: 10, category: "Boissons chaudes" },
    { id: "7", name: "Tiramisu", price: 6.90, vat: 10, category: "Desserts" },
    { id: "8", name: "Frites supplémentaires", price: 4.50, vat: 20, category: "Accompagnements" },
    { id: "9", name: "Glace Vanille", price: 4.50, vat: 5.5, category: "Desserts" },
    { id: "10", name: "Eau minérale 50cl", price: 2.80, vat: 20, category: "Boissons" }
  ]);

  // Données mockées des transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      number: "T2025-001",
      date: "2025-09-13",
      time: "14:35",
      customer: {
        name: "Marie Dubois",
        email: "marie.dubois@email.fr",
        phone: "06 12 34 56 78"
      },
      items: [
        { name: "Menu Burger Complet", quantity: 2, unitPrice: 15.90, total: 31.80, vat: 20 },
        { name: "Coca-Cola 33cl", quantity: 2, unitPrice: 3.50, total: 7.00, vat: 20 },
        { name: "Frites supplémentaires", quantity: 1, unitPrice: 4.50, total: 4.50, vat: 20 }
      ],
      subtotal: 36.08,
      vatAmount: 7.22,
      total: 43.30,
      paymentMethod: 'card',
      status: 'completed',
      cashier: "Sophie Martin",
      tips: 2.00
    },
    {
      id: "2", 
      number: "T2025-002",
      date: "2025-09-13",
      time: "14:42",
      customer: {
        name: "Ahmed Hassan",
        phone: "06 98 76 54 32"
      },
      items: [
        { name: "Pizza Margherita", quantity: 1, unitPrice: 12.50, total: 12.50, vat: 10 },
        { name: "Tiramisu", quantity: 1, unitPrice: 6.90, total: 6.90, vat: 10 },
        { name: "Café Espresso", quantity: 2, unitPrice: 2.20, total: 4.40, vat: 10 }
      ],
      subtotal: 21.63,
      vatAmount: 2.17,
      total: 23.80,
      paymentMethod: 'cash',
      status: 'completed',
      cashier: "Sophie Martin"
    },
    {
      id: "3",
      number: "T2025-003", 
      date: "2025-09-13",
      time: "14:55",
      customer: {
        name: "Julie Lecomte",
        email: "julie.lecomte@email.fr"
      },
      items: [
        { name: "Salade César", quantity: 1, unitPrice: 13.90, total: 13.90, vat: 10 },
        { name: "Eau minérale 50cl", quantity: 1, unitPrice: 2.80, total: 2.80, vat: 20 }
      ],
      subtotal: 15.36,
      vatAmount: 1.34,
      total: 16.70,
      paymentMethod: 'apple_pay',
      status: 'completed',
      cashier: "Marc Dubois"
    },
    {
      id: "4",
      number: "T2025-004",
      date: "2025-09-13", 
      time: "15:08",
      customer: {
        name: "Pierre Moreau",
        phone: "06 45 67 89 12"
      },
      items: [
        { name: "Menu Enfant", quantity: 2, unitPrice: 9.90, total: 19.80, vat: 10 },
        { name: "Glace Vanille", quantity: 1, unitPrice: 4.50, total: 4.50, vat: 5.5 }
      ],
      subtotal: 22.60,
      vatAmount: 1.70,
      total: 24.30,
      paymentMethod: 'card',
      status: 'refunded',
      cashier: "Marc Dubois",
      refundAmount: 24.30,
      refundReason: "Commande incorrecte"
    },
    {
      id: "5",
      number: "T2025-005",
      date: "2025-09-13",
      time: "15:25",
      customer: {
        name: "Commande comptoir",
        phone: "Non renseigné"
      },
      items: [
        { name: "Café allongé", quantity: 3, unitPrice: 2.50, total: 7.50, vat: 10 },
        { name: "Croissant", quantity: 2, unitPrice: 1.80, total: 3.60, vat: 5.5 }
      ],
      subtotal: 10.43,
      vatAmount: 0.67,
      total: 11.10,
      paymentMethod: 'cash',
      status: 'completed',
      cashier: "Sophie Martin"
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.total.toString().includes(searchTerm) ||
      transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    const matchesPayment = selectedPaymentMethod === "all" || transaction.paymentMethod === selectedPaymentMethod;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'apple_pay': return <Smartphone className="w-4 h-4" />;
      case 'lydia': return <Smartphone className="w-4 h-4" />;
      case 'transfer': return <ArrowUpDown className="w-4 h-4" />;
      case 'check': return <FileText className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'card': return 'Carte bancaire';
      case 'apple_pay': return 'Apple Pay';
      case 'lydia': return 'Lydia';
      case 'transfer': return 'Virement';
      case 'check': return 'Chèque';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'refunded': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Validée';
      case 'pending': return 'En attente';
      case 'refunded': return 'Remboursée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'refunded': return <RotateCcw className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handlePrintTicket = (transaction: Transaction) => {
    toast.success(`Ticket de caisse ${transaction.number} envoyé à l'impression`);
  };

  const handleRefund = (transaction: Transaction) => {
    if (transaction.status === 'refunded') {
      toast.info(`Cette transaction a déjà été remboursée`);
      return;
    }
    toast.success(`Remboursement de ${transaction.total}€ initié pour ${transaction.number}`);
  };

  const handleDuplicate = (transaction: Transaction) => {
    toast.success(`Nouvelle transaction créée à partir de ${transaction.number}`);
  };

  // Fonctions pour la nouvelle transaction
  const addProductToTransaction = (product: typeof availableProducts[0]) => {
    const existingItem = newTransaction.items.find(item => item.name === product.name);
    
    if (existingItem) {
      setNewTransaction(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setNewTransaction(prev => ({
        ...prev,
        items: [...prev.items, {
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
          vat: product.vat
        }]
      }));
    }
  };

  const removeProductFromTransaction = (productName: string) => {
    setNewTransaction(prev => ({
      ...prev,
      items: prev.items.filter(item => item.name !== productName)
    }));
  };

  const updateProductQuantity = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromTransaction(productName);
      return;
    }
    
    setNewTransaction(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.name === productName
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const calculateTransactionTotals = () => {
    const itemsTotal = newTransaction.items.reduce((total, item) => 
      total + (item.quantity * item.unitPrice), 0
    );
    
    const vatAmount = newTransaction.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemVat = (itemTotal * item.vat) / (100 + item.vat);
      return total + itemVat;
    }, 0);
    
    const subtotal = itemsTotal - vatAmount;
    const total = itemsTotal + newTransaction.tips;
    
    return { subtotal, vatAmount, total: itemsTotal };
  };

  const generateTransactionNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const existingNumbers = transactions
      .filter(t => t.date === today.toISOString().split('T')[0])
      .map(t => parseInt(t.number.split('-')[1]))
      .sort((a, b) => b - a);
    
    const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
    return `T${year}-${String(nextNumber).padStart(3, '0')}`;
  };

  const handleCreateTransaction = () => {
    if (newTransaction.items.length === 0) {
      toast.error("Veuillez ajouter au moins un article à la transaction");
      return;
    }
    
    if (!newTransaction.customer.name.trim()) {
      toast.error("Veuillez saisir le nom du client");
      return;
    }

    const totals = calculateTransactionTotals();
    const now = new Date();
    const transactionNumber = generateTransactionNumber();
    
    const createdTransaction: Transaction = {
      id: String(transactions.length + 1),
      number: transactionNumber,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      customer: newTransaction.customer,
      items: newTransaction.items.map(item => ({
        ...item,
        total: item.quantity * item.unitPrice
      })),
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      total: totals.total + newTransaction.tips,
      paymentMethod: newTransaction.paymentMethod,
      status: 'completed',
      cashier: newTransaction.cashier,
      tips: newTransaction.tips > 0 ? newTransaction.tips : undefined
    };

    setTransactions(prev => [createdTransaction, ...prev]);
    
    // Réinitialiser le formulaire
    setNewTransaction({
      customer: { name: "", email: "", phone: "" },
      items: [],
      paymentMethod: 'cash',
      cashier: "Utilisateur actuel",
      tips: 0
    });
    
    setIsNewTransactionModalOpen(false);
    toast.success(`Transaction ${transactionNumber} créée avec succès !`);
  };

  const getStats = () => {
    const completed = filteredTransactions.filter(t => t.status === 'completed');
    const refunded = filteredTransactions.filter(t => t.status === 'refunded');
    
    return {
      totalTransactions: filteredTransactions.length,
      completedTransactions: completed.length,
      totalRevenue: completed.reduce((sum, t) => sum + t.total, 0),
      refundedAmount: refunded.reduce((sum, t) => sum + (t.refundAmount || 0), 0),
      avgTicket: completed.length > 0 ? completed.reduce((sum, t) => sum + t.total, 0) / completed.length : 0
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Historique et gestion des ventes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button 
            className="bg-[#b70f23] hover:bg-[#70070e] gap-2"
            onClick={() => setIsNewTransactionModalOpen(true)}
          >
            <Receipt className="w-4 h-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedTransactions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CA Total</p>
                <p className="text-2xl font-bold text-[#b70f23]">{stats.totalRevenue.toFixed(2)}€</p>
              </div>
              <Euro className="w-8 h-8 text-[#b70f23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remboursés</p>
                <p className="text-2xl font-bold text-red-600">{stats.refundedAmount.toFixed(2)}€</p>
              </div>
              <RotateCcw className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket moyen</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgTicket.toFixed(2)}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
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
                placeholder="Rechercher par numéro, client, montant..."
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
                <option value="completed">Validées</option>
                <option value="pending">En attente</option>
                <option value="refunded">Remboursées</option>
                <option value="cancelled">Annulées</option>
              </select>
              
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous les modes</option>
                <option value="cash">Espèces</option>
                <option value="card">Carte bancaire</option>
                <option value="apple_pay">Apple Pay</option>
                <option value="lydia">Lydia</option>
                <option value="check">Chèque</option>
                <option value="transfer">Virement</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b70f23] to-[#70070e] flex items-center justify-center text-white">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{transaction.number}</h3>
                        <Badge className={getStatusColor(transaction.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(transaction.status)}
                            {getStatusLabel(transaction.status)}
                          </div>
                        </Badge>
                        <Badge variant="outline">
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(transaction.paymentMethod)}
                            {getPaymentMethodLabel(transaction.paymentMethod)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{transaction.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{transaction.date} à {transaction.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Caissier : {transaction.cashier}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#b70f23]">{transaction.total.toFixed(2)}€</p>
                      <p className="text-sm text-gray-600">
                        TVA : {transaction.vatAmount.toFixed(2)}€
                      </p>
                      {transaction.tips && (
                        <p className="text-sm text-green-600">
                          Pourboire : +{transaction.tips.toFixed(2)}€
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrintTicket(transaction)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicate(transaction)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {transaction.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRefund(transaction)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {transaction.status === 'refunded' && transaction.refundReason && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">
                        Remboursé ({transaction.refundAmount?.toFixed(2)}€) : {transaction.refundReason}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
                <p className="text-gray-500">Aucune transaction ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la transaction {selectedTransaction?.number}</DialogTitle>
            <DialogDescription>
              Informations complètes de la vente
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Heure</label>
                  <p>{selectedTransaction.date} à {selectedTransaction.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Caissier</label>
                  <p>{selectedTransaction.cashier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Client</label>
                  <p>{selectedTransaction.customer.name}</p>
                  {selectedTransaction.customer.email && (
                    <p className="text-sm text-gray-600">{selectedTransaction.customer.email}</p>
                  )}
                  {selectedTransaction.customer.phone && (
                    <p className="text-sm text-gray-600">{selectedTransaction.customer.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mode de paiement</label>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                    <span>{getPaymentMethodLabel(selectedTransaction.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Articles vendus</label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Article</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Qté</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">P.U.</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">TVA</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTransaction.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{item.unitPrice.toFixed(2)}€</td>
                          <td className="px-4 py-3 text-right">{item.vat}%</td>
                          <td className="px-4 py-3 text-right font-medium">{item.total.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total HT</span>
                    <span>{selectedTransaction.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA</span>
                    <span>{selectedTransaction.vatAmount.toFixed(2)}€</span>
                  </div>
                  {selectedTransaction.tips && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Pourboire</span>
                      <span>+{selectedTransaction.tips.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total TTC</span>
                    <span>{selectedTransaction.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handlePrintTicket(selectedTransaction)}
                >
                  <Printer className="w-4 h-4" />
                  Imprimer ticket
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleDuplicate(selectedTransaction)}
                >
                  <Copy className="w-4 h-4" />
                  Dupliquer
                </Button>
                {selectedTransaction.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    className="gap-2 text-red-600 hover:text-red-700"
                    onClick={() => handleRefund(selectedTransaction)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rembourser
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Transaction Modal */}
      <Dialog open={isNewTransactionModalOpen} onOpenChange={setIsNewTransactionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle transaction</DialogTitle>
            <DialogDescription>
              Créer une nouvelle vente en sélectionnant les produits et en saisissant les informations client
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName">Nom du client *</Label>
                <Input
                  id="customerName"
                  placeholder="Nom complet"
                  value={newTransaction.customer.name}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email (optionnel)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="email@exemple.fr"
                  value={newTransaction.customer.email}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    customer: { ...prev.customer, email: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Téléphone (optionnel)</Label>
                <Input
                  id="customerPhone"
                  placeholder="06 12 34 56 78"
                  value={newTransaction.customer.phone}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    customer: { ...prev.customer, phone: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Sélection des produits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {availableProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#b70f23]">
                          {product.price.toFixed(2)}€
                        </span>
                        <span className="text-sm text-gray-600">
                          TVA {product.vat}%
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-[#b70f23] hover:bg-[#70070e]"
                        onClick={() => addProductToTransaction(product)}
                      >
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Items */}
            {newTransaction.items.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Articles sélectionnés</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Article</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Quantité</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Prix unitaire</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">TVA</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newTransaction.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(item.name, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProductQuantity(item.name, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">{item.unitPrice.toFixed(2)}€</td>
                          <td className="px-4 py-3 text-right">{item.vat}%</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {(item.quantity * item.unitPrice).toFixed(2)}€
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeProductFromTransaction(item.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment and Total */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method */}
              <div>
                <Label>Mode de paiement</Label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    paymentMethod: e.target.value as any
                  }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="cash">Espèces</option>
                  <option value="card">Carte bancaire</option>
                  <option value="apple_pay">Apple Pay</option>
                  <option value="lydia">Lydia</option>
                  <option value="check">Chèque</option>
                  <option value="transfer">Virement</option>
                </select>

                <div className="mt-4">
                  <Label htmlFor="tips">Pourboire (€)</Label>
                  <Input
                    id="tips"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newTransaction.tips || ""}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev,
                      tips: parseFloat(e.target.value) || 0
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Transaction Summary */}
              <div>
                <h3 className="font-medium mb-4">Récapitulatif</h3>
                {newTransaction.items.length > 0 && (
                  <div className="space-y-3">
                    {(() => {
                      const totals = calculateTransactionTotals();
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Sous-total HT :</span>
                            <span>{totals.subtotal.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TVA :</span>
                            <span>{totals.vatAmount.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total TTC :</span>
                            <span className="font-medium">{totals.total.toFixed(2)}€</span>
                          </div>
                          {newTransaction.tips > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Pourboire :</span>
                              <span>+{newTransaction.tips.toFixed(2)}€</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold border-t pt-3">
                            <span>Total à payer :</span>
                            <span className="text-[#b70f23]">
                              {(totals.total + newTransaction.tips).toFixed(2)}€
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
                
                {newTransaction.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucun article sélectionné</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleCreateTransaction}
                className="bg-[#b70f23] hover:bg-[#70070e]"
                disabled={newTransaction.items.length === 0 || !newTransaction.customer.name.trim()}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Créer la transaction
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsNewTransactionModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="outline"
                onClick={() => setNewTransaction({
                  customer: { name: "", email: "", phone: "" },
                  items: [],
                  paymentMethod: 'cash',
                  cashier: "Utilisateur actuel",
                  tips: 0
                })}
                className="ml-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}