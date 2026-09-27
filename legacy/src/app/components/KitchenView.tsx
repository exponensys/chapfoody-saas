import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { LiveOrder, useLiveOrders } from '../contexts/LiveOrdersContext';
import { 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  Timer,
  Utensils,
  Package,
  X
} from 'lucide-react';

interface KitchenColumnProps {
  title: string;
  count: number;
  color: string;
  orders: LiveOrder[];
  onStatusUpdate: (orderId: string, status: LiveOrder['status']) => void;
}

function KitchenColumn({ title, count, color, orders, onStatusUpdate }: KitchenColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      {/* Header de colonne */}
      <div className={`${color} rounded-t-lg p-3 flex items-center justify-between`}>
        <h3 className="font-medium text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{count}</span>
          <button className="text-white hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Zone de contenu */}
      <div className="bg-gray-50 min-h-[600px] p-2 space-y-3 rounded-b-lg border-x border-b border-gray-200">
        <AnimatePresence>
          {orders.map((order) => (
            <KitchenOrderCard 
              key={order.id} 
              order={order} 
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface KitchenOrderCardProps {
  order: LiveOrder;
  onStatusUpdate: (orderId: string, status: LiveOrder['status']) => void;
}

function KitchenOrderCard({ order, onStatusUpdate }: KitchenOrderCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isNewlyAccepted, setIsNewlyAccepted] = useState(false);

  // Marquer les commandes nouvellement acceptées
  useEffect(() => {
    if (order.status === 'accepted') {
      setIsNewlyAccepted(true);
      // Retirer le highlight après 5 secondes
      const timer = setTimeout(() => setIsNewlyAccepted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [order.status]);

  // Calculer le temps restant pour les commandes acceptées
  useEffect(() => {
    if (order.status === 'accepted' && order.estimatedTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const createdAt = new Date(order.createdAt);
        const estimatedFinish = new Date(createdAt.getTime() + order.estimatedTime! * 60000);
        const remaining = estimatedFinish.getTime() - now.getTime();
        
        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeRemaining(`${minutes}m ${seconds.toString().padStart(2, '0')}s`);
        } else {
          setTimeRemaining('En retard');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order.status, order.estimatedTime, order.createdAt]);

  const getActionButton = () => {
    switch (order.status) {
      case 'pending':
        return (
          <Button 
            onClick={() => onStatusUpdate(order.id, 'accepted')}
            className="w-full bg-[#f4b71b] hover:bg-[#e5a617] text-white"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Accepter
          </Button>
        );
      
      case 'accepted':
        return (
          <Button 
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white"
            size="sm"
          >
            <Utensils className="w-4 h-4 mr-2" />
            Démarrer la préparation
          </Button>
        );
      
      case 'preparing':
        return (
          <Button 
            onClick={() => onStatusUpdate(order.id, 'ready')}
            className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Terminé
          </Button>
        );
      
      case 'ready':
        return (
          <Button 
            onClick={() => onStatusUpdate(order.id, 'delivered')}
            className="w-full bg-[#6c757d] hover:bg-[#545b62] text-white"
            size="sm"
          >
            <Package className="w-4 h-4 mr-2" />
            Marquer comme servi
          </Button>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-white border shadow-sm transition-all duration-300 ${
        isNewlyAccepted 
          ? 'border-[#f4b71b] shadow-lg ring-2 ring-[#f4b71b]/20 animate-pulse' 
          : 'border-gray-200'
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">#{order.orderNumber}</h4>
              {isNewlyAccepted && (
                <span className="text-xs bg-[#f4b71b] text-white px-2 py-1 rounded-full font-medium animate-bounce">
                  NOUVEAU
                </span>
              )}
              <SyncStatusIndicator order={order} />
            </div>
            {order.status === 'accepted' && timeRemaining && (
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">restant: {timeRemaining}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Informations client */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#17a2b8]">
              <User className="w-4 h-4" />
              <span className="font-medium">Nom: {order.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[#17a2b8]">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Téléphone: {order.customer.phone}</span>
            </div>
            <div className="text-[#17a2b8] font-semibold">
              Prix: {order.totalAmount.toFixed(2)} €
            </div>
          </div>

          <Separator />

          {/* Articles de la commande */}
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="font-medium">{item.quantity} x {item.name}</span>
                {item.extras && item.extras.length > 0 && (
                  <div className="text-xs text-gray-500 ml-4">
                    + {item.extras.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notes si présentes */}
          {order.notes && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              Note: {order.notes}
            </div>
          )}

          {/* Bouton d'action */}
          <div className="pt-2">
            {getActionButton()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function KitchenView() {
  const {
    orders,
    pendingOrders,
    activeOrders,
    updateOrderStatus,
    addMockOrder
  } = useLiveOrders();

  // Séparer les commandes par statut pour chaque colonne
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const servedOrders = orders.filter(order => order.status === 'delivered');

  const handleStatusUpdate = (orderId: string, status: LiveOrder['status']) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cuisine - Gestion des Commandes</h1>
          <p className="text-gray-600">Suivez le workflow de préparation en temps réel</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Synchronisé avec \"Commandes Live\"</span>
          </div>
        </div>
        <Button onClick={addMockOrder} variant="outline" size="sm">
          <Package className="w-4 h-4 mr-2" />
          Test Commande
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#17a2b8]">{acceptedOrders.length}</div>
            <div className="text-sm text-gray-600">Acceptées</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#28a745]">{preparingOrders.length}</div>
            <div className="text-sm text-gray-600">En préparation</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#28a745]">{readyOrders.length}</div>
            <div className="text-sm text-gray-600">Prêtes</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#6c757d]">{servedOrders.length}</div>
            <div className="text-sm text-gray-600">Servies</div>
          </div>
        </Card>
      </div>

      {/* Colonnes de workflow Kanban */}
      <div className="flex gap-4 overflow-x-auto">        
        <KitchenColumn
          title="accepté"
          count={acceptedOrders.length}
          color="bg-[#17a2b8]"
          orders={acceptedOrders}
          onStatusUpdate={handleStatusUpdate}
        />
        
        <KitchenColumn
          title="En préparation"
          count={preparingOrders.length}
          color="bg-[#17a2b8]"
          orders={preparingOrders}
          onStatusUpdate={handleStatusUpdate}
        />
        
        <KitchenColumn
          title="Terminé"
          count={readyOrders.length}
          color="bg-[#28a745]"
          orders={readyOrders}
          onStatusUpdate={handleStatusUpdate}
        />
        
        <KitchenColumn
          title="servi(e)"
          count={servedOrders.length}
          color="bg-[#6c757d]"
          orders={servedOrders}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}