import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { 
  Target, 
  Plus, 
  Eye, 
  Edit, 
  Play, 
  Pause, 
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Euro,
  Mail,
  Smartphone,
  Share2,
  Gift,
  Megaphone,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'loyalty' | 'promotion';
  status: 'draft' | 'active' | 'completed' | 'paused' | 'scheduled';
  audience: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
  description: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  type: Campaign['type'];
  description: string;
  icon: any;
  color: string;
  estimatedRoi: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Offre Week-end Famille',
    type: 'email',
    status: 'active',
    audience: 'Familles avec enfants',
    startDate: '2024-01-10',
    endDate: '2024-01-16',
    budget: 200,
    spent: 150,
    impressions: 2500,
    clicks: 375,
    conversions: 68,
    revenue: 1250,
    roi: 733,
    description: 'Promotion spéciale pour les familles avec menu enfant offert'
  },
  {
    id: '2',
    name: 'SMS Flash Midi',
    type: 'sms',
    status: 'completed',
    audience: 'Clients bureaux proximité',
    startDate: '2024-01-08',
    budget: 80,
    spent: 80,
    impressions: 890,
    clicks: 234,
    conversions: 56,
    revenue: 780,
    roi: 875,
    description: 'Offre express pour le déjeuner des employés de bureau'
  },
  {
    id: '3',
    name: 'Programme Fidélité Premium',
    type: 'loyalty',
    status: 'active',
    audience: 'Clients VIP',
    startDate: '2024-01-01',
    budget: 500,
    spent: 320,
    impressions: 1200,
    clicks: 890,
    conversions: 234,
    revenue: 4500,
    roi: 1306,
    description: 'Avantages exclusifs pour les clients les plus fidèles'
  },
  {
    id: '4',
    name: 'Réseaux Sociaux - Nouveau Menu',
    type: 'social',
    status: 'scheduled',
    audience: 'Followers Instagram/Facebook',
    startDate: '2024-01-20',
    endDate: '2024-01-27',
    budget: 150,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    roi: 0,
    description: 'Lancement du nouveau menu de printemps sur les réseaux'
  }
];

const campaignTemplates: CampaignTemplate[] = [
  {
    id: '1',
    name: 'Newsletter Hebdomadaire',
    type: 'email',
    description: 'Newsletter avec actualités et promotions',
    icon: Mail,
    color: 'bg-blue-500',
    estimatedRoi: '+250%'
  },
  {
    id: '2',
    name: 'SMS Flash',
    type: 'sms',
    description: 'Offres limitées dans le temps',
    icon: Smartphone,
    color: 'bg-green-500',
    estimatedRoi: '+400%'
  },
  {
    id: '3',
    name: 'Campagne Sociale',
    type: 'social',
    description: 'Publication sponsorisée sur réseaux',
    icon: Share2,
    color: 'bg-purple-500',
    estimatedRoi: '+180%'
  },
  {
    id: '4',
    name: 'Programme Fidélité',
    type: 'loyalty',
    description: 'Récompenses pour clients fidèles',
    icon: Gift,
    color: 'bg-yellow-500',
    estimatedRoi: '+320%'
  },
  {
    id: '5',
    name: 'Promotion Saisonnière',
    type: 'promotion',
    description: 'Offres spéciales événements',
    icon: Target,
    color: 'bg-red-500',
    estimatedRoi: '+280%'
  }
];

interface MarketingCampaignsViewProps {
  onBack?: () => void;
}

export function MarketingCampaignsView({ onBack }: MarketingCampaignsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCampaignIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'sms': return <Smartphone className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'loyalty': return <Gift className="w-5 h-5" />;
      case 'promotion': return <Target className="w-5 h-5" />;
      default: return <Megaphone className="w-5 h-5" />;
    }
  };

  const calculateClickRate = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(1);
  };

  const calculateConversionRate = (conversions: number, clicks: number) => {
    if (clicks === 0) return 0;
    return ((conversions / clicks) * 100).toFixed(1);
  };

  return (
    <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Campagnes Marketing</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Créez et gérez vos campagnes marketing multi-canaux</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
            <BarChart3 className="w-4 h-4" />
            Analyser
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e] flex-1 sm:flex-none"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle campagne</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Campagnes actives</p>
                  <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === 'active').length}</p>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget total</p>
                  <p className="text-2xl font-bold">€{mockCampaigns.reduce((sum, c) => sum + c.budget, 0)}</p>
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
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI moyen</p>
                  <p className="text-2xl font-bold">
                    +{Math.round(mockCampaigns.reduce((sum, c) => sum + c.roi, 0) / mockCampaigns.filter(c => c.roi > 0).length)}%
                  </p>
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
                  <Users className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversions totales</p>
                  <p className="text-2xl font-bold">{mockCampaigns.reduce((sum, c) => sum + c.conversions, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveGrid>

      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Modèles de campagnes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={4}>
            {campaignTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowCreateModal(true);
                }}
              >
                <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                  <template.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <Badge variant="outline" className="text-green-600">
                  ROI {template.estimatedRoi}
                </Badge>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Mes campagnes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 sm:p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {getCampaignIcon(campaign.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <p className="text-xs text-gray-500">
                        Audience: {campaign.audience} • Du {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                        {campaign.endDate && ` au ${new Date(campaign.endDate).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                    <div className="flex gap-1">
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
                </div>

                <ResponsiveGrid cols={{ base: 3, md: 6 }} gap={4} className="text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">€{campaign.budget}</p>
                    <p className="text-xs text-gray-600">Budget</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">€{campaign.spent}</p>
                    <p className="text-xs text-gray-600">Dépensé</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{campaign.impressions.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Vues</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{campaign.clicks}</p>
                    <p className="text-xs text-gray-600">Clics ({calculateClickRate(campaign.clicks, campaign.impressions)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{campaign.conversions}</p>
                    <p className="text-xs text-gray-600">Conversions ({calculateConversionRate(campaign.conversions, campaign.clicks)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">+{campaign.roi}%</p>
                    <p className="text-xs text-gray-600">ROI (€{campaign.revenue})</p>
                  </div>
                </ResponsiveGrid>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? `Créer: ${selectedTemplate.name}` : 'Nouvelle campagne marketing'}
            </DialogTitle>
            <DialogDescription>
              Configurez votre campagne marketing pour atteindre vos objectifs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Nom de la campagne</Label>
              <Input 
                id="campaignName" 
                placeholder={selectedTemplate ? `Ma campagne ${selectedTemplate.name}` : "Ex: Offre Week-end"} 
              />
            </div>
            
            <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap={4}>
              <div>
                <Label htmlFor="campaignType">Type</Label>
                <Select defaultValue={selectedTemplate?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de campagne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="sms">SMS Marketing</SelectItem>
                    <SelectItem value="social">Réseaux Sociaux</SelectItem>
                    <SelectItem value="loyalty">Programme Fidélité</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" placeholder="200" />
              </div>
            </ResponsiveGrid>

            <div>
              <Label htmlFor="audience">Audience cible</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="vip">Clients VIP</SelectItem>
                  <SelectItem value="frequent">Clients fréquents</SelectItem>
                  <SelectItem value="new">Nouveaux clients</SelectItem>
                  <SelectItem value="inactive">Clients inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap={4}>
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                <Input id="endDate" type="date" />
              </div>
            </ResponsiveGrid>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder={selectedTemplate ? selectedTemplate.description : "Décrivez votre campagne..."} 
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                setShowCreateModal(false);
                setSelectedTemplate(null);
              }}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e] w-full sm:w-auto">
                <Target className="w-4 h-4 mr-2" />
                Créer la campagne
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}