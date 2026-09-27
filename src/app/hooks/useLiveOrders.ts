import { useState, useEffect, useCallback } from 'react';
import { mockCustomers, mockMenuItems } from '../data/mockOrdersData';
import { generateOrderNumber, calculateTotalAmount } from '../utils/orderUtils';
import { toast } from 'sonner@2.0.3';
import { 
  playNewOrderSound, 
  soundPreferences, 
  startPersistentNotification, 
  stopPersistentNotification,
  isPersistentNotificationActive
} from '../utils/soundUtils';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  extras?: string[];
  notes?: string;
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  orderType: 'delivery' | 'pickup' | 'dine-in';
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  estimatedTime?: number; // en minutes
  paymentMethod: 'cash' | 'card' | 'online';
  notes?: string;
}

// Fonction pour générer des commandes initiales mockées
const generateInitialMockOrders = (): LiveOrder[] => {
  const orders: LiveOrder[] = [];
  
  // Générer quelques commandes rejetées pour tester
  for (let i = 0; i < 2; i++) {
    const orderNumber = generateOrderNumber();
    const selectedCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const selectedItems = [mockMenuItems[Math.floor(Math.random() * mockMenuItems.length)]];
    const totalAmount = calculateTotalAmount(selectedItems);
    
    orders.push({
      id: `rejected-order-${Date.now()}-${i}`,
      orderNumber,
      customer: selectedCustomer,
      items: selectedItems.map(item => ({...item, id: `${item.id}-${i}`, quantity: 1})),
      totalAmount,
      orderType: ['delivery', 'pickup', 'dine-in'][Math.floor(Math.random() * 3)] as LiveOrder['orderType'],
      status: 'rejected',
      createdAt: new Date(Date.now() - (i + 1) * 3600000), // Commandes d'il y a quelques heures
      paymentMethod: ['cash', 'card', 'online'][Math.floor(Math.random() * 3)] as LiveOrder['paymentMethod'],
      notes: i === 0 ? 'Ingrédient non disponible' : 'Fermeture exceptionnelle'
    });
  }
  
  return orders;
};

// Ce hook est déprécié - utilisez le contexte LiveOrdersContext à la place
export function useLiveOrdersDeprecated() {
  const [orders, setOrders] = useState<LiveOrder[]>(() => generateInitialMockOrders());
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => soundPreferences.getSoundEnabled());

  // Simulation de nouvelles commandes qui arrivent
  const generateMockOrder = useCallback((): LiveOrder => {
    const orderNumber = generateOrderNumber();
    const selectedCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const selectedItems = [];
    
    for (let i = 0; i < numItems; i++) {
      const item = mockMenuItems[Math.floor(Math.random() * mockMenuItems.length)];
      selectedItems.push({
        ...item,
        id: `${item.id}-${Date.now()}-${i}`,
        quantity: Math.floor(Math.random() * 2) + 1
      });
    }

    const totalAmount = calculateTotalAmount(selectedItems);
    
    const orderTypes: LiveOrder['orderType'][] = ['delivery', 'pickup', 'dine-in'];
    const paymentMethods: LiveOrder['paymentMethod'][] = ['cash', 'card', 'online'];

    return {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      customer: selectedCustomer,
      items: selectedItems,
      totalAmount,
      orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
      status: 'pending',
      createdAt: new Date(),
      estimatedTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      notes: Math.random() > 0.7 ? 'Commande urgente, merci !' : undefined
    };
  }, []);

  // Simulation automatique de nouvelles commandes
  useEffect(() => {
    const interval = setInterval(() => {
      // Probabilité de 30% qu'une nouvelle commande arrive toutes les 10 secondes
      if (Math.random() < 0.3) {
        const newOrder = generateMockOrder();
        setOrders(prev => [newOrder, ...prev]);
        setHasNewOrders(true);
        setUnreadOrdersCount(prev => prev + 1);
        
        // Démarrer les bips persistants seulement s'il n'y en a pas déjà
        if (!isPersistentNotificationActive()) {
          startPersistentNotification(soundEnabled);
        }
        
        // Notification navigateur (optionnel)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nouvelle commande !', {
            body: `Commande ${newOrder.orderNumber} de ${newOrder.customer.name}`,
            icon: '/favicon.ico'
          });
        }
      }
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, [generateMockOrder, soundEnabled]);

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const acceptOrder = useCallback((orderId: string, estimatedTime: number) => {
    const order = orders.find(o => o.id === orderId);
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'accepted' as const, estimatedTime }
        : order
    ));
    
    // Toast de confirmation
    if (order) {
      toast.success('✅ Commande acceptée et envoyée en cuisine !', {
        description: `Commande ${order.orderNumber} est maintenant visible dans le KDS`,
        duration: 4000
      });
    }
    
    // Notification navigateur de synchronisation vers le KDS
    if ('Notification' in window && Notification.permission === 'granted') {
      if (order) {
        new Notification('Commande envoyée en cuisine !', {
          body: `Commande ${order.orderNumber} acceptée - Disponible dans le KDS`,
          icon: '/favicon.ico'
        });
      }
    }
  }, [orders]);

  const rejectOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const, notes: reason }
        : order
    ));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: LiveOrder['status']) => {
    const order = orders.find(o => o.id === orderId);
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status }
        : order
    ));
    
    // Toasts de synchronisation entre KDS et Commandes Live
    const statusMessages = {
      'preparing': {
        title: '👨‍🍳 Préparation commencée',
        description: `Commande ${order?.orderNumber} en cours de préparation`
      },
      'ready': {
        title: '✅ Commande terminée !',
        description: `Commande ${order?.orderNumber} prête à servir/livrer`
      },
      'delivered': {
        title: '📦 Commande servie',
        description: `Commande ${order?.orderNumber} marquée comme livrée/servie`
      }
    };
    
    const messageInfo = statusMessages[status as keyof typeof statusMessages];
    if (messageInfo && order) {
      toast.success(messageInfo.title, {
        description: messageInfo.description,
        duration: 3000
      });
    }
    
    // Notification navigateur
    if (messageInfo && 'Notification' in window && Notification.permission === 'granted') {
      if (order) {
        new Notification(messageInfo.title, {
          body: messageInfo.description,
          icon: '/favicon.ico'
        });
      }
    }
  }, [orders]);

  const markAsRead = useCallback(() => {
    setHasNewOrders(false);
    setUnreadOrdersCount(0);
    // Arrêter les bips persistants
    stopPersistentNotification();
  }, []);

  const getPendingOrders = useCallback(() => {
    return orders.filter(order => order.status === 'pending');
  }, [orders]);

  const getActiveOrders = useCallback(() => {
    return orders.filter(order => ['accepted', 'preparing'].includes(order.status));
  }, [orders]);

  const getRejectedOrders = useCallback(() => {
    return orders.filter(order => order.status === 'rejected');
  }, [orders]);

  // Ajouter une commande manuellement (pour les tests)
  const addMockOrder = useCallback(() => {
    const newOrder = generateMockOrder();
    setOrders(prev => [newOrder, ...prev]);
    setHasNewOrders(true);
    setUnreadOrdersCount(prev => prev + 1);
    
    // Démarrer les bips persistants pour les tests aussi
    if (!isPersistentNotificationActive()) {
      startPersistentNotification(soundEnabled);
    }
  }, [generateMockOrder, soundEnabled]);

  // Fonction pour basculer les notifications sonores
  const toggleSound = useCallback(() => {
    const newState = soundPreferences.toggleSound();
    setSoundEnabled(newState);
    return newState;
  }, []);

  // Fonction pour arrêter les bips (appelée par le bouton Bell)
  const stopNotifications = useCallback(() => {
    stopPersistentNotification();
  }, []);

  return {
    orders,
    hasNewOrders,
    unreadOrdersCount,
    pendingOrders: getPendingOrders(),
    activeOrders: getActiveOrders(),
    rejectedOrders: getRejectedOrders(),
    soundEnabled,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    markAsRead,
    addMockOrder,
    toggleSound,
    stopNotifications
  };
}