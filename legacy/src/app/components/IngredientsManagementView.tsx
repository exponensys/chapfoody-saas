import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreateItemModal } from "./CreateItemModal";
import { EditIngredientModal } from "./EditIngredientModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  ChefHat, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package
} from "lucide-react";

export function IngredientsManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<number | null>(null);
  const [ingredients, setIngredients] = useState([
    { 
      id: 1, 
      name: "Tomates cerises", 
      category: "Légumes", 
      stock: "12 kg", 
      stockLevel: 80, 
      minStock: 5, 
      unit: "kg",
      price: "4.50€/kg",
      supplier: "Maraîcher Local",
      lastOrder: "2024-01-15",
      status: "ok",
      trend: "up"
    },
    { 
      id: 2, 
      name: "Huile d'olive extra vierge", 
      category: "Huiles", 
      stock: "3 L", 
      stockLevel: 25, 
      minStock: 2, 
      unit: "L",
      price: "8.90€/L",
      supplier: "Oléiculteur Pro",
      lastOrder: "2024-01-10",
      status: "low",
      trend: "down"
    },
    { 
      id: 3, 
      name: "Mozzarella di bufala", 
      category: "Fromages", 
      stock: "8 kg", 
      stockLevel: 60, 
      minStock: 3, 
      unit: "kg",
      price: "12.00€/kg",
      supplier: "Fromagerie Italia",
      lastOrder: "2024-01-12",
      status: "ok",
      trend: "up"
    },
    { 
      id: 4, 
      name: "Basilic frais", 
      category: "Herbes", 
      stock: "0.5 kg", 
      stockLevel: 10, 
      minStock: 1, 
      unit: "kg",
      price: "15.00€/kg",
      supplier: "Potager Urbain",
      lastOrder: "2024-01-08",
      status: "critical",
      trend: "down"
    },
    { 
      id: 5, 
      name: "Pâtes linguines", 
      category: "Féculents", 
      stock: "25 kg", 
      stockLevel: 95, 
      minStock: 5, 
      unit: "kg",
      price: "2.80€/kg",
      supplier: "Pastificio Romano",
      lastOrder: "2024-01-14",
      status: "ok",
      trend: "up"
    }
  ]);

  const categories = ["all", "Légumes", "Huiles", "Fromages", "Herbes", "Féculents"];

  // Fonction pour ajouter un nouvel ingrédient
  const handleIngredientCreated = (newIngredient: any) => {
    const mappedIngredient = {
      id: Date.now(),
      name: newIngredient.name,
      category: "Légumes", // Catégorie par défaut
      stock: `${newIngredient.quantity} ${newIngredient.unit}`,
      stockLevel: 100, // Niveau par défaut
      minStock: Math.floor(newIngredient.quantity * 0.2), // 20% du stock initial
      unit: newIngredient.unit,
      price: newIngredient.price ? `${newIngredient.price}€/${newIngredient.unit}` : "N/A",
      supplier: "Nouveau fournisseur", // Par défaut
      lastOrder: new Date().toISOString().split('T')[0],
      status: "ok",
      trend: "up"
    };
    
    setIngredients(prev => [mappedIngredient, ...prev]);
    toast.success(`Ingrédient "${newIngredient.name}" ajouté avec succès !`);
  };

  // Fonction pour éditer un ingrédient
  const handleEditIngredient = (ingredient: any) => {
    setSelectedIngredient(ingredient);
    setShowEditModal(true);
  };

  // Fonction pour mettre à jour un ingrédient
  const handleIngredientUpdated = (updatedIngredient: any) => {
    setIngredients(prev => 
      prev.map(ingredient => 
        ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
      )
    );
    toast.success(`Ingrédient "${updatedIngredient.name}" modifié avec succès !`);
  };

  // Fonction pour initier la suppression d'un ingrédient
  const handleDeleteIngredient = (ingredientId: number) => {
    setIngredientToDelete(ingredientId);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteIngredient = () => {
    if (ingredientToDelete) {
      const ingredient = ingredients.find(i => i.id === ingredientToDelete);
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientToDelete));
      toast.success(`Ingrédient "${ingredient?.name}" supprimé avec succès !`);
      setIngredientToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-500";
      case "low": return "bg-yellow-500";
      case "ok": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "critical": return "Critique";
      case "low": return "Bas";
      case "ok": return "OK";
      default: return "Inconnu";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des ingrédients</h1>
            <p className="text-gray-600">Suivez et gérez votre stock d'ingrédients</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel ingrédient
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un ingrédient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#b70f23] hover:bg-[#70070e]" : ""}
                >
                  {category === "all" ? "Toutes" : category}
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
                <p className="text-sm text-gray-600">Total ingrédients</p>
                <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock critique</p>
                <p className="text-2xl font-bold text-red-600">
                  {ingredients.filter(i => i.status === "critical").length}
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
                <p className="text-sm text-gray-600">Stock bas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ingredients.filter(i => i.status === "low").length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock optimal</p>
                <p className="text-2xl font-bold text-green-600">
                  {ingredients.filter(i => i.status === "ok").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des ingrédients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIngredients.map((ingredient) => (
              <div key={ingredient.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                      <p className="text-sm text-gray-600">{ingredient.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock actuel</p>
                      <p className="font-medium text-gray-900">{ingredient.stock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix unitaire</p>
                      <p className="font-medium text-gray-900">{ingredient.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fournisseur</p>
                      <p className="font-medium text-gray-900">{ingredient.supplier}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(ingredient.status)} text-white`}>
                        {getStatusText(ingredient.status)}
                      </Badge>
                      {ingredient.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditIngredient(ingredient)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {/* Stock level bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Niveau de stock</span>
                    <span>{ingredient.stockLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        ingredient.stockLevel < 20 ? 'bg-red-500' : 
                        ingredient.stockLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${ingredient.stockLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modale de création d'ingrédient */}
      <CreateItemModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        categoryType="ingredient"
        categoryName="Ingrédients"
        onItemCreated={handleIngredientCreated}
      />

      {/* Modale d'édition d'ingrédient */}
      <EditIngredientModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        ingredient={selectedIngredient}
        onIngredientUpdated={handleIngredientUpdated}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet ingrédient ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteIngredient}
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