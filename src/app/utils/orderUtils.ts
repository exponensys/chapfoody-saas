import { LiveOrder } from '../hooks/useLiveOrders';
import { orderTypeLabels, paymentMethodLabels, statusLabels, statusColors } from '../data/mockOrdersData';

export const getOrderTypeIcon = (type: LiveOrder['orderType']) => {
  const icons = {
    delivery: 'Car',
    pickup: 'Package',
    'dine-in': 'Store'
  };
  return icons[type] || 'Package';
};

export const getOrderTypeLabel = (type: LiveOrder['orderType']) => {
  return orderTypeLabels[type] || 'À emporter';
};

export const getPaymentMethodLabel = (method: LiveOrder['paymentMethod']) => {
  return paymentMethodLabels[method] || 'Espèces';
};

export const getStatusColor = (status: LiveOrder['status']) => {
  return statusColors[status] || 'bg-gray-500';
};

export const getStatusLabel = (status: LiveOrder['status']) => {
  return statusLabels[status] || 'Inconnu';
};

export const generateOrderNumber = () => {
  return `CMD-${Date.now().toString().slice(-6)}`;
};

export const calculateTotalAmount = (items: LiveOrder['items']) => {
  return Math.round(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100) / 100;
};