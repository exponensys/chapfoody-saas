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
  Clock,
  Star,
  Home,
  Percent
} from 'lucide-react';

interface Specialty {
  id: string;
  name: string;
  price: number;
  isDiscount: boolean;
  preview: string;
  details: string;
  language: string;
  showOnHomepage: boolean;
  imageUrl?: string;
  status: 'Live' | 'Caché';
  createdAt: string;
  ordersToday: number;
  revenueToday: number;
  viewsToday: number;
  conversionRate: number;
}

interface SpecialtyFormData {
  name: string;
  price: string;
  isDiscount: boolean;
  preview: string;
  details: string;
  language: string;
  showOnHomepage: boolean;
  imageFile?: File;
  imageUrl?: string;
}

interface SpecialtyManagementViewProps {
  onBack: () => void;
}

const mockSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'Spécialité du Chef',
    price: 4500,
    isDiscount: false,
    preview: 'Notre plat signature préparé avec amour',
    details: 'Un mélange unique de saveurs locales et d\'influences internationales, préparé par notre chef étoilé avec les meilleurs ingrédients de saison.',
    language: 'French',
    showOnHomepage: true,
    imageUrl: 'https://images.unsplash.com/photo-1588560107833-167198a53677?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 25,
    revenueToday: 112500,
    viewsToday: 180,
    conversionRate: 13.9
  },
  {
    id: '2',
    name: 'Menu Découverte',
    price: 8000,
    isDiscount: true,
    preview: 'Découvrez nos saveurs africaines authentiques',
    details: 'Menu dégustation de 5 plats représentant la richesse culinaire de l\'Afrique de l\'Ouest. Une expérience gastronomique unique.',
    language: 'French',
    showOnHomepage: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 15,
    revenueToday: 120000,
    viewsToday: 95,
    conversionRate: 15.8
  },
  {
    id: '3',
    name: 'Grillades Premium',
    price: 6500,
    isDiscount: false,
    preview: 'Viandes grillées au feu de bois',
    details: 'Sélection de viandes premium grillées au feu de bois selon nos méthodes traditionnelles. Accompagnées de légumes de saison.',
    language: 'French',
    showOnHomepage: false,
    imageUrl: 'https://images.unsplash.com/photo-1598515213692-d872d549ce8e?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 8,
    revenueToday: 52000,
    viewsToday: 67,
    conversionRate: 11.9
  },
  {
    id: '4',
    name: 'Formule Étudiante',
    price: 2000,
    isDiscount: true,
    preview: 'Menu complet à prix réduit',
    details: 'Formule spéciale pour les étudiants : plat principal + boisson + dessert. Disponible sur présentation de la carte étudiante.',
    language: 'French',
    showOnHomepage: true,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 32,
    revenueToday: 64000,
    viewsToday: 145,
    conversionRate: 22.1
  }
];

export function SpecialtyManagementView({ onBack }: SpecialtyManagementViewProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>(mockSpecialties);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddSpecialtyOpen, setIsAddSpecialtyOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const [formData, setFormData] = useState<SpecialtyFormData>({
    name: '',
    price: '',
    isDiscount: false,
    preview: '',
    details: '',
    language: 'French',
    showOnHomepage: false,
    imageUrl: ''
  });

  const filteredSpecialties = specialties
    .filter(specialty => showOnlyActive ? specialty.status === 'Live' : true)
    .filter(specialty => 
      searchQuery === '' || 
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specialty.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalOrdersToday = specialties.reduce((sum, spec) => sum + spec.ordersToday, 0);
  const totalRevenueToday = specialties.reduce((sum, spec) => sum + spec.revenueToday, 0);
  const totalViewsToday = specialties.reduce((sum, spec) => sum + spec.viewsToday, 0);
  const averageConversionRate = specialties.length > 0 
    ? specialties.reduce((sum, spec) => sum + spec.conversionRate, 0) / specialties.length 
    : 0;

  const handleAddSpecialty = () => {
    setEditingSpecialty(null);
    setFormData({
      name: '',
      price: '',
      isDiscount: false,
      preview: '',
      details: '',
      language: selectedLanguage,
      showOnHomepage: false,
      imageUrl: ''
    });
    setIsAddSpecialtyOpen(true);
  };

  const handleEditSpecialty = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name,
      price: specialty.price.toString(),
      isDiscount: specialty.isDiscount,
      preview: specialty.preview,
      details: specialty.details,
      language: specialty.language,
      showOnHomepage: specialty.showOnHomepage,
      imageUrl: specialty.imageUrl
    });
    setIsAddSpecialtyOpen(true);
  };

  const handleSaveSpecialty = () => {
    const newSpecialty: Specialty = {
      id: editingSpecialty?.id || String(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      isDiscount: formData.isDiscount,
      preview: formData.preview,
      details: formData.details,
      language: formData.language,
      showOnHomepage: formData.showOnHomepage,
      imageUrl: formData.imageUrl,
      status: 'Live',
      createdAt: editingSpecialty?.createdAt || new Date().toISOString().split('T')[0],
      ordersToday: editingSpecialty?.ordersToday || 0,
      revenueToday: editingSpecialty?.revenueToday || 0,
      viewsToday: editingSpecialty?.viewsToday || 0,
      conversionRate: editingSpecialty?.conversionRate || 0
    };

    if (editingSpecialty) {
      setSpecialties(prev => prev.map(spec => 
        spec.id === editingSpecialty.id ? { ...newSpecialty, id: editingSpecialty.id } : spec
      ));
    } else {
      setSpecialties(prev => [newSpecialty, ...prev]);
    }

    setIsAddSpecialtyOpen(false);
    setFormData({
      name: '',
      price: '',
      isDiscount: false,
      preview: '',
      details: '',
      language: 'French',
      showOnHomepage: false,
      imageUrl: ''
    });
  };

  const toggleSpecialtyStatus = (specialtyId: string) => {
    setSpecialties(prev => prev.map(spec => 
      spec.id === specialtyId 
        ? { ...spec, status: spec.status === 'Live' ? 'Caché' : 'Live' as const }
        : spec
    ));
  };

  const deleteSpecialty = (specialtyId: string) => {
    setSpecialties(prev => prev.filter(spec => spec.id !== specialtyId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
            <h2 className="text-2xl font-medium text-[#b70f23]">Spécialités</h2>
            <p className="text-muted-foreground">
              Gérez vos spécialités et consultez les performances
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
            onClick={handleAddSpecialty}
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
                  Reporting du jour - Spécialités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{filteredSpecialties.length}</div>
                    <div className="text-sm opacity-90">Spécialités actives</div>
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
                  <h4 className="font-medium mb-4 text-white">Performance par spécialité</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSpecialties.slice(0, 6).map((specialty) => (
                      <Card key={specialty.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              {specialty.isDiscount ? (
                                <Percent className="w-5 h-5 text-white" />
                              ) : (
                                <Star className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm">{specialty.name}</div>
                              <div className="text-xs text-white/70">{specialty.ordersToday} commandes</div>
                            </div>
                            {specialty.showOnHomepage && (
                              <Home className="w-4 h-4 text-[#f4b71b]" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">CA:</span>
                              <span className="text-white font-medium">{(specialty.revenueToday / 1000).toFixed(1)}k FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Vues:</span>
                              <span className="text-white font-medium">{specialty.viewsToday}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Conversion:</span>
                              <span className="text-white font-medium">{specialty.conversionRate}%</span>
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
            placeholder="Rechercher une spécialité..."
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

      {/* Specialties Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#b70f23]">Spécialités</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sl</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpecialties.map((specialty, index) => (
                <TableRow key={specialty.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {specialty.imageUrl ? (
                        <ImageWithFallback 
                          src={specialty.imageUrl} 
                          alt={specialty.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {specialty.name}
                        {specialty.showOnHomepage && (
                          <Home className="w-4 h-4 text-[#f4b71b]" title="Affiché en page d'accueil" />
                        )}
                      </div>
                      {specialty.preview && (
                        <div className="text-sm text-muted-foreground">{specialty.preview}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{specialty.price.toFixed(0)} FCFA</span>
                      {specialty.isDiscount && (
                        <Percent className="w-4 h-4 text-green-600" title="Remise" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={specialty.isDiscount ? "secondary" : "default"}
                      className={specialty.isDiscount ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                    >
                      {specialty.isDiscount ? "Remise" : "Standard"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={specialty.status === 'Live' ? "default" : "destructive"}
                      className={specialty.status === 'Live' ? "bg-green-100 text-green-800" : ""}
                    >
                      {specialty.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSpecialtyStatus(specialty.id)}
                        className="p-1"
                      >
                        {specialty.status === 'Live' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSpecialty(specialty)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSpecialty(specialty.id)}
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

      {/* Add/Edit Specialty Dialog */}
      <Dialog open={isAddSpecialtyOpen} onOpenChange={setIsAddSpecialtyOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingSpecialty ? 'Modifier la spécialité' : 'Ajouter une spécialité'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingSpecialty ? 'modifier' : 'créer'} une spécialité.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="specialty-name" className="text-sm font-medium">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="specialty-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de la spécialité"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix <span className="text-red-500">*</span></Label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Prix"
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">FCFA</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-discount"
                    checked={formData.isDiscount}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isDiscount: checked as boolean }))
                    }
                  />
                  <Label htmlFor="is-discount" className="text-sm bg-[#00bcd4] text-white px-2 py-1 rounded text-xs">
                    Est une remise
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview" className="text-sm font-medium">Aperçu</Label>
              <Textarea
                id="preview"
                value={formData.preview}
                onChange={(e) => setFormData(prev => ({ ...prev, preview: e.target.value }))}
                placeholder="aperçu"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">Détails</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Description détaillée de la spécialité..."
                rows={6}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                Utilisez cet espace pour décrire en détail votre spécialité
              </div>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-homepage"
                  checked={formData.showOnHomepage}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, showOnHomepage: checked as boolean }))
                  }
                />
                <Label htmlFor="show-homepage" className="text-sm bg-[#00bcd4] text-white px-3 py-1 rounded">
                  Afficher en page d'accueil
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Image de la spécialité</Label>
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
              onClick={() => setIsAddSpecialtyOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSpecialty}
              className="flex-1 bg-[#b70f23] hover:bg-[#70070e] text-white"
              disabled={!formData.name || !formData.price || !formData.language}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}