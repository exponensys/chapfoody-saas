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
  Mail, 
  Send, 
  Users, 
  Eye,
  Edit,
  Plus,
  Copy,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  Heart,
  Gift,
  Zap,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Workflow
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface EmailCampaign {
  id: string;
  name: string;
  type: 'newsletter' | 'promotional' | 'automated' | 'transactional' | 'winback';
  subject: string;
  previewText: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  template: string;
  audience: string;
  scheduledDate?: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  unsubscribeCount: number;
  bounceCount: number;
  revenue: number;
  createdDate: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  type: EmailCampaign['type'];
  subject: string;
  content: string;
  thumbnail: string;
  usageCount: number;
  lastUsed?: string;
  tags: string[];
}

interface EmailAutomation {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  emails: AutomationEmail[];
  subscribers: number;
  openRate: number;
  clickRate: number;
  revenue: number;
  createdDate: string;
}

interface AutomationEmail {
  id: string;
  subject: string;
  delay: number; // en jours
  template: string;
  sent: number;
  opened: number;
  clicked: number;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Newsletter Hebdomadaire #45',
    type: 'newsletter',
    subject: '🍽️ Nouveautés de la semaine chez ChapFoody !',
    previewText: 'Découvrez nos nouveaux plats et offres spéciales...',
    status: 'sent',
    template: 'weekly_newsletter',
    audience: 'Tous les abonnés (1,234)',
    sentCount: 1234,
    openCount: 567,
    clickCount: 89,
    unsubscribeCount: 3,
    bounceCount: 12,
    revenue: 1250,
    createdDate: '2024-01-14'
  },
  {
    id: '2',
    name: 'Offre Week-end Premium',
    type: 'promotional',
    subject: '💎 Offre Exclusive - 25% sur nos menus Premium',
    previewText: 'Profitez de nos menus gastronomiques à prix réduit...',
    status: 'scheduled',
    template: 'promotional_weekend',
    audience: 'Clients VIP (345)',
    scheduledDate: '2024-01-20T09:00:00',
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    unsubscribeCount: 0,
    bounceCount: 0,
    revenue: 0,
    createdDate: '2024-01-15'
  },
  {
    id: '3',
    name: 'Bienvenue Nouveaux Clients',
    type: 'automated',
    subject: '🎉 Bienvenue chez ChapFoody ! Votre code promo vous attend',
    previewText: 'Merci de nous avoir rejoint ! Voici votre réduction...',
    status: 'sending',
    template: 'welcome_series',
    audience: 'Automatisation (nouveaux inscrits)',
    sentCount: 45,
    openCount: 38,
    clickCount: 12,
    unsubscribeCount: 0,
    bounceCount: 1,
    revenue: 290,
    createdDate: '2024-01-01'
  }
];

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Newsletter Moderne',
    type: 'newsletter',
    subject: 'Votre newsletter hebdomadaire',
    content: '<html><body>Contenu de la newsletter...</body></html>',
    thumbnail: '/templates/newsletter-modern.jpg',
    usageCount: 23,
    lastUsed: '2024-01-14',
    tags: ['responsive', 'moderne', 'newsletter']
  },
  {
    id: '2',
    name: 'Offre Promotionnelle',
    type: 'promotional',
    subject: 'Offre spéciale pour vous !',
    content: '<html><body>Contenu promotionnel...</body></html>',
    thumbnail: '/templates/promo-special.jpg',
    usageCount: 18,
    lastUsed: '2024-01-12',
    tags: ['promotion', 'coloré', 'conversion']
  },
  {
    id: '3',
    name: 'Email de Bienvenue',
    type: 'automated',
    subject: 'Bienvenue dans notre communauté !',
    content: '<html><body>Message de bienvenue...</body></html>',
    thumbnail: '/templates/welcome-clean.jpg',
    usageCount: 156,
    lastUsed: '2024-01-15',
    tags: ['bienvenue', 'automatique', 'simple']
  },
  {
    id: '4',
    name: 'Reconquête Client',
    type: 'winback',
    subject: 'Nous vous avons manqué !',
    content: '<html><body>Message de reconquête...</body></html>',
    thumbnail: '/templates/winback-elegant.jpg',
    usageCount: 34,
    lastUsed: '2024-01-10',
    tags: ['reconquête', 'émotion', 'retour']
  }
];

