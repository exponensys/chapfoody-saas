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
  Bell, 
  Smartphone, 
  Send, 
  Users,
  Eye,
  Edit,
  Plus,
  Play,
  Pause,
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle,
  Globe,
  MapPin,
  Calendar,
  ShoppingCart,
  Heart,
  Settings
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'promotional' | 'transactional' | 'reminder' | 'breaking_news' | 'location_based';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  audience: string;
  scheduledDate?: string;
  platform: 'all' | 'ios' | 'android' | 'web';
  priority: 'low' | 'normal' | 'high';
  actionButton?: string;
  actionUrl?: string;
  icon?: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  conversions: number;
  revenue: number;
  createdDate: string;
  tags: string[];
}

interface PushSubscriber {
  id: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  customerName: string;
  customerId: string;
  subscriptionDate: string;
  lastSeen: string;
  isActive: boolean;
  preferences: NotificationPreferences;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
}

interface NotificationPreferences {
  promotional: boolean;
  transactional: boolean;
  reminders: boolean;
  news: boolean;
  locationBased: boolean;
  timeRestrictions: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: PushNotification['type'];
  title: string;
  message: string;
  icon: string;
  actionButton?: string;
  usageCount: number;
  averageOpenRate: number;
  averageClickRate: number;
}

const mockNotifications: PushNotification[] = [
  {
    id: '1',
    title: '🍕 Offre Flash Midi !',
    message: 'Menu du jour à 12€ au lieu de 15€. Plus que 2h pour en profiter !',
    type: 'promotional',
    status: 'sent',
    audience: 'Clients proximité (500m)',
    platform: 'all',
    priority: 'high',
    actionButton: 'Commander maintenant',
    actionUrl: '/menu',
    icon: 'pizza',
    sent: 1245,
    delivered: 1198,
    opened: 456,
    clicked: 89,
    conversions: 23,
    revenue: 276,
    createdDate: '2024-01-14',
    tags: ['flash', 'lunch', 'discount']
  },
  {
    id: '2',
    title: '📦 Votre commande est en route !',
    message: 'Le livreur est parti ! Livraison estimée dans 15 minutes.',
    type: 'transactional',
    status: 'sent',
    audience: 'Commandes en cours',
    platform: 'all',
    priority: 'high',
    actionButton: 'Suivre',
    actionUrl: '/track',
    icon: 'delivery',
    sent: 89,
    delivered: 89,
    opened: 76,
    clicked: 12,
    conversions: 0,
    revenue: 0,
    createdDate: '2024-01-14',
    tags: ['delivery', 'tracking', 'urgent']
  },
  {
    id: '3',
    title: '🎉 Nouveau menu disponible !',
    message: 'Découvrez nos nouvelles spécialités de saison. Première commande avec 10% offerts !',
    type: 'promotional',
    status: 'scheduled',
    audience: 'Tous les abonnés',
    scheduledDate: '2024-01-20T11:00:00',
    platform: 'all',
    priority: 'normal',
    actionButton: 'Découvrir',
    actionUrl: '/new-menu',
    icon: 'menu',
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    revenue: 0,
    createdDate: '2024-01-15',
    tags: ['new', 'menu', 'seasonal']
  },
  {
    id: '4',
    title: '⏰ N\'oubliez pas votre panier !',
    message: 'Vos plats favoris vous attendent. Finalisez votre commande avant qu\'il ne soit trop tard.',
    type: 'reminder',
    status: 'sending',
    audience: 'Paniers abandonnés (30min)',
    platform: 'all',
    priority: 'normal',
    actionButton: 'Finaliser',
    actionUrl: '/cart',
    icon: 'cart',
    sent: 156,
    delivered: 145,
    opened: 34,
    clicked: 8,
    conversions: 3,
    revenue: 67,
    createdDate: '2024-01-14',
    tags: ['cart', 'reminder', 'recovery']
  }
];

