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
  Facebook, 
  Users, 
  Target, 
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Edit,
  Play,
  Pause,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface FacebookAudience {
  id: string;
  name: string;
  size: number;
  status: 'active' | 'syncing' | 'paused' | 'error';
  lastSync: string;
  source: 'customers' | 'email_list' | 'website_visitors' | 'app_users';
  criteria: string[];
  campaignsUsing: number;
  reach: number;
  engagementRate: number;
  adSpend: number;
  roi: number;
}

interface SyncSettings {
  autoSync: boolean;
  syncFrequency: 'daily' | 'weekly' | 'monthly';
  includeEmails: boolean;
  includePhones: boolean;
  minPurchaseAmount: number;
  lastPurchaseDays: number;
}

const mockAudiences: FacebookAudience[] = [
  {
    id: '1',
    name: 'Clients VIP - Gros Acheteurs',
    size: 234,
    status: 'active',
    lastSync: '2024-01-14T10:30:00',
    source: 'customers',
    criteria: ['Total achats > 500€', 'Fréquence > 10 visites'],
    campaignsUsing: 3,
    reach: 1890,
    engagementRate: 4.8,
    adSpend: 145,
    roi: 320
  },
  {
    id: '2',
    name: 'Clients Fréquents',
    size: 567,
    status: 'active',
    lastSync: '2024-01-14T08:15:00',
    source: 'customers',
    criteria: ['Visites > 5', 'Dernière commande < 30 jours'],
    campaignsUsing: 2,
    reach: 4200,
    engagementRate: 3.2,
    adSpend: 230,
    roi: 280
  },
  {
    id: '3',
    name: 'Clients Inactifs - Reconquête',
    size: 189,
    status: 'syncing',
    lastSync: '2024-01-13T16:45:00',
    source: 'customers',
    criteria: ['Dernière commande > 60 jours', 'Total achats > 100€'],
    campaignsUsing: 1,
    reach: 1200,
    engagementRate: 2.1,
    adSpend: 80,
    roi: 150
  },
  {
    id: '4',
    name: 'Nouveaux Clients - Onboarding',
    size: 123,
    status: 'paused',
    lastSync: '2024-01-12T14:20:00',
    source: 'customers',
    criteria: ['Première commande < 7 jours'],
    campaignsUsing: 0,
    reach: 890,
    engagementRate: 5.4,
    adSpend: 0,
    roi: 0
  }
];

const syncSettings: SyncSettings = {
  autoSync: true,
  syncFrequency: 'daily',
  includeEmails: true,
  includePhones: true,
  minPurchaseAmount: 25,
  lastPurchaseDays: 90
};

interface FacebookAudienceSyncViewProps {
  onBack?: () => void;
}

