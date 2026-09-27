import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreateProductModal } from "./CreateProductModal";
import { EditProductModal } from "./EditProductModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Package2, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  Euro,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description: string;
  price: number;
  cost?: number;
  quantity: number;
  unit: string;
  sku?: string;
  status: 'available' | 'unavailable' | 'seasonal';
  allergens: string[];
  ingredients: string[];
  preparationTime?: number;
  image?: string;
  createdAt: string;
}

export function ProductsManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Burger Classic",
      categoryId: 9,
      categoryName: "Plats principaux",
      description: "Burger classique avec steak, salade, tomate, cornichons et sauce maison",
      price: 12.90,
      cost: 4.50,
      quantity: 25,
      unit: "unité",
      sku: "BGR001",
      status: "available",
      allergens: ["Gluten", "Œufs"],
      ingredients: ["Pain burger", "Steak 150g", "Salade", "Tomate", "Cornichons", "Sauce burger"],
      preparationTime: 8,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Salade César",
      categoryId: 10,
      categoryName: "Entrées",
      description: "Salade romaine, croûtons, parmesan, anchois et sauce César",
      price: 9.50,
      cost: 3.20,
      quantity: 15,
      unit: "portion",
      sku: "SAL001",
      status: "available",
      allergens: ["Gluten", "Poisson", "Lactose"],
      ingredients: ["Salade romaine", "Croûtons", "Parmesan", "Anchois", "Sauce César"],
      preparationTime: 5,
      createdAt: "2024-01-12"
    },
    {
      id: 3,
      name: "Coca-Cola",
      categoryId: 7,
      categoryName: "Boissons",
      description: "Boisson gazeuse 33cl",
      price: 2.50,
      cost: 0.80,
      quantity: 50,
      unit: "bouteille",
      sku: "BOI001",
      status: "available",
      allergens: [],
      ingredients: ["Coca-Cola"],
      preparationTime: 1,
      createdAt: "2024-01-10"
    },
    {
      id: 4,
      name: "Tarte Tatin",
      categoryId: 11,
      categoryName: "Desserts",
      description: "Tarte aux pommes caramélisées, pâte feuilletée maison",
      price: 6.80,
      cost: 2.10,
      quantity: 0,
      unit: "portion",
      sku: "DES001",
      status: "unavailable",
      allergens: ["Gluten", "Lactose", "Œufs"],
      ingredients: ["Pommes", "Sucre", "Beurre", "Pâte feuilletée", "Œufs"],
      preparationTime: 45,
      createdAt: "2024-01-08"
    },
    {
      id: 5,
      name: "Frites maison",
      categoryId: 12,
      categoryName: "Accompagnements",
      description: "Frites de pommes de terre fraîches, cuites à l'huile de tournesol",
      price: 4.20,
      cost: 1.30,
      quantity: 30,
      unit: "portion",
      sku: "ACC001",
      status: "available",
      allergens: [],
      ingredients: ["Pommes de terre", "Huile de tournesol", "Sel"],
      preparationTime: 12,
      createdAt: "2024-01-14"
    }
  ]);

  const categories = ["all", "Boissons", "Plats principaux", "Entrées", "Desserts", "Accompagnements"];

  // Fonction pour ajouter un nouveau produit
  const handleProductCreated = (newProductData: any) => {
    // Mock des catégories pour obtenir le nom
    const categoryNames: Record<number, string> = {
      7: "Boissons",
      9: "Plats principaux", 
      10: "Entrées",
      11: "Desserts",
      12: "Accompagnements"
    };

    const newProduct: Product = {
      id: Date.now(),
      ...newProductData,
      categoryName: categoryNames[newProductData.categoryId] || "Autre",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProducts(prev => [newProduct, ...prev]);
    toast.success(`Produit "${newProductData.name}" ajouté avec succès !`);
  };

  // Fonction pour éditer un produit
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Fonction pour mettre à jour un produit
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    toast.success(`Produit "${updatedProduct.name}" modifié avec succès !`);
  };

  // Fonction pour initier la suppression d'un produit
  const handleDeleteProduct = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteProduct = () => {
    if (productToDelete) {
      const product = products.find(p => p.id === productToDelete);
      setProducts(prev => prev.filter(product => product.id !== productToDelete));
      toast.success(`Produit "${product?.name}" supprimé avec succès !`);
      setProductToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "unavailable": return "bg-red-500";
      case "seasonal": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Disponible";
      case "unavailable": return "Indisponible";
      case "seasonal": return "Saisonnier";
      default: return "Inconnu";
    }
  };

  const calculateMargin = (price: number, cost?: number) => {
    if (!cost) return 0;
    return ((price - cost) / price * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package2 className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des produits</h1>
            <p className="text-gray-600">Gérez vos produits finis à vendre</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit..."
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
                <p className="text-sm text-gray-600">Total produits</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indisponibles</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.status === "unavailable").length}
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
                  {products.filter(p => p.quantity < 5 && p.quantity > 0).length}
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
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === "available").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.categoryName}</p>
                      {product.sku && (
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="font-medium text-gray-900">{product.price.toFixed(2)}€</p>
                      {product.cost && (
                        <p className="text-xs text-gray-500">
                          Marge: {calculateMargin(product.price, product.cost).toFixed(1)}%
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="font-medium text-gray-900">{product.quantity} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Préparation</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {product.preparationTime || 0} min
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Allergènes</p>
                      {product.allergens.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.allergens.slice(0, 2).map((allergen) => (
                            <Badge key={allergen} variant="outline" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                          {product.allergens.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.allergens.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Aucun</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(product.status)} text-white`}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Description */}
                {product.description && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                )}
                
                {/* Ingredients */}
                {product.ingredients.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Ingrédients:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredients.map((ingredient) => (
                        <Badge key={ingredient} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modale de création de produit */}
      <CreateProductModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onProductCreated={handleProductCreated}
      />

      {/* Modale d'édition de produit */}
      <EditProductModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProduct}
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