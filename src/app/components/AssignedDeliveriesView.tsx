import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import { 
  Package, 
  Search,
  Clock,
  MapPin,
  User,
  Phone,
  Euro,
  Navigation,
  AlertCircle,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Truck
} from "lucide-react";

interface AssignedDelivery {
  id: number;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  driver: {
    id: number;
    name: string;
    phone: string;
    vehicleType: string;
    avatar?: string;
  };
  restaurant: {
    name: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'normal' | 'urgent' | 'express';
  estimatedDeliveryTime: string;
  actualPickupTime?: string;
  totalAmount: number;
  deliveryFee: number;
  specialInstructions?: string;
  assignedAt: string;
  distance: number;
}

export function AssignedDeliveriesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const [deliveries, setDeliveries] = useState<AssignedDelivery[]>([
    {
      id: 1,
      orderNumber: "CMD-2024-0001",
      customer: {
        name: "Jean Dupont",
        phone: "06 12 34 56 78",
        address: "15 Rue de la République, 75001 Paris",
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      driver: {
        id: 1,
        name: "Marc Dubois",
        phone: "06 98 76 54 32",
        vehicleType: "scooter",
        avatar: ""
      },
      restaurant: {
        name: "Pizza Bella",
        address: "23 Avenue des Italiens, 75009 Paris"
      },
      items: [
        { name: "Pizza Margherita", quantity: 2, price: 12.50 },
        { name: "Salade César", quantity: 1, price: 8.90 }
      ],
      status: "assigned",
      priority: "normal",
      estimatedDeliveryTime: "2024-01-16T19:30:00",
      totalAmount: 33.90,
      deliveryFee: 3.50,
      specialInstructions: "Sonner à l'interphone, appartement 3B",
      assignedAt: "2024-01-16T18:45:00",
      distance: 2.3
    },
    {
      id: 2,
      orderNumber: "CMD-2024-0002",
      customer: {
        name: "Marie Martin",
        phone: "06 87 65 43 21",
        address: "42 Boulevard Saint-Germain, 75006 Paris"
      },
      driver: {
        id: 2,
        name: "Sophie Martin",
        phone: "06 11 22 33 44",
        vehicleType: "bike",
        avatar: ""
      },
      restaurant: {
        name: "Sushi Zen",
        address: "8 Rue du Dragon, 75006 Paris"
      },
      items: [
        { name: "Menu Sashimi", quantity: 1, price: 24.90 },
        { name: "Miso Soup", quantity: 2, price: 4.50 }
      ],
      status: "picked_up",
      priority: "express",
      estimatedDeliveryTime: "2024-01-16T19:15:00",
      actualPickupTime: "2024-01-16T18:52:00",
      totalAmount: 33.90,
      deliveryFee: 4.00,
      assignedAt: "2024-01-16T18:40:00",
      distance: 1.2
    },
    {
      id: 3,
      orderNumber: "CMD-2024-0003",
      customer: {
        name: "Pierre Lecomte",
        phone: "06 55 44 33 22",
        address: "78 Rue de Rivoli, 75004 Paris"
      },
      driver: {
        id: 3,
        name: "Ahmed Hassan",
        phone: "06 33 44 55 66",
        vehicleType: "car",
        avatar: ""
      },
      restaurant: {
        name: "Burger House",
        address: "12 Place de la Bastille, 75011 Paris"
      },
      items: [
        { name: "Burger Deluxe", quantity: 3, price: 14.90 },
        { name: "Frites", quantity: 3, price: 4.50 },
        { name: "Coca Cola", quantity: 3, price: 3.20 }
      ],
      status: "in_transit",
      priority: "urgent",
      estimatedDeliveryTime: "2024-01-16T19:45:00",
      actualPickupTime: "2024-01-16T19:05:00",
      totalAmount: 67.80,
      deliveryFee: 5.00,
      specialInstructions: "Appeler avant d'arriver",
      assignedAt: "2024-01-16T18:30:00",
      distance: 3.8
    }
  ]);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || delivery.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "bg-yellow-100 text-yellow-700";
      case "picked_up": return "bg-blue-100 text-blue-700";
      case "in_transit": return "bg-purple-100 text-purple-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "assigned": return "Attribuée";
      case "picked_up": return "Récupérée";
      case "in_transit": return "En cours";
      case "delivered": return "Livrée";
      case "cancelled": return "Annulée";
      default: return "Inconnu";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "normal": return "bg-gray-100 text-gray-700";
      case "urgent": return "bg-orange-100 text-orange-700";
      case "express": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "normal": return "Normal";
      case "urgent": return "Urgent";
      case "express": return "Express";
      default: return "Normal";
    }
  };

  const getVehicleText = (vehicleType: string) => {
    switch (vehicleType) {
      case "bike": return "Vélo";
      case "scooter": return "Scooter";
      case "car": return "Voiture";
      case "van": return "Camionnette";
      default: return "Inconnu";
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulation du rafraîchissement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Données mises à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  };

  const getStats = () => {
    return {
      total: deliveries.length,
      assigned: deliveries.filter(d => d.status === 'assigned').length,
      inProgress: deliveries.filter(d => d.status === 'picked_up' || d.status === 'in_transit').length,
      urgent: deliveries.filter(d => d.priority === 'urgent' || d.priority === 'express').length
    };
  };

  const stats = getStats();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Commandes attribuées</h1>
            <p className="text-gray-600">Suivez les livraisons en cours</p>
          </div>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par commande, client ou livreur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="assigned">Attribuée</option>
                <option value="picked_up">Récupérée</option>
                <option value="in_transit">En cours</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Toutes priorités</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
              </select>
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
                <p className="text-sm text-gray-600">Total attribuées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.assigned}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prioritaires</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Livraisons actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{delivery.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        Attribuée à {formatTime(delivery.assignedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusText(delivery.status)}
                      </Badge>
                      <Badge className={getPriorityColor(delivery.priority)}>
                        {getPriorityText(delivery.priority)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Client Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Client</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{delivery.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{delivery.customer.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm">{delivery.customer.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Livreur</h4>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={delivery.driver.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{delivery.driver.name}</p>
                        <p className="text-xs text-gray-600">
                          {getVehicleText(delivery.driver.vehicleType)} • {delivery.distance} km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{delivery.driver.phone}</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Commande</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{delivery.restaurant.name}</p>
                      <div className="space-y-1">
                        {delivery.items.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-xs text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {delivery.items.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{delivery.items.length - 2} autres articles
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Euro className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {delivery.totalAmount.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timing Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Livraison prévue à {formatTime(delivery.estimatedDeliveryTime)}
                        </span>
                      </div>
                      {delivery.actualPickupTime && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Récupérée à {formatTime(delivery.actualPickupTime)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {delivery.specialInstructions && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Instructions spéciales</span>
                      </div>
                    )}
                  </div>
                  
                  {delivery.specialInstructions && (
                    <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-800">
                      {delivery.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredDeliveries.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune livraison trouvée</h3>
                <p className="text-gray-500">Aucune livraison ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}