export function FacebookAudienceSyncView({ onBack }: FacebookAudienceSyncViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<SyncSettings>(syncSettings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'customers': return 'Base clients';
      case 'email_list': return 'Liste email';
      case 'website_visitors': return 'Visiteurs site';
      case 'app_users': return 'Utilisateurs app';
      default: return source;
    }
  };

  const totalAudienceSize = mockAudiences.reduce((sum, audience) => sum + audience.size, 0);
  const totalReach = mockAudiences.reduce((sum, audience) => sum + audience.reach, 0);
  const avgEngagement = mockAudiences.reduce((sum, audience) => sum + audience.engagementRate, 0) / mockAudiences.length;
  const avgROI = mockAudiences.reduce((sum, audience) => sum + audience.roi, 0) / mockAudiences.filter(a => a.roi > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Facebook Audience Sync</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Synchronisez vos segments clients avec Facebook Ads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4" />
            Paramètres
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
            Nouvelle audience
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Facebook Business Manager</h3>
                <p className="text-sm text-gray-600">Connecté • Dernière sync: il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connecté
              </Badge>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-sm text-gray-600">Audiences créées</p>
                  <p className="text-2xl font-bold">{mockAudiences.length}</p>
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
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients synchronisés</p>
                  <p className="text-2xl font-bold">{totalAudienceSize.toLocaleString()}</p>
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
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Portée totale</p>
                  <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
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
                  <p className="text-sm text-gray-600">ROI moyen</p>
                  <p className="text-2xl font-bold">+{Math.round(avgROI)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sync Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Statut de synchronisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold">Synchronisation active</h4>
              <p className="text-sm text-gray-600">Mise à jour automatique toutes les 24h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold">Audiences créées</h4>
              <p className="text-sm text-gray-600">{mockAudiences.length} segments synchronisés</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold">Performance</h4>
              <p className="text-sm text-gray-600">{avgEngagement.toFixed(1)}% d'engagement moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audiences List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes audiences Facebook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAudiences.map((audience) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{audience.name}</h4>
                      <p className="text-sm text-gray-600">
                        {getSourceLabel(audience.source)} • {audience.size.toLocaleString()} contacts
                      </p>
                      <p className="text-xs text-gray-500">
                        Dernière sync: {new Date(audience.lastSync).toLocaleDateString('fr-FR')} à {new Date(audience.lastSync).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(audience.status)}>
                      {getStatusIcon(audience.status)}
                      <span className="ml-1 capitalize">{audience.status}</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Criteria */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Critères de segmentation:</h5>
                  <div className="flex flex-wrap gap-2">
                    {audience.criteria.map((criterion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{audience.size}</p>
                    <p className="text-xs text-gray-600">Contacts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{audience.reach.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Portée</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{audience.engagementRate}%</p>
                    <p className="text-xs text-gray-600">Engagement</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">€{audience.adSpend}</p>
                    <p className="text-xs text-gray-600">Dépenses pub</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">+{audience.roi}%</p>
                    <p className="text-xs text-gray-600">ROI</p>
                  </div>
                </div>

                {audience.campaignsUsing > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Utilisée dans {audience.campaignsUsing} campagne{audience.campaignsUsing > 1 ? 's' : ''} active{audience.campaignsUsing > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Audience Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle audience Facebook</DialogTitle>
            <DialogDescription>
              Configurez les critères pour créer un segment client personnalisé.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="audienceName">Nom de l'audience</Label>
              <Input id="audienceName" placeholder="Ex: Clients VIP Restaurants" />
            </div>
            
            <div>
              <Label htmlFor="source">Source des données</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customers">Base clients CHAPFOODY</SelectItem>
                  <SelectItem value="email_list">Liste email externe</SelectItem>
                  <SelectItem value="website_visitors">Visiteurs du site web</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">Montant min. des achats (€)</Label>
                <Input id="minAmount" type="number" placeholder="100" />
              </div>
              <div>
                <Label htmlFor="frequency">Nombre min. de visites</Label>
                <Input id="frequency" type="number" placeholder="3" />
              </div>
            </div>

            <div>
              <Label htmlFor="lastPurchase">Dernière commande (jours)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 derniers jours</SelectItem>
                  <SelectItem value="30">30 derniers jours</SelectItem>
                  <SelectItem value="90">90 derniers jours</SelectItem>
                  <SelectItem value="365">Année dernière</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Users className="w-4 h-4 mr-2" />
                Créer l'audience
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Paramètres de synchronisation</DialogTitle>
            <DialogDescription>
              Configurez la synchronisation automatique avec Facebook.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Synchronisation automatique</h4>
                <p className="text-sm text-gray-600">Synchroniser automatiquement les audiences</p>
              </div>
              <Switch 
                checked={settings.autoSync} 
                onCheckedChange={(checked) => setSettings({...settings, autoSync: checked})}
              />
            </div>

            <div>
              <Label htmlFor="frequency">Fréquence de synchronisation</Label>
              <Select value={settings.syncFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Données à inclure</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">Adresses email</span>
                <Switch 
                  checked={settings.includeEmails}
                  onCheckedChange={(checked) => setSettings({...settings, includeEmails: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Numéros de téléphone</span>
                <Switch 
                  checked={settings.includePhones}
                  onCheckedChange={(checked) => setSettings({...settings, includePhones: checked})}
                />
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