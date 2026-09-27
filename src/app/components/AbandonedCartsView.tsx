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
  ShoppingCart, 
  Mail, 
  Clock, 
  Euro, 
  TrendingUp,
  Plus,
  Edit,
  Send,
  Eye,
  RotateCcw,
  Users,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  Timer,
  Percent
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalValue: number;
  abandonedAt: string;
  emailsSent: number;
  lastEmailSent?: string;
  recovered: boolean;
  recoveredAt?: string;
  recoveredValue?: number;
  stage: 'recent' | 'reminder_sent' | 'followup_sent' | 'lost';
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface RecoveryTemplate {
  id: string;
  name: string;
  delay: number; // en heures
  subject: string;
  type: 'reminder' | 'discount' | 'urgency' | 'personal';
  discountPercent?: number;
  enabled: boolean;
}

const mockAbandonedCarts: AbandonedCart[] = [
  {
    id: '1',
    customerName: 'Marie Dubois',
    customerEmail: 'marie.dubois@email.com',
    items: [
      { id: '1', name: 'Menu Burger Deluxe', price: 15.90, quantity: 2 },
      { id: '2', name: 'Frites Maison', price: 4.50, quantity: 2 },
      { id: '3', name: 'Coca Cola', price: 2.50, quantity: 2 }
    ],
    totalValue: 45.80,
    abandonedAt: '2024-01-14T14:30:00',
    emailsSent: 1,
    lastEmailSent: '2024-01-14T15:30:00',
    recovered: false,
    stage: 'reminder_sent'
  },
  {
    id: '2',
    customerName: 'Jean Martin',
    customerEmail: 'jean.martin@email.com',
    items: [
      { id: '4', name: 'Pizza Margherita', price: 12.90, quantity: 1 },
      { id: '5', name: 'Salade César', price: 8.50, quantity: 1 }
    ],
    totalValue: 21.40,
    abandonedAt: '2024-01-14T12:15:00',
    emailsSent: 0,
    recovered: false,
    stage: 'recent'
  },
  {
    id: '3',
    customerName: 'Sophie Laurent',
    customerEmail: 'sophie.laurent@email.com',
    items: [
      { id: '6', name: 'Menu Familial', price: 35.90, quantity: 1 },
      { id: '7', name: 'Dessert Tiramisu', price: 6.50, quantity: 2 }
    ],
    totalValue: 48.90,
    abandonedAt: '2024-01-13T19:45:00',
    emailsSent: 2,
    lastEmailSent: '2024-01-14T09:45:00',
    recovered: true,
    recoveredAt: '2024-01-14T10:30:00',
    recoveredValue: 48.90,
    stage: 'recent'
  },
  {
    id: '4',
    customerName: 'Pierre Durand',
    customerEmail: 'pierre.durand@email.com',
    items: [
      { id: '8', name: 'Plat du Jour', price: 14.90, quantity: 1 }
    ],
    totalValue: 14.90,
    abandonedAt: '2024-01-12T13:20:00',
    emailsSent: 3,
    lastEmailSent: '2024-01-13T13:20:00',
    recovered: false,
    stage: 'lost'
  }
];

const recoveryTemplates: RecoveryTemplate[] = [
  {
    id: '1',
    name: 'Rappel Immédiat',
    delay: 1,
    subject: 'Vous avez oublié quelque chose dans votre panier !',
    type: 'reminder',
    enabled: true
  },
  {
    id: '2',
    name: 'Offre de Récupération',
    delay: 24,
    subject: 'Finalisez votre commande avec 10% de réduction !',
    type: 'discount',
    discountPercent: 10,
    enabled: true
  },
  {
    id: '3',
    name: 'Urgence - Dernière Chance',
    delay: 72,
    subject: 'Dernière chance ! Vos plats vous attendent',
    type: 'urgency',
    enabled: true
  }
];

interface AbandonedCartsViewProps {
  onBack?: () => void;
}

export function AbandonedCartsView({ onBack }: AbandonedCartsViewProps) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'recent': return 'bg-yellow-100 text-yellow-800';
      case 'reminder_sent': return 'bg-blue-100 text-blue-800';
      case 'followup_sent': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'recent': return 'Récent';
      case 'reminder_sent': return 'Rappel envoyé';
      case 'followup_sent': return 'Suivi envoyé';
      case 'lost': return 'Perdu';
      default: return stage;
    }
  };

  const calculateRecoveryRate = () => {
    const recovered = mockAbandonedCarts.filter(cart => cart.recovered).length;
    return ((recovered / mockAbandonedCarts.length) * 100).toFixed(1);
  };

  const getTotalAbandonedValue = () => {
    return mockAbandonedCarts
      .filter(cart => !cart.recovered)
      .reduce((sum, cart) => sum + cart.totalValue, 0);
  };

  const getRecoveredValue = () => {
    return mockAbandonedCarts
      .filter(cart => cart.recovered)
      .reduce((sum, cart) => sum + (cart.recoveredValue || 0), 0);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Paniers Abandonnés</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Récupérez les ventes perdues avec des emails automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowTemplateModal(true)}>
            <Edit className="w-4 h-4" />
            Modèles
          </Button>
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <Send className="w-4 h-4" />
            Campagne manuelle
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
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paniers abandonnés</p>
                  <p className="text-2xl font-bold">{mockAbandonedCarts.filter(c => !c.recovered).length}</p>
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
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valeur perdue</p>
                  <p className="text-2xl font-bold">€{getTotalAbandonedValue().toFixed(2)}</p>
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
                  <RotateCcw className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de récupération</p>
                  <p className="text-2xl font-bold">{calculateRecoveryRate()}%</p>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenus récupérés</p>
                  <p className="text-2xl font-bold">€{getRecoveredValue().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recovery Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Séquence de récupération automatique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recoveryTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#f4b71b] rounded-lg flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                      <p className="text-xs text-gray-500">
                        Envoyé {template.delay}h après abandon
                        {template.discountPercent && ` • Réduction ${template.discountPercent}%`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={template.enabled} />
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

      {/* Abandoned Carts List */}
      <Card>
        <CardHeader>
          <CardTitle>Paniers abandonnés récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAbandonedCarts.map((cart) => (
              <motion.div
                key={cart.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-6 hover:shadow-md transition-all ${
                  cart.recovered ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {cart.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{cart.customerName}</h4>
                      <p className="text-sm text-gray-600">{cart.customerEmail}</p>
                      <p className="text-xs text-gray-500">
                        Abandonné {getTimeAgo(cart.abandonedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#b70f23]">€{cart.totalValue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{cart.items.length} article{cart.items.length > 1 ? 's' : ''}</p>
                    </div>
                    {cart.recovered ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Récupéré
                      </Badge>
                    ) : (
                      <Badge className={getStageColor(cart.stage)}>
                        {getStageLabel(cart.stage)}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCart(cart);
                        setShowCartModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Cart Items Preview */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Status */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{cart.emailsSent} email{cart.emailsSent > 1 ? 's' : ''} envoyé{cart.emailsSent > 1 ? 's' : ''}</span>
                    </div>
                    {cart.lastEmailSent && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Dernier: {getTimeAgo(cart.lastEmailSent)}</span>
                      </div>
                    )}
                  </div>
                  {!cart.recovered && (
                    <Button size="sm" variant="outline" className="gap-1">
                      <Send className="w-3 h-3" />
                      Envoyer rappel
                    </Button>
                  )}
                </div>

                {cart.recovered && cart.recoveredAt && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-sm text-green-700">
                      ✅ Récupéré le {new Date(cart.recoveredAt).toLocaleDateString('fr-FR')} pour €{cart.recoveredValue?.toFixed(2)}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart Detail Modal */}
      <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du panier abandonné</DialogTitle>
            <DialogDescription>
              Informations complètes sur le panier de {selectedCart?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedCart && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Informations client</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nom:</span> {selectedCart.customerName}
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span> {selectedCart.customerEmail}
                  </div>
                  <div>
                    <span className="text-gray-600">Abandonné:</span> {getTimeAgo(selectedCart.abandonedAt)}
                  </div>
                  <div>
                    <span className="text-gray-600">Emails envoyés:</span> {selectedCart.emailsSent}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <h4 className="font-semibold mb-3">Articles dans le panier</h4>
                <div className="space-y-2">
                  {selectedCart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded p-3">
                      <div>
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">€{item.price} chacun</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-[#b70f23]">€{selectedCart.totalValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCartModal(false)}>
                  Fermer
                </Button>
                {!selectedCart.recovered && (
                  <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer rappel personnalisé
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Management Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gestion des modèles de récupération</DialogTitle>
            <DialogDescription>
              Configurez vos emails automatiques de récupération de paniers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {recoveryTemplates.map((template, index) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${template.id}`}>Nom du modèle</Label>
                    <Input id={`name-${template.id}`} defaultValue={template.name} />
                  </div>
                  <div>
                    <Label htmlFor={`delay-${template.id}`}>Délai d'envoi (heures)</Label>
                    <Input id={`delay-${template.id}`} type="number" defaultValue={template.delay} />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor={`subject-${template.id}`}>Objet de l'email</Label>
                  <Input id={`subject-${template.id}`} defaultValue={template.subject} />
                </div>
                {template.type === 'discount' && (
                  <div className="mt-4">
                    <Label htmlFor={`discount-${template.id}`}>Pourcentage de réduction (%)</Label>
                    <Input 
                      id={`discount-${template.id}`} 
                      type="number" 
                      defaultValue={template.discountPercent} 
                    />
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={template.enabled} />
                    <span className="text-sm">Activer ce modèle</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                Sauvegarder les modèles
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}