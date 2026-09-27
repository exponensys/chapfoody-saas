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
import { Switch } from './ui/switch';
import { 
  Zap, 
  Plus, 
  Edit, 
  Play, 
  Pause,
  Settings,
  Clock,
  Mail,
  Smartphone,
  Users,
  ShoppingCart,
  Calendar,
  Gift,
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Activity,
  Workflow
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  trigger: TriggerEvent;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  enabled: boolean;
  triggerCount: number;
  successRate: number;
  revenue: number;
  createdDate: string;
  lastTriggered?: string;
}

interface TriggerEvent {
  type: 'customer_signup' | 'first_order' | 'order_placed' | 'cart_abandoned' | 'birthday' | 'no_activity' | 'order_delivered' | 'review_received';
  delay?: number; // en minutes
}

interface TriggerCondition {
  type: 'order_value' | 'customer_segment' | 'location' | 'time_of_day' | 'day_of_week';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

interface TriggerAction {
  type: 'send_email' | 'send_sms' | 'add_points' | 'send_coupon' | 'assign_segment' | 'create_task';
  template?: string;
  value?: string | number;
  delay?: number; // en minutes
}

const mockTriggers: AutomationTrigger[] = [
  {
    id: '1',
    name: 'Bienvenue nouveau client',
    description: 'Email et SMS de bienvenue avec offre première commande',
    trigger: { type: 'customer_signup', delay: 15 },
    conditions: [],
    actions: [
      { type: 'send_email', template: 'welcome_email', delay: 15 },
      { type: 'send_coupon', value: '10WELCOME', delay: 30 },
      { type: 'add_points', value: 100, delay: 0 }
    ],
    enabled: true,
    triggerCount: 234,
    successRate: 78.5,
    revenue: 3450,
    createdDate: '2024-01-01',
    lastTriggered: '2024-01-14T10:30:00'
  },
  {
    id: '2',
    name: 'Récupération panier abandonné',
    description: 'Séquence de 3 emails pour récupérer les paniers abandonnés',
    trigger: { type: 'cart_abandoned', delay: 60 },
    conditions: [
      { type: 'order_value', operator: 'greater_than', value: 20 }
    ],
    actions: [
      { type: 'send_email', template: 'cart_reminder_1', delay: 60 },
      { type: 'send_email', template: 'cart_reminder_2', delay: 1440 },
      { type: 'send_coupon', value: '5EURO', delay: 2880 }
    ],
    enabled: true,
    triggerCount: 189,
    successRate: 34.2,
    revenue: 2890,
    createdDate: '2024-01-01',
    lastTriggered: '2024-01-14T14:15:00'
  },
  {
    id: '3',
    name: 'Anniversaire client VIP',
    description: 'Cadeau spécial pour les clients VIP le jour de leur anniversaire',
    trigger: { type: 'birthday', delay: 0 },
    conditions: [
      { type: 'customer_segment', operator: 'equals', value: 'VIP' }
    ],
    actions: [
      { type: 'send_email', template: 'birthday_vip', delay: 0 },
      { type: 'send_coupon', value: 'BIRTHDAY25', delay: 0 },
      { type: 'add_points', value: 250, delay: 0 }
    ],
    enabled: true,
    triggerCount: 45,
    successRate: 89.1,
    revenue: 1250,
    createdDate: '2024-01-01',
    lastTriggered: '2024-01-14T09:00:00'
  },
  {
    id: '4',
    name: 'Réactivation clients inactifs',
    description: 'Offre spéciale pour les clients inactifs depuis 90 jours',
    trigger: { type: 'no_activity', delay: 0 },
    conditions: [
      { type: 'order_value', operator: 'greater_than', value: 50 }
    ],
    actions: [
      { type: 'send_email', template: 'winback_offer', delay: 0 },
      { type: 'send_coupon', value: 'RETURN20', delay: 60 },
      { type: 'send_sms', template: 'winback_sms', delay: 1440 }
    ],
    enabled: false,
    triggerCount: 67,
    successRate: 23.8,
    revenue: 890,
    createdDate: '2024-01-01',
    lastTriggered: '2024-01-10T16:45:00'
  },
  {
    id: '5',
    name: 'Merci après livraison',
    description: 'SMS de remerciement et demande d\'avis après livraison',
    trigger: { type: 'order_delivered', delay: 30 },
    conditions: [],
    actions: [
      { type: 'send_sms', template: 'delivery_thanks', delay: 30 },
      { type: 'send_email', template: 'review_request', delay: 1440 }
    ],
    enabled: true,
    triggerCount: 567,
    successRate: 91.3,
    revenue: 0,
    createdDate: '2024-01-01',
    lastTriggered: '2024-01-14T18:20:00'
  }
];

const triggerTypes = [
  { value: 'customer_signup', label: 'Inscription client', icon: Users },
  { value: 'first_order', label: 'Première commande', icon: ShoppingCart },
  { value: 'order_placed', label: 'Commande passée', icon: ShoppingCart },
  { value: 'cart_abandoned', label: 'Panier abandonné', icon: ShoppingCart },
  { value: 'birthday', label: 'Anniversaire', icon: Calendar },
  { value: 'no_activity', label: 'Inactivité client', icon: Clock },
  { value: 'order_delivered', label: 'Commande livrée', icon: CheckCircle },
  { value: 'review_received', label: 'Avis reçu', icon: Target }
];

const actionTypes = [
  { value: 'send_email', label: 'Envoyer un email', icon: Mail },
  { value: 'send_sms', label: 'Envoyer un SMS', icon: Smartphone },
  { value: 'add_points', label: 'Ajouter des points', icon: Gift },
  { value: 'send_coupon', label: 'Envoyer un coupon', icon: Target },
  { value: 'assign_segment', label: 'Assigner un segment', icon: Users },
  { value: 'create_task', label: 'Créer une tâche', icon: CheckCircle }
];

interface AutomationTriggersViewProps {
  onBack?: () => void;
}

export function AutomationTriggersView({ onBack }: AutomationTriggersViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTrigger | null>(null);

  const getTriggerIcon = (type: string) => {
    const triggerType = triggerTypes.find(t => t.value === type);
    return triggerType ? triggerType.icon : Zap;
  };

  const getActionIcon = (type: string) => {
    const actionType = actionTypes.find(a => a.value === type);
    return actionType ? actionType.icon : Settings;
  };

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return 'Immédiat';
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)} jour${Math.floor(minutes / 1440) > 1 ? 's' : ''}`;
  };

  const totalTriggers = mockTriggers.reduce((sum, t) => sum + t.triggerCount, 0);
  const averageSuccessRate = mockTriggers.reduce((sum, t) => sum + t.successRate, 0) / mockTriggers.length;
  const totalRevenue = mockTriggers.reduce((sum, t) => sum + t.revenue, 0);
  const activeTriggers = mockTriggers.filter(t => t.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Déclencheurs Automatiques</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Automatisez vos interactions marketing avec vos clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Performances
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau déclencheur
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
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Déclencheurs actifs</p>
                  <p className="text-2xl font-bold">{activeTriggers}</p>
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
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total exécutions</p>
                  <p className="text-2xl font-bold">{totalTriggers}</p>
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
                  <p className="text-sm text-gray-600">Taux de succès</p>
                  <p className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</p>
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

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Modèles d'automatisation populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-3 h-auto p-4">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="text-center">
                <p className="font-medium">Série de bienvenue</p>
                <p className="text-xs text-gray-500">3 emails + points</p>
              </div>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-3 h-auto p-4">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
              <div className="text-center">
                <p className="font-medium">Panier abandonné</p>
                <p className="text-xs text-gray-500">Rappels + coupon</p>
              </div>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-3 h-auto p-4">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div className="text-center">
                <p className="font-medium">Anniversaire</p>
                <p className="text-xs text-gray-500">Cadeau + points</p>
              </div>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-3 h-auto p-4">
              <Clock className="w-8 h-8 text-red-500" />
              <div className="text-center">
                <p className="font-medium">Réactivation</p>
                <p className="text-xs text-gray-500">Offre retour</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Triggers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Mes déclencheurs automatiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTriggers.map((trigger) => {
              const TriggerIcon = getTriggerIcon(trigger.trigger.type);
              return (
                <motion.div
                  key={trigger.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                        <TriggerIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{trigger.name}</h4>
                        <p className="text-sm text-gray-600">{trigger.description}</p>
                        <p className="text-xs text-gray-500">
                          Créé le {new Date(trigger.createdDate).toLocaleDateString('fr-FR')}
                          {trigger.lastTriggered && ` • Dernière exécution: ${new Date(trigger.lastTriggered).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={trigger.enabled} />
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Trigger Details */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#b70f23]" />
                      <span className="font-medium text-sm">
                        Déclencheur: {triggerTypes.find(t => t.value === trigger.trigger.type)?.label}
                      </span>
                      {trigger.trigger.delay && trigger.trigger.delay > 0 && (
                        <Badge variant="outline">
                          Délai: {formatDelay(trigger.trigger.delay)}
                        </Badge>
                      )}
                    </div>
                    {trigger.conditions.length > 0 && (
                      <div className="text-xs text-gray-600">
                        Conditions: {trigger.conditions.length} critère{trigger.conditions.length > 1 ? 's' : ''} défini{trigger.conditions.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Actions automatiques:</h5>
                    <div className="flex flex-wrap gap-2">
                      {trigger.actions.map((action, index) => {
                        const ActionIcon = getActionIcon(action.type);
                        return (
                          <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded px-2 py-1 text-xs">
                            <ActionIcon className="w-3 h-3" />
                            <span>{actionTypes.find(a => a.value === action.type)?.label}</span>
                            {action.delay && action.delay > 0 && (
                              <span className="text-blue-500">({formatDelay(action.delay)})</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center border-t pt-4">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{trigger.triggerCount}</p>
                      <p className="text-xs text-gray-600">Exécutions</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{trigger.successRate}%</p>
                      <p className="text-xs text-gray-600">Succès</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">€{trigger.revenue}</p>
                      <p className="text-xs text-gray-600">Revenus</p>
                    </div>
                    <div>
                      <Badge className={trigger.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {trigger.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Trigger Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau déclencheur</DialogTitle>
            <DialogDescription>
              Configurez un déclencheur automatique pour interagir avec vos clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="triggerName">Nom du déclencheur</Label>
                <Input id="triggerName" placeholder="Ex: Bienvenue nouveau client" />
              </div>
              <div>
                <Label htmlFor="triggerType">Type d'événement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'événement" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Décrivez ce que fait ce déclencheur..." />
            </div>

            <div>
              <Label htmlFor="delay">Délai d'exécution</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input id="delay" type="number" placeholder="15" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Heures</SelectItem>
                    <SelectItem value="days">Jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Actions à exécuter</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choisir une action" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Zap className="w-4 h-4 mr-2" />
                Créer le déclencheur
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}