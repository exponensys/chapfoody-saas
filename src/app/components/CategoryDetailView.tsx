import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CreateItemModal } from "./CreateItemModal";
import { EditItemModal } from "./EditItemModal";
import { toast } from "sonner@2.0.3";
import { 
  ArrowLeft, 
  Search,
  Plus,
  Edit,
  Trash,
  Filter,
  Download,
  Upload,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  ChefHat,
  Package2,
  Utensils,
  BarChart3
} from "lucide-react";

interface CategoryDetailViewProps {
  category: CategoryData;
  onBack: () => void;
}

interface CategoryData {
  id: number;
  name: string;
  type: 'ingredient' | 'produit' | 'ustensile';
  description: string;
  color: string;
  items: number;
}

interface ItemData {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  status: 'stock' | 'low' | 'out' | 'available' | 'unavailable' | 'operational' | 'maintenance' | 'broken';
  price?: number;
  lastUpdate: string;
  expiryDate?: string;
  visible?: boolean;
}

const mockItems: ItemData[] = [
  {
    id: 1,
    name: "Tomates cerises",
    quantity: 15,
    unit: "kg",
    status: "stock",
    price: 4.50,
    lastUpdate: "2024-01-10",
    expiryDate: "2024-01-15",
    visible: true
  },
  {
    id: 2,
    name: "Basilic frais",
    quantity: 2,
    unit: "botte",
    status: "low",
    price: 2.20,
    lastUpdate: "2024-01-09",
    expiryDate: "2024-01-12",
    visible: true
  },
  {
    id: 3,
    name: "Courgettes",
    quantity: 0,
    unit: "kg",
    status: "out",
    price: 3.80,
    lastUpdate: "2024-01-08",
    expiryDate: null,
    visible: true
  },
  {
    id: 4,
    name: "Aubergines",
    quantity: 8,
    unit: "pièce",
    status: "stock",
    price: 1.90,
    lastUpdate: "2024-01-10",
    expiryDate: "2024-01-14",
    visible: true
  },
  {
    id: 5,
    name: "Épinards",
    quantity: 3,
    unit: "kg",
    status: "low",
    price: 5.20,
    lastUpdate: "2024-01-09",
    expiryDate: "2024-01-11",
    visible: true
  }
];

export function CategoryDetailView({ category, onBack }: CategoryDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [items, setItems] = useState<ItemData[]>(mockItems);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const isVisible = item.visible !== false; // Afficher les articles visibles
      return matchesSearch && matchesStatus && isVisible;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "quantity":
          return b.quantity - a.quantity;
        case "status":
          return a.status.localeCompare(b.status);
        case "lastUpdate":
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stock':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">En stock</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Stock faible</Badge>;
      case 'out':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Épuisé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stock':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'out':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ingredient': return ChefHat;
      case 'produit': return Package2;
      case 'ustensile': return Utensils;
      default: return Package;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ingredient': return 'Ingrédient';
      case 'produit': return 'Produit';
      case 'ustensile': return 'Ustensile';
      default: return 'Non défini';
    }
  };

  const TypeIcon = getTypeIcon(category.type);

  // Fonctions de gestion des articles
  const handleItemCreated = (newItem: any) => {
    setItems(prev => [newItem, ...prev]);
    toast.success(`Article "${newItem.name}" ajouté avec succès !`);
  };

  const handleEditItem = (item: ItemData) => {
    setSelectedItem(item);
    setShowEditItemModal(true);
  };

  const handleItemUpdated = (updatedItem: any) => {
    setItems(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    toast.success(`Article "${updatedItem.name}" mis à jour !`);
  };

  const handleToggleVisibility = (itemId: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId 
          ? { ...item, visible: !item.visible }
          : item
      )
    );
    const item = items.find(i => i.id === itemId);
    if (item) {
      toast.success(
        item.visible 
          ? `"${item.name}" masqué de l'affichage`
          : `"${item.name}" rendu visible`
      );
    }
  };

  const handleDeleteItem = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (item && window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success(`Article "${item.name}" supprimé avec succès !`);
    }
  };

  const stockStats = {
    total: items.filter(item => item.visible !== false).length,
    inStock: items.filter(item => item.visible !== false && item.status === 'stock').length,
    lowStock: items.filter(item => item.visible !== false && item.status === 'low').length,
    outOfStock: items.filter(item => item.visible !== false && item.status === 'out').length,
    totalValue: items.filter(item => item.visible !== false).reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
            <TypeIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold text-gray-900">{category.name}</h1>
              <Badge variant="outline">{getTypeLabel(category.type)}</Badge>
            </div>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button 
            className="bg-[#b70f23] hover:bg-[#70070e]" 
            size="sm"
            onClick={() => setShowCreateItemModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stockStats.total}</p>
                <p className="text-sm text-gray-600">Articles totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stockStats.inStock}</p>
                <p className="text-sm text-gray-600">En stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stockStats.lowStock}</p>
                <p className="text-sm text-gray-600">Stock faible</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stockStats.outOfStock}</p>
                <p className="text-sm text-gray-600">Épuisé</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stockStats.totalValue.toFixed(2)}€</p>
                <p className="text-sm text-gray-600">Valeur totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="stock">En stock</SelectItem>
                  <SelectItem value="low">Stock faible</SelectItem>
                  <SelectItem value="out">Épuisé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="quantity">Quantité</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
                  <SelectItem value="lastUpdate">Dernière MAJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Articles dans cette catégorie ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Aucun article trouvé</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? "Essayez de modifier vos filtres de recherche"
                    : "Commencez par ajouter des articles à cette catégorie"
                  }
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Quantité: {item.quantity} {item.unit}</span>
                        {item.price && <span>Prix: {item.price}€/{item.unit}</span>}
                        <span>MAJ: {new Date(item.lastUpdate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleVisibility(item.id)}
                      title={item.visible === false ? "Rendre visible" : "Masquer"}
                    >
                      {item.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Supprimer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateItemModal
        open={showCreateItemModal}
        onOpenChange={setShowCreateItemModal}
        categoryType={category.type}
        categoryName={category.name}
        onItemCreated={handleItemCreated}
      />

      <EditItemModal
        open={showEditItemModal}
        onOpenChange={setShowEditItemModal}
        item={selectedItem}
        onItemUpdated={handleItemUpdated}
      />
    </div>
  );
}