const mockSubscribers: PushSubscriber[] = [
  {
    id: '1',
    deviceToken: 'abc123...def456',
    platform: 'ios',
    customerName: 'Marie Dubois',
    customerId: 'cust_001',
    subscriptionDate: '2024-01-01',
    lastSeen: '2024-01-14T10:30:00',
    isActive: true,
    preferences: {
      promotional: true,
      transactional: true,
      reminders: true,
      news: false,
      locationBased: true,
      timeRestrictions: {
        enabled: true,
        startTime: '08:00',
        endTime: '22:00'
      }
    },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris'
    }
  },
  {
    id: '2',
    deviceToken: 'xyz789...uvw012',
    platform: 'android',
    customerName: 'Jean Martin',
    customerId: 'cust_002',
    subscriptionDate: '2024-01-05',
    lastSeen: '2024-01-14T15:45:00',
    isActive: true,
    preferences: {
      promotional: false,
      transactional: true,
      reminders: true,
      news: true,
      locationBased: false,
      timeRestrictions: {
        enabled: false,
        startTime: '09:00',
        endTime: '21:00'
      }
    }
  },
  {
    id: '3',
    deviceToken: 'lmn345...qrs678',
    platform: 'web',
    customerName: 'Sophie Laurent',
    customerId: 'cust_003',
    subscriptionDate: '2024-01-10',
    lastSeen: '2024-01-13T20:15:00',
    isActive: false,
    preferences: {
      promotional: true,
      transactional: true,
      reminders: false,
      news: true,
      locationBased: true,
      timeRestrictions: {
        enabled: true,
        startTime: '10:00',
        endTime: '20:00'
      }
    }
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Offre Flash',
    type: 'promotional',
    title: '⚡ Offre Flash - {discount}% !',
    message: '{offer_description}. Plus que {time_left} pour en profiter !',
    icon: 'flash',
    actionButton: 'En profiter',
    usageCount: 45,
    averageOpenRate: 38.5,
    averageClickRate: 12.3
  },
  {
    id: '2',
    name: 'Commande Prête',
    type: 'transactional',
    title: '✅ Votre commande #{order_id} est prête !',
    message: 'Vous pouvez venir récupérer votre commande au comptoir.',
    icon: 'ready',
    actionButton: 'Détails',
    usageCount: 234,
    averageOpenRate: 89.2,
    averageClickRate: 23.1
  },
  {
    id: '3',
    name: 'Panier Abandonné',
    type: 'reminder',
    title: '🛒 Votre panier vous attend !',
    message: 'N\'oubliez pas vos {items_count} articles. Finalisez avant qu\'ils ne soient plus disponibles.',
    icon: 'cart',
    actionButton: 'Voir mon panier',
    usageCount: 67,
    averageOpenRate: 42.8,
    averageClickRate: 18.9
  },
  {
    id: '4',
    name: 'Proximité Restaurant',
    type: 'location_based',
    title: '📍 Vous êtes près de chez nous !',
    message: 'Profitez de notre happy hour jusqu\'à 18h. 20% sur toutes les boissons !',
    icon: 'location',
    actionButton: 'Voir l\'offre',
    usageCount: 23,
    averageOpenRate: 52.1,
    averageClickRate: 28.7
  }
];

interface PushNotificationsViewProps {
  onBack?: () => void;
}

