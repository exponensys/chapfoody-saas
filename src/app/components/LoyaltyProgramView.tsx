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
  Crown, 
  Award, 
  Star, 
  Gift, 
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Settings,
  Calendar,
  Euro,
  Target,
  UserPlus,
  Heart,
  Zap,
  Percent,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface LoyaltyCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  visitCount: number;
  joinDate: string;
  lastVisit: string;
  pointsEarned: number;
  pointsRedeemed: number;
  nextTierPoints: number;
}

interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  minPoints: number;
  color: string;
  benefits: string[];
  discount: number;
  bonusMultiplier: number;
  exclusiveOffers: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_item' | 'upgrade' | 'exclusive';
  value: number;
  available: boolean;
  redeemCount: number;
  expiryDate?: string;
}

interface PointsRule {
  id: string;
  action: string;
  points: number;
  enabled: boolean;
  conditions?: string[];
}

const mockCustomers: LoyaltyCustomer[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    points: 2450,
    tier: 'gold',
    totalSpent: 890,
    visitCount: 23,
    joinDate: '2023-06-15',
    lastVisit: '2024-01-14',
    pointsEarned: 3200,
    pointsRedeemed: 750,
    nextTierPoints: 550
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 98 76 54 32',
    points: 890,
    tier: 'silver',
    totalSpent: 345,
    visitCount: 12,
    joinDate: '2023-09-20',
    lastVisit: '2024-01-12',
    pointsEarned: 1200,
    pointsRedeemed: 310,
    nextTierPoints: 1110
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 55 44 33 22',
    points: 150,
    tier: 'bronze',
    totalSpent: 125,
    visitCount: 5,
    joinDate: '2024-01-01',
    lastVisit: '2024-01-10',
    pointsEarned: 200,
    pointsRedeemed: 50,
    nextTierPoints: 350
  }
];

const loyaltyTiers: LoyaltyTier[] = [
  {
    id: '1',
    name: 'Bronze',
    level: 1,
    minPoints: 0,
    color: 'bg-amber-100 text-amber-800',
    benefits: ['1 point par €1 dépensé', 'Offres spéciales mensuelles'],
    discount: 0,
    bonusMultiplier: 1,
    exclusiveOffers: false
  },
  {
    id: '2',
    name: 'Argent',
    level: 2,
    minPoints: 500,
    color: 'bg-gray-100 text-gray-800',
    benefits: ['1,5 points par €1', '5% de réduction', 'Offres hebdomadaires'],
    discount: 5,
    bonusMultiplier: 1.5,
    exclusiveOffers: true
  },
  {
    id: '3',
    name: 'Or',
    level: 3,
    minPoints: 2000,
    color: 'bg-yellow-100 text-yellow-800',
    benefits: ['2 points par €1', '10% de réduction', 'Accès prioritaire', 'Livraison offerte'],
    discount: 10,
    bonusMultiplier: 2,
    exclusiveOffers: true
  },
  {
    id: '4',
    name: 'Platine',
    level: 4,
    minPoints: 5000,
    color: 'bg-purple-100 text-purple-800',
    benefits: ['3 points par €1', '15% de réduction', 'Concierge personnel', 'Événements VIP'],
    discount: 15,
    bonusMultiplier: 3,
    exclusiveOffers: true
  }
];

const rewards: Reward[] = [
  {
    id: '1',
    name: 'Café offert',
    description: 'Un café ou thé de votre choix',
    pointsCost: 50,
    type: 'free_item',
    value: 2.50,
    available: true,
    redeemCount: 234
  },
  {
    id: '2',
    name: '10% de réduction',
    description: 'Réduction sur votre prochaine commande',
    pointsCost: 100,
    type: 'discount',
    value: 10,
    available: true,
    redeemCount: 189
  },
  {
    id: '3',
    name: 'Dessert gratuit',
    description: 'Dessert maison au choix',
    pointsCost: 200,
    type: 'free_item',
    value: 6.50,
    available: true,
    redeemCount: 98
  },
  {
    id: '4',
    name: 'Menu complet offert',
    description: 'Menu entrée + plat + dessert',
    pointsCost: 500,
    type: 'free_item',
    value: 25.90,
    available: true,
    redeemCount: 23
  },
  {
    id: '5',
    name: 'Soirée VIP',
    description: 'Invitation à nos événements exclusifs',
    pointsCost: 1000,
    type: 'exclusive',
    value: 0,
    available: true,
    redeemCount: 12
  }
];

const pointsRules: PointsRule[] = [
  { id: '1', action: 'Inscription', points: 100, enabled: true },
  { id: '2', action: 'Première commande', points: 200, enabled: true },
  { id: '3', action: 'Commande (par €1)', points: 1, enabled: true },
  { id: '4', action: 'Avis client', points: 50, enabled: true },
  { id: '5', action: 'Parrainage réussi', points: 300, enabled: true },
  { id: '6', action: 'Anniversaire', points: 100, enabled: true }
];

interface LoyaltyProgramViewProps {
  onBack?: () => void;
}

