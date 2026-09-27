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
  Smartphone, 
  Send, 
  Users, 
  BarChart3,
  Plus,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Bell,
  MessageSquare,
  Zap,
  Calendar,
  Euro,
  Settings
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface SMSCampaign {
  id: string;
  name: string;
  type: 'flash' | 'reminder' | 'promotion' | 'notification' | 'birthday';
  message: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  audience: string;
  scheduledDate?: string;
  sentCount: number;
  deliveredCount: number;
  clickedCount: number;
  unsubscribeCount: number;
  cost: number;
  revenue: number;
  createdDate: string;
}

interface SMSTemplate {
  id: string;
  name: string;
  type: SMSCampaign['type'];
  message: string;
  variables: string[];
  usageCount: number;
}

interface SMSAutomation {
  id: string;
  name: string;
  trigger: string;
  delay: number; // en minutes
  message: string;
  enabled: boolean;
  sentCount: number;
  openRate: number;
}

const mockCampaigns: SMSCampaign[] = [
  {
    id: '1',
    name: 'Flash Lunch - Aujourd\'hui',
    type: 'flash',
    message: '🍽️ FLASH LUNCH ! Menu du jour à 12€ au lieu de 15€. Valable jusqu\'à 15h. Réservez: chapfoody.com/reserve',
    status: 'sent',
    audience: 'Clients actifs (500m)',
    sentCount: 342,
    deliveredCount: 338,
    clickedCount: 89,
    unsubscribeCount: 2,
    cost: 34.20,
    revenue: 890,
    createdDate: '2024-01-14'
  },
  {
    id: '2',
    name: 'Rappel Réservation',
    type: 'reminder',
    message: 'Bonjour {prenom}, rappel de votre réservation ce soir à 20h pour {nombre} personnes. À bientôt !',
    status: 'sending',
    audience: 'Réservations du jour',
    sentCount: 23,
    deliveredCount: 23,
    clickedCount: 0,
    unsubscribeCount: 0,
    cost: 2.30,
    revenue: 0,
    createdDate: '2024-01-14'
  },
  {
    id: '3',
    name: 'Week-end Spécial Famille',
    type: 'promotion',
    message: '👨‍👩‍👧‍👦 Week-end famille ! Menu enfant OFFERT pour tout menu adulte commandé. Code: FAMILLE24',
    status: 'scheduled',
    audience: 'Familles avec enfants',
    scheduledDate: '2024-01-20T10:00:00',
    sentCount: 0,
    deliveredCount: 0,
    clickedCount: 0,
    unsubscribeCount: 0,
    cost: 0,
    revenue: 0,
    createdDate: '2024-01-13'
  },
  {
    id: '4',
    name: 'Anniversaire Marie',
    type: 'birthday',
    message: '🎂 Joyeux anniversaire Marie ! Venez fêter ça avec nous, dessert offert sur présentation de ce SMS.',
    status: 'sent',
    audience: 'Anniversaire du jour',
    sentCount: 1,
    deliveredCount: 1,
    clickedCount: 1,
    unsubscribeCount: 0,
    cost: 0.10,
    revenue: 45,
    createdDate: '2024-01-14'
  }
];

const smsTemplates: SMSTemplate[] = [
  {
    id: '1',
    name: 'Offre Flash Restaurant',
    type: 'flash',
    message: '🍽️ FLASH ! {offre} jusqu\'à {heure}. {lien}',
    variables: ['offre', 'heure', 'lien'],
    usageCount: 45
  },
  {
    id: '2',
    name: 'Rappel Réservation',
    type: 'reminder',
    message: 'Bonjour {prenom}, rappel de votre réservation {date} à {heure} pour {nombre} personnes. À bientôt !',
    variables: ['prenom', 'date', 'heure', 'nombre'],
    usageCount: 234
  },
  {
    id: '3',
    name: 'Promotion Week-end',
    type: 'promotion',
    message: '🎉 {promotion}. Valable ce week-end. Code: {code}',
    variables: ['promotion', 'code'],
    usageCount: 18
  },
  {
    id: '4',
    name: 'Anniversaire Client',
    type: 'birthday',
    message: '🎂 Joyeux anniversaire {prenom} ! {cadeau} vous attend. Valable 7 jours.',
    variables: ['prenom', 'cadeau'],
    usageCount: 67
  }
];

const smsAutomations: SMSAutomation[] = [
  {
    id: '1',
    name: 'Confirmation de commande',
    trigger: 'Nouvelle commande',
    delay: 2,
    message: 'Commande confirmée ! Préparation en cours. Livraison estimée: {temps}',
    enabled: true,
    sentCount: 1249,
    openRate: 98.5
  },
  {
    id: '2',
    name: 'Commande prête (Sur place)',
    trigger: 'Commande prête',
    delay: 0,
    message: 'Votre commande #{numero} est prête ! Vous pouvez venir la récupérer.',
    enabled: true,
    sentCount: 567,
    openRate: 99.1
  },
  {
    id: '3',
    name: 'Merci après visite',
    trigger: 'Fin de repas',
    delay: 30,
    message: 'Merci pour votre visite ! Donnez votre avis: {lien_avis}',
    enabled: false,
    sentCount: 234,
    openRate: 87.3
  }
];

interface SMSMarketingViewProps {
  onBack?: () => void;
}

