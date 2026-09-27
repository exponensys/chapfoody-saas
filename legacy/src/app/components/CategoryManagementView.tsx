import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  ShoppingCart,
  Clock
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  language: string;
  commandCount: number;
  status: 'Live' | 'Caché';
  createdAt: string;
  ordersToday: number;
  revenueToday: number;
  averageOrderValue: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  language: string;
  imageFile?: File;
  imageUrl?: string;
}

interface CategoryManagementViewProps {
  onBack: () => void;
}

const mockCategories: Category[] = [
  {
    id: '89',
    name: 'Cuisine Africaine',
    description: 'Plats traditionnels africains authentiques',
    imageUrl: 'https://images.unsplash.com/photo-1702827482556-481adcd68f3b?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 45,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 12,
    revenueToday: 34500,
    averageOrderValue: 2875
  },
  {
    id: '90',
    name: 'Cuisine Occidentale',
    description: 'Plats européens et américains',
    imageUrl: 'https://images.unsplash.com/photo-1557499305-bd68d0ad468d?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 32,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 8,
    revenueToday: 28000,
    averageOrderValue: 3500
  },
  {
    id: '97',
    name: 'Grillades',
    description: 'Viandes et poissons grillés',
    imageUrl: 'https://images.unsplash.com/photo-1626323108673-4bd52f641909?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 28,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 15,
    revenueToday: 42000,
    averageOrderValue: 2800
  },
  {
    id: '96',
    name: 'Sandwich & Burger',
    description: 'Sandwichs et burgers variés',
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 19,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 6,
    revenueToday: 18500,
    averageOrderValue: 3083
  },
  {
    id: '95',
    name: 'Pizzas',
    description: 'Pizzas artisanales et classiques',
    imageUrl: 'https://images.unsplash.com/photo-1597715474989-9ae8683704b3?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 22,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 9,
    revenueToday: 31500,
    averageOrderValue: 3500
  },
  {
    id: '91',
    name: 'Cuisine Asiatique',
    description: 'Spécialités asiatiques variées',
    imageUrl: 'https://images.unsplash.com/photo-1590784591058-6cd313ac9444?w=400&h=300&fit=crop',
    language: 'French',
    commandCount: 16,
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 4,
    revenueToday: 14000,
    averageOrderValue: 3500
  }
];

export function CategoryManagementView({ onBack }: CategoryManagementViewProps) {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    language: 'French',
    imageUrl: ''
  });

  const filteredCategories = categories
    .filter(category => showOnlyActive ? category.status === 'Live' : true)
    .filter(category => 
      searchQuery === '' || 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalOrdersToday = categories.reduce((sum, cat) => sum + cat.ordersToday, 0);
  const totalRevenueToday = categories.reduce((sum, cat) => sum + cat.revenueToday, 0);
  const averageOrderValue = totalOrdersToday > 0 ? totalRevenueToday / totalOrdersToday : 0;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      language: selectedLanguage,
      imageUrl: ''
    });
    setIsAddCategoryOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      language: category.language,
      imageUrl: category.imageUrl
    });
    setIsAddCategoryOpen(true);
  };

  const handleSaveCategory = () => {
    const newCategory: Category = {
      id: editingCategory?.id || String(Date.now()),
      name: formData.name,
      description: formData.description,
      language: formData.language,
      imageUrl: formData.imageUrl,
      commandCount: editingCategory?.commandCount || 0,
      status: 'Live',
      createdAt: editingCategory?.createdAt || new Date().toISOString().split('T')[0],
      ordersToday: editingCategory?.ordersToday || 0,
      revenueToday: editingCategory?.revenueToday || 0,
      averageOrderValue: editingCategory?.averageOrderValue || 0
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? { ...newCategory, id: editingCategory.id } : cat
      ));
    } else {
      setCategories(prev => [newCategory, ...prev]);
    }

    setIsAddCategoryOpen(false);
    setFormData({
      name: '',
      description: '',
      language: 'French',
      imageUrl: ''
    });
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, status: cat.status === 'Live' ? 'Caché' : 'Live' as const }
        : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // En production, on uploadrait le fichier vers un service de stockage
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-medium text-[#b70f23]">Catégories de menus</h2>
            <p className="text-muted-foreground">
              Gérez vos catégories de plats et consultez les performances
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={showReporting ? "default" : "outline"}
            onClick={() => setShowReporting(!showReporting)}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Reporting
          </Button>
          <Button 
            onClick={handleAddCategory}
            className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un nouveau
          </Button>
        </div>
      </div>

      {/* Reporting Section */}
      <AnimatePresence>
        {showReporting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Reporting du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{filteredCategories.length}</div>
                    <div className="text-sm opacity-90">Catégories actives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalOrdersToday}</div>
                    <div className="text-sm opacity-90">Commandes aujourd'hui</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{(totalRevenueToday / 1000).toFixed(1)}k FCFA</div>
                    <div className="text-sm opacity-90">Chiffre d'affaires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{averageOrderValue.toFixed(0)} FCFA</div>
                    <div className="text-sm opacity-90">Panier moyen</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                  <h4 className="font-medium mb-4 text-white">Performance par catégorie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.slice(0, 6).map((category) => (
                      <Card key={category.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm">{category.name}</div>
                              <div className="text-xs text-white/70">{category.ordersToday} commandes</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">CA:</span>
                              <span className="text-white font-medium">{(category.revenueToday / 1000).toFixed(1)}k FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Panier moyen:</span>
                              <span className="text-white font-medium">{category.averageOrderValue} FCFA</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Filter and Search */}
      <div className="flex gap-4 items-center">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Arabic">Arabic</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une catégorie..."
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
          <Label htmlFor="active-only" className="text-sm">Actifs uniquement</Label>
        </div>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#b70f23]">catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sl</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Id Catégorie</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {category.imageUrl ? (
                        <ImageWithFallback 
                          src={category.imageUrl} 
                          alt={category.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.status === 'Live' ? "default" : "destructive"}
                      className={category.status === 'Live' ? "bg-green-100 text-green-800" : ""}
                    >
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryStatus(category.id)}
                        className="p-1"
                      >
                        {category.status === 'Live' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingCategory ? 'modifier' : 'créer'} une catégorie.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium">
                Nom de la catégorie <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de la catégorie"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="command-count" className="text-sm font-medium">commande</Label>
              <Input
                id="command-count"
                type="number"
                value={editingCategory?.commandCount || 0}
                placeholder="0"
                className="w-full"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">Détails</Label>
              <Textarea
                id="details"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Détails"
                rows={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Langues <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Image de la catégorie</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Télécharger l'image</span>
                  </div>
                  <div className="text-xs text-gray-500">Max: 500 x 500 px</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200"
                  >
                    Choisir un fichier
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-4">
                    <ImageWithFallback
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCategoryOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              className="flex-1 bg-[#b70f23] hover:bg-[#70070e] text-white"
              disabled={!formData.name || !formData.language}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}