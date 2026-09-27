import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { CategoryDetailView } from "./CategoryDetailView";
import { toast } from "sonner@2.0.3";
import { 
  Folder, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  Package,
  ChefHat,
  Package2,
  Utensils
} from "lucide-react";

export function StockCategoriesView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showCategoryDetail, setShowCategoryDetail] = useState(false);

  const [categories, setCategories] = useState([
    { id: 1, name: "Légumes frais", type: "ingredient" as const, items: 45, color: "bg-green-500", description: "Légumes de saison et produits frais" },
    { id: 2, name: "Viandes & Poissons", type: "ingredient" as const, items: 23, color: "bg-red-500", description: "Protéines animales fraîches et surgelées" },
    { id: 3, name: "Produits laitiers", type: "ingredient" as const, items: 18, color: "bg-blue-500", description: "Fromages, yaourts, crème et beurre" },
    { id: 4, name: "Épices & Aromates", type: "ingredient" as const, items: 67, color: "bg-orange-500", description: "Herbes, épices et condiments" },
    { id: 5, name: "Féculents", type: "ingredient" as const, items: 12, color: "bg-yellow-500", description: "Pâtes, riz, pommes de terre" },
    { id: 6, name: "Huiles & Vinaigres", type: "ingredient" as const, items: 8, color: "bg-purple-500", description: "Matières grasses et assaisonnements" },
    { id: 7, name: "Boissons", type: "produit" as const, items: 34, color: "bg-teal-500", description: "Boissons alcoolisées et non alcoolisées" },
    { id: 8, name: "Ustensiles de service", type: "ustensile" as const, items: 15, color: "bg-gray-500", description: "Matériel de service et présentation" }
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryCreated = (categoryData: any) => {
    const newCategory = {
      id: categories.length + 1,
      ...categoryData,
      items: 0 // Nouvelle catégorie commence avec 0 articles
    };
    
    setCategories(prev => [newCategory, ...prev]);
    
    toast.success(`Catégorie "${categoryData.name}" créée avec succès !`);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleCategoryUpdated = (updatedCategory: any) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
    toast.success(`Catégorie "${updatedCategory.name}" mise à jour !`);
  };

  const handleViewCategoryDetail = (category: any) => {
    setSelectedCategory(category);
    setShowCategoryDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowCategoryDetail(false);
    setSelectedCategory(null);
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

  // Affichage conditionnel : vue détail de catégorie ou liste des catégories
  if (showCategoryDetail && selectedCategory) {
    return (
      <CategoryDetailView
        category={selectedCategory}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Catégories de stock</h1>
            <p className="text-gray-600">Organisez vos ingrédients par catégorie</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => {
          const TypeIcon = getTypeIcon(category.type);
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(category.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {category.items} articles
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCategoryDetail(category)}
                    >
                      Voir tout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Catégories totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{categories.reduce((acc, cat) => acc + cat.items, 0)}</p>
              <p className="text-sm text-gray-600">Articles totaux</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{Math.round(categories.reduce((acc, cat) => acc + cat.items, 0) / categories.length)}</p>
              <p className="text-sm text-gray-600">Moyenne par catégorie</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.items > 20).length}
              </p>
              <p className="text-sm text-gray-600">Catégories bien fournies</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de création de catégorie */}
      <CreateCategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* Modal d'édition de catégorie */}
      <EditCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </div>
  );
}