export function PushNotificationsView({ onBack }: PushNotificationsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<PushSubscriber | null>(null);

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
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotional': return <Target className="w-4 h-4" />;
      case 'transactional': return <CheckCircle className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'breaking_news': return <AlertCircle className="w-4 h-4" />;
      case 'location_based': return <MapPin className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'web': return '🌐';
      case 'all': return '📱';
      default: return '📱';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOpenRate = (opened: number, delivered: number) => {
    if (delivered === 0) return 0;
    return ((opened / delivered) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, opened: number) => {
    if (opened === 0) return 0;
    return ((clicked / opened) * 100).toFixed(1);
  };

  const totalSent = mockNotifications.reduce((sum, n) => sum + n.sent, 0);
  const totalDelivered = mockNotifications.reduce((sum, n) => sum + n.delivered, 0);
  const totalOpened = mockNotifications.reduce((sum, n) => sum + n.opened, 0);
  const totalRevenue = mockNotifications.reduce((sum, n) => sum + n.revenue, 0);

  const activeSubscribers = mockSubscribers.filter(s => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Notifications Push</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Engagez vos clients avec des notifications instantanées et ciblées</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowTemplateModal(true)}>
            <Bell className="w-4 h-4" />
            Modèles
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouvelle notification
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
                  <p className="text-sm text-gray-600">Abonnés actifs</p>
                  <p className="text-2xl font-bold">{activeSubscribers}</p>
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
                  <Send className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de livraison</p>
                  <p className="text-2xl font-bold">{totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0}%</p>
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
                  <p className="text-sm text-gray-600">Taux d'ouverture</p>
                  <p className="text-2xl font-bold">{calculateOpenRate(totalOpened, totalDelivered)}%</p>
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

      {/* Quick Send Options */}
      <Card>
        <CardHeader>
          <CardTitle>Envoi rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <Target className="w-8 h-8 text-red-500" />
              <span>Offre Flash</span>
              <span className="text-xs text-gray-500">Promotion urgente</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <MapPin className="w-8 h-8 text-blue-500" />
              <span>Géolocalisée</span>
              <span className="text-xs text-gray-500">Clients à proximité</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
              <span>Panier abandonné</span>
              <span className="text-xs text-gray-500">Rappel automatique</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
              <AlertCircle className="w-8 h-8 text-purple-500" />
              <span>Info importante</span>
              <span className="text-xs text-gray-500">Communication urgente</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Push Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Modèles de notifications populaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white">
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-xs text-gray-600 capitalize">{template.type.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{template.title}</p>
                  <p className="text-sm text-gray-600">{template.message}</p>
                  {template.actionButton && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {template.actionButton}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold">{template.usageCount}</p>
                    <p className="text-gray-600">Utilisations</p>
                  </div>
                  <div>
                    <p className="font-bold text-green-600">{template.averageOpenRate}%</p>
                    <p className="text-gray-600">Ouverture</p>
                  </div>
                  <div>
                    <p className="font-bold text-blue-600">{template.averageClickRate}%</p>
                    <p className="text-gray-600">Clics</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-lg flex items-center justify-center text-white">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs">
                          {getPlatformIcon(notification.platform)} {notification.platform}
                        </span>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{notification.audience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(notification.status)}>
                      {getStatusIcon(notification.status)}
                      <span className="ml-1 capitalize">{notification.status}</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                {notification.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {notification.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{notification.sent}</p>
                    <p className="text-xs text-gray-600">Envoyées</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{notification.delivered}</p>
                    <p className="text-xs text-gray-600">Livrées ({notification.sent > 0 ? ((notification.delivered / notification.sent) * 100).toFixed(0) : 0}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{notification.opened}</p>
                    <p className="text-xs text-gray-600">Ouvertes ({calculateOpenRate(notification.opened, notification.delivered)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{notification.clicked}</p>
                    <p className="text-xs text-gray-600">Clics ({calculateClickRate(notification.clicked, notification.opened)}%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">{notification.conversions}</p>
                    <p className="text-xs text-gray-600">Conversions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-700">€{notification.revenue}</p>
                    <p className="text-xs text-gray-600">Revenus</p>
                  </div>
                </div>

                {/* Scheduled Info */}
                {notification.status === 'scheduled' && notification.scheduledDate && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-purple-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Programmée pour le {new Date(notification.scheduledDate).toLocaleDateString('fr-FR')} à {new Date(notification.scheduledDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Abonnés aux notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubscribers.map((subscriber) => (
              <motion.div
                key={subscriber.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#f4b71b] rounded-full flex items-center justify-center text-white font-semibold">
                      {subscriber.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{subscriber.customerName}</h4>
                      <p className="text-sm text-gray-600">
                        {getPlatformIcon(subscriber.platform)} {subscriber.platform} • 
                        Inscrit le {new Date(subscriber.subscriptionDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Dernière activité: {new Date(subscriber.lastSeen).toLocaleDateString('fr-FR')}
                        {subscriber.location && ` • ${subscriber.location.city}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p>Préférences:</p>
                      <div className="flex gap-1">
                        {subscriber.preferences.promotional && <Badge variant="outline" className="text-xs">Promo</Badge>}
                        {subscriber.preferences.transactional && <Badge variant="outline" className="text-xs">Transac</Badge>}
                        {subscriber.preferences.reminders && <Badge variant="outline" className="text-xs">Rappels</Badge>}
                        {subscriber.preferences.locationBased && <Badge variant="outline" className="text-xs">Géoloc</Badge>}
                      </div>
                    </div>
                    <Badge className={subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {subscriber.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedSubscriber(subscriber);
                        setShowSubscriberModal(true);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Notification Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une notification push</DialogTitle>
            <DialogDescription>
              Configurez votre notification pour engager vos clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notifTitle">Titre de la notification</Label>
                <Input id="notifTitle" placeholder="Ex: 🍕 Offre Flash Midi !" />
              </div>
              <div>
                <Label htmlFor="notifType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de notification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotional">Promotionnelle</SelectItem>
                    <SelectItem value="transactional">Transactionnelle</SelectItem>
                    <SelectItem value="reminder">Rappel</SelectItem>
                    <SelectItem value="breaking_news">Info importante</SelectItem>
                    <SelectItem value="location_based">Géolocalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notifMessage">Message</Label>
              <Textarea id="notifMessage" placeholder="Rédigez votre message..." />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="platform">Plateforme</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="ios">iOS seulement</SelectItem>
                    <SelectItem value="android">Android seulement</SelectItem>
                    <SelectItem value="web">Web seulement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les abonnés</SelectItem>
                    <SelectItem value="nearby">Clients à proximité</SelectItem>
                    <SelectItem value="active">Clients actifs</SelectItem>
                    <SelectItem value="inactive">Clients inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actionButton">Bouton d'action (optionnel)</Label>
                <Input id="actionButton" placeholder="Ex: Commander maintenant" />
              </div>
              <div>
                <Label htmlFor="actionUrl">URL d'action (optionnel)</Label>
                <Input id="actionUrl" placeholder="/menu" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Send className="w-4 h-4 mr-2" />
                Envoyer maintenant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscriber Settings Modal */}
      <Dialog open={showSubscriberModal} onOpenChange={setShowSubscriberModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Préférences de {selectedSubscriber?.customerName}</DialogTitle>
            <DialogDescription>
              Gérez les préférences de notification de ce client.
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="space-y-6">
              {/* Device Info */}
              <div>
                <h4 className="font-semibold mb-3">Informations de l'appareil</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Plateforme:</span> {getPlatformIcon(selectedSubscriber.platform)} {selectedSubscriber.platform}</div>
                  <div><span className="text-gray-600">Statut:</span> {selectedSubscriber.isActive ? 'Actif' : 'Inactif'}</div>
                  <div><span className="text-gray-600">Inscription:</span> {new Date(selectedSubscriber.subscriptionDate).toLocaleDateString('fr-FR')}</div>
                  <div><span className="text-gray-600">Dernière activité:</span> {new Date(selectedSubscriber.lastSeen).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="font-semibold mb-3">Préférences de notification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Notifications promotionnelles</span>
                    <Switch checked={selectedSubscriber.preferences.promotional} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notifications transactionnelles</span>
                    <Switch checked={selectedSubscriber.preferences.transactional} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rappels</span>
                    <Switch checked={selectedSubscriber.preferences.reminders} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Actualités</span>
                    <Switch checked={selectedSubscriber.preferences.news} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notifications géolocalisées</span>
                    <Switch checked={selectedSubscriber.preferences.locationBased} />
                  </div>
                </div>
              </div>

              {/* Time Restrictions */}
              <div>
                <h4 className="font-semibold mb-3">Restrictions horaires</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Activer les restrictions horaires</span>
                    <Switch checked={selectedSubscriber.preferences.timeRestrictions.enabled} />
                  </div>
                  {selectedSubscriber.preferences.timeRestrictions.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Heure de début</Label>
                        <Input type="time" defaultValue={selectedSubscriber.preferences.timeRestrictions.startTime} />
                      </div>
                      <div>
                        <Label>Heure de fin</Label>
                        <Input type="time" defaultValue={selectedSubscriber.preferences.timeRestrictions.endTime} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSubscriberModal(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Settings className="w-4 h-4 mr-2" />
                  Sauvegarder les préférences
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}