const mockAutomations: EmailAutomation[] = [
  {
    id: '1',
    name: 'Série de Bienvenue (3 emails)',
    trigger: 'Inscription newsletter',
    status: 'active',
    emails: [
      { id: '1', subject: 'Bienvenue !', delay: 0, template: 'welcome_1', sent: 234, opened: 198, clicked: 45 },
      { id: '2', subject: 'Découvrez nos spécialités', delay: 3, template: 'welcome_2', sent: 198, opened: 156, clicked: 34 },
      { id: '3', subject: 'Offre exclusive pour vous', delay: 7, template: 'welcome_3', sent: 156, opened: 123, clicked: 28 }
    ],
    subscribers: 234,
    openRate: 73.2,
    clickRate: 15.8,
    revenue: 1890,
    createdDate: '2024-01-01'
  },
  {
    id: '2',
    name: 'Anniversaire Client',
    trigger: 'Date anniversaire',
    status: 'active',
    emails: [
      { id: '4', subject: '🎂 Joyeux anniversaire !', delay: 0, template: 'birthday', sent: 67, opened: 62, clicked: 23 }
    ],
    subscribers: 892,
    openRate: 92.5,
    clickRate: 37.1,
    revenue: 580,
    createdDate: '2024-01-01'
  },
  {
    id: '3',
    name: 'Réactivation Inactifs (30 jours)',
    trigger: 'Pas de commande depuis 30 jours',
    status: 'paused',
    emails: [
      { id: '5', subject: 'Nous vous avons manqué...', delay: 0, template: 'winback_1', sent: 145, opened: 89, clicked: 12 },
      { id: '6', subject: 'Offre spéciale retour', delay: 7, template: 'winback_2', sent: 89, opened: 45, clicked: 8 }
    ],
    subscribers: 456,
    openRate: 48.3,
    clickRate: 8.9,
    revenue: 320,
    createdDate: '2024-01-01'
  }
];

interface EmailMarketingViewProps {
  onBack?: () => void;
}