export function LoyaltyProgramView({ onBack }: LoyaltyProgramViewProps) {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Award className="w-5 h-5 text-amber-600" />;
      case 'silver': return <Star className="w-5 h-5 text-gray-600" />;
      case 'gold': return <Crown className="w-5 h-5 text-yellow-600" />;
      case 'platinum': return <Crown className="w-5 h-5 text-purple-600" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent className="w-4 h-4" />;
      case 'free_item': return <Gift className="w-4 h-4" />;
      case 'upgrade': return <TrendingUp className="w-4 h-4" />;
      case 'exclusive': return <Crown className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const totalMembers = mockCustomers.length;
  const totalPointsIssued = mockCustomers.reduce((sum, customer) => sum + customer.pointsEarned, 0);
  const averageSpent = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) / totalMembers;
  const activeMembers = mockCustomers.filter(c => new Date(c.lastVisit) > new Date('2024-01-01')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Programme de Fidélité</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Récompensez vos clients fidèles et augmentez leur engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowRewardModal(true)}>
            <Gift className="w-4 h-4" />
            Nouvelle récompense
          </Button>
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <UserPlus className="w-4 h-4" />
            Inscrire un client
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
                  <p className="text-sm text-gray-600">Membres actifs</p>
                  <p className="text-2xl font-bold">{activeMembers}</p>
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
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points distribués</p>
                  <p className="text-2xl font-bold">{totalPointsIssued.toLocaleString()}</p>
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Panier moyen membre</p>
                  <p className="text-2xl font-bold">€{averageSpent.toFixed(0)}</p>
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
                  <p className="text-sm text-gray-600">Récompenses utilisées</p>
                  <p className="text-2xl font-bold">{rewards.reduce((sum, r) => sum + r.redeemCount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Loyalty Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Niveaux de fidélité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loyaltyTiers.map((tier) => {
              const memberCount = mockCustomers.filter(c => c.tier === tier.name.toLowerCase()).length;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border rounded-lg p-4 text-center"
                >
                  <div className={`w-16 h-16 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    {getTierIcon(tier.name.toLowerCase())}
                  </div>
                  <h4 className="font-semibold mb-2">{tier.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{tier.minPoints}+ points</p>
                  <div className="space-y-1 text-xs text-left">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="outline">{memberCount} membre{memberCount > 1 ? 's' : ''}</Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Récompenses disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                      {getRewardTypeIcon(reward.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{reward.name}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#b70f23]">{reward.pointsCost} pts</p>
                    {reward.value > 0 && (
                      <p className="text-sm text-gray-600">Valeur: €{reward.value}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{reward.redeemCount} utilisations</p>
                    <Badge className={reward.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {reward.available ? 'Disponible' : 'Indisponible'}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Loyalty Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Meilleurs membres fidèles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers
              .sort((a, b) => b.points - a.points)
              .map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                        <p className="text-xs text-gray-500">
                          Membre depuis {new Date(customer.joinDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-[#b70f23]">{customer.points}</p>
                        <p className="text-xs text-gray-600">points</p>
                      </div>
                      <Badge className={getTierColor(customer.tier)}>
                        {getTierIcon(customer.tier)}
                        <span className="ml-1 capitalize">{customer.tier}</span>
                      </Badge>
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
                  
                  {/* Progress to next tier */}
                  {customer.tier !== 'platinum' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression vers niveau supérieur</span>
                        <span>{customer.nextTierPoints} points restants</span>
                      </div>
                      <Progress 
                        value={(customer.points / (customer.points + customer.nextTierPoints)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil de fidélité - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Détails complets du programme de fidélité du client
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Overview */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Email:</span> {selectedCustomer.email}</div>
                      <div><span className="text-gray-600">Téléphone:</span> {selectedCustomer.phone}</div>
                      <div><span className="text-gray-600">Membre depuis:</span> {new Date(selectedCustomer.joinDate).toLocaleDateString('fr-FR')}</div>
                      <div><span className="text-gray-600">Dernière visite:</span> {new Date(selectedCustomer.lastVisit).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Statut</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getTierColor(selectedCustomer.tier)}>
                        {getTierIcon(selectedCustomer.tier)}
                        <span className="ml-1 capitalize">{selectedCustomer.tier}</span>
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Points actuels:</span> <span className="font-semibold">{selectedCustomer.points}</span></div>
                      <div><span className="text-gray-600">Total dépensé:</span> €{selectedCustomer.totalSpent}</div>
                      <div><span className="text-gray-600">Nombre de visites:</span> {selectedCustomer.visitCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points History */}
              <div>
                <h4 className="font-semibold mb-3">Historique des points</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-green-600">{selectedCustomer.pointsEarned}</p>
                    <p className="text-sm text-gray-600">Points gagnés</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-red-600">{selectedCustomer.pointsRedeemed}</p>
                    <p className="text-sm text-gray-600">Points utilisés</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-[#b70f23]">{selectedCustomer.points}</p>
                    <p className="text-sm text-gray-600">Solde actuel</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCustomerModal(false)}>
                  Fermer
                </Button>
                <Button variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Offrir des points
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Paramètres du programme de fidélité</DialogTitle>
            <DialogDescription>
              Configurez les règles d'attribution des points et les récompenses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Règles d'attribution des points</h4>
              <div className="space-y-3">
                {pointsRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between border rounded p-3">
                    <div className="flex items-center gap-3">
                      <Switch checked={rule.enabled} />
                      <div>
                        <span className="font-medium">{rule.action}</span>
                        <p className="text-sm text-gray-600">+{rule.points} points</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Settings className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}