import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  Truck, 
  Users, 
  Package, 
  Clock, 
  Star,
  TrendingUp,
  Euro,
  CheckCircle,
  AlertCircle,
  Activity,
  Building2,
  Navigation,
  MapPin,
  Phone
} from "lucide-react";

export function DeliveryOverviewView() {
  // Données de performance pour les graphiques
  const performanceData = [
    { day: "Lun", deliveries: 45, revenue: 1250 },
    { day: "Mar", deliveries: 52, revenue: 1450 },
    { day: "Mer", deliveries: 38, revenue: 1100 },
    { day: "Jeu", deliveries: 65, revenue: 1800 },
    { day: "Ven", deliveries: 78, revenue: 2200 },
    { day: "Sam", deliveries: 85, revenue: 2400 },
    { day: "Dim", deliveries: 42, revenue: 1200 }
  ];

  const deliveryTimeData = [
    { hour: "12h", avgTime: 25 },
    { hour: "13h", avgTime: 32 },
    { hour: "14h", avgTime: 28 },
    { hour: "19h", avgTime: 35 },
    { hour: "20h", avgTime: 42 },
    { hour: "21h", avgTime: 38 },
    { hour: "22h", avgTime: 30 }
  ];

  const driverStatusData = [
    { name: "Disponibles", value: 8, color: "#22c55e" },
    { name: "En livraison", value: 5, color: "#3b82f6" },
    { name: "Hors ligne", value: 2, color: "#6b7280" },
    { name: "En pause", value: 1, color: "#f59e0b" }
  ];

  // Données temps réel (simulation)
  const [liveStats, setLiveStats] = useState({
    activeDeliveries: 12,
    pendingOrders: 8,
    completedToday: 67,
    averageDeliveryTime: 28,
    customerSatisfaction: 4.7,
    totalRevenue: 2340.50
  });

  // Simulation de mise à jour des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeDeliveries: prev.activeDeliveries + Math.floor(Math.random() * 3) - 1,
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 3) - 1),
        completedToday: prev.completedToday + Math.floor(Math.random() * 2)
      }));
    }, 10000); // Mise à jour toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Aperçu des livraisons</h1>
            <p className="text-gray-600">Tableau de bord des livraisons en temps réel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">En temps réel</span>
          </div>
        </div>
      </div>

      {/* Statistiques temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <Package className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.activeDeliveries}</div>
            <div className="text-xs text-white/80 uppercase">En cours</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <Clock className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.pendingOrders}</div>
            <div className="text-xs text-white/80 uppercase">En attente</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <CheckCircle className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.completedToday}</div>
            <div className="text-xs text-white/80 uppercase">Livrées aujourd'hui</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <Activity className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.averageDeliveryTime} min</div>
            <div className="text-xs text-white/80 uppercase">Temps moyen</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <Star className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.customerSatisfaction}/5</div>
            <div className="text-xs text-white/80 uppercase">Satisfaction</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500 text-white rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <Euro className="w-5 h-5 text-white/70 mb-2" />
            <div className="text-lg font-bold">{liveStats.totalRevenue.toFixed(0)}€</div>
            <div className="text-xs text-white/80 uppercase">CA du jour</div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Livraisons par jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Temps de livraison par heure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={deliveryTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status des livreurs et informations entreprise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Statut des livreurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={driverStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {driverStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {driverStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Entreprise de livraison partenaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">FastDelivery Pro</h3>
                  <p className="text-gray-600">Partenaire officiel de livraison</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  Actif
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">01 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Zone: Paris et proche banlieue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">16 livreurs actifs</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Note de service</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4.7 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">4.7/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ponctualité</span>
                    <span className="text-sm font-medium text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Livraisons totales</span>
                    <span className="text-sm font-medium">2,847</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
              onClick={() => {/* Navigation vers infos entreprise */}}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm">Infos entreprise</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
              onClick={() => {/* Navigation vers liste livreurs */}}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Gérer livreurs</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600"
              onClick={() => {/* Navigation vers commandes attribuées */}}
            >
              <Package className="w-6 h-6" />
              <span className="text-sm">Commandes actives</span>
            </Button>
            
            <Button 
              className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600"
              onClick={() => {/* Navigation vers historique */}}
            >
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm">Historique</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes et notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Alertes et notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Retard signalé</p>
                <p className="text-xs text-gray-600">Commande CMD-2024-0156 - Estimée +15 min</p>
              </div>
              <Button size="sm" variant="outline">
                Voir détails
              </Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau livreur disponible</p>
                <p className="text-xs text-gray-600">Marc Dubois vient de terminer sa livraison</p>
              </div>
              <Button size="sm" variant="outline">
                Attribuer commande
              </Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Star className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Excellent retour client</p>
                <p className="text-xs text-gray-600">Commande CMD-2024-0155 - Note 5/5</p>
              </div>
              <Button size="sm" variant="outline">
                Voir avis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}