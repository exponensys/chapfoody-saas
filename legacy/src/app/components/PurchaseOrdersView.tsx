import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreatePurchaseOrderModal } from "./CreatePurchaseOrderModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  ShoppingCart, 
  Plus, 
  Search,
  Edit,
  Trash,
  Eye,
  Calendar,
  Euro,
  Building2,
  Package,
  Clock,
  AlertTriangle
} from "lucide-react";

interface PurchaseOrder {
  id: number;
  reference: string;
  supplierId: number;
  supplierName: string;
  deliveryDate: string;
  priority: string;
  notes?: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export function PurchaseOrdersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      reference: "CMD240115-001",
      supplierId: 1,
      supplierName: "Metro Cash & Carry",
      deliveryDate: "2024-01-20",
      priority: "normal",
      notes: "Livraison en matinée préférée",
      items: [
        { name: "Tomates", quantity: 10, unit: "kg", unitPrice: 3.50, total: 35.00 },
        { name: "Salade verte", quantity: 5, unit: "kg", unitPrice: 2.80, total: 14.00 }
      ],
      totalAmount: 49.00,
      status: "pending",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      reference: "CMD240114-002",
      supplierId: 2,
      supplierName: "Sysco France",
      deliveryDate: "2024-01-18",
      priority: "high",
      notes: "",
      items: [
        { name: "Viande de bœuf", quantity: 5, unit: "kg", unitPrice: 24.50, total: 122.50 }
      ],
      totalAmount: 122.50,
      status: "confirmed",
      createdAt: "2024-01-14"
    },
    {
      id: 3,
      reference: "CMD240112-003",
      supplierId: 3,
      supplierName: "Pomona",
      deliveryDate: "2024-01-16",
      priority: "urgent",
      notes: "Commande urgente - livraison immédiate",
      items: [
        { name: "Pommes", quantity: 8, unit: "kg", unitPrice: 2.20, total: 17.60 },
        { name: "Oranges", quantity: 6, unit: "kg", unitPrice: 2.80, total: 16.80 }
      ],
      totalAmount: 34.40,
      status: "delivered",
      createdAt: "2024-01-12"
    }
  ]);

  const statusOptions = ["all", "pending", "confirmed", "delivered", "cancelled"];

  // Fonction pour ajouter une nouvelle commande
  const handleOrderCreated = (newOrderData: any) => {
    const newOrder: PurchaseOrder = {
      id: Date.now(),
      ...newOrderData
    };
    
    setOrders(prev => [newOrder, ...prev]);
    toast.success(`Commande "${newOrderData.reference}" créée avec succès !`);
  };

  // Fonction pour initier la suppression d'une commande
  const handleDeleteOrder = (orderId: number) => {
    setOrderToDelete(orderId);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      const order = orders.find(o => o.id === orderToDelete);
      setOrders(prev => prev.filter(order => order.id !== orderToDelete));
      toast.success(`Commande "${order?.reference}" supprimée avec succès !`);
      setOrderToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "confirmed": return "Confirmée";
      case "delivered": return "Livrée";
      case "cancelled": return "Annulée";
      default: return "Inconnu";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-700";
      case "normal": return "bg-blue-100 text-blue-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "urgent": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low": return "Basse";
      case "normal": return "Normale";
      case "high": return "Haute";
      case "urgent": return "Urgente";
      default: return "Normale";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Commandes d'achat</h1>
            <p className="text-gray-600">Gérez vos commandes auprès des fournisseurs</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle commande
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? "bg-[#b70f23] hover:bg-[#70070e]" : ""}
                >
                  {status === "all" ? "Toutes" : getStatusText(status)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total commandes</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter(o => o.priority === "urgent").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}€
                </p>
              </div>
              <Euro className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.reference}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{order.supplierName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Livraison</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priorité</p>
                      <Badge className={getPriorityColor(order.priority)}>
                        {getPriorityText(order.priority)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant</p>
                      <p className="font-medium text-gray-900">{order.totalAmount.toFixed(2)}€</p>
                      <p className="text-xs text-gray-500">{order.items.length} article(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {/* TODO: Implement view */}}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Notes */}
                {order.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
                
                {/* Items preview */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Articles:</p>
                  <div className="flex flex-wrap gap-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item.name} ({item.quantity} {item.unit})
                      </Badge>
                    ))}
                    {order.items.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{order.items.length - 3} autre(s)
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modale de création de commande */}
      <CreatePurchaseOrderModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onOrderCreated={handleOrderCreated}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}