export function EmailMarketingView({ onBack }: EmailMarketingViewProps) {
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
      case 'active': return 'bg-green-100 text-green-800';
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
      case 'active': return <CheckCircle className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter': return <Mail className="w-4 h-4" />;
      case 'promotional': return <Target className="w-4 h-4" />;
      case 'automated': return <Zap className="w-4 h-4" />;
      case 'transactional': return <FileText className="w-4 h-4" />;
      case 'winback': return <Heart className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, opened: number) => {
    if (opened === 0) return 0;
    return ((clicked / opened) * 100).toFixed(1);
  };

  const totalSent = mockCampaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const totalOpened = mockCampaigns.reduce((sum, c) => sum + c.openCount, 0);
  const totalClicked = mockCampaigns.reduce((sum, c) => sum + c.clickCount, 0);
  const totalRevenue = mockCampaigns.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Créez des campagnes email performantes et automatisées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowTemplateModal(true)}>
            <FileText className="w-4 h-4" />
            Modèles
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowAutomationModal(true)}>
            <Workflow className="w-4 h-4" />
            Automatisations
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emails envoyés</p>
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
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux d'ouverture</p>
                  <p className="text-2xl font-bold">{calculateOpenRate(totalOpened, totalSent)}%</p>
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
                  <p className="text-2xl font-bold">{calculateClickRate(totalClicked, totalOpened)}%</p>
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
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenus générés</p>
                  <p className="text-2xl font-bold">€{totalRevenue}</p>
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
              <Mail className="w-8 h-8 text-blue-500" />
              <span>Newsletter</span>
              <span className="text-xs text-gray-500">Hebdomadaire</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Target className="w-8 h-8 text-red-500" />
              <span>Promotion</span>
              <span className="text-xs text-gray-500">Offre spéciale</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              <span>Automatisation</span>
              <span className="text-xs text-gray-500">Série d'emails</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <span>Reconquête</span>
              <span className="text-xs text-gray-500">Clients inactifs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Modèles populaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                  {getTypeIcon(template.type)}
                </div>
                <h4 className="font-semibold mb-2">{template.name}</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{template.usageCount} utilisations</span>
                  <Button size="sm" variant="ghost">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes récentes</CardTitle>
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
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                      <p className="text-xs text-gray-500">
                        {campaign.audience} • Créé le {new Date(campaign.createdDate).toLocaleDateString('fr-FR')}
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
                  </div>
                </div>

                {/* Preview Text */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{campaign.previewText}</p>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{campaign.sentCount}</p>
                    <p className="text-xs text-gray-600">Envoyés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{campaign.openCount}</p>
                    <p className="text-xs text-gray-600">Ouverts ({calculateOpenRate(campaign.openCount, campaign.sentCount)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{campaign.clickCount}</p>
                    <p className="text-xs text-gray-600">Clics ({calculateClickRate(campaign.clickCount, campaign.openCount)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{campaign.unsubscribeCount}</p>
                    <p className="text-xs text-gray-600">Désabonnés</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{campaign.bounceCount}</p>
                    <p className="text-xs text-gray-600">Bounces</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">€{campaign.revenue}</p>
                    <p className="text-xs text-gray-600">Revenus</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Automatisations actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAutomations.map((automation) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Switch checked={automation.status === 'active'} />
                    <div>
                      <h4 className="font-semibold">{automation.name}</h4>
                      <p className="text-sm text-gray-600">Déclencheur: {automation.trigger}</p>
                      <p className="text-xs text-gray-500">{automation.emails.length} email{automation.emails.length > 1 ? 's' : ''} dans la séquence</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{automation.subscribers} abonnés</p>
                    <p className="text-sm text-gray-600">{automation.openRate}% ouverture</p>
                    <p className="text-xs text-green-600">€{automation.revenue} générés</p>
                  </div>
                </div>

                {/* Automation Sequence */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  {automation.emails.map((email, index) => (
                    <div key={email.id} className="flex items-center gap-2 min-w-fit">
                      <div className="text-center p-2 border rounded bg-blue-50 min-w-[120px]">
                        <p className="text-xs font-medium">{email.subject}</p>
                        <p className="text-xs text-gray-600">J+{email.delay}</p>
                        <p className="text-xs text-blue-600">{email.sent} envoyés</p>
                      </div>
                      {index < automation.emails.length - 1 && (
                        <div className="w-4 h-0.5 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une campagne email</DialogTitle>
            <DialogDescription>
              Configurez votre campagne email marketing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignName">Nom de la campagne</Label>
                <Input id="campaignName" placeholder="Ex: Newsletter Janvier" />
              </div>
              <div>
                <Label htmlFor="campaignType">Type de campagne</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotionnelle</SelectItem>
                    <SelectItem value="automated">Automatisée</SelectItem>
                    <SelectItem value="winback">Reconquête</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Objet de l'email</Label>
              <Input id="subject" placeholder="Ex: 🍽️ Nouveautés de la semaine !" />
            </div>

            <div>
              <Label htmlFor="preview">Texte de prévisualisation</Label>
              <Input id="preview" placeholder="Aperçu affiché dans la boîte de réception..." />
            </div>

            <div>
              <Label htmlFor="template">Modèle</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="audience">Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les abonnés</SelectItem>
                  <SelectItem value="vip">Clients VIP</SelectItem>
                  <SelectItem value="active">Clients actifs</SelectItem>
                  <SelectItem value="inactive">Clients inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Mail className="w-4 h-4 mr-2" />
                Créer la campagne
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}