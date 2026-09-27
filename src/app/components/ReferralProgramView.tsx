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
  UserPlus, 
  Users, 
  Gift, 
  Share2,
  TrendingUp,
  Euro,
  Target,
  Plus,
  Edit,
  Eye,
  Copy,
  Mail,
  Smartphone,
  Crown,
  Award,
  Calendar,
  BarChart3,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'points' | 'cash' | 'free_item';
  referrerReward: ReferralReward;
  refereeReward: ReferralReward;
  requirements: ReferralRequirement[];
  isActive: boolean;
  totalReferrals: number;
  successfulReferrals: number;
  totalRewardsGiven: number;
  revenueGenerated: number;
  createdDate: string;
}

interface ReferralReward {
  type: 'discount' | 'points' | 'cash' | 'free_item';
  value: number;
  description: string;
}

interface ReferralRequirement {
  type: 'min_order' | 'first_order' | 'multiple_orders';
  value: number;
  description: string;
}

interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'rewarded' | 'expired';
  referralCode: string;
  referredAt: string;
  completedAt?: string;
  rewardedAt?: string;
  orderValue?: number;
  programId: string;
}

interface ReferralLink {
  id: string;
  name: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  isActive: boolean;
  createdDate: string;
}

const mockPrograms: ReferralProgram[] = [
  {
    id: '1',
    name: 'Programme Amis & Famille',
    description: 'Parrainez vos amis et recevez tous les deux une réduction',
    type: 'discount',
    referrerReward: {
      type: 'discount',
      value: 15,
      description: '15% de réduction sur votre prochaine commande'
    },
    refereeReward: {
      type: 'discount',
      value: 10,
      description: '10% de réduction sur la première commande'
    },
    requirements: [
      { type: 'min_order', value: 25, description: 'Commande minimum de 25€' }
    ],
    isActive: true,
    totalReferrals: 89,
    successfulReferrals: 67,
    totalRewardsGiven: 134,
    revenueGenerated: 2890,
    createdDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Points de Parrainage',
    description: 'Gagnez des points pour chaque ami qui commande',
    type: 'points',
    referrerReward: {
      type: 'points',
      value: 500,
      description: '500 points de fidélité'
    },
    refereeReward: {
      type: 'points',
      value: 200,
      description: '200 points de bienvenue'
    },
    requirements: [
      { type: 'first_order', value: 1, description: 'Première commande validée' }
    ],
    isActive: true,
    totalReferrals: 156,
    successfulReferrals: 98,
    totalRewardsGiven: 196,
    revenueGenerated: 1950,
    createdDate: '2024-01-01'
  },
  {
    id: '3',
    name: 'Cashback Parrainage',
    description: 'Recevez de l\'argent pour chaque parrainage réussi',
    type: 'cash',
    referrerReward: {
      type: 'cash',
      value: 10,
      description: '10€ en cashback'
    },
    refereeReward: {
      type: 'free_item',
      value: 0,
      description: 'Dessert offert'
    },
    requirements: [
      { type: 'min_order', value: 50, description: 'Commande minimum de 50€' }
    ],
    isActive: false,
    totalReferrals: 23,
    successfulReferrals: 15,
    totalRewardsGiven: 30,
    revenueGenerated: 750,
    createdDate: '2024-01-01'
  }
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    referrerName: 'Marie Dubois',
    referrerEmail: 'marie.dubois@email.com',
    referredName: 'Jean Martin',
    referredEmail: 'jean.martin@email.com',
    status: 'completed',
    referralCode: 'MARIE2024',
    referredAt: '2024-01-10',
    completedAt: '2024-01-12',
    rewardedAt: '2024-01-12',
    orderValue: 45.50,
    programId: '1'
  },
  {
    id: '2',
    referrerName: 'Sophie Laurent',
    referrerEmail: 'sophie.laurent@email.com',
    referredName: 'Pierre Durand',
    referredEmail: 'pierre.durand@email.com',
    status: 'pending',
    referralCode: 'SOPHIE2024',
    referredAt: '2024-01-13',
    programId: '1'
  },
  {
    id: '3',
    referrerName: 'Jean Martin',
    referrerEmail: 'jean.martin@email.com',
    referredName: 'Alice Bernard',
    referredEmail: 'alice.bernard@email.com',
    status: 'rewarded',
    referralCode: 'JEAN2024',
    referredAt: '2024-01-08',
    completedAt: '2024-01-09',
    rewardedAt: '2024-01-09',
    orderValue: 32.90,
    programId: '2'
  }
];

const mockReferralLinks: ReferralLink[] = [
  {
    id: '1',
    name: 'Lien Principal',
    code: 'INVITE2024',
    url: 'https://chapfoody.com/invite/INVITE2024',
    clicks: 234,
    conversions: 45,
    isActive: true,
    createdDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Réseaux Sociaux',
    code: 'SOCIAL2024',
    url: 'https://chapfoody.com/invite/SOCIAL2024',
    clicks: 189,
    conversions: 23,
    isActive: true,
    createdDate: '2024-01-01'
  }
];

interface ReferralProgramViewProps {
  onBack?: () => void;
}

export function ReferralProgramView({ onBack }: ReferralProgramViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'rewarded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'rewarded': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Target className="w-4 h-4" />;
      case 'points': return <Award className="w-4 h-4" />;
      case 'cash': return <Euro className="w-4 h-4" />;
      case 'free_item': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const formatRewardValue = (type: string, value: number) => {
    switch (type) {
      case 'discount': return `${value}%`;
      case 'points': return `${value} pts`;
      case 'cash': return `€${value}`;
      case 'free_item': return 'Gratuit';
      default: return value.toString();
    }
  };

  const calculateConversionRate = (conversions: number, clicks: number) => {
    if (clicks === 0) return 0;
    return ((conversions / clicks) * 100).toFixed(1);
  };

  const totalReferrals = mockPrograms.reduce((sum, p) => sum + p.totalReferrals, 0);
  const totalSuccessful = mockPrograms.reduce((sum, p) => sum + p.successfulReferrals, 0);
  const totalRevenue = mockPrograms.reduce((sum, p) => sum + p.revenueGenerated, 0);
  const overallConversionRate = totalReferrals > 0 ? (totalSuccessful / totalReferrals * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Programme de Parrainage</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Développez votre clientèle grâce aux recommandations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau programme
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
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total parrainages</p>
                  <p className="text-2xl font-bold">{totalReferrals}</p>
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
                  <p className="text-sm text-gray-600">Taux de conversion</p>
                  <p className="text-2xl font-bold">{overallConversionRate}%</p>
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
                  <Euro className="w-5 h-5 text-purple-600" />
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
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Meilleurs parrains</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Liens de parrainage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReferralLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#f4b71b] rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{link.name}</h4>
                      <p className="text-sm text-gray-600 font-mono">{link.url}</p>
                      <p className="text-xs text-gray-500">Code: {link.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{link.clicks}</p>
                      <p className="text-xs text-gray-600">Clics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{link.conversions}</p>
                      <p className="text-xs text-gray-600">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{calculateConversionRate(link.conversions, link.clicks)}%</p>
                      <p className="text-xs text-gray-600">Taux</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Programmes actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPrograms.filter(p => p.isActive).map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{program.name}</h4>
                  <Switch checked={program.isActive} />
                </div>
                <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                {/* Rewards */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    {getRewardIcon(program.referrerReward.type)}
                    <div>
                      <p className="font-medium text-sm">Parrain reçoit:</p>
                      <p className="text-sm text-gray-600">{program.referrerReward.description}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="font-bold text-green-600">
                        {formatRewardValue(program.referrerReward.type, program.referrerReward.value)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    {getRewardIcon(program.refereeReward.type)}
                    <div>
                      <p className="font-medium text-sm">Filleul reçoit:</p>
                      <p className="text-sm text-gray-600">{program.refereeReward.description}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="font-bold text-blue-600">
                        {formatRewardValue(program.refereeReward.type, program.refereeReward.value)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{program.successfulReferrals}</p>
                    <p className="text-xs text-gray-600">Réussis</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{program.totalRewardsGiven}</p>
                    <p className="text-xs text-gray-600">Récompenses</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">€{program.revenueGenerated}</p>
                    <p className="text-xs text-gray-600">Revenus</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Parrainages récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReferrals.map((referral) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {referral.referrerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{referral.referrerName}</h4>
                      <p className="text-sm text-gray-600">a parrainé {referral.referredName}</p>
                      <p className="text-xs text-gray-500">
                        Code: {referral.referralCode} • {new Date(referral.referredAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {referral.orderValue && (
                      <div className="text-right">
                        <p className="font-semibold">€{referral.orderValue}</p>
                        <p className="text-xs text-gray-600">Commande</p>
                      </div>
                    )}
                    <Badge className={getStatusColor(referral.status)}>
                      {getStatusIcon(referral.status)}
                      <span className="ml-1 capitalize">
                        {referral.status === 'pending' && 'En attente'}
                        {referral.status === 'completed' && 'Complété'}
                        {referral.status === 'rewarded' && 'Récompensé'}
                        {referral.status === 'expired' && 'Expiré'}
                      </span>
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedReferral(referral);
                        setShowReferralModal(true);
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

      {/* Create Program Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer un programme de parrainage</DialogTitle>
            <DialogDescription>
              Configurez les récompenses et conditions pour votre programme.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="programName">Nom du programme</Label>
                <Input id="programName" placeholder="Ex: Amis & Famille" />
              </div>
              <div>
                <Label htmlFor="programType">Type de récompense</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Réduction</SelectItem>
                    <SelectItem value="points">Points de fidélité</SelectItem>
                    <SelectItem value="cash">Cashback</SelectItem>
                    <SelectItem value="free_item">Article gratuit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Décrivez votre programme de parrainage..." />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Récompense du parrain</h4>
                <div>
                  <Label htmlFor="referrerValue">Valeur</Label>
                  <Input id="referrerValue" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="referrerDesc">Description</Label>
                  <Input id="referrerDesc" placeholder="15% de réduction..." />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Récompense du filleul</h4>
                <div>
                  <Label htmlFor="refereeValue">Valeur</Label>
                  <Input id="refereeValue" type="number" placeholder="10" />
                </div>
                <div>
                  <Label htmlFor="refereeDesc">Description</Label>
                  <Input id="refereeDesc" placeholder="10% de réduction..." />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="minOrder">Commande minimum (€)</Label>
              <Input id="minOrder" type="number" placeholder="25" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <UserPlus className="w-4 h-4 mr-2" />
                Créer le programme
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Detail Modal */}
      <Dialog open={showReferralModal} onOpenChange={setShowReferralModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du parrainage</DialogTitle>
            <DialogDescription>
              Informations complètes sur ce parrainage
            </DialogDescription>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-6">
              {/* Referral Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Parrain</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Nom:</span> {selectedReferral.referrerName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedReferral.referrerEmail}</p>
                    <p><span className="text-gray-600">Code:</span> {selectedReferral.referralCode}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Filleul</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Nom:</span> {selectedReferral.referredName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedReferral.referredEmail}</p>
                    <p><span className="text-gray-600">Statut:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedReferral.status)}`}>
                        {selectedReferral.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-3">Chronologie</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Parrainage créé le {new Date(selectedReferral.referredAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {selectedReferral.completedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Première commande le {new Date(selectedReferral.completedAt).toLocaleDateString('fr-FR')}</span>
                      {selectedReferral.orderValue && (
                        <span className="text-sm font-medium">- €{selectedReferral.orderValue}</span>
                      )}
                    </div>
                  )}
                  {selectedReferral.rewardedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Récompenses attribuées le {new Date(selectedReferral.rewardedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReferralModal(false)}>
                  Fermer
                </Button>
                {selectedReferral.status === 'pending' && (
                  <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                    <Gift className="w-4 h-4 mr-2" />
                    Marquer comme complété
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