export function SMSMarketingView({ onBack }: SMSMarketingViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'sending': return <Send className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'paused': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flash': return <Zap className="w-4 h-4" />;
      case 'reminder': return <Bell className="w-4 h-4" />;
      case 'promotion': return <Target className="w-4 h-4" />;
      case 'birthday': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const calculateDeliveryRate = (delivered: number, sent: number) => {
    if (sent === 0) return 0;
    return ((delivered / sent) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, delivered: number) => {
    if (delivered === 0) return 0;
    return ((clicked / delivered) * 100).toFixed(1);
  };

  const calculateROI = (revenue: number, cost: number) => {
    if (cost === 0) return 0;
    return (((revenue - cost) / cost) * 100).toFixed(0);
  };

  const totalSent = mockCampaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalDelivered = mockCampaigns.reduce((sum, c) => sum + c.deliveredCount, 0);
  const totalClicked = mockCampaigns.reduce((sum, c) => sum + c.clickedCount, 0);
  const totalRevenue = mockCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalCost = mockCampaigns.reduce((sum, c) => sum + c.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">SMS Marketing</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Communiquez instantanément avec vos clients via SMS</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Rapports
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowTemplateModal(true)}>
            <MessageSquare className="w-4 h-4" />
            Modèles
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau SMS
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">SMS envoyés</p>
                  <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
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
                  <p className="text-sm text-gray-600">Taux de livraison</p>
                  <p className="text-2xl font-bold">{calculateDeliveryRate(totalDelivered, totalSent)}%</p>
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
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de clic</p>
                  <p className="text-2xl font-bold">{calculateClickRate(totalClicked, totalDelivered)}%</p>
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
                  <Euro className="w-5 h-5 text-yellow-600" />
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
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              <span>SMS Flash</span>
              <span className="text-xs text-gray-500">Offre immédiate</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Bell className="w-8 h-8 text-blue-500" />
              <span>Rappel</span>
              <span className="text-xs text-gray-500">Réservations</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Target className="w-8 h-8 text-green-500" />
              <span>Promotion</span>
              <span className="text-xs text-gray-500">Week-end spécial</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Users className="w-8 h-8 text-purple-500" />
              <span>SMS Masse</span>
              <span className="text-xs text-gray-500">Tous les clients</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes SMS récentes</CardTitle>
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
                    <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">
                        {campaign.audience} • Créé le {new Date(campaign.createdDate).toLocaleDateString('fr-FR')}
                      </p>
                      {campaign.scheduledDate && (
                        <p className="text-xs text-purple-600">
                          Programmé pour le {new Date(campaign.scheduledDate).toLocaleDateString('fr-FR')} à {new Date(campaign.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
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
                  </div>
                </div>

                {/* Message Preview */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-[#b70f23]">
                  <p className="text-sm font-mono">{campaign.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {campaign.message.length}/160 caractères
                  </p>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{campaign.sentCount}</p>
                    <p className="text-xs text-gray-600">Envoyés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{campaign.deliveredCount}</p>
                    <p className="text-xs text-gray-600">Livrés ({calculateDeliveryRate(campaign.deliveredCount, campaign.sentCount)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{campaign.clickedCount}</p>
                    <p className="text-xs text-gray-600">Clics ({calculateClickRate(campaign.clickedCount, campaign.deliveredCount)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{campaign.unsubscribeCount}</p>
                    <p className="text-xs text-gray-600">Désabonnés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">€{campaign.cost.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Coût</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">€{campaign.revenue}</p>
                    <p className="text-xs text-gray-600">Revenus ({campaign.cost > 0 ? `+${calculateROI(campaign.revenue, campaign.cost)}%` : '-'})</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SMS Automations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              SMS Automatiques
            </CardTitle>
            <Button size="sm" onClick={() => setShowAutomationModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smsAutomations.map((automation) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Switch checked={automation.enabled} />
                    <div>
                      <h4 className="font-semibold">{automation.name}</h4>
                      <p className="text-sm text-gray-600">
                        Déclencheur: {automation.trigger} • Délai: {automation.delay} min
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        "{automation.message.substring(0, 60)}..."
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{automation.sentCount}</p>
                    <p className="text-sm text-gray-600">envoyés</p>
                    <p className="text-xs text-green-600">{automation.openRate}% de lecture</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create SMS Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une campagne SMS</DialogTitle>
            <DialogDescription>
              Rédigez votre message et sélectionnez votre audience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignName">Nom de la campagne</Label>
                <Input id="campaignName" placeholder="Ex: Flash Lunch Midi" />
              </div>
              <div>
                <Label htmlFor="campaignType">Type de SMS</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flash">Offre Flash</SelectItem>
                    <SelectItem value="reminder">Rappel</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="audience">Audience cible</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="active">Clients actifs</SelectItem>
                  <SelectItem value="nearby">Clients à proximité (500m)</SelectItem>
                  <SelectItem value="frequent">Clients fréquents</SelectItem>
                  <SelectItem value="vip">Clients VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message SMS</Label>
              <Textarea 
                id="message" 
                placeholder="Rédigez votre message..."
                className="min-h-[100px]"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Utilisez {'{prenom}'} pour personnaliser</span>
                <span>0/160 caractères</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule">Programmation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Envoyer maintenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Envoyer maintenant</SelectItem>
                    <SelectItem value="schedule">Programmer l'envoi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="datetime">Date et heure</Label>
                <Input id="datetime" type="datetime-local" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Send className="w-4 h-4 mr-2" />
                Envoyer le SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}