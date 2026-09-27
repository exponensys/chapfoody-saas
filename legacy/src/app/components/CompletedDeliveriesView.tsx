import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DatePicker } from "./ui/date-picker";
import { toast } from "sonner@2.0.3";
import { 
  CheckCircle, 
  Search,
  Calendar,
  MapPin,
  User,
  Phone,
  Euro,
  Star,
  Clock,
  Truck,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Package
} from "lucide-react";

interface CompletedDelivery {
  id: number;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    rating?: number;
    feedback?: string;
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
  deliveryDetails: {
    assignedAt: string;
    pickedUpAt: string;
    deliveredAt: string;
    estimatedTime: string;
    actualDeliveryTime: number; // en minutes
    distance: number;
  };
  payment: {
    totalAmount: number;
    deliveryFee: number;
    tip?: number;
    paymentMethod: string;
  };
  status: 'delivered' | 'returned' | 'partially_delivered';
  priority: 'normal' | 'urgent' | 'express';
  specialInstructions?: string;
}

export function CompletedDeliveriesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const [deliveries, setDeliveries] = useState<CompletedDelivery[]>([
    {
      id: 1,
      orderNumber: "CMD-2024-0001",
      customer: {
        name: "Jean Dupont",
        phone: "06 12 34 56 78",
        address: "15 Rue de la République, 75001 Paris",
        rating: 5,
        feedback: "Livraison parfaite, livreur très sympa !"
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
      deliveryDetails: {
        assignedAt: "2024-01-15T18:45:00",
        pickedUpAt: "2024-01-15T19:10:00",
        deliveredAt: "2024-01-15T19:28:00",
        estimatedTime: "2024-01-15T19:30:00",
        actualDeliveryTime: 43,
        distance: 2.3
      },
      payment: {
        totalAmount: 33.90,
        deliveryFee: 3.50,
        tip: 2.00,
        paymentMethod: "Carte bancaire"
      },
      status: 'delivered',
      priority: 'normal',
      specialInstructions: "Sonner à l'interphone, appartement 3B"
    },
    {
      id: 2,
      orderNumber: "CMD-2024-0002",
      customer: {
        name: "Marie Martin",
        phone: "06 87 65 43 21",
        address: "42 Boulevard Saint-Germain, 75006 Paris",
        rating: 4,
        feedback: "Bon service, mais un peu en retard"
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
      deliveryDetails: {
        assignedAt: "2024-01-15T18:40:00",
        pickedUpAt: "2024-01-15T18:52:00",
        deliveredAt: "2024-01-15T19:22:00",
        estimatedTime: "2024-01-15T19:15:00",
        actualDeliveryTime: 42,
        distance: 1.2
      },
      payment: {
        totalAmount: 33.90,
        deliveryFee: 4.00,
        tip: 1.50,
        paymentMethod: "Espèces"
      },
      status: 'delivered',
      priority: 'express'
    },
    {
      id: 3,
      orderNumber: "CMD-2024-0003",
      customer: {
        name: "Pierre Lecomte",
        phone: "06 55 44 33 22",
        address: "78 Rue de Rivoli, 75004 Paris",
        rating: 3,
        feedback: "Nourriture froide à l'arrivée"
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
      deliveryDetails: {
        assignedAt: "2024-01-14T18:30:00",
        pickedUpAt: "2024-01-14T19:05:00",
        deliveredAt: "2024-01-14T19:58:00",
        estimatedTime: "2024-01-14T19:45:00",
        actualDeliveryTime: 88,
        distance: 3.8
      },
      payment: {
        totalAmount: 67.80,
        deliveryFee: 5.00,
        paymentMethod: "Carte bancaire"
      },
      status: 'delivered',
      priority: 'urgent',
      specialInstructions: "Appeler avant d'arriver"
    }
  ]);

  // Ajouter une liste des conducteurs pour le filtre
  const drivers = Array.from(new Set(deliveries.map(d => d.driver.name))).map(name => ({
    id: deliveries.find(d => d.driver.name === name)?.driver.id || 0,
    name
  }));

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus;
    const matchesDriver = selectedDriver === "all" || delivery.driver.name === selectedDriver;
    
    // Filter by date range if provided
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const deliveryDate = new Date(delivery.deliveryDetails.deliveredAt);
      if (dateFrom && deliveryDate < dateFrom) matchesDate = false;
      if (dateTo && deliveryDate > dateTo) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDriver && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "returned": return "bg-orange-100 text-orange-700";
      case "partially_delivered": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Livrée";
      case "returned": return "Retournée";
      case "partially_delivered": return "Partiellement livrée";
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStats = () => {
    const totalRevenue = filteredDeliveries.reduce((sum, d) => sum + d.payment.totalAmount, 0);
    const totalTips = filteredDeliveries.reduce((sum, d) => sum + (d.payment.tip || 0), 0);
    const avgRating = filteredDeliveries
      .filter(d => d.customer.rating)
      .reduce((sum, d) => sum + (d.customer.rating || 0), 0) / 
      filteredDeliveries.filter(d => d.customer.rating).length || 0;
    const avgDeliveryTime = filteredDeliveries.reduce((sum, d) => sum + d.deliveryDetails.actualDeliveryTime, 0) / filteredDeliveries.length || 0;

    return {
      total: filteredDeliveries.length,
      revenue: totalRevenue,
      tips: totalTips,
      avgRating: avgRating,
      avgDeliveryTime: Math.round(avgDeliveryTime)
    };
  };

  const stats = getStats();

  const handleExport = () => {
    toast.success("Export des données en cours...");
    // TODO: Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Commandes livrées</h1>
            <p className="text-gray-600">Historique et statistiques des livraisons terminées</p>
          </div>
        </div>
        <Button 
          onClick={handleExport}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
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
                <option value="delivered">Livrée</option>
                <option value="returned">Retournée</option>
                <option value="partially_delivered">Partiellement livrée</option>
              </select>
              
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous livreurs</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.name}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <div className="min-w-[120px]">
                <DatePicker
                  date={dateFrom}
                  onSelect={setDateFrom}
                  placeholder="Date début"
                />
              </div>
              <div className="min-w-[120px]">
                <DatePicker
                  date={dateTo}
                  onSelect={setDateTo}
                  placeholder="Date fin"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total livrées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-green-600">{stats.revenue.toFixed(2)}€</p>
              </div>
              <Euro className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pourboires</p>
                <p className="text-2xl font-bold text-blue-600">{stats.tips.toFixed(2)}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgDeliveryTime} min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des livraisons</CardTitle>
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
                        {formatDate(delivery.deliveryDetails.deliveredAt)}
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {getVehicleText(delivery.driver.vehicleType)} • {delivery.deliveryDetails.distance} km
                        </p>
                      </div>
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
                    </div>
                  </div>

                  {/* Payment & Performance */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Paiement</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {delivery.payment.totalAmount.toFixed(2)}€
                        </span>
                      </div>
                      {delivery.payment.tip && (
                        <p className="text-xs text-green-600">
                          +{delivery.payment.tip.toFixed(2)}€ pourboire
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        {delivery.payment.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timing & Rating */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Livrée en {delivery.deliveryDetails.actualDeliveryTime} min
                          ({formatTime(delivery.deliveryDetails.deliveredAt)})
                        </span>
                      </div>
                      
                      {delivery.customer.rating && (
                        <div className="flex items-center gap-2">
                          {renderStars(delivery.customer.rating)}
                          <span className="text-sm text-gray-600">
                            {delivery.customer.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {delivery.customer.feedback && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>Commentaire client :</strong> {delivery.customer.feedback}
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