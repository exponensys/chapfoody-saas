import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  Filter, 
  Users, 
  Eye, 
  Target,
  TrendingUp,
  BarChart3,
  Plus,
  Edit,
  Star,
  Crown,
  Heart,
  ShoppingCart,
  Calendar,
  Euro,
  Clock,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customerCount: number;
  averageOrderValue: number;
  totalRevenue: number;
  frequency: number;
  lastPurchaseAvg: number; // jours
  conversionRate: number;
  color: string;
  createdDate: string;
  isActive: boolean;
}

interface SegmentCriteria {
  totalSpent?: { min?: number; max?: number };
  orderCount?: { min?: number; max?: number };
  lastPurchase?: { days: number; operator: 'less_than' | 'more_than' };
  frequency?: { visits: number; period: 'month' | 'year' };
  location?: { radius: number; center: string };
  demographics?: { ageMin?: number; ageMax?: number; gender?: string };
  behavior?: { type: 'frequent' | 'seasonal' | 'weekend' | 'evening' };
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  segment: string;
  totalSpent: number;
  orderCount: number;
  lastPurchase: string;
  averageOrderValue: number;
  frequencyScore: number;
  recencyScore: number;
  monetaryScore: number;
  predictedLifetimeValue: number;
  churnRisk: 'low' | 'medium' | 'high';
}

const mockSegments: CustomerSegment[] = [
  {
    id: '1',
    name: 'Champions',
    description: 'Clients les plus fidèles et rentables',
    criteria: {
      totalSpent: { min: 500 },
      orderCount: { min: 10 },
      lastPurchase: { days: 30, operator: 'less_than' }
    },
    customerCount: 45,
    averageOrderValue: 35.50,
    totalRevenue: 18500,
    frequency: 8.2,
    lastPurchaseAvg: 12,
    conversionRate: 85,
    color: 'bg-purple-100 text-purple-800',
    createdDate: '2024-01-01',
    isActive: true
  },
  {
    id: '2',
    name: 'Clients Fidèles',
    description: 'Clients réguliers avec bon potentiel',
    criteria: {
      totalSpent: { min: 200, max: 500 },
      orderCount: { min: 5 },
      lastPurchase: { days: 60, operator: 'less_than' }
    },
    customerCount: 123,
    averageOrderValue: 28.30,
    totalRevenue: 15600,
    frequency: 5.4,
    lastPurchaseAvg: 25,
    conversionRate: 72,
    color: 'bg-green-100 text-green-800',
    createdDate: '2024-01-01',
    isActive: true
  },
  {
    id: '3',
    name: 'Clients Potentiels',
    description: 'Nouveaux clients à développer',
    criteria: {
      orderCount: { min: 2, max: 5 },
      lastPurchase: { days: 90, operator: 'less_than' }
    },
    customerCount: 89,
    averageOrderValue: 22.10,
    totalRevenue: 8900,
    frequency: 2.8,
    lastPurchaseAvg: 45,
    conversionRate: 45,
    color: 'bg-blue-100 text-blue-800',
    createdDate: '2024-01-01',
    isActive: true
  },
  {
    id: '4',
    name: 'Clients à Risque',
    description: 'Clients en perte de vitesse',
    criteria: {
      totalSpent: { min: 100 },
      lastPurchase: { days: 90, operator: 'more_than' }
    },
    customerCount: 67,
    averageOrderValue: 31.20,
    totalRevenue: 4200,
    frequency: 1.2,
    lastPurchaseAvg: 145,
    conversionRate: 28,
    color: 'bg-yellow-100 text-yellow-800',
    createdDate: '2024-01-01',
    isActive: true
  },
  {
    id: '5',
    name: 'Clients Perdus',
    description: 'Clients inactifs depuis longtemps',
    criteria: {
      lastPurchase: { days: 180, operator: 'more_than' }
    },
    customerCount: 156,
    averageOrderValue: 26.80,
    totalRevenue: 1200,
    frequency: 0.3,
    lastPurchaseAvg: 220,
    conversionRate: 12,
    color: 'bg-red-100 text-red-800',
    createdDate: '2024-01-01',
    isActive: true
  }
];

const mockCustomers: CustomerProfile[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    segment: 'Champions',
    totalSpent: 890,
    orderCount: 23,
    lastPurchase: '2024-01-14',
    averageOrderValue: 38.70,
    frequencyScore: 9,
    recencyScore: 10,
    monetaryScore: 8,
    predictedLifetimeValue: 1200,
    churnRisk: 'low'
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    segment: 'Clients Fidèles',
    totalSpent: 345,
    orderCount: 12,
    lastPurchase: '2024-01-12',
    averageOrderValue: 28.75,
    frequencyScore: 6,
    recencyScore: 8,
    monetaryScore: 5,
    predictedLifetimeValue: 450,
    churnRisk: 'low'
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    segment: 'Clients à Risque',
    totalSpent: 125,
    orderCount: 5,
    lastPurchase: '2023-10-15',
    averageOrderValue: 25.00,
    frequencyScore: 3,
    recencyScore: 2,
    monetaryScore: 3,
    predictedLifetimeValue: 80,
    churnRisk: 'high'
  }
];

interface CustomerSegmentationViewProps {
  onBack?: () => void;
}

export function CustomerSegmentationView({ onBack }: CustomerSegmentationViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalCustomers = mockSegments.reduce((sum, s) => sum + s.customerCount, 0);
  const totalRevenue = mockSegments.reduce((sum, s) => sum + s.totalRevenue, 0);
  const averageOrderValue = mockSegments.reduce((sum, s) => sum + (s.averageOrderValue * s.customerCount), 0) / totalCustomers;

  const filteredCustomers = selectedSegment === 'all' 
    ? mockCustomers 
    : mockCustomers.filter(c => c.segment.toLowerCase().includes(selectedSegment.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Segmentation Clients</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Analysez et segmentez vos clients automatiquement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analyses RFM
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Comportements
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau segment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total clients</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenus totaux</p>
                  <p className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Panier moyen</p>
                  <p className="text-2xl font-bold">€{averageOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Segments actifs</p>
                  <p className="text-2xl font-bold">{mockSegments.filter(s => s.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Segments Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Vue d'ensemble des segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSegments.map((segment) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{segment.name}</h4>
                  <Badge className={segment.color}>
                    {segment.customerCount}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Part de clientèle</span>
                    <span>{((segment.customerCount / totalCustomers) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(segment.customerCount / totalCustomers) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div>
                    <p className="text-gray-600">Panier moyen</p>
                    <p className="font-semibold">€{segment.averageOrderValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenus</p>
                    <p className="font-semibold">€{segment.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fréquence</p>
                    <p className="font-semibold">{segment.frequency}/mois</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversion</p>
                    <p className="font-semibold">{segment.conversionRate}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Analyse RFM des clients
            </CardTitle>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les segments</SelectItem>
                {mockSegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.name}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={mockSegments.find(s => s.name === customer.segment)?.color}>
                          {customer.segment}
                        </Badge>
                        <Badge className={getRiskColor(customer.churnRisk)}>
                          Risque {customer.churnRisk}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* RFM Scores */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Récence</p>
                      <p className={`text-xl font-bold ${getScoreColor(customer.recencyScore)}`}>
                        {customer.recencyScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Fréquence</p>
                      <p className={`text-xl font-bold ${getScoreColor(customer.frequencyScore)}`}>
                        {customer.frequencyScore}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Montant</p>
                      <p className={`text-xl font-bold ${getScoreColor(customer.monetaryScore)}`}>
                        {customer.monetaryScore}
                      </p>
                    </div>
                    
                    {/* Customer Metrics */}
                    <div className="text-right">
                      <p className="font-semibold">€{customer.totalSpent}</p>
                      <p className="text-sm text-gray-600">{customer.orderCount} commandes</p>
                      <p className="text-xs text-gray-500">
                        CLV: €{customer.predictedLifetimeValue}
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Segment Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau segment</DialogTitle>
            <DialogDescription>
              Définissez les critères pour segmenter automatiquement vos clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segmentName">Nom du segment</Label>
                <Input id="segmentName" placeholder="Ex: Clients Premium" />
              </div>
              <div>
                <Label htmlFor="segmentColor">Couleur</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purple">Violet</SelectItem>
                    <SelectItem value="green">Vert</SelectItem>
                    <SelectItem value="blue">Bleu</SelectItem>
                    <SelectItem value="yellow">Jaune</SelectItem>
                    <SelectItem value="red">Rouge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Critères de segmentation</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="minSpent">Montant dépensé min. (€)</Label>
                  <Input id="minSpent" type="number" placeholder="100" />
                </div>
                <div>
                  <Label htmlFor="minOrders">Nombre de commandes min.</Label>
                  <Input id="minOrders" type="number" placeholder="5" />
                </div>
                <div>
                  <Label htmlFor="lastPurchase">Dernière commande (jours)</Label>
                  <Input id="lastPurchase" type="number" placeholder="30" />
                </div>
                <div>
                  <Label htmlFor="frequency">Fréquence min./mois</Label>
                  <Input id="frequency" type="number" placeholder="2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Filter className="w-4 h-4 mr-2" />
                Créer le segment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil détaillé - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Analyse comportementale et prédictive du client
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* RFM Analysis */}
              <div>
                <h4 className="font-semibold mb-4">Analyse RFM (Récence, Fréquence, Montant)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedCustomer.recencyScore)}`}>
                      {selectedCustomer.recencyScore}/10
                    </div>
                    <p className="font-medium">Récence</p>
                    <p className="text-sm text-gray-600">
                      Dernière commande: {new Date(selectedCustomer.lastPurchase).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedCustomer.frequencyScore)}`}>
                      {selectedCustomer.frequencyScore}/10
                    </div>
                    <p className="font-medium">Fréquence</p>
                    <p className="text-sm text-gray-600">
                      {selectedCustomer.orderCount} commandes
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(selectedCustomer.monetaryScore)}`}>
                      {selectedCustomer.monetaryScore}/10
                    </div>
                    <p className="font-medium">Montant</p>
                    <p className="text-sm text-gray-600">
                      €{selectedCustomer.totalSpent} dépensés
                    </p>
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div>
                <h4 className="font-semibold mb-4">Prédictions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <h5 className="font-medium mb-2">Valeur vie client (CLV)</h5>
                    <p className="text-2xl font-bold text-green-600">€{selectedCustomer.predictedLifetimeValue}</p>
                    <p className="text-sm text-gray-600">Estimation sur 2 ans</p>
                  </div>
                  <div className="border rounded p-4">
                    <h5 className="font-medium mb-2">Risque d'attrition</h5>
                    <Badge className={getRiskColor(selectedCustomer.churnRisk)}>
                      {selectedCustomer.churnRisk === 'low' && 'Faible'}
                      {selectedCustomer.churnRisk === 'medium' && 'Moyen'}
                      {selectedCustomer.churnRisk === 'high' && 'Élevé'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Probabilité de partir dans les 90 jours
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCustomerModal(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Target className="w-4 h-4 mr-2" />
                  Cibler ce client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}