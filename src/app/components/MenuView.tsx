import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CategoryManagementView } from "./CategoryManagementView";
import { SpecialtyManagementView } from "./SpecialtyManagementView";
import { ExtraManagementView } from "./ExtraManagementView";
import { PackageManagementView } from "./PackageManagementView";
import { QRGeneratorView } from "./QRGeneratorView";
import { AllergenManagementView } from "./AllergenManagementView";
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { ResponsiveTable } from './ResponsiveTable';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Star,
  Download,
  Upload,
  Search,
  Filter,
  ChevronLeft,
  Settings,
  Package,
  QrCode,
  AlertTriangle,
} from "lucide-react";

interface MenuCategory {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  isActive: boolean;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isActive: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  allergens: string[];
  variants?: MenuVariant[];
  featured: boolean;
}

interface MenuVariant {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface MenuViewProps {
  onBack: () => void;
  activeSubSection?: string;
}

const mockCategories: MenuCategory[] = [
  {
    id: "african",
    name: "Cuisine Africaine",
    image: "https://images.unsplash.com/photo-1647998270792-69ac80570183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY3Vpc2luZSUyMGZvb2QlMjBkaXNofGVufDF8fHx8MTc1ODI5MDY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 10,
    isActive: true,
  },
  {
    id: "western",
    name: "Cuisine Occidentale",
    image: "https://images.unsplash.com/photo-1517984055083-fd6e1e788e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXN0ZXJuJTIwY2hpY2tlbiUyMGdyaWxsZWR8ZW58MXx8fHwxNzU4MjkwNzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 14,
    isActive: true,
  },
  {
    id: "grillades",
    name: "Grillades",
    image: "https://images.unsplash.com/photo-1702741168115-cd3d9a682972?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmFyYmVjdWUlMjBtZWF0fGVufDF8fHx8MTc1ODI5MDcwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 8,
    isActive: true,
  },
  {
    id: "sandwiches",
    name: "Sandwich & Burger",
    image: "https://images.unsplash.com/photo-1654471179701-e6dd7544ae5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBidXJnZXIlMjBmb29kfGVufDF8fHx8MTc1ODIxNjI1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 3,
    isActive: true,
  },
  {
    id: "pizza",
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1672856398893-2fb52d807874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBpenphJTIwaXRhbGlhbnxlbnwxfHx8fDE3NTgyOTA3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 6,
    isActive: true,
  },
  {
    id: "desserts",
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1630534375958-074cdc332d6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NTgyOTA3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 5,
    isActive: true,
  },
];

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    categoryId: "african",
    name: "Foutou sauce graine",
    description: "Avec viande de boeuf, triple, brochets",
    price: 2500,
    isActive: false,
    isVegetarian: false,
    isVegan: false,
    allergens: [],
    featured: false,
    variants: [
      {
        id: "1a",
        name: "Viande de Boeuf",
        price: 2500,
        description: "Avec viande de boeuf premium",
      },
      {
        id: "1b",
        name: "Poisson brochets",
        price: 2500,
        description: "Avec poisson brochets frais",
      },
    ],
  },
  {
    id: "2",
    categoryId: "african",
    name: "Foutou sauce gombo (Côpé)",
    description: "Spécialité traditionnelle ivoirienne",
    price: 3000,
    isActive: true,
    isVegetarian: false,
    isVegan: false,
    allergens: [],
    featured: true,
  },
  {
    id: "3",
    categoryId: "african",
    name: "Kedjenou de poulet",
    description: "Poulet mijoté aux légumes et épices",
    price: 6000,
    isActive: true,
    isVegetarian: false,
    isVegan: false,
    allergens: [],
    featured: true,
  },
  {
    id: "4",
    categoryId: "african",
    name: "APF",
    description: "Attieké Poisson Frit",
    price: 1800,
    isActive: true,
    isVegetarian: false,
    isVegan: false,
    allergens: ["poisson"],
    featured: false,
  },
];

export function MenuView({
  onBack,
  activeSubSection,
}: MenuViewProps) {
  const [currentView, setCurrentView] = useState<
    | "categories"
    | "items"
    | "categoryManagement"
    | "specialtyManagement"
    | "extraManagement"
    | "packageManagement"
    | "qrGenerator"
    | "allergenManagement"
  >("categories");
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory | null>(null);
  const [categories, setCategories] =
    useState<MenuCategory[]>(mockCategories);
  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(mockMenuItems);

  // Gérer la navigation basée sur activeSubSection
  useEffect(() => {
    if (activeSubSection === "categories") {
      setCurrentView("categoryManagement");
    } else if (activeSubSection === "specialites") {
      setCurrentView("specialtyManagement");
    } else if (activeSubSection === "extras") {
      setCurrentView("extraManagement");
    } else if (activeSubSection === "packages") {
      setCurrentView("packageManagement");
    } else if (activeSubSection === "generateur-qr") {
      setCurrentView("qrGenerator");
    } else if (activeSubSection === "allergies") {
      setCurrentView("allergenManagement");
    } else {
      setCurrentView("categories");
    }
  }, [activeSubSection]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isVegetarian: false,
    isVegan: false,
    allergens: [] as string[],
    hasVariants: false,
    variants: [] as MenuVariant[],
  });

  const handleCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setCurrentView("items");
  };

  const handleBackToCategories = () => {
    setCurrentView("categories");
    setSelectedCategory(null);
  };

  const handleAddItem = () => {
    if (selectedCategory) {
      setNewItemForm((prev) => ({
        ...prev,
        categoryId: selectedCategory.id,
      }));
    }
    setIsAddItemOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItemForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      categoryId: item.categoryId,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      allergens: item.allergens,
      hasVariants: !!item.variants?.length,
      variants: item.variants || [],
    });
    setIsAddItemOpen(true);
  };

  const handleSaveItem = () => {
    const itemData: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      categoryId: newItemForm.categoryId,
      name: newItemForm.name,
      description: newItemForm.description || undefined,
      price: parseFloat(newItemForm.price),
      isActive: true,
      isVegetarian: newItemForm.isVegetarian,
      isVegan: newItemForm.isVegan,
      allergens: newItemForm.allergens,
      variants: newItemForm.hasVariants
        ? newItemForm.variants
        : undefined,
      featured: false,
    };

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...itemData, id: editingItem.id }
            : item,
        ),
      );
    } else {
      setMenuItems((prev) => [itemData, ...prev]);
    }

    // Reset form
    setNewItemForm({
      name: "",
      description: "",
      price: "",
      categoryId: selectedCategory?.id || "",
      isVegetarian: false,
      isVegan: false,
      allergens: [],
      hasVariants: false,
      variants: [],
    });
    setEditingItem(null);
    setIsAddItemOpen(false);
  };

  const toggleItemStatus = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isActive: !item.isActive }
          : item,
      ),
    );
  };

  const deleteItem = (itemId: string) => {
    setMenuItems((prev) =>
      prev.filter((item) => item.id !== itemId),
    );
  };

  const filteredItems = menuItems
    .filter((item) =>
      selectedCategory
        ? item.categoryId === selectedCategory.id
        : true,
    )
    .filter((item) => (showOnlyActive ? item.isActive : true))
    .filter(
      (item) =>
        searchQuery === "" ||
        item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

  const remainingItems = categories.reduce((total, cat) => {
    const catItems = menuItems.filter(
      (item) => item.categoryId === cat.id,
    );
    return total + catItems.length;
  }, 0);

  // Vue de gestion des catégories
  if (currentView === "categoryManagement") {
    return (
      <CategoryManagementView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  // Vue de gestion des spécialités
  if (currentView === "specialtyManagement") {
    return (
      <SpecialtyManagementView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  // Vue de gestion des extras
  if (currentView === "extraManagement") {
    return (
      <ExtraManagementView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  // Vue de gestion des packages
  if (currentView === "packageManagement") {
    return (
      <PackageManagementView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  // Vue générateur QR
  if (currentView === "qrGenerator") {
    return (
      <QRGeneratorView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  // Vue gestion des allergènes
  if (currentView === "allergenManagement") {
    return (
      <AllergenManagementView
        onBack={() => {
          setCurrentView("categories");
        }}
      />
    );
  }

  if (currentView === "categories") {
    return (
      <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-medium text-[#b70f23]">
                Gestion de Menu
              </h2>
              <p className="text-muted-foreground">
                Il vous reste {remainingItems} articles sur 100
                • Durée : 28 Aug 2025 - 26 Nov 2025
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Upload className="w-4 h-4" />
              Importer
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-50 border-l-4 border-l-[#b70f23]">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              total :{" "}
              <span className="font-medium">
                {remainingItems} / 100
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Categories Section */}
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl mb-2">Catégories Populaires</h3>
              <div className="w-16 h-1 bg-[#b70f23] rounded-full"></div>
            </div>
            <div className="w-full lg:w-auto overflow-x-auto">
              <div className="flex gap-2 min-w-fit">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentView("categoryManagement")
                  }
                  className="gap-2 whitespace-nowrap"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Gérer catégories</span>
                  <span className="sm:hidden">Catégories</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentView("specialtyManagement")
                  }
                  className="gap-2 whitespace-nowrap"
                >
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">Gérer spécialités</span>
                  <span className="sm:hidden">Spécialités</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentView("extraManagement")
                  }
                  className="gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Gérer extras</span>
                  <span className="sm:hidden">Extras</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentView("packageManagement")
                  }
                  className="gap-2 whitespace-nowrap"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Gérer packages</span>
                  <span className="sm:hidden">Packages</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("qrGenerator")}
                  className="gap-2 whitespace-nowrap"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Générateur QR</span>
                  <span className="sm:hidden">QR</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentView("allergenManagement")
                  }
                  className="gap-2 whitespace-nowrap"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">Gérer allergènes</span>
                  <span className="sm:hidden">Allergènes</span>
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Ajouter un nouvel élément</span>
                  <span className="sm:hidden">Ajouter</span>
                </Button>
              </div>
            </div>
          </div>

          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 group overflow-hidden rounded-lg border-0"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-medium text-lg mb-1">
                          {category.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-[#f4b71b] text-black text-xs font-medium"
                          >
                            {category.itemCount} plats
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleBackToCategories}
            className="p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-medium text-[#b70f23]">
            {selectedCategory?.name} - : {filteredItems.length}
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="bg-[#f4b71b] hover:bg-[#e6a516] text-black gap-2 flex-1 sm:flex-none">
            <Upload className="w-4 h-4" />
            Importer
          </Button>
          <Button className="bg-gray-600 hover:bg-gray-700 text-white gap-2 flex-1 sm:flex-none">
            <Download className="w-4 h-4" />
            Modèle
          </Button>
          <Button
            onClick={handleAddItem}
            className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2 flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un nouveau</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={showOnlyActive}
            onCheckedChange={setShowOnlyActive}
            id="active-only"
          />
          <Label htmlFor="active-only" className="text-sm whitespace-nowrap">
            Actifs uniquement
          </Label>
        </div>
      </div>

      {/* Items Table - Responsive */}
      <Card>
        <ResponsiveTable
          columns={[
            { key: 'index', label: '#' },
            { key: 'image', label: 'Images', hideOnMobile: true },
            { key: 'title', label: 'Title' },
            { key: 'price', label: 'Prix' },
            { key: 'extra', label: 'Extra', hideOnMobile: true },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Action' }
          ]}
          data={filteredItems.map((item, index) => ({
            id: item.id,
            index: index + 1,
            image: item.image,
            title: item.name,
            description: item.description,
            price: item.price,
            variants: item.variants,
            extra: { featured: item.featured, vegetarian: item.isVegetarian, vegan: item.isVegan },
            status: item.isActive,
            actions: 'menu-actions',
            originalItem: item
          }))}
          renderCell={(key, value, row) => {
            const item = row.originalItem as MenuItem;
            
            switch (key) {
              case 'image':
                return (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {item.image ? (
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Eye className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                );
              
              case 'title':
                return (
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    )}
                    {item.variants && item.variants.length > 0 && (
                      <div className="text-xs text-[#b70f23] mt-1">
                        Nom de la variante : Variation
                        {item.variants.map((variant, idx) => (
                          <div
                            key={variant.id}
                            className="text-xs text-muted-foreground"
                          >
                            {variant.name} : {variant.price.toFixed(2)} FCFA
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              
              case 'price':
                return <span className="font-medium">{item.price.toFixed(2)} FCFA</span>;
              
              case 'extra':
                return (
                  <div className="flex gap-1">
                    {item.featured && <Star className="w-4 h-4 text-[#f4b71b]" />}
                    {item.isVegetarian && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 rounded">V</span>
                    )}
                    {item.isVegan && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 rounded">VG</span>
                    )}
                  </div>
                );
              
              case 'status':
                return (
                  <Badge
                    variant={item.isActive ? "default" : "destructive"}
                    className={item.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {item.isActive ? "Live" : "Caché"}
                  </Badge>
                );
              
              case 'actions':
                return (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleItemStatus(item.id)}
                      className="p-1"
                    >
                      {item.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      className="p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              
              default:
                return value;
            }
          }}
          onRowClick={() => {}} // Pas de click sur les lignes
          emptyState={
            <div className="text-center py-8 text-muted-foreground">
              Aucun article trouvé
            </div>
          }
        />
      </Card>

      {/* Add/Edit Item Dialog - Responsive */}
      <Dialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingItem
                ? "Modifier l'article"
                : "Ajouter un nouvel article"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour{" "}
              {editingItem ? "modifier" : "créer"} un article de
              menu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap={4}>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={newItemForm.categoryId}
                  onValueChange={(value) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergies</Label>
                <Input
                  placeholder="Sélectionner"
                  // This would typically be a multi-select component
                />
              </div>
            </ResponsiveGrid>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newItemForm.name}
                onChange={(e) =>
                  setNewItemForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Nom de l'article"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItemForm.description}
                onChange={(e) =>
                  setNewItemForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description de l'article"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                value={newItemForm.price}
                onChange={(e) =>
                  setNewItemForm((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>

            <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap={4}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegetarian"
                  checked={newItemForm.isVegetarian}
                  onCheckedChange={(checked) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      isVegetarian: !!checked,
                    }))
                  }
                />
                <Label htmlFor="vegetarian">Végétarien</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegan"
                  checked={newItemForm.isVegan}
                  onCheckedChange={(checked) =>
                    setNewItemForm((prev) => ({
                      ...prev,
                      isVegan: !!checked,
                    }))
                  }
                />
                <Label htmlFor="vegan">Vegan</Label>
              </div>
            </ResponsiveGrid>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddItemOpen(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveItem}
                className="bg-[#b70f23] hover:bg-[#70070e] text-white w-full sm:w-auto"
                disabled={!newItemForm.name || !newItemForm.price}
              >
                {editingItem ? "Modifier" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}