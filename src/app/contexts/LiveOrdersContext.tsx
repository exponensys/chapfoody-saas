import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
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

export interface LiveReservation {
  id: string;
  reservationNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  partySize: number;
  reservationDate: Date;
  reservationTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed';
  tableNumber?: number;
  specialRequests?: string;
  createdAt: Date;
}

interface LiveOrdersContextType {
  orders: LiveOrder[];
  reservations: LiveReservation[];
  hasNewOrders: boolean;
  hasNewReservations: boolean;
  unreadOrdersCount: number;
  unreadReservationsCount: number;
  notificationType: 'orders' | 'reservations' | 'both' | null;
  pendingOrders: LiveOrder[];
  activeOrders: LiveOrder[];
  rejectedOrders: LiveOrder[];
  pendingReservations: LiveReservation[];
  confirmedReservations: LiveReservation[];
  soundEnabled: boolean;
  acceptOrder: (orderId: string, estimatedTime: number) => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  updateOrderStatus: (orderId: string, status: LiveOrder['status']) => void;
  confirmReservation: (reservationId: string, tableNumber?: number) => void;
  cancelReservation: (reservationId: string) => void;
  updateReservationStatus: (reservationId: string, status: LiveReservation['status']) => void;
  markAsRead: () => void;
  addMockOrder: () => void;
  addMockReservation: () => void;
  toggleSound: () => boolean;
  stopNotifications: () => void;
}

const LiveOrdersContext = createContext<LiveOrdersContextType | undefined>(undefined);

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

export function LiveOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<LiveOrder[]>(() => generateInitialMockOrders());
  const [reservations, setReservations] = useState<LiveReservation[]>([]);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [hasNewReservations, setHasNewReservations] = useState(false);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
  const [unreadReservationsCount, setUnreadReservationsCount] = useState(0);
  const [notificationType, setNotificationType] = useState<'orders' | 'reservations' | 'both' | null>(null);
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

  // Fonction pour générer une réservation mockée
  const generateMockReservation = useCallback((): LiveReservation => {
    const customers = [
      { name: 'Sophie Martin', phone: '06 12 34 56 78', email: 'sophie.martin@email.com' },
      { name: 'Pierre Dupont', phone: '06 98 76 54 32', email: 'pierre.dupont@email.com' },
      { name: 'Marie Leroy', phone: '06 45 67 89 01' },
      { name: 'Jean Bernard', phone: '06 33 44 55 66', email: 'jean.bernard@email.com' },
      { name: 'Claire Durand', phone: '06 77 88 99 00' }
    ];
    
    const specialRequests = [
      'Table près de la fenêtre si possible',
      'Anniversaire - dessert spécial',
      'Allergie aux noix',
      'Chaise haute pour enfant',
      'Table calme pour rendez-vous d\'affaires'
    ];
    
    const selectedCustomer = customers[Math.floor(Math.random() * customers.length)];
    const times = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
    
    return {
      id: `reservation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reservationNumber: `RES-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      customer: selectedCustomer,
      partySize: Math.floor(Math.random() * 6) + 1, // 1-6 personnes
      reservationDate: new Date(),
      reservationTime: times[Math.floor(Math.random() * times.length)],
      status: 'pending',
      specialRequests: Math.random() > 0.6 ? specialRequests[Math.floor(Math.random() * specialRequests.length)] : undefined,
      createdAt: new Date()
    };
  }, []);

  // Simulation automatique de nouvelles commandes et réservations - DÉSACTIVÉE
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.random();
      
      // 20% chance pour une nouvelle commande
      if (randomValue < 0.2) {
        const newOrder = generateMockOrder();
        setOrders(prev => [newOrder, ...prev]);
        setHasNewOrders(true);
        setUnreadOrdersCount(prev => prev + 1);
        setNotificationType(prev => prev === 'reservations' ? 'both' : 'orders');
        
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
      // 15% chance pour une nouvelle réservation
      else if (randomValue < 0.35) {
        const newReservation = generateMockReservation();
        setReservations(prev => [newReservation, ...prev]);
        setHasNewReservations(true);
        setUnreadReservationsCount(prev => prev + 1);
        setNotificationType(prev => prev === 'orders' ? 'both' : 'reservations');
        
        // Démarrer les bips persistants seulement s'il n'y en a pas déjà
        if (!isPersistentNotificationActive()) {
          startPersistentNotification(soundEnabled);
        }
        
        // Notification navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nouvelle réservation !', {
            body: `Réservation ${newReservation.reservationNumber} de ${newReservation.customer.name}`,
            icon: '/favicon.ico'
          });
        }
      }
    }, 12000); // Toutes les 12 secondes

    return () => clearInterval(interval);
  }, [generateMockOrder, generateMockReservation, soundEnabled]);
  */

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const acceptOrder = useCallback((orderId: string, estimatedTime: number) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      
      // Toast de confirmation
      if (order) {
        toast.success('✅ Commande acceptée et envoyée en cuisine !', {
          description: `Commande ${order.orderNumber} est maintenant visible dans le KDS`,
          duration: 4000
        });
        
        // Notification navigateur de synchronisation vers le KDS
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Commande envoyée en cuisine !', {
            body: `Commande ${order.orderNumber} acceptée - Disponible dans le KDS`,
            icon: '/favicon.ico'
          });
        }
      }
      
      return prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'accepted' as const, estimatedTime }
          : order
      );
    });
  }, []);

  const rejectOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const, notes: reason }
        : order
    ));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: LiveOrder['status']) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      
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
        
        // Notification navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(messageInfo.title, {
            body: messageInfo.description,
            icon: '/favicon.ico'
          });
        }
      }
      
      return prev.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      );
    });
  }, []);

  const confirmReservation = useCallback((reservationId: string, tableNumber?: number) => {
    setReservations(prev => {
      const reservation = prev.find(r => r.id === reservationId);
      
      // Toast de confirmation
      if (reservation) {
        toast.success('✅ Réservation confirmée !', {
          description: `Réservation ${reservation.reservationNumber} confirmée${tableNumber ? ` - Table ${tableNumber}` : ''}`,
          duration: 4000
        });
      }
      
      return prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: 'confirmed' as const, tableNumber }
          : reservation
      );
    });
  }, []);

  const cancelReservation = useCallback((reservationId: string) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, status: 'cancelled' as const }
        : reservation
    ));
  }, []);

  const updateReservationStatus = useCallback((reservationId: string, status: LiveReservation['status']) => {
    setReservations(prev => {
      const reservation = prev.find(r => r.id === reservationId);
      
      // Toasts de notification
      const statusMessages = {
        'seated': {
          title: '🪑 Clients installés',
          description: `Table ${reservation?.tableNumber || ''} occupée`
        },
        'completed': {
          title: '✅ Service terminé',
          description: `Réservation ${reservation?.reservationNumber} terminée`
        }
      };
      
      const messageInfo = statusMessages[status as keyof typeof statusMessages];
      if (messageInfo && reservation) {
        toast.success(messageInfo.title, {
          description: messageInfo.description,
          duration: 3000
        });
      }
      
      return prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status }
          : reservation
      );
    });
  }, []);

  const markAsRead = useCallback(() => {
    setHasNewOrders(false);
    setHasNewReservations(false);
    setUnreadOrdersCount(0);
    setUnreadReservationsCount(0);
    setNotificationType(null);
    // Arrêter les bips persistants
    stopPersistentNotification();
  }, []);

  // Calculer les listes filtrées avec useMemo pour éviter les re-calculs
  const pendingOrders = useMemo(() => {
    return orders.filter(order => order.status === 'pending');
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(order => ['accepted', 'preparing'].includes(order.status));
  }, [orders]);

  const rejectedOrders = useMemo(() => {
    return orders.filter(order => order.status === 'rejected');
  }, [orders]);

  const pendingReservations = useMemo(() => {
    return reservations.filter(reservation => reservation.status === 'pending');
  }, [reservations]);

  const confirmedReservations = useMemo(() => {
    return reservations.filter(reservation => reservation.status === 'confirmed');
  }, [reservations]);

  // Ajouter une commande manuellement (pour les tests)
  const addMockOrder = useCallback(() => {
    const newOrder = generateMockOrder();
    setOrders(prev => [newOrder, ...prev]);
    setHasNewOrders(true);
    setUnreadOrdersCount(prev => prev + 1);
    setNotificationType(prev => prev === 'reservations' ? 'both' : 'orders');
    
    // Démarrer les bips persistants pour les tests aussi
    if (!isPersistentNotificationActive()) {
      startPersistentNotification(soundEnabled);
    }
  }, [generateMockOrder, soundEnabled]);

  // Ajouter une réservation manuellement (pour les tests)
  const addMockReservation = useCallback(() => {
    const newReservation = generateMockReservation();
    setReservations(prev => [newReservation, ...prev]);
    setHasNewReservations(true);
    setUnreadReservationsCount(prev => prev + 1);
    setNotificationType(prev => prev === 'orders' ? 'both' : 'reservations');
    
    // Démarrer les bips persistants pour les tests aussi
    if (!isPersistentNotificationActive()) {
      startPersistentNotification(soundEnabled);
    }
  }, [generateMockReservation, soundEnabled]);

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

  // Mémoriser l'objet value pour éviter les re-renders inutiles
  const value = useMemo<LiveOrdersContextType>(() => ({
    orders,
    reservations,
    hasNewOrders,
    hasNewReservations,
    unreadOrdersCount,
    unreadReservationsCount,
    notificationType,
    pendingOrders,
    activeOrders,
    rejectedOrders,
    pendingReservations,
    confirmedReservations,
    soundEnabled,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    confirmReservation,
    cancelReservation,
    updateReservationStatus,
    markAsRead,
    addMockOrder,
    addMockReservation,
    toggleSound,
    stopNotifications
  }), [
    orders,
    reservations,
    hasNewOrders,
    hasNewReservations,
    unreadOrdersCount,
    unreadReservationsCount,
    notificationType,
    pendingOrders,
    activeOrders,
    rejectedOrders,
    pendingReservations,
    confirmedReservations,
    soundEnabled,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    confirmReservation,
    cancelReservation,
    updateReservationStatus,
    markAsRead,
    addMockOrder,
    addMockReservation,
    toggleSound,
    stopNotifications
  ]);

  return (
    <LiveOrdersContext.Provider value={value}>
      {children}
    </LiveOrdersContext.Provider>
  );
}

export function useLiveOrders() {
  const context = useContext(LiveOrdersContext);
  if (context === undefined) {
    throw new Error('useLiveOrders must be used within a LiveOrdersProvider');
  }
  return context;
}