import { LiveOrder } from '../hooks/useLiveOrders';

export const mockCustomers = [
  { name: "Jean Dupont", phone: "06 12 34 56 78", address: "15 Rue de la Paix, 75001 Paris" },
  { name: "Marie Martin", phone: "06 23 45 67 89", address: "42 Avenue des Champs, 75008 Paris" },
  { name: "Pierre Durand", phone: "06 34 56 78 90", address: "8 Boulevard Saint-Germain, 75005 Paris" },
  { name: "Sophie Laurent", phone: "06 45 67 89 01", address: "23 Rue de Rivoli, 75004 Paris" },
  { name: "Thomas Bernard", phone: "06 56 78 90 12", address: "67 Avenue Montaigne, 75008 Paris" }
];

export const mockMenuItems = [
  { id: '1', name: 'Pizza Margherita', quantity: 1, price: 12.50 },
  { id: '2', name: 'Salade César', quantity: 1, price: 8.90, extras: ['Sauce supplémentaire'] },
  { id: '3', name: 'Burger Classic', quantity: 2, price: 14.00 },
  { id: '4', name: 'Pâtes Carbonara', quantity: 1, price: 13.50, notes: 'Sans bacon' },
  { id: '5', name: 'Coca Cola 33cl', quantity: 2, price: 2.50 }
];

export const orderTypeLabels = {
  delivery: 'Livraison',
  pickup: 'À emporter',
  'dine-in': 'Sur place'
} as const;

export const paymentMethodLabels = {
  cash: 'Espèces',
  card: 'Carte',
  online: 'En ligne'
} as const;

export const statusLabels = {
  pending: 'En attente',
  accepted: 'Acceptée',
  preparing: 'En préparation',
  ready: 'Prête',
  delivered: 'Livrée',
  rejected: 'Refusée'
} as const;

export const statusColors = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  delivered: 'bg-gray-500',
  rejected: 'bg-red-500'
} as const;