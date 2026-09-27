import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Folder,
  ChefHat,
  Package2,
  Utensils,
  ShoppingCart,
  Eye
} from "lucide-react";

export function StockOverviewView() {
  const stockMetrics = [
    { label: "Total Catégories", value: "12", color: "bg-blue-500", icon: Folder },
    { label: "Ingrédients", value: "247", color: "bg-green-500", icon: ChefHat },
    { label: "Produits à vendre", value: "89", color: "bg-orange-500", icon: Package2 },
    { label: "Ustensiles", value: "34", color: "bg-purple-500", icon: Utensils },
    { label: "Commandes en cours", value: "7", color: "bg-red-600", icon: ShoppingCart },
    { label: "Alertes stock", value: "15", color: "bg-yellow-500", icon: AlertTriangle }
  ];

  const recentActivity = [
    { type: "Réapprovisionnement", item: "Tomates fraîches", status: "Livré", time: "Il y a 2h" },
    { type: "Stock bas", item: "Huile d'olive", status: "Critique", time: "Il y a 3h" },
    { type: "Nouvelle commande", item: "Farine T55 (25kg)", status: "En cours", time: "Il y a 5h" },
    { type: "Inventaire", item: "Épices diverses", status: "Terminé", time: "Hier" }
  ];

  const topItems = [
    { name: "Tomates cerises", stock: "12 kg", usage: "+15%", trend: "up" },
    { name: "Fromage mozzarella", stock: "8 kg", usage: "-5%", trend: "down" },
    { name: "Pâtes linguines", stock: "25 kg", usage: "+8%", trend: "up" },
    { name: "Huile d'olive", stock: "3 L", usage: "+22%", trend: "up" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-[#b70f23]" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vue d'ensemble Stock & Ingrédients</h1>
          <p className="text-gray-600">Aperçu global de votre inventaire et activité récente</p>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stockMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#b70f23]" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.item}</p>
                    <p className="text-sm text-gray-600">{activity.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={activity.status === 'Critique' ? 'destructive' : 
                               activity.status === 'Livré' ? 'default' : 'secondary'}
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top ingrédients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#b70f23]" />
              Top ingrédients utilisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.usage}
                    </span>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Folder className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm text-blue-700">Catégories</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <ChefHat className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm text-green-700">Ingrédients</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <Package2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm text-orange-700">Produits</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Utensils className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm text-purple-700">Ustensiles</span>
            </button>
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors">
              <ShoppingCart className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <span className="text-sm text-red-700">Commandes</span>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm text-yellow-700">Alertes</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}