import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { 
  Banknote, 
  CreditCard,
  Smartphone,
  FileText,
  ArrowUpDown,
  Settings,
  TrendingUp,
  Percent,
  Clock,
  Euro,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash,
  Eye,
  BarChart3,
  Wifi,
  Shield,
  Users,
  Calendar
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'digital' | 'check' | 'transfer';
  icon: any;
  enabled: boolean;
  fees: {
    fixed: number;
    percentage: number;
  };
  processingTime: string;
  dailyLimit: number;
  monthlyVolume: number;
  transactionCount: number;
  avgAmount: number;
  description: string;
  isPopular?: boolean;
  requiresSetup?: boolean;
  setupStatus: 'configured' | 'pending' | 'error' | 'not_configured';
  features: string[];
}

export function PaymentMethodsView() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);

  // Données mockées des modes de paiement
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      name: "Espèces",
      type: "cash",
      icon: Banknote,
      enabled: true,
      fees: { fixed: 0, percentage: 0 },
      processingTime: "Immédiat",
      dailyLimit: 1000,
      monthlyVolume: 3420.50,
      transactionCount: 45,
      avgAmount: 23.50,
      description: "Paiement traditionnel en liquide. Aucun frais, encaissement immédiat.",
      setupStatus: "configured",
      features: ["Gratuit", "Immédiat", "Anonyme", "Pas de trace électronique"]
    },
    {
      id: "2", 
      name: "Carte Bancaire",
      type: "card",
      icon: CreditCard,
      enabled: true,
      fees: { fixed: 0.10, percentage: 1.4 },
      processingTime: "48h",
      dailyLimit: 5000,
      monthlyVolume: 12450.80,
      transactionCount: 158,
      avgAmount: 78.80,
      description: "Cartes Visa, Mastercard, American Express. Sécurisé avec authentification PIN.",
      isPopular: true,
      setupStatus: "configured",
      features: ["Sécurisé", "Sans contact", "3D Secure", "Remboursement garanti"]
    },
    {
      id: "3",
      name: "Apple Pay",
      type: "digital", 
      icon: Smartphone,
      enabled: true,
      fees: { fixed: 0, percentage: 1.2 },
      processingTime: "Immédiat",
      dailyLimit: 2000,
      monthlyVolume: 2890.30,
      transactionCount: 67,
      avgAmount: 43.14,
      description: "Paiement mobile sécurisé Apple. Biométrie et chiffrement de bout en bout.",
      setupStatus: "configured",
      features: ["Biométrique", "Rapide", "Sécurisé", "Pas de carte physique"]
    },
    {
      id: "4",
      name: "Google Pay", 
      type: "digital",
      icon: Smartphone,
      enabled: false,
      fees: { fixed: 0, percentage: 1.3 },
      processingTime: "Immédiat",
      dailyLimit: 2000,
      monthlyVolume: 0,
      transactionCount: 0,
      avgAmount: 0,
      description: "Solution de paiement mobile Google. Compatible Android et empreinte digitale.",
      requiresSetup: true,
      setupStatus: "not_configured",
      features: ["Android", "Empreinte", "NFC", "Multi-comptes"]
    },
    {
      id: "5",
      name: "Lydia",
      type: "digital",
      icon: Smartphone,
      enabled: true,
      fees: { fixed: 0, percentage: 1.7 },
      processingTime: "Immédiat",
      dailyLimit: 1500,
      monthlyVolume: 1234.60,
      transactionCount: 28,
      avgAmount: 44.09,
      description: "Application française de paiement mobile. QR Code et paiement entre amis.",
      setupStatus: "configured",
      features: ["QR Code", "Français", "Peer-to-peer", "Portefeuille digital"]
    },
    {
      id: "6",
      name: "Chèques",
      type: "check",
      icon: FileText,
      enabled: true,
      fees: { fixed: 0, percentage: 0 },
      processingTime: "3-5 jours",
      dailyLimit: 3000,
      monthlyVolume: 890.40,
      transactionCount: 12,
      avgAmount: 74.20,
      description: "Paiement par chèque traditionnel. Vérification et encaissement différé.",
      setupStatus: "configured",
      features: ["Gratuit", "Grosse somme", "Traçable", "Délai encaissement"]
    },
    {
      id: "7",
      name: "Virement",
      type: "transfer",
      icon: ArrowUpDown,
      enabled: false,
      fees: { fixed: 0.50, percentage: 0 },
      processingTime: "24-48h",
      dailyLimit: 10000,
      monthlyVolume: 0,
      transactionCount: 0,
      avgAmount: 0,
      description: "Virement bancaire SEPA. Idéal pour les grosses commandes professionnelles.",
      requiresSetup: true,
      setupStatus: "pending",
      features: ["B2B", "Grosse somme", "SEPA", "Traçabilité bancaire"]
    },
    {
      id: "8",
      name: "PayPal",
      type: "digital",
      icon: Smartphone,
      enabled: false,
      fees: { fixed: 0.35, percentage: 2.9 },
      processingTime: "Immédiat",
      dailyLimit: 3000,
      monthlyVolume: 0,
      transactionCount: 0,
      avgAmount: 0,
      description: "Plateforme de paiement en ligne internationale. Protection acheteur et vendeur.",
      requiresSetup: true,
      setupStatus: "not_configured",
      features: ["International", "Protection", "E-commerce", "Multi-devises"]
    }
  ]);

  const handleToggleMethod = (methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === methodId 
          ? { ...method, enabled: !method.enabled }
          : method
      )
    );
    
    const method = paymentMethods.find(m => m.id === methodId);
    if (method) {
      toast.success(`${method.name} ${method.enabled ? 'désactivé' : 'activé'} avec succès`);
    }
  };

  const handleConfigureMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfiguration = () => {
    if (selectedMethod) {
      toast.success(`Configuration de ${selectedMethod.name} sauvegardée`);
      setIsConfigModalOpen(false);
      setSelectedMethod(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cash': return <Banknote className="w-5 h-5" />;
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'digital': return <Smartphone className="w-5 h-5" />;
      case 'check': return <FileText className="w-5 h-5" />;
      case 'transfer': return <ArrowUpDown className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cash': return 'Espèces';
      case 'card': return 'Cartes';
      case 'digital': return 'Digital';
      case 'check': return 'Chèques';
      case 'transfer': return 'Virements';
      default: return 'Autre';
    }
  };

  const getSetupStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'not_configured': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSetupStatusLabel = (status: string) => {
    switch (status) {
      case 'configured': return 'Configuré';
      case 'pending': return 'En attente';
      case 'error': return 'Erreur';
      case 'not_configured': return 'À configurer';
      default: return 'Inconnu';
    }
  };

  const getSetupStatusIcon = (status: string) => {
    switch (status) {
      case 'configured': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'not_configured': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStats = () => {
    const enabled = paymentMethods.filter(m => m.enabled);
    const totalVolume = paymentMethods.reduce((sum, m) => sum + m.monthlyVolume, 0);
    const totalTransactions = paymentMethods.reduce((sum, m) => sum + m.transactionCount, 0);
    const avgTicket = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
    
    return {
      enabledMethods: enabled.length,
      totalMethods: paymentMethods.length,
      monthlyVolume: totalVolume,
      transactionCount: totalTransactions,
      avgTicket: avgTicket
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
            <h1 className="text-2xl font-semibold text-gray-900">Modes de paiement</h1>
            <p className="text-gray-600">Configuration et gestion des moyens d'encaissement</p>
          </div>
        </div>
        <Dialog open={isAddMethodModalOpen} onOpenChange={setIsAddMethodModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
              <Plus className="w-4 h-4" />
              Ajouter méthode
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un mode de paiement</DialogTitle>
              <DialogDescription>
                Configurez un nouveau moyen d'encaissement pour votre établissement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Fonctionnalité disponible prochainement. Contactez le support pour ajouter des modes de paiement personnalisés.
              </p>
              <Button variant="outline" className="w-full">
                Contacter le support
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Méthodes actives</p>
                <p className="text-2xl font-bold text-green-600">{stats.enabledMethods}/{stats.totalMethods}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume mensuel</p>
                <p className="text-2xl font-bold text-[#b70f23]">{stats.monthlyVolume.toFixed(0)}€</p>
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
                <p className="text-2xl font-bold text-blue-600">{stats.transactionCount}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Frais moyens</p>
                <p className="text-2xl font-bold text-purple-600">1.3%</p>
              </div>
              <Percent className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={`relative ${method.isPopular ? 'ring-2 ring-[#b70f23]' : ''}`}>
            {method.isPopular && (
              <div className="absolute -top-2 left-4">
                <Badge className="bg-[#b70f23] text-white">Populaire</Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    method.enabled 
                      ? 'bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getTypeIcon(method.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {getTypeLabel(method.type)}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={method.enabled}
                  onCheckedChange={() => handleToggleMethod(method.id)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Setup Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">État :</span>
                <Badge className={getSetupStatusColor(method.setupStatus)}>
                  <div className="flex items-center gap-1">
                    {getSetupStatusIcon(method.setupStatus)}
                    {getSetupStatusLabel(method.setupStatus)}
                  </div>
                </Badge>
              </div>

              {/* Fees */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais :</span>
                  <span className="font-medium">
                    {method.fees.fixed > 0 && `${method.fees.fixed}€ + `}
                    {method.fees.percentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Délai :</span>
                  <span className="font-medium">{method.processingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Limite/jour :</span>
                  <span className="font-medium">{method.dailyLimit.toLocaleString()}€</span>
                </div>
              </div>

              {/* Monthly Stats */}
              {method.enabled && method.monthlyVolume > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Volume mois :</span>
                    <span className="font-bold text-[#b70f23]">{method.monthlyVolume.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transactions :</span>
                    <span className="font-medium">{method.transactionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ticket moyen :</span>
                    <span className="font-medium">{method.avgAmount.toFixed(2)}€</span>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {method.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {method.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{method.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleConfigureMethod(method)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Configurer
                </Button>
                {method.enabled && method.monthlyVolume > 0 && (
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {method.requiresSetup && method.setupStatus === 'not_configured' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Configuration requise pour activer ce mode
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuration {selectedMethod?.name}</DialogTitle>
            <DialogDescription>
              Paramétrez les options et limites pour ce mode de paiement
            </DialogDescription>
          </DialogHeader>
          
          {selectedMethod && (
            <div className="space-y-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">Paramètres généraux</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Limite quotidienne (€)</Label>
                    <Input type="number" defaultValue={selectedMethod.dailyLimit} />
                  </div>
                  <div>
                    <Label>Montant minimum (€)</Label>
                    <Input type="number" defaultValue="1.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Frais fixe (€)</Label>
                    <Input type="number" step="0.01" defaultValue={selectedMethod.fees.fixed} />
                  </div>
                  <div>
                    <Label>Frais pourcentage (%)</Label>
                    <Input type="number" step="0.1" defaultValue={selectedMethod.fees.percentage} />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">Paramètres avancés</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Accepter les pourboires</Label>
                      <p className="text-sm text-gray-500">Permettre l'ajout de pourboires</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Remboursements automatiques</Label>
                      <p className="text-sm text-gray-500">Activer les remboursements directs</p>
                    </div>
                    <Switch defaultChecked={selectedMethod.type !== 'cash'} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications en temps réel</Label>
                      <p className="text-sm text-gray-500">Alertes pour chaque transaction</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description personnalisée</Label>
                <Textarea 
                  placeholder="Description affichée aux clients..."
                  defaultValue={selectedMethod.description}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveConfiguration} className="bg-[#b70f23] hover:bg-[#70070e]">
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
                  Annuler
                </Button>
                {selectedMethod.setupStatus === 'not_configured' && (
                  <Button variant="outline" className="ml-auto">
                    Guide de configuration
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}