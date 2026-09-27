import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import { 
  Calculator, 
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Plus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Clock,
  Euro,
  Banknote,
  CreditCard,
  FileText,
  Printer,
  RefreshCw,
  BarChart3,
  Search,
  Filter,
  User,
  Shield,
  Receipt
} from "lucide-react";

interface CashClosure {
  id: string;
  date: string;
  cashier: string;
  openingTime: string;
  closingTime: string;
  status: 'completed' | 'pending' | 'error' | 'validated';
  cash: {
    expected: number;
    counted: number;
    difference: number;
  };
  cards: {
    expected: number;
    processed: number;
    commission: number;
  };
  checks: {
    count: number;
    amount: number;
  };
  digital: {
    amount: number;
    transactions: number;
  };
  total: {
    expected: number;
    actual: number;
    difference: number;
  };
  transactions: {
    count: number;
    cancelled: number;
    refunded: number;
  };
  notes?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export function CashClosureView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [isNewClosureModalOpen, setIsNewClosureModalOpen] = useState(false);
  const [selectedClosure, setSelectedClosure] = useState<CashClosure | null>(null);
  const [countedAmounts, setCountedAmounts] = useState({
    bills500: 0, bills200: 0, bills100: 0, bills50: 0, bills20: 0, bills10: 0, bills5: 0,
    coins2: 0, coins1: 0, coins050: 0, coins020: 0, coins010: 0, coins005: 0, coins002: 0, coins001: 0
  });

  // Données mockées des clôtures de caisse
  const [closures] = useState<CashClosure[]>([
    {
      id: "1",
      date: "2025-09-13",
      cashier: "Sophie Martin",
      openingTime: "08:00",
      closingTime: "20:00",
      status: "completed",
      cash: { expected: 450.75, counted: 447.50, difference: -3.25 },
      cards: { expected: 1250.80, processed: 1250.80, commission: 17.51 },
      checks: { count: 3, amount: 124.60 },
      digital: { amount: 289.30, transactions: 15 },
      total: { expected: 2115.45, actual: 2112.20, difference: -3.25 },
      transactions: { count: 87, cancelled: 2, refunded: 1 },
      notes: "Petite différence due à un arrondi de pourboire.",
      validatedBy: "Marc Dubois",
      validatedAt: "2025-09-13T20:15:00"
    },
    {
      id: "2",
      date: "2025-09-12", 
      cashier: "Marc Dubois",
      openingTime: "08:00",
      closingTime: "20:00",
      status: "validated",
      cash: { expected: 523.40, counted: 523.40, difference: 0 },
      cards: { expected: 1456.20, processed: 1456.20, commission: 20.39 },
      checks: { count: 1, amount: 45.80 },
      digital: { amount: 234.70, transactions: 12 },
      total: { expected: 2260.10, actual: 2260.10, difference: 0 },
      transactions: { count: 94, cancelled: 1, refunded: 0 },
      validatedBy: "Sophie Martin",
      validatedAt: "2025-09-12T20:10:00"
    },
    {
      id: "3",
      date: "2025-09-11",
      cashier: "Julie Lecomte", 
      openingTime: "08:00",
      closingTime: "20:00",
      status: "error",
      cash: { expected: 389.60, counted: 375.20, difference: -14.40 },
      cards: { expected: 967.80, processed: 967.80, commission: 13.55 },
      checks: { count: 2, amount: 78.90 },
      digital: { amount: 167.45, transactions: 8 },
      total: { expected: 1603.75, actual: 1589.35, difference: -14.40 },
      transactions: { count: 73, cancelled: 3, refunded: 2 },
      notes: "Écart important sur les espèces à vérifier. Possible oubli de saisie ou erreur de comptage."
    },
    {
      id: "4",
      date: "2025-09-10",
      cashier: "Ahmed Hassan",
      openingTime: "08:00", 
      closingTime: "20:00",
      status: "completed",
      cash: { expected: 412.90, counted: 415.30, difference: +2.40 },
      cards: { expected: 1123.45, processed: 1123.45, commission: 15.73 },
      checks: { count: 0, amount: 0 },
      digital: { amount: 198.75, transactions: 11 },
      total: { expected: 1735.10, actual: 1737.50, difference: +2.40 },
      transactions: { count: 81, cancelled: 1, refunded: 1 },
      notes: "Excédent probablement dû à un pourboire non saisi.",
      validatedBy: "Sophie Martin", 
      validatedAt: "2025-09-10T20:05:00"
    }
  ]);

  const filteredClosures = closures.filter(closure => {
    const matchesSearch = 
      closure.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      closure.date.includes(searchTerm) ||
      closure.id.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || closure.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'validated': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'validated': return 'Validée';
      case 'error': return 'Erreur';
      case 'pending': return 'En cours';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'validated': return <Shield className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (closure: CashClosure) => {
    setSelectedClosure(closure);
    setIsClosureModalOpen(true);
  };

  const handleValidateClosure = (closure: CashClosure) => {
    toast.success(`Clôture du ${closure.date} validée par le responsable`);
  };

  const handlePrintReport = (closure: CashClosure) => {
    toast.success(`Rapport de clôture ${closure.id} envoyé à l'impression`);
  };

  const handleExportClosure = (closure: CashClosure) => {
    toast.success(`Données de clôture ${closure.id} exportées en comptabilité`);
  };

  const calculateCashTotal = () => {
    const { bills500, bills200, bills100, bills50, bills20, bills10, bills5,
            coins2, coins1, coins050, coins020, coins010, coins005, coins002, coins001 } = countedAmounts;
    
    return (bills500 * 500) + (bills200 * 200) + (bills100 * 100) + (bills50 * 50) + 
           (bills20 * 20) + (bills10 * 10) + (bills5 * 5) + (coins2 * 2) + 
           (coins1 * 1) + (coins050 * 0.5) + (coins020 * 0.2) + (coins010 * 0.1) + 
           (coins005 * 0.05) + (coins002 * 0.02) + (coins001 * 0.01);
  };

  const handleStartNewClosure = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingClosure = closures.find(c => c.date === today);
    
    if (existingClosure) {
      toast.error("Une clôture a déjà été effectuée aujourd'hui");
      return;
    }
    
    setIsNewClosureModalOpen(true);
  };

  const handleSubmitNewClosure = () => {
    const cashTotal = calculateCashTotal();
    toast.success(`Nouvelle clôture de caisse effectuée. Total espèces comptées : ${cashTotal.toFixed(2)}€`);
    setIsNewClosureModalOpen(false);
    setCountedAmounts({
      bills500: 0, bills200: 0, bills100: 0, bills50: 0, bills20: 0, bills10: 0, bills5: 0,
      coins2: 0, coins1: 0, coins050: 0, coins020: 0, coins010: 0, coins005: 0, coins002: 0, coins001: 0
    });
  };

  const getStats = () => {
    const totalDifference = filteredClosures.reduce((sum, c) => sum + c.total.difference, 0);
    const errorCount = filteredClosures.filter(c => c.status === 'error').length;
    const avgDaily = filteredClosures.length > 0 ? 
      filteredClosures.reduce((sum, c) => sum + c.total.actual, 0) / filteredClosures.length : 0;
    
    return {
      totalClosures: filteredClosures.length,
      errorCount,
      totalDifference,
      avgDaily,
      pendingValidation: filteredClosures.filter(c => c.status === 'completed').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clôtures de caisse</h1>
            <p className="text-gray-600">Gestion et validation des clôtures quotidiennes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter période
          </Button>
          <Button 
            className="bg-[#b70f23] hover:bg-[#70070e] gap-2"
            onClick={handleStartNewClosure}
          >
            <Plus className="w-4 h-4" />
            Nouvelle clôture
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clôtures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClosures}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En erreur</p>
                <p className="text-2xl font-bold text-red-600">{stats.errorCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Écart total</p>
                <p className={`text-2xl font-bold ${stats.totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalDifference >= 0 ? '+' : ''}{stats.totalDifference.toFixed(2)}€
                </p>
              </div>
              {stats.totalDifference >= 0 ? 
                <TrendingUp className="w-8 h-8 text-green-500" /> : 
                <TrendingDown className="w-8 h-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CA moyen/jour</p>
                <p className="text-2xl font-bold text-[#b70f23]">{stats.avgDaily.toFixed(0)}€</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#b70f23]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">À valider</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingValidation}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
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
                placeholder="Rechercher par date, caissier..."
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
                <option value="completed">Terminées</option>
                <option value="validated">Validées</option>
                <option value="error">En erreur</option>
                <option value="pending">En cours</option>
              </select>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closures List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des clôtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClosures.map((closure) => (
              <div key={closure.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b70f23] to-[#70070e] flex items-center justify-center text-white">
                      <Calculator className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">Clôture {closure.date}</h3>
                        <Badge className={getStatusColor(closure.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(closure.status)}
                            {getStatusLabel(closure.status)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{closure.cashier}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{closure.openingTime} - {closure.closingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Receipt className="w-4 h-4" />
                          <span>{closure.transactions.count} transactions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Payment Methods Breakdown */}
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <Banknote className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Espèces :</span>
                        <span className="font-medium">{closure.cash.counted.toFixed(2)}€</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">Cartes :</span>
                        <span className="font-medium">{closure.cards.processed.toFixed(2)}€</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">Digital :</span>
                        <span className="font-medium">{closure.digital.amount.toFixed(2)}€</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#b70f23]">{closure.total.actual.toFixed(2)}€</p>
                      <p className={`text-sm ${closure.total.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Écart : {closure.total.difference >= 0 ? '+' : ''}{closure.total.difference.toFixed(2)}€
                      </p>
                      {closure.validatedBy && (
                        <p className="text-xs text-gray-500">
                          Validé par {closure.validatedBy}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(closure)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrintReport(closure)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExportClosure(closure)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {closure.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleValidateClosure(closure)}
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {closure.status === 'error' && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Écart significatif détecté :</strong> {Math.abs(closure.total.difference).toFixed(2)}€
                      {closure.notes && (
                        <span className="block mt-1 text-sm">{closure.notes}</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
            
            {filteredClosures.length === 0 && (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune clôture trouvée</h3>
                <p className="text-gray-500">Aucune clôture ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Closure Detail Modal */}
      <Dialog open={isClosureModalOpen} onOpenChange={setIsClosureModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails clôture du {selectedClosure?.date}</DialogTitle>
            <DialogDescription>
              Rapport complet de la clôture de caisse
            </DialogDescription>
          </DialogHeader>
          
          {selectedClosure && (
            <div className="space-y-6">
              {/* General Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Caissier</label>
                  <p>{selectedClosure.cashier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Horaires</label>
                  <p>{selectedClosure.openingTime} - {selectedClosure.closingTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <Badge className={getStatusColor(selectedClosure.status)}>
                    {getStatusLabel(selectedClosure.status)}
                  </Badge>
                </div>
              </div>

              {/* Payment Methods Details */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Banknote className="w-5 h-5" />
                      Espèces
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendu :</span>
                      <span>{selectedClosure.cash.expected.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compté :</span>
                      <span className="font-medium">{selectedClosure.cash.counted.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Écart :</span>
                      <span className={`font-bold ${selectedClosure.cash.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedClosure.cash.difference >= 0 ? '+' : ''}{selectedClosure.cash.difference.toFixed(2)}€
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Cartes bancaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendu :</span>
                      <span>{selectedClosure.cards.expected.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Traité :</span>
                      <span className="font-medium">{selectedClosure.cards.processed.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Commission :</span>
                      <span className="text-red-600">-{selectedClosure.cards.commission.toFixed(2)}€</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Chèques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre :</span>
                      <span>{selectedClosure.checks.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant :</span>
                      <span className="font-medium">{selectedClosure.checks.amount.toFixed(2)}€</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Paiements digitaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions :</span>
                      <span>{selectedClosure.digital.transactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant :</span>
                      <span className="font-medium">{selectedClosure.digital.amount.toFixed(2)}€</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Total Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Total attendu :</span>
                    <span className="font-medium">{selectedClosure.total.expected.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Total réel :</span>
                    <span className="font-medium">{selectedClosure.total.actual.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Écart total :</span>
                    <span className={selectedClosure.total.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {selectedClosure.total.difference >= 0 ? '+' : ''}{selectedClosure.total.difference.toFixed(2)}€
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedClosure.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Observations</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedClosure.notes}</p>
                  </div>
                </div>
              )}

              {/* Validation Info */}
              {selectedClosure.validatedBy && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Clôture validée</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Validé par {selectedClosure.validatedBy} le {new Date(selectedClosure.validatedAt!).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handlePrintReport(selectedClosure)}
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleExportClosure(selectedClosure)}
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </Button>
                {selectedClosure.status === 'completed' && (
                  <Button 
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => handleValidateClosure(selectedClosure)}
                  >
                    <Shield className="w-4 h-4" />
                    Valider la clôture
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Closure Modal */}
      <Dialog open={isNewClosureModalOpen} onOpenChange={setIsNewClosureModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle clôture de caisse</DialogTitle>
            <DialogDescription>
              Effectuez le comptage des espèces et validez la clôture quotidienne
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Money Counting */}
            <div>
              <h3 className="text-lg font-medium mb-4">Comptage des espèces</h3>
              
              {/* Bills */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-green-700">Billets</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: 500, label: "500€" },
                    { value: 200, label: "200€" },
                    { value: 100, label: "100€" },
                    { value: 50, label: "50€" },
                    { value: 20, label: "20€" },
                    { value: 10, label: "10€" },
                    { value: 5, label: "5€" }
                  ].map(bill => (
                    <div key={bill.value} className="space-y-2">
                      <Label>{bill.label}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={countedAmounts[`bills${bill.value}` as keyof typeof countedAmounts]}
                        onChange={(e) => setCountedAmounts(prev => ({
                          ...prev,
                          [`bills${bill.value}`]: parseInt(e.target.value) || 0
                        }))}
                        className="text-center"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        = {((countedAmounts[`bills${bill.value}` as keyof typeof countedAmounts] as number) * bill.value).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coins */}
              <div>
                <h4 className="font-medium mb-3 text-orange-700">Pièces</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: 2, label: "2€", key: "coins2" },
                    { value: 1, label: "1€", key: "coins1" },
                    { value: 0.5, label: "50c", key: "coins050" },
                    { value: 0.2, label: "20c", key: "coins020" },
                    { value: 0.1, label: "10c", key: "coins010" },
                    { value: 0.05, label: "5c", key: "coins005" },
                    { value: 0.02, label: "2c", key: "coins002" },
                    { value: 0.01, label: "1c", key: "coins001" }
                  ].map(coin => (
                    <div key={coin.key} className="space-y-2">
                      <Label>{coin.label}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={countedAmounts[coin.key as keyof typeof countedAmounts]}
                        onChange={(e) => setCountedAmounts(prev => ({
                          ...prev,
                          [coin.key]: parseInt(e.target.value) || 0
                        }))}
                        className="text-center"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        = {((countedAmounts[coin.key as keyof typeof countedAmounts] as number) * coin.value).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-[#b70f23] bg-opacity-10 border border-[#b70f23] rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total espèces comptées :</span>
                  <span className="text-[#b70f23]">{calculateCashTotal().toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Expected vs Counted */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Attendu (système)</p>
                  <p className="text-xl font-bold text-blue-600">487.30€</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Compté (caisse)</p>
                  <p className="text-xl font-bold text-green-600">{calculateCashTotal().toFixed(2)}€</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Écart</p>
                  <p className={`text-xl font-bold ${(calculateCashTotal() - 487.30) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(calculateCashTotal() - 487.30) >= 0 ? '+' : ''}{(calculateCashTotal() - 487.30).toFixed(2)}€
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div>
              <Label>Observations (optionnel)</Label>
              <Textarea 
                placeholder="Commentaires sur les écarts, incidents, remarques..."
                className="mt-2"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmitNewClosure}
                className="bg-[#b70f23] hover:bg-[#70070e]"
                disabled={calculateCashTotal() === 0}
              >
                Valider la clôture
              </Button>
              <Button variant="outline" onClick={() => setIsNewClosureModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="outline" className="ml-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser comptage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}