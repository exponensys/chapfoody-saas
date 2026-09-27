import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  RotateCcw, 
  Users, 
  Heart, 
  TrendingUp,
  Mail,
  Smartphone,
  Gift,
  Target,
  Plus,
  Edit,
  Eye,
  Play,
  Pause,
  Calendar,
  Clock,
  Euro,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface WinbackCampaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'mixed';
  status: 'active' | 'paused' | 'completed' | 'draft';
  trigger: WinbackTrigger;
  incentive: WinbackIncentive;
  targetSegment: string;
  customersTargeted: number;
  emailsSent: number;
  smsSent: number;
  opened: number;
  clicked: number;
  returned: number;
  revenue: number;
  cost: number;
  createdDate: string;
  lastRun?: string;
  nextRun?: string;
}

interface WinbackTrigger {
  inactivityDays: number;
  minPreviousOrders: number;
  minTotalSpent: number;
}

interface WinbackIncentive {
  type: 'discount_percentage' | 'discount_fixed' | 'free_delivery' | 'free_item' | 'points';
  value: number;
  description: string;
  validityDays: number;
}

interface InactiveCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  riskLevel: 'medium' | 'high' | 'critical';
  campaignsSent: number;
  lastCampaignDate?: string;
  preferredChannel: 'email' | 'sms' | 'both';
}

interface WinbackTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  incentiveType: string;
  usageCount: number;
  conversionRate: number;
}

const mockCampaigns: WinbackCampaign[] = [
  {
    id: '1',
    name: 'Clients 30 jours inactifs',
    description: 'Réactivation des clients inactifs depuis 30 jours avec 15% de réduction',
    type: 'email',
    status: 'active',
    trigger: {
      inactivityDays: 30,
      minPreviousOrders: 2,
      minTotalSpent: 50
    },
    incentive: {
      type: 'discount_percentage',
      value: 15,
      description: '15% de réduction sur votre prochaine commande',
      validityDays: 14
    },
    targetSegment: 'Clients à valeur moyenne',
    customersTargeted: 234,
    emailsSent: 234,
    smsSent: 0,
    opened: 145,
    clicked: 34,
    returned: 12,
    revenue: 890,
    cost: 23.40,
    createdDate: '2024-01-01',
    lastRun: '2024-01-14T09:00:00',
    nextRun: '2024-01-21T09:00:00'
  },
  {
    id: '2',
    name: 'Clients VIP 60 jours',
    description: 'Reconquête spéciale pour clients VIP inactifs depuis 60 jours',
    type: 'mixed',
    status: 'active',
    trigger: {
      inactivityDays: 60,
      minPreviousOrders: 5,
      minTotalSpent: 200
    },
    incentive: {
      type: 'free_delivery',
      value: 0,
      description: 'Livraison gratuite + dessert offert',
      validityDays: 21
    },
    targetSegment: 'Clients VIP',
    customersTargeted: 67,
    emailsSent: 67,
    smsSent: 67,
    opened: 58,
    clicked: 23,
    returned: 8,
    revenue: 650,
    cost: 13.40,
    createdDate: '2024-01-01',
    lastRun: '2024-01-12T10:00:00',
    nextRun: '2024-01-26T10:00:00'
  },
  {
    id: '3',
    name: 'Clients perdus 90 jours',
    description: 'Dernière chance pour les clients perdus depuis 90 jours',
    type: 'sms',
    status: 'paused',
    trigger: {
      inactivityDays: 90,
      minPreviousOrders: 1,
      minTotalSpent: 25
    },
    incentive: {
      type: 'discount_fixed',
      value: 10,
      description: '10€ offerts sur votre retour',
      validityDays: 30
    },
    targetSegment: 'Clients perdus',
    customersTargeted: 189,
    emailsSent: 0,
    smsSent: 189,
    opened: 0,
    clicked: 45,
    returned: 6,
    revenue: 180,
    cost: 18.90,
    createdDate: '2024-01-01',
    lastRun: '2024-01-08T14:00:00'
  }
];

const mockInactiveCustomers: InactiveCustomer[] = [
  {
    id: '1',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 55 44 33 22',
    lastOrderDate: '2023-12-15',
    daysSinceLastOrder: 30,
    totalOrders: 8,
    totalSpent: 245,
    averageOrderValue: 30.60,
    riskLevel: 'medium',
    campaignsSent: 1,
    lastCampaignDate: '2024-01-10',
    preferredChannel: 'email'
  },
  {
    id: '2',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 6 77 88 99 00',
    lastOrderDate: '2023-11-20',
    daysSinceLastOrder: 56,
    totalOrders: 15,
    totalSpent: 890,
    averageOrderValue: 59.30,
    riskLevel: 'high',
    campaignsSent: 2,
    lastCampaignDate: '2024-01-05',
    preferredChannel: 'both'
  },
  {
    id: '3',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    lastOrderDate: '2023-10-01',
    daysSinceLastOrder: 105,
    totalOrders: 23,
    totalSpent: 1240,
    averageOrderValue: 53.90,
    riskLevel: 'critical',
    campaignsSent: 3,
    lastCampaignDate: '2024-01-01',
    preferredChannel: 'email'
  }
];

const mockTemplates: WinbackTemplate[] = [
  {
    id: '1',
    name: 'Email Nostalgie',
    type: 'email',
    subject: 'Vous nous manquez... 😢',
    content: 'Bonjour {prenom}, cela fait {jours} jours que nous ne vous avons pas vu...',
    incentiveType: 'percentage',
    usageCount: 45,
    conversionRate: 8.2
  },
  {
    id: '2',
    name: 'SMS Urgence',
    type: 'sms',
    content: '⏰ DERNIÈRE CHANCE ! {prenom}, {offre} expire dans 48h. Commandez: {lien}',
    incentiveType: 'fixed',
    usageCount: 23,
    conversionRate: 12.4
  },
  {
    id: '3',
    name: 'Email Offre Spéciale',
    type: 'email',
    subject: 'Offre exclusive pour votre retour !',
    content: 'Nous avons préparé quelque chose de spécial pour vous...',
    incentiveType: 'free_delivery',
    usageCount: 67,
    conversionRate: 15.7
  }
];

interface WinbackCampaignsViewProps {
  onBack?: () => void;
}

export function WinbackCampaignsView({ onBack }: WinbackCampaignsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<InactiveCustomer | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'both': return <Send className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const calculateROI = (revenue: number, cost: number) => {
    if (cost === 0) return 0;
    return (((revenue - cost) / cost) * 100).toFixed(0);
  };

  const calculateReturnRate = (returned: number, targeted: number) => {
    if (targeted === 0) return 0;
    return ((returned / targeted) * 100).toFixed(1);
  };

  const totalCustomersTargeted = mockCampaigns.reduce((sum, c) => sum + c.customersTargeted, 0);
  const totalReturned = mockCampaigns.reduce((sum, c) => sum + c.returned, 0);
  const totalRevenue = mockCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalCost = mockCampaigns.reduce((sum, c) => sum + c.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Campagnes de Reconquête</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Récupérez vos clients inactifs avec des offres ciblées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analyses
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouvelle campagne
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
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients ciblés</p>
                  <p className="text-2xl font-bold">{totalCustomersTargeted}</p>
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
                  <RotateCcw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de retour</p>
                  <p className="text-2xl font-bold">{calculateReturnRate(totalReturned, totalCustomersTargeted)}%</p>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenus générés</p>
                  <p className="text-2xl font-bold">€{totalRevenue}</p>
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold">+{calculateROI(totalRevenue, totalCost)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Modèles de reconquête performants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                    {template.type === 'email' ? <Mail className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-xs text-gray-600">{template.type.toUpperCase()}</p>
                  </div>
                </div>
                
                {template.subject && (
                  <p className="text-sm font-medium mb-2">{template.subject}</p>
                )}
                <p className="text-sm text-gray-600 mb-3">{template.content.substring(0, 80)}...</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600">{template.usageCount} utilisations</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {template.conversionRate}% conversion
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Campagnes de reconquête
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-lg flex items-center justify-center text-white">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <p className="text-xs text-gray-500">
                        {campaign.targetSegment} • Créé le {new Date(campaign.createdDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {campaign.status === 'active' && (
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Déclencheur:</span>
                      <p className="font-medium">{campaign.trigger.inactivityDays} jours d'inactivité</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Incitation:</span>
                      <p className="font-medium">{campaign.incentive.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Validité:</span>
                      <p className="font-medium">{campaign.incentive.validityDays} jours</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Canal:</span>
                      <p className="font-medium capitalize">{campaign.type}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{campaign.customersTargeted}</p>
                    <p className="text-xs text-gray-600">Ciblés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{campaign.emailsSent + campaign.smsSent}</p>
                    <p className="text-xs text-gray-600">Messages</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{campaign.opened}</p>
                    <p className="text-xs text-gray-600">Ouverts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{campaign.clicked}</p>
                    <p className="text-xs text-gray-600">Clics</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">{campaign.returned}</p>
                    <p className="text-xs text-gray-600">Retours ({calculateReturnRate(campaign.returned, campaign.customersTargeted)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-800">€{campaign.revenue}</p>
                    <p className="text-xs text-gray-600">Revenus (+{calculateROI(campaign.revenue, campaign.cost)}%)</p>
                  </div>
                </div>

                {/* Next Run */}
                {campaign.nextRun && campaign.status === 'active' && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Prochaine exécution : {new Date(campaign.nextRun).toLocaleDateString('fr-FR')} à {new Date(campaign.nextRun).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Customers at Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Clients à risque de perte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInactiveCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f4b71b] rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-xs text-gray-500">
                        Dernière commande : {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')} ({customer.daysSinceLastOrder} jours)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">€{customer.totalSpent}</p>
                      <p className="text-sm text-gray-600">{customer.totalOrders} commandes</p>
                      <p className="text-xs text-gray-500">Panier moyen: €{customer.averageOrderValue}</p>
                    </div>
                    <div className="text-center">
                      <Badge className={getRiskColor(customer.riskLevel)}>
                        {customer.riskLevel === 'medium' && 'Risque moyen'}
                        {customer.riskLevel === 'high' && 'Risque élevé'}
                        {customer.riskLevel === 'critical' && 'Risque critique'}
                      </Badge>
                      <div className="flex items-center gap-1 mt-1">
                        {getChannelIcon(customer.preferredChannel)}
                        <span className="text-xs text-gray-600">{customer.campaignsSent} campagnes</span>
                      </div>
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

      {/* Create Campaign Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer une campagne de reconquête</DialogTitle>
            <DialogDescription>
              Configurez votre campagne pour récupérer les clients inactifs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignName">Nom de la campagne</Label>
                <Input id="campaignName" placeholder="Ex: Clients 30 jours inactifs" />
              </div>
              <div>
                <Label htmlFor="campaignType">Type de campagne</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email seulement</SelectItem>
                    <SelectItem value="sms">SMS seulement</SelectItem>
                    <SelectItem value="mixed">Email + SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Critères de déclenchement</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="inactivityDays">Jours d'inactivité</Label>
                  <Input id="inactivityDays" type="number" placeholder="30" />
                </div>
                <div>
                  <Label htmlFor="minOrders">Commandes min.</Label>
                  <Input id="minOrders" type="number" placeholder="2" />
                </div>
                <div>
                  <Label htmlFor="minSpent">Dépensé min. (€)</Label>
                  <Input id="minSpent" type="number" placeholder="50" />
                </div>
              </div>
            </div>

            <div>
              <Label>Incitation</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="incentiveType">Type d'offre</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'offre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount_percentage">Réduction %</SelectItem>
                      <SelectItem value="discount_fixed">Réduction fixe</SelectItem>
                      <SelectItem value="free_delivery">Livraison gratuite</SelectItem>
                      <SelectItem value="free_item">Article gratuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="incentiveValue">Valeur</Label>
                  <Input id="incentiveValue" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="validityDays">Validité (jours)</Label>
                  <Input id="validityDays" type="number" placeholder="14" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description de l'offre</Label>
              <Input id="description" placeholder="15% de réduction sur votre prochaine commande" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Créer la campagne
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil client à risque - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Analyse détaillée et recommandations de reconquête
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Historique client</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Total dépensé:</span> €{selectedCustomer.totalSpent}</div>
                    <div><span className="text-gray-600">Nombre de commandes:</span> {selectedCustomer.totalOrders}</div>
                    <div><span className="text-gray-600">Panier moyen:</span> €{selectedCustomer.averageOrderValue}</div>
                    <div><span className="text-gray-600">Dernière commande:</span> {new Date(selectedCustomer.lastOrderDate).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Analyse de risque</h4>
                  <div className="space-y-3">
                    <div>
                      <Badge className={getRiskColor(selectedCustomer.riskLevel)}>
                        {selectedCustomer.riskLevel === 'medium' && 'Risque moyen'}
                        {selectedCustomer.riskLevel === 'high' && 'Risque élevé'}
                        {selectedCustomer.riskLevel === 'critical' && 'Risque critique'}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Inactivité:</span> {selectedCustomer.daysSinceLastOrder} jours
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Campagnes envoyées:</span> {selectedCustomer.campaignsSent}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Canal préféré:</span> {selectedCustomer.preferredChannel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3">Recommandations</h4>
                <div className="space-y-2">
                  {selectedCustomer.riskLevel === 'critical' && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">Action urgente recommandée - Offre personnalisée avec forte incitation</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Gift className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Offre suggérée: 20% de réduction basée sur son panier moyen</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Potentiel de récupération élevé (client à forte valeur)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCustomerModal(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer campagne personnalisée
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}