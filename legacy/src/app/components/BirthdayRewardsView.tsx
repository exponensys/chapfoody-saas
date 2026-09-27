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
  Calendar, 
  Gift, 
  Cake, 
  Heart,
  Mail,
  Smartphone,
  Crown,
  Star,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Send,
  BarChart3,
  Clock,
  Euro,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface BirthdayReward {
  id: string;
  name: string;
  description: string;
  type: 'discount_percentage' | 'discount_fixed' | 'free_item' | 'points' | 'upgrade' | 'combo';
  value: number;
  details: string;
  validityDays: number;
  minimumSpend?: number;
  isActive: boolean;
  customerSegment: 'all' | 'vip' | 'frequent' | 'new';
  deliveryMethod: 'email' | 'sms' | 'both' | 'in_app';
  advanceDays: number; // Jours avant l'anniversaire
  usageCount: number;
  redemptionRate: number;
  averageOrderValue: number;
  totalRevenue: number;
  createdDate: string;
}

interface BirthdayCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  daysUntilBirthday: number;
  segment: 'vip' | 'frequent' | 'regular' | 'new';
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  preferredChannel: 'email' | 'sms' | 'both';
  rewardsSent: number;
  rewardsUsed: number;
  lastBirthdayReward?: string;
}

interface BirthdayMessage {
  id: string;
  rewardId: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  usageCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

const mockRewards: BirthdayReward[] = [
  {
    id: '1',
    name: 'Anniversaire VIP',
    description: 'Cadeau spécial pour nos clients VIP',
    type: 'combo',
    value: 0,
    details: 'Dessert offert + 25% sur la commande + livraison gratuite',
    validityDays: 14,
    minimumSpend: 30,
    isActive: true,
    customerSegment: 'vip',
    deliveryMethod: 'both',
    advanceDays: 3,
    usageCount: 45,
    redemptionRate: 78.2,
    averageOrderValue: 52.30,
    totalRevenue: 2350,
    createdDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Anniversaire Standard',
    description: 'Récompense pour tous nos clients fidèles',
    type: 'discount_percentage',
    value: 15,
    details: '15% de réduction sur votre commande d\'anniversaire',
    validityDays: 7,
    minimumSpend: 20,
    isActive: true,
    customerSegment: 'all',
    deliveryMethod: 'email',
    advanceDays: 1,
    usageCount: 189,
    redemptionRate: 62.4,
    averageOrderValue: 28.90,
    totalRevenue: 3420,
    createdDate: '2024-01-01'
  },
  {
    id: '3',
    name: 'Premier Anniversaire',
    description: 'Cadeau spécial pour le premier anniversaire',
    type: 'free_item',
    value: 0,
    details: 'Petit gâteau d\'anniversaire offert',
    validityDays: 5,
    isActive: true,
    customerSegment: 'new',
    deliveryMethod: 'sms',
    advanceDays: 0,
    usageCount: 34,
    redemptionRate: 85.3,
    averageOrderValue: 22.10,
    totalRevenue: 750,
    createdDate: '2024-01-01'
  },
  {
    id: '4',
    name: 'Anniversaire Points',
    description: 'Points de fidélité bonus',
    type: 'points',
    value: 500,
    details: '500 points bonus + double points sur la commande',
    validityDays: 10,
    isActive: false,
    customerSegment: 'frequent',
    deliveryMethod: 'in_app',
    advanceDays: 2,
    usageCount: 67,
    redemptionRate: 55.2,
    averageOrderValue: 35.60,
    totalRevenue: 1890,
    createdDate: '2024-01-01'
  }
];

const mockCustomers: BirthdayCustomer[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    birthDate: '1985-01-20',
    age: 39,
    daysUntilBirthday: 6,
    segment: 'vip',
    totalSpent: 890,
    orderCount: 23,
    lastOrderDate: '2024-01-10',
    preferredChannel: 'email',
    rewardsSent: 3,
    rewardsUsed: 2,
    lastBirthdayReward: '2023-01-20'
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 98 76 54 32',
    birthDate: '1990-01-18',
    age: 34,
    daysUntilBirthday: 4,
    segment: 'frequent',
    totalSpent: 345,
    orderCount: 12,
    lastOrderDate: '2024-01-12',
    preferredChannel: 'sms',
    rewardsSent: 2,
    rewardsUsed: 1,
    lastBirthdayReward: '2023-01-18'
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 55 44 33 22',
    birthDate: '1995-01-25',
    age: 29,
    daysUntilBirthday: 11,
    segment: 'regular',
    totalSpent: 125,
    orderCount: 5,
    lastOrderDate: '2024-01-08',
    preferredChannel: 'both',
    rewardsSent: 1,
    rewardsUsed: 1,
    lastBirthdayReward: '2023-01-25'
  },
  {
    id: '4',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 6 77 88 99 00',
    birthDate: '1988-01-16',
    age: 36,
    daysUntilBirthday: 2,
    segment: 'vip',
    totalSpent: 1240,
    orderCount: 34,
    lastOrderDate: '2024-01-13',
    preferredChannel: 'email',
    rewardsSent: 4,
    rewardsUsed: 3,
    lastBirthdayReward: '2023-01-16'
  }
];

const mockMessages: BirthdayMessage[] = [
  {
    id: '1',
    rewardId: '1',
    type: 'email',
    subject: '🎂 Joyeux anniversaire ! Votre cadeau VIP vous attend',
    content: 'Cher {prenom}, en ce jour si spécial, toute l\'équipe vous souhaite un très joyeux anniversaire ! 🎉',
    usageCount: 45,
    openRate: 89.5,
    clickRate: 67.2,
    conversionRate: 78.2
  },
  {
    id: '2',
    rewardId: '2',
    type: 'email',
    subject: '🎈 C\'est votre anniversaire ! Profitez de votre cadeau',
    content: 'Joyeux anniversaire {prenom} ! Pour fêter ce jour spécial, nous vous offrons 15% de réduction.',
    usageCount: 189,
    openRate: 76.8,
    clickRate: 45.3,
    conversionRate: 62.4
  },
  {
    id: '3',
    rewardId: '3',
    type: 'sms',
    content: '🎂 Joyeux anniversaire {prenom} ! Votre petit gâteau vous attend. Montrez ce SMS en magasin. Valable 5 jours.',
    usageCount: 34,
    openRate: 98.2,
    clickRate: 0,
    conversionRate: 85.3
  }
];

interface BirthdayRewardsViewProps {
  onBack?: () => void;
}

export function BirthdayRewardsView({ onBack }: BirthdayRewardsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<BirthdayCustomer | null>(null);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'frequent': return 'bg-blue-100 text-blue-800';
      case 'regular': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'frequent': return <Star className="w-4 h-4" />;
      case 'regular': return <Users className="w-4 h-4" />;
      case 'new': return <Gift className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount_percentage':
      case 'discount_fixed': return <Target className="w-4 h-4" />;
      case 'free_item': return <Gift className="w-4 h-4" />;
      case 'points': return <Star className="w-4 h-4" />;
      case 'upgrade': return <TrendingUp className="w-4 h-4" />;
      case 'combo': return <Crown className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'both': return <Send className="w-4 h-4" />;
      case 'in_app': return <CheckCircle className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const formatRewardValue = (type: string, value: number) => {
    switch (type) {
      case 'discount_percentage': return `${value}%`;
      case 'discount_fixed': return `€${value}`;
      case 'points': return `${value} pts`;
      case 'free_item':
      case 'upgrade':
      case 'combo': return 'Offert';
      default: return value.toString();
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const upcomingBirthdays = mockCustomers
    .filter(c => c.daysUntilBirthday <= 7)
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);

  const totalRewards = mockRewards.reduce((sum, r) => sum + r.usageCount, 0);
  const averageRedemption = mockRewards.reduce((sum, r) => sum + r.redemptionRate, 0) / mockRewards.length;
  const totalRevenue = mockRewards.reduce((sum, r) => sum + r.totalRevenue, 0);
  const activeRewards = mockRewards.filter(r => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Récompenses Anniversaire</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Fidélisez vos clients avec des cadeaux personnalisés d'anniversaire</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowMessageModal(true)}>
            <Mail className="w-4 h-4" />
            Messages
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Rapports
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouvelle récompense
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
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Cake className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Récompenses envoyées</p>
                  <p className="text-2xl font-bold">{totalRewards}</p>
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
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux d'utilisation</p>
                  <p className="text-2xl font-bold">{averageRedemption.toFixed(1)}%</p>
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
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Programmes actifs</p>
                  <p className="text-2xl font-bold">{activeRewards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Birthdays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Anniversaires à venir (7 prochains jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-4">
              {upcomingBirthdays.map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{customer.name}</h4>
                        <p className="text-sm text-gray-600">
                          {customer.daysUntilBirthday === 0 ? "Aujourd'hui" : 
                           customer.daysUntilBirthday === 1 ? "Demain" :
                           `Dans ${customer.daysUntilBirthday} jours`} • 
                          {calculateAge(customer.birthDate) + 1} ans
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.orderCount} commandes • €{customer.totalSpent} dépensés
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getSegmentColor(customer.segment)}>
                        {getSegmentIcon(customer.segment)}
                        <span className="ml-1 capitalize">{customer.segment}</span>
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{customer.rewardsUsed}/{customer.rewardsSent}</p>
                        <p className="text-xs text-gray-600">récompenses utilisées</p>
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
                      <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun anniversaire dans les 7 prochains jours</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Birthday Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Programmes de récompenses d'anniversaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                      {getTypeIcon(reward.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{reward.name}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <Switch checked={reward.isActive} />
                </div>

                {/* Reward Details */}
                <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <p className="font-medium text-sm mb-1">🎁 {reward.details}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Validité: {reward.validityDays} jours</div>
                    <div>Segment: {reward.customerSegment}</div>
                    <div>Envoi: J-{reward.advanceDays}</div>
                    <div>Canal: {reward.deliveryMethod}</div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{reward.usageCount}</p>
                    <p className="text-xs text-gray-600">Envoyées</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{reward.redemptionRate}%</p>
                    <p className="text-xs text-gray-600">Utilisées</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">€{reward.averageOrderValue}</p>
                    <p className="text-xs text-gray-600">Panier moy.</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">€{reward.totalRevenue}</p>
                    <p className="text-xs text-gray-600">Revenus</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Badge className={reward.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {reward.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance des messages d'anniversaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getChannelIcon(message.type)}
                    </div>
                    <div>
                      {message.subject && (
                        <h4 className="font-semibold text-sm">{message.subject}</h4>
                      )}
                      <p className="text-sm text-gray-600">{message.content.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <Badge variant="outline">{message.type.toUpperCase()}</Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{message.usageCount}</p>
                    <p className="text-xs text-gray-600">Envoyés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{message.openRate}%</p>
                    <p className="text-xs text-gray-600">Ouverture</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">
                      {message.type === 'sms' ? 'N/A' : `${message.clickRate}%`}
                    </p>
                    <p className="text-xs text-gray-600">Clics</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{message.conversionRate}%</p>
                    <p className="text-xs text-gray-600">Conversion</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Reward Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer une récompense d'anniversaire</DialogTitle>
            <DialogDescription>
              Configurez un programme de récompenses personnalisé pour les anniversaires.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rewardName">Nom du programme</Label>
                <Input id="rewardName" placeholder="Ex: Anniversaire VIP" />
              </div>
              <div>
                <Label htmlFor="rewardType">Type de récompense</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount_percentage">Réduction %</SelectItem>
                    <SelectItem value="discount_fixed">Réduction fixe</SelectItem>
                    <SelectItem value="free_item">Article gratuit</SelectItem>
                    <SelectItem value="points">Points de fidélité</SelectItem>
                    <SelectItem value="upgrade">Upgrade gratuit</SelectItem>
                    <SelectItem value="combo">Combo spécial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Décrivez la récompense d'anniversaire..." />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="segment">Segment de clients</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="vip">Clients VIP</SelectItem>
                    <SelectItem value="frequent">Clients fréquents</SelectItem>
                    <SelectItem value="new">Nouveaux clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="validityDays">Validité (jours)</Label>
                <Input id="validityDays" type="number" placeholder="14" />
              </div>
              <div>
                <Label htmlFor="advanceDays">Envoi avant (jours)</Label>
                <Input id="advanceDays" type="number" placeholder="3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryMethod">Canal d'envoi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email seulement</SelectItem>
                    <SelectItem value="sms">SMS seulement</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                    <SelectItem value="in_app">Notification in-app</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minimumSpend">Achat minimum (€)</Label>
                <Input id="minimumSpend" type="number" placeholder="25" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Gift className="w-4 h-4 mr-2" />
                Créer la récompense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil anniversaire - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Historique des récompenses d'anniversaire et recommandations
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Date de naissance:</span> {new Date(selectedCustomer.birthDate).toLocaleDateString('fr-FR')}</div>
                    <div><span className="text-gray-600">Âge actuel:</span> {selectedCustomer.age} ans</div>
                    <div><span className="text-gray-600">Prochain anniversaire:</span> Dans {selectedCustomer.daysUntilBirthday} jours ({selectedCustomer.age + 1} ans)</div>
                    <div><span className="text-gray-600">Canal préféré:</span> {selectedCustomer.preferredChannel}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Historique récompenses</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Récompenses envoyées:</span> {selectedCustomer.rewardsSent}</div>
                    <div><span className="text-gray-600">Récompenses utilisées:</span> {selectedCustomer.rewardsUsed}</div>
                    <div><span className="text-gray-600">Taux d'utilisation:</span> {selectedCustomer.rewardsSent > 0 ? ((selectedCustomer.rewardsUsed / selectedCustomer.rewardsSent) * 100).toFixed(1) : 0}%</div>
                    {selectedCustomer.lastBirthdayReward && (
                      <div><span className="text-gray-600">Dernier anniversaire:</span> {new Date(selectedCustomer.lastBirthdayReward).toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3">Recommandations</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-700">
                      {selectedCustomer.segment === 'vip' ? 'Client VIP - Récompense premium recommandée' : 
                       selectedCustomer.totalSpent > 500 ? 'Client à forte valeur - Upgrade VIP suggéré' :
                       'Client standard - Récompense classique'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Envoi recommandé {selectedCustomer.daysUntilBirthday <= 3 ? 'immédiatement' : `dans ${selectedCustomer.daysUntilBirthday - 3} jours`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCustomerModal(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer récompense maintenant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}