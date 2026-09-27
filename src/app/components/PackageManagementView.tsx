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
import { Checkbox } from './ui/checkbox';
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
  Eye,
  EyeOff,
  Image as ImageIcon,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  Clock,
  Star,
  Box,
  Package,
  Home,
  Percent,
  TrendingUp
} from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  price: number;
}

interface Package {
  id: string;
  name: string;
  totalPrice: number;
  originalPrice: number;
  isDiscount: boolean;
  items: PackageItem[];
  details: string;
  showOnHomepage: boolean;
  imageUrl?: string;
  status: 'Live' | 'Caché';
  createdAt: string;
  ordersToday: number;
  revenueToday: number;
  viewsToday: number;
  conversionRate: number;
}

interface PackageFormData {
  name: string;
  selectedItems: string[];
  totalPrice: string;
  originalPrice: string;
  isDiscount: boolean;
  details: string;
  showOnHomepage: boolean;
  imageFile?: File;
  imageUrl?: string;
}

interface PackageManagementViewProps {
  onBack: () => void;
}

// Mock items disponibles pour créer des packages
const availableItems: PackageItem[] = [
  { id: '1', name: 'Attieke + Poisson braisé', price: 2500 },
  { id: '2', name: 'Riz au gras', price: 2000 },
  { id: '3', name: 'Foutou + sauce arachide', price: 1800 },
  { id: '4', name: 'Alloco + poisson', price: 1500 },
  { id: '5', name: 'Kedjenou de poulet', price: 3000 },
  { id: '6', name: 'Soupe de poisson', price: 2200 },
  { id: '7', name: 'Coca Cola', price: 500 },
  { id: '8', name: 'Jus de bissap', price: 400 },
  { id: '9', name: 'Eau minérale', price: 300 }
];

const mockPackages: Package[] = [
  {
    id: '1',
    name: 'Menu Familial',
    totalPrice: 8500,
    originalPrice: 10000,
    isDiscount: true,
    items: [
      { id: '1', name: 'Attieke + Poisson braisé', price: 2500 },
      { id: '2', name: 'Riz au gras', price: 2000 },
      { id: '5', name: 'Kedjenou de poulet', price: 3000 },
      { id: '7', name: 'Coca Cola', price: 500 },
      { id: '8', name: 'Jus de bissap', price: 400 }
    ],
    details: 'Un menu complet pour toute la famille avec nos spécialités les plus appréciées.',
    showOnHomepage: true,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 18,
    revenueToday: 153000,
    viewsToday: 89,
    conversionRate: 20.2
  },
  {
    id: '2',
    name: 'Formule Déjeuner',
    totalPrice: 3500,
    originalPrice: 4200,
    isDiscount: true,
    items: [
      { id: '3', name: 'Foutou + sauce arachide', price: 1800 },
      { id: '8', name: 'Jus de bissap', price: 400 },
      { id: '9', name: 'Eau minérale', price: 300 }
    ],
    details: 'Formule parfaite pour un déjeuner équilibré et savoureux.',
    showOnHomepage: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 25,
    revenueToday: 87500,
    viewsToday: 134,
    conversionRate: 18.7
  }
];

export function PackageManagementView({ onBack }: PackageManagementViewProps) {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    selectedItems: [],
    totalPrice: '',
    originalPrice: '',
    isDiscount: false,
    details: '',
    showOnHomepage: false,
    imageUrl: ''
  });

  const filteredPackages = packages
    .filter(pkg => showOnlyActive ? pkg.status === 'Live' : true)
    .filter(pkg => 
      searchQuery === '' || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalOrdersToday = packages.reduce((sum, pkg) => sum + pkg.ordersToday, 0);
  const totalRevenueToday = packages.reduce((sum, pkg) => sum + pkg.revenueToday, 0);
  const totalViewsToday = packages.reduce((sum, pkg) => sum + pkg.viewsToday, 0);
  const averageConversionRate = packages.length > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.conversionRate, 0) / packages.length 
    : 0;

  const calculateItemsTotal = (selectedItemIds: string[]) => {
    return selectedItemIds.reduce((total, itemId) => {
      const item = availableItems.find(i => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      selectedItems: [],
      totalPrice: '',
      originalPrice: '',
      isDiscount: false,
      details: '',
      showOnHomepage: false,
      imageUrl: ''
    });
    setIsAddPackageOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      selectedItems: pkg.items.map(item => item.id),
      totalPrice: pkg.totalPrice.toString(),
      originalPrice: pkg.originalPrice.toString(),
      isDiscount: pkg.isDiscount,
      details: pkg.details,
      showOnHomepage: pkg.showOnHomepage,
      imageUrl: pkg.imageUrl
    });
    setIsAddPackageOpen(true);
  };

  const handleSavePackage = () => {
    const selectedItemObjects = formData.selectedItems.map(itemId => 
      availableItems.find(item => item.id === itemId)!
    );

    const newPackage: Package = {
      id: editingPackage?.id || String(Date.now()),
      name: formData.name,
      totalPrice: parseFloat(formData.totalPrice),
      originalPrice: parseFloat(formData.originalPrice || formData.totalPrice),
      isDiscount: formData.isDiscount,
      items: selectedItemObjects,
      details: formData.details,
      showOnHomepage: formData.showOnHomepage,
      imageUrl: formData.imageUrl,
      status: 'Live',
      createdAt: editingPackage?.createdAt || new Date().toISOString().split('T')[0],
      ordersToday: editingPackage?.ordersToday || 0,
      revenueToday: editingPackage?.revenueToday || 0,
      viewsToday: editingPackage?.viewsToday || 0,
      conversionRate: editingPackage?.conversionRate || 0
    };

    if (editingPackage) {
      setPackages(prev => prev.map(pkg => 
        pkg.id === editingPackage.id ? { ...newPackage, id: editingPackage.id } : pkg
      ));
    } else {
      setPackages(prev => [newPackage, ...prev]);
    }

    setIsAddPackageOpen(false);
    setFormData({
      name: '',
      selectedItems: [],
      totalPrice: '',
      originalPrice: '',
      isDiscount: false,
      details: '',
      showOnHomepage: false,
      imageUrl: ''
    });
  };

  const togglePackageStatus = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: pkg.status === 'Live' ? 'Caché' : 'Live' as const }
        : pkg
    ));
  };

  const deletePackage = (packageId: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl }));
    }
  };

  const handleItemSelection = (itemId: string, checked: boolean) => {
    setFormData(prev => {
      const newSelectedItems = checked 
        ? [...prev.selectedItems, itemId]
        : prev.selectedItems.filter(id => id !== itemId);
      
      // Auto-calculate original price based on selected items
      const itemsTotal = calculateItemsTotal(newSelectedItems);
      
      return {
        ...prev,
        selectedItems: newSelectedItems,
        originalPrice: itemsTotal.toString(),
        totalPrice: prev.totalPrice || itemsTotal.toString()
      };
    });
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
            <h2 className="text-2xl font-medium text-[#b70f23]">Packages</h2>
            <p className="text-muted-foreground">
              Gérez vos formules et packages et consultez les performances
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
            onClick={handleAddPackage}
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
                  Reporting du jour - Packages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{filteredPackages.length}</div>
                    <div className="text-sm opacity-90">Packages actifs</div>
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
                    <div className="text-2xl font-bold">{averageConversionRate.toFixed(1)}%</div>
                    <div className="text-sm opacity-90">Taux de conversion</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                  <h4 className="font-medium mb-4 text-white">Performance par package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPackages.map((pkg) => (
                      <Card key={pkg.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <Box className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm flex items-center gap-2">
                                {pkg.name}
                                {pkg.showOnHomepage && (
                                  <Home className="w-4 h-4 text-[#f4b71b]" />
                                )}
                              </div>
                              <div className="text-xs text-white/70">{pkg.ordersToday} commandes</div>
                            </div>
                            {pkg.isDiscount && (
                              <Percent className="w-4 h-4 text-[#f4b71b]" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Articles:</span>
                              <span className="text-white font-medium">{pkg.items.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">CA:</span>
                              <span className="text-white font-medium">{(pkg.revenueToday / 1000).toFixed(1)}k FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Conversion:</span>
                              <span className="text-white font-medium">{pkg.conversionRate}%</span>
                            </div>
                            {pkg.isDiscount && (
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Économie:</span>
                                <span className="text-[#f4b71b] font-medium">
                                  {((pkg.originalPrice - pkg.totalPrice) / pkg.originalPrice * 100).toFixed(0)}%
                                </span>
                              </div>
                            )}
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

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un package..."
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

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#b70f23]">Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sl</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Nom du Package</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg, index) => (
                <TableRow key={pkg.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {pkg.imageUrl ? (
                        <ImageWithFallback 
                          src={pkg.imageUrl} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {pkg.name}
                        {pkg.showOnHomepage && (
                          <Home className="w-4 h-4 text-[#f4b71b]" title="Affiché en page d'accueil" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.isDiscount && (
                          <span className="text-green-600 font-medium">
                            Économie de {((pkg.originalPrice - pkg.totalPrice) / pkg.originalPrice * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{pkg.totalPrice.toFixed(0)} FCFA</span>
                      {pkg.isDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                          {pkg.originalPrice.toFixed(0)} FCFA
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{pkg.items.length} articles</span>
                      <div className="text-xs text-muted-foreground">
                        {pkg.items.slice(0, 2).map(item => item.name).join(', ')}
                        {pkg.items.length > 2 && '...'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={pkg.status === 'Live' ? "default" : "destructive"}
                      className={pkg.status === 'Live' ? "bg-green-100 text-green-800" : ""}
                    >
                      {pkg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePackageStatus(pkg.id)}
                        className="p-1"
                      >
                        {pkg.status === 'Live' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPackage(pkg)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePackage(pkg.id)}
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

      {/* Add/Edit Package Dialog */}
      <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingPackage ? 'Modifier le package' : 'Ajouter un package'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingPackage ? 'modifier' : 'créer'} un package.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="package-name" className="text-sm font-medium">
                Nom du Package <span className="text-red-500">*</span>
              </Label>
              <Input
                id="package-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du package"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Articles <span className="text-red-500">*</span>
              </Label>
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="text-sm text-muted-foreground mb-3">Sélectionnez les articles</div>
                <div className="space-y-2">
                  {availableItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={formData.selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleItemSelection(item.id, checked as boolean)}
                      />
                      <Label htmlFor={`item-${item.id}`} className="flex-1 text-sm">
                        {item.name} - {item.price} FCFA
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {formData.selectedItems.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Total des articles sélectionnés: {calculateItemsTotal(formData.selectedItems)} FCFA
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix</Label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Prix de vente</Label>
                  <Input
                    type="number"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: e.target.value }))}
                    placeholder="Prix de vente"
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-discount-package"
                    checked={formData.isDiscount}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isDiscount: checked as boolean }))
                    }
                  />
                  <Label htmlFor="is-discount-package" className="text-sm bg-[#00bcd4] text-white px-2 py-1 rounded text-xs">
                    Est une remise
                  </Label>
                </div>
              </div>
              {formData.isDiscount && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Prix original (avant remise)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="Prix original"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">Détails</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Description du package..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-homepage-package"
                  checked={formData.showOnHomepage}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, showOnHomepage: checked as boolean }))
                  }
                />
                <Label htmlFor="show-homepage-package" className="text-sm bg-[#00bcd4] text-white px-3 py-1 rounded">
                  Afficher en page d'accueil
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Image du package</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Télécharger l'image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-package"
                  />
                  <label
                    htmlFor="image-upload-package"
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
              onClick={() => setIsAddPackageOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePackage}
              className="flex-1 bg-[#b70f23] hover:bg-[#70070e] text-white"
              disabled={!formData.name || formData.selectedItems.length === 0 || !formData.totalPrice}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}