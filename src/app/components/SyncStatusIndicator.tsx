import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Utensils, 
  Package, 
  Truck 
} from 'lucide-react';
import { LiveOrder } from '../contexts/LiveOrdersContext';

interface SyncStatusIndicatorProps {
  order?: LiveOrder;
  showDetail?: boolean;
  standalone?: boolean;
}

export function SyncStatusIndicator({ order, showDetail = false, standalone = false }: SyncStatusIndicatorProps) {
  const [showSyncAnimation, setShowSyncAnimation] = useState(false);

  // Animation quand le statut change
  useEffect(() => {
    if (order?.status) {
      setShowSyncAnimation(true);
      const timer = setTimeout(() => setShowSyncAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [order?.status]);

  const getStatusInfo = () => {
    // Mode standalone pour affichage générique
    if (standalone || !order) {
      return {
        icon: CheckCircle,
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'Synchronisé',
        description: 'Système opérationnel',
        syncStatus: '✅ Tous les systèmes connectés'
      };
    }

    switch (order.status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'En attente',
          description: 'Nouvelle commande à traiter',
          syncStatus: 'Pas encore synchronisée'
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Acceptée',
          description: 'Commande acceptée et envoyée en cuisine',
          syncStatus: '✅ Synchronisée avec KDS'
        };
      case 'preparing':
        return {
          icon: Utensils,
          color: 'bg-orange-500',
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'En préparation',
          description: 'Commande en cours de préparation',
          syncStatus: '👨‍🍳 Statut KDS → Live'
        };
      case 'ready':
        return {
          icon: Package,
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Prête',
          description: 'Commande terminée, prête à servir',
          syncStatus: '✅ Statut KDS → Live'
        };
      case 'delivered':
        return {
          icon: Truck,
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Servie/Livrée',
          description: 'Commande complètement terminée',
          syncStatus: '✅ Synchronisation terminée'
        };
      case 'rejected':
        return {
          icon: CheckCircle,
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Refusée',
          description: 'Commande refusée',
          syncStatus: '❌ Non synchronisée'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Statut inconnu',
          description: '',
          syncStatus: 'Statut inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  if (!showDetail) {
    return (
      <motion.div
        animate={showSyncAnimation ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Badge className={`${statusInfo.color} text-white`}>
          <Icon className="w-3 h-3 mr-1" />
          {statusInfo.title}
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
      animate={showSyncAnimation ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${statusInfo.textColor}`} />
        <span className={`font-medium text-sm ${statusInfo.textColor}`}>
          {statusInfo.title}
        </span>
      </div>
      <p className={`text-xs ${statusInfo.textColor} opacity-80`}>
        {statusInfo.description}
      </p>
      <div className={`text-xs ${statusInfo.textColor} opacity-70 mt-1 font-medium`}>
        {statusInfo.syncStatus}
      </div>
    </motion.div>
  );
}