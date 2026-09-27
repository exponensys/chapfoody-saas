import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { LiveOrder, useLiveOrders } from '../contexts/LiveOrdersContext';
import { OrderCard } from './OrderCard';
import { OrderStats } from './OrderStats';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { SynchronizationDemo } from './SynchronizationDemo';
import { ResponsiveGrid } from './ResponsiveGrid';
import { ResponsiveContainer } from './ResponsiveGrid';
import { getOrderTypeLabel, getPaymentMethodLabel, getStatusColor, getStatusLabel } from '../utils/orderUtils';
import { testSound } from '../utils/soundUtils';
import { 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  X, 
  Package,
  MessageCircle,
  Plus,
  Volume2,
  Filter,
  Truck
} from 'lucide-react';

export function LiveOrdersView() {
  const {
    orders,
    pendingOrders,
    activeOrders,
    rejectedOrders,
    hasNewOrders,
    unreadOrdersCount,
    soundEnabled,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    markAsRead,
    addMockOrder
  } = useLiveOrders();

  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDeliveryCompanies, setSelectedDeliveryCompanies] = useState<string[]>([]);
  const [selectedIndependentDrivers, setSelectedIndependentDrivers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected' | 'all'>('pending');
  
  // États pour les filtres
  const [orderNumberFilter, setOrderNumberFilter] = useState('');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableNumberFilter, setTableNumberFilter] = useState('all');
  
  // Simuler que le restaurant a des tables (has_table = 1)
  const hasTable = true;

  // Données mock pour les livreurs
  const deliveryCompanies = [
    { id: 'uber', name: 'Uber Eats', status: 'online', commission: '30%' },
    { id: 'deliveroo', name: 'Deliveroo', status: 'online', commission: '25%' },
    { id: 'just-eat', name: 'Just Eat', status: 'offline', commission: '15%' },
    { id: 'glovo', name: 'Glovo', status: 'online', commission: '20%' }
  ];

  const independentDrivers = [
    { id: 'driver-1', name: 'Pierre Martin', status: 'available', vehicle: 'Scooter', rating: 4.8 },
    { id: 'driver-2', name: 'Sophie Dubois', status: 'available', vehicle: 'Vélo', rating: 4.9 },
    { id: 'driver-3', name: 'Ahmed Ben Ali', status: 'busy', vehicle: 'Voiture', rating: 4.7 },
    { id: 'driver-4', name: 'Marie Lefebvre', status: 'available', vehicle: 'Scooter', rating: 4.6 }
  ];

  // Marquer comme lu quand on ouvre la vue
  useEffect(() => {
    if (hasNewOrders) {
      markAsRead();
    }
  }, [hasNewOrders, markAsRead]);



  const handleAcceptOrder = () => {
    if (selectedOrder) {
      acceptOrder(selectedOrder.id, estimatedTime);
      setShowAcceptDialog(false);
      setSelectedOrder(null);
    }
  };

  const handleRejectOrder = () => {
    if (selectedOrder) {
      rejectOrder(selectedOrder.id, rejectReason);
      setShowRejectDialog(false);
      setSelectedOrder(null);
      setRejectReason('');
    }
  };

  const handleStatusUpdate = (orderId: string, status: LiveOrder['status']) => {
    updateOrderStatus(orderId, status);
  };

  const handleAssignToDelivery = () => {
    if (selectedOrder) {
      // Logique pour attribuer la commande aux livreurs sélectionnés
      console.log('Commande attribuée:', {
        orderId: selectedOrder.id,
        deliveryCompanies: selectedDeliveryCompanies,
        independentDrivers: selectedIndependentDrivers
      });
      
      // Réinitialiser les sélections
      setSelectedDeliveryCompanies([]);
      setSelectedIndependentDrivers([]);
      setShowAssignDialog(false);
    }
  };



  // Filtrer les commandes selon l'onglet actif
  let baseFilteredOrders = 
    activeTab === 'pending' ? pendingOrders :
    activeTab === 'active' ? activeOrders :
    activeTab === 'rejected' ? rejectedOrders :
    orders;
    
  // Appliquer les filtres supplémentaires
  const filteredOrders = baseFilteredOrders.filter(order => {
    // Filtre par numéro de commande
    if (orderNumberFilter && !order.orderNumber.toLowerCase().includes(orderNumberFilter.toLowerCase())) {
      return false;
    }
    
    // Filtre par nom du client
    if (customerNameFilter && !order.customer.name.toLowerCase().includes(customerNameFilter.toLowerCase())) {
      return false;
    }
    
    // Filtre par type de commande
    if (orderTypeFilter !== 'all' && order.orderType !== orderTypeFilter) {
      return false;
    }
    
    // Filtre par statut
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filtre par table (simulé - dans une vraie app, les commandes auraient un numéro de table)
    if (hasTable && tableNumberFilter !== 'all') {
      // Simuler des numéros de table basés sur l'ID de commande
      const simulatedTableNumber = (parseInt(order.id.slice(-1)) % 10) + 1;
      if (tableNumberFilter !== simulatedTableNumber.toString()) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <ResponsiveContainer maxWidth="6xl" className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Live</h1>
          <p className="text-gray-600">Gérez vos commandes en temps réel</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addMockOrder} variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Test Commande
          </Button>
          <Button 
            onClick={() => testSound('order-received')} 
            variant="outline" 
            size="sm"
            className="text-gray-600 flex-1 sm:flex-none"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Test Son
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <OrderStats
        pendingCount={pendingOrders.length}
        activeCount={activeOrders.length}
        totalAmount={filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)}
      />

      {/* Démonstration de synchronisation */}
      <SynchronizationDemo />
      
      {/* Filtres */}
      <div className="bg-white rounded-lg border p-4">
        <ResponsiveGrid cols={{ base: 1, sm: 2, md: 3, lg: hasTable ? 5 : 4 }} gap={4}>
          {/* N° De Commande */}
          <div>
            <Label htmlFor="orderNumber" className="text-sm font-medium text-gray-700">N° De Commande</Label>
            <Input
              id="orderNumber"
              placeholder=""
              value={orderNumberFilter}
              onChange={(e) => setOrderNumberFilter(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Nom Du Client */}
          <div>
            <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Nom Du Client</Label>
            <Input
              id="customerName"
              placeholder="Nom Du Client /"
              value={customerNameFilter}
              onChange={(e) => setCustomerNameFilter(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Type De Commande */}
          <div>
            <Label htmlFor="orderType" className="text-sm font-medium text-gray-700">Type De Commande</Label>
            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="delivery">Livraison</SelectItem>
                <SelectItem value="pickup">À emporter</SelectItem>
                <SelectItem value="dine-in">Sur place</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Statut */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">Statut</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptée</SelectItem>
                <SelectItem value="preparing">En préparation</SelectItem>
                <SelectItem value="ready">Prête</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="rejected">Refusée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Table N° - visible seulement si has_table = 1 */}
          {hasTable && (
            <div>
              <Label htmlFor="tableNumber" className="text-sm font-medium text-gray-700">Table N°</Label>
              <Select value={tableNumberFilter} onValueChange={setTableNumberFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>Table {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </ResponsiveGrid>
        
        <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
          <Button 
            onClick={() => {
              // Réinitialiser tous les filtres
              setOrderNumberFilter('');
              setCustomerNameFilter('');
              setOrderTypeFilter('all');
              setStatusFilter('all');
              setTableNumberFilter('all');
            }}
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto"
          >
            Réinitialiser
          </Button>
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filtre
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          En attente ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          En cours ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'rejected' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejetée(s) ({rejectedOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Toutes ({orders.length})
        </button>
      </div>

      {/* Orders Grid */}
      <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }}>
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={setSelectedOrder}
            />
          ))}
        </AnimatePresence>
      </ResponsiveGrid>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
          <p className="text-gray-500">Les nouvelles commandes apparaîtront ici automatiquement</p>
        </div>
      )}

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedOrder.status)}`}></div>
                Commande {selectedOrder.orderNumber}
                <SyncStatusIndicator order={selectedOrder} />
              </DialogTitle>
              {/* Indicateur de synchronisation détaillé */}
              <div className="mb-4">
                <SyncStatusIndicator order={selectedOrder} showDetail={true} />
              </div>
              <DialogDescription>
                Reçue le {selectedOrder.createdAt.toLocaleString('fr-FR')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Informations client</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  {selectedOrder.orderType === 'delivery' && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{selectedOrder.customer.address}</span>
                    </div>
                  )}
                  {hasTable && selectedOrder.orderType === 'dine-in' && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>Table {(parseInt(selectedOrder.id.slice(-1)) % 10) + 1}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Informations commande</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium">{getOrderTypeLabel(selectedOrder.orderType)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Paiement:</span>
                    <span className="ml-2 font-medium">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span>
                  </div>
                  {selectedOrder.estimatedTime && (
                    <div>
                      <span className="text-gray-500">Temps estimé:</span>
                      <span className="ml-2 font-medium">{selectedOrder.estimatedTime} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <h3 className="font-medium">Détails de la commande</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.quantity}x {item.name}</div>
                      {item.extras && (
                        <div className="text-sm text-gray-600 mt-1">
                          Extras: {item.extras.join(', ')}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-sm text-blue-600 mt-1">
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="font-medium ml-2">{(item.price * item.quantity).toFixed(2)} €</div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#b70f23]">{selectedOrder.totalAmount.toFixed(2)} €</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-blue-900 text-sm">Note du client</div>
                      <div className="text-blue-700 text-sm">{selectedOrder.notes}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Messages informatifs de synchronisation KDS */}
              {selectedOrder.status === 'accepted' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <strong>✅ Commande synchronisée avec la cuisine</strong> - Cette commande est maintenant visible dans le KDS (Kitchen Display System) pour la préparation.
                    </div>
                  </div>
                </div>
              )}
              
              {selectedOrder.status === 'preparing' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <div className="text-sm text-orange-700">
                      <strong>👨‍🍳 En préparation en cuisine</strong> - Statut mis à jour depuis le KDS. La commande est en cours de préparation.
                    </div>
                  </div>
                </div>
              )}
              
              {selectedOrder.status === 'ready' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="text-sm text-green-700">
                      <strong>✅ Commande prête !</strong> - Marquée comme terminée depuis le KDS. Prête pour livraison/service.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Refuser
                  </Button>
                  <Button
                    onClick={() => setShowAcceptDialog(true)}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accepter
                  </Button>
                </>
              )}
              {selectedOrder.status === 'accepted' && selectedOrder.orderType === 'delivery' && (
                <Button
                  onClick={() => setShowAssignDialog(true)}
                  className="bg-[#b70f23] hover:bg-[#70070e] w-full sm:w-auto"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Attribuer à un livreur
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accepter la commande</DialogTitle>
            <DialogDescription>
              Définissez le temps de préparation estimé pour cette commande.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="estimatedTime">Temps de préparation (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
                min="5"
                max="120"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAcceptOrder} className="bg-green-600 hover:bg-green-700">
              Accepter la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser la commande</DialogTitle>
            <DialogDescription>
              Indiquez la raison du refus (optionnel).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">Raison du refus</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Ingrédient non disponible, fermeture exceptionnelle..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRejectOrder} variant="destructive">
              Refuser la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Delivery Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attribuer à un livreur</DialogTitle>
            <DialogDescription>
              Sélectionnez une ou plusieurs entreprises de livraison et/ou des livreurs indépendants pour cette commande.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Entreprises de livraison */}
            <div>
              <h3 className="font-medium mb-3">Entreprises de livraison partenaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deliveryCompanies.map((company) => (
                  <div key={company.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      id={`company-${company.id}`}
                      checked={selectedDeliveryCompanies.includes(company.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeliveryCompanies([...selectedDeliveryCompanies, company.id]);
                        } else {
                          setSelectedDeliveryCompanies(selectedDeliveryCompanies.filter(id => id !== company.id));
                        }
                      }}
                      disabled={company.status === 'offline'}
                      className="rounded border-gray-300 text-[#b70f23] focus:ring-[#b70f23]"
                    />
                    <label htmlFor={`company-${company.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-gray-500">Commission: {company.commission}</div>
                        </div>
                        <Badge 
                          variant={company.status === 'online' ? 'default' : 'secondary'}
                          className={company.status === 'online' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {company.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        </Badge>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Livreurs indépendants */}
            <div>
              <h3 className="font-medium mb-3">Livreurs indépendants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {independentDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      id={`driver-${driver.id}`}
                      checked={selectedIndependentDrivers.includes(driver.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIndependentDrivers([...selectedIndependentDrivers, driver.id]);
                        } else {
                          setSelectedIndependentDrivers(selectedIndependentDrivers.filter(id => id !== driver.id));
                        }
                      }}
                      disabled={driver.status === 'busy'}
                      className="rounded border-gray-300 text-[#b70f23] focus:ring-[#b70f23]"
                    />
                    <label htmlFor={`driver-${driver.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-500">
                            {driver.vehicle} • ⭐ {driver.rating}
                          </div>
                        </div>
                        <Badge 
                          variant={driver.status === 'available' ? 'default' : 'secondary'}
                          className={driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                        >
                          {driver.status === 'available' ? 'Disponible' : 'Occupé'}
                        </Badge>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations sur la sélection */}
            {(selectedDeliveryCompanies.length > 0 || selectedIndependentDrivers.length > 0) && (
              <div className="bg-[#b70f23]/10 border border-[#b70f23]/20 rounded-lg p-3">
                <div className="text-sm text-[#b70f23]">
                  <strong>Sélection actuelle:</strong>
                  <div className="mt-1">
                    {selectedDeliveryCompanies.length > 0 && (
                      <div>• {selectedDeliveryCompanies.length} entreprise(s) de livraison</div>
                    )}
                    {selectedIndependentDrivers.length > 0 && (
                      <div>• {selectedIndependentDrivers.length} livreur(s) indépendant(s)</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAssignToDelivery}
              disabled={selectedDeliveryCompanies.length === 0 && selectedIndependentDrivers.length === 0}
              className="bg-[#b70f23] hover:bg-[#70070e]"
            >
              <Truck className="w-4 h-4 mr-2" />
              Attribuer la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}