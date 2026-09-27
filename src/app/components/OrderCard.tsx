import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { LiveOrder } from '../contexts/LiveOrdersContext';
import { getOrderTypeLabel, getPaymentMethodLabel, getStatusColor } from '../utils/orderUtils';
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Timer,
  MessageCircle,
  Car,
  Package,
  Store
} from 'lucide-react';

interface OrderCardProps {
  order: LiveOrder;
  onClick: (order: LiveOrder) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const getOrderTypeIcon = (type: LiveOrder['orderType']) => {
    switch (type) {
      case 'delivery': return Car;
      case 'pickup': return Package;
      case 'dine-in': return Store;
      default: return Package;
    }
  };

  const OrderTypeIcon = getOrderTypeIcon(order.orderType);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        border-2 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg
        ${order.status === 'pending' ? 'border-yellow-400 bg-yellow-50' : 
          order.status === 'accepted' ? 'border-blue-400 bg-blue-50' :
          order.status === 'preparing' ? 'border-orange-400 bg-orange-50' :
          order.status === 'ready' ? 'border-green-400 bg-green-50' :
          'border-gray-300 bg-gray-50'}
      `}
      onClick={() => onClick(order)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)} ${
            order.status === 'pending' ? 'animate-pulse' : ''
          }`}></div>
          <h3 className="font-bold text-lg">{order.orderNumber}</h3>
          <Badge variant="outline" className="text-xs">
            <OrderTypeIcon className="w-3 h-3 mr-1" />
            {getOrderTypeLabel(order.orderType)}
          </Badge>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-[#b70f23]">{order.totalAmount.toFixed(2)} €</div>
          <div className="text-xs text-gray-500">{getPaymentMethodLabel(order.paymentMethod)}</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{order.customer.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{order.customer.phone}</span>
        </div>
        {order.orderType === 'delivery' && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <span>{order.customer.address}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-2">
        <div className="text-sm text-gray-600 mb-1">Articles:</div>
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-gray-500">+ {order.items.length - 2} autre(s) article(s)</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{order.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {order.estimatedTime && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Timer className="w-3 h-3" />
            <span>{order.estimatedTime} min</span>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-3 h-3 text-blue-500 mt-0.5" />
            <span className="text-xs text-blue-700">{order.notes}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}