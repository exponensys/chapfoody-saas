import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
  Eye,
  EyeOff,
  BarChart3,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Globe,
  Shield,
  TrendingUp
} from 'lucide-react';

interface Allergen {
  id: string;
  nom: string;
  language: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  usageCount: number;
  menuItemsWithAllergen: number;
}

interface AllergenFormData {
  nom: string;
  language: string;
  imageFile?: File;
  imageUrl?: string;
}

interface AllergenManagementViewProps {
  onBack: () => void;
}

const availableLanguages = [
  { value: 'french', label: 'French' },
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'arabic', label: 'Arabic' }
];

const mockAllergens: Allergen[] = [
  {
    id: '1',
    nom: 'Gluten',
    language: 'french',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
    status: 'Active',
    createdAt: '2024-01-15',
    usageCount: 15,
    menuItemsWithAllergen: 8
  },
  {
    id: '2',
    nom: 'Lactose',
    language: 'french',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop',
    status: 'Active',
    createdAt: '2024-01-15',
    usageCount: 12,
    menuItemsWithAllergen: 6
  },
  {
    id: '3',
    nom: 'Noix',
    language: 'french',
    imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=100&h=100&fit=crop',
    status: 'Active',
    createdAt: '2024-01-15',
    usageCount: 8,
    menuItemsWithAllergen: 4
  },
  {
    id: '4',
    nom: 'Peanuts',
    language: 'english',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop',
    status: 'Inactive',
    createdAt: '2024-01-15',
    usageCount: 3,
    menuItemsWithAllergen: 2
  }
];

export function AllergenManagementView({ onBack }: AllergenManagementViewProps) {
  const [allergens, setAllergens] = useState<Allergen[]>(mockAllergens);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddAllergenOpen, setIsAddAllergenOpen] = useState(false);
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [formData, setFormData] = useState<AllergenFormData>({
    nom: '',
    language: 'french',
    imageUrl: ''
  });

  const filteredAllergens = allergens
    .filter(allergen => showOnlyActive ? allergen.status === 'Active' : true)
    .filter(allergen => 
      searchQuery === '' || 
      allergen.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalActiveAllergens = allergens.filter(a => a.status === 'Active').length;
  const totalUsageCount = allergens.reduce((sum, a) => sum + a.usageCount, 0);
  const totalMenuItemsWithAllergens = allergens.reduce((sum, a) => sum + a.menuItemsWithAllergen, 0);
  const averageUsagePerAllergen = allergens.length > 0 
    ? Math.round(totalUsageCount / allergens.length) 
    : 0;

  const handleAddAllergen = () => {
    setEditingAllergen(null);
    setFormData({
      nom: '',
      language: 'french',
      imageUrl: ''
    });
    setIsAddAllergenOpen(true);
  };

  const handleEditAllergen = (allergen: Allergen) => {
    setEditingAllergen(allergen);
    setFormData({
      nom: allergen.nom,
      language: allergen.language,
      imageUrl: allergen.imageUrl
    });
    setIsAddAllergenOpen(true);
  };

  const handleSaveAllergen = () => {
    const newAllergen: Allergen = {
      id: editingAllergen?.id || String(Date.now()),
      nom: formData.nom,
      language: formData.language,
      imageUrl: formData.imageUrl,
      status: 'Active',
      createdAt: editingAllergen?.createdAt || new Date().toISOString().split('T')[0],
      usageCount: editingAllergen?.usageCount || 0,
      menuItemsWithAllergen: editingAllergen?.menuItemsWithAllergen || 0
    };

    if (editingAllergen) {
      setAllergens(prev => prev.map(allergen => 
        allergen.id === editingAllergen.id ? { ...newAllergen, id: editingAllergen.id } : allergen
      ));
    } else {
      setAllergens(prev => [newAllergen, ...prev]);
    }

    setIsAddAllergenOpen(false);
    setFormData({
      nom: '',
      language: 'french',
      imageUrl: ''
    });
  };

  const toggleAllergenStatus = (allergenId: string) => {
    setAllergens(prev => prev.map(allergen => 
      allergen.id === allergenId 
        ? { ...allergen, status: allergen.status === 'Active' ? 'Inactive' : 'Active' as const }
        : allergen
    ));
  };

  const deleteAllergen = (allergenId: string) => {
    setAllergens(prev => prev.filter(allergen => allergen.id !== allergenId));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl }));
    }
  };

  const getLanguageLabel = (languageValue: string) => {
    const language = availableLanguages.find(lang => lang.value === languageValue);
    return language ? language.label : languageValue;
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
            <h2 className="text-2xl font-medium text-[#b70f23]">Allergènes</h2>
            <p className="text-muted-foreground">
              Gérez les allergènes et consultez leur utilisation dans vos menus
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
            onClick={handleAddAllergen}
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
                  Reporting - Allergènes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalActiveAllergens}</div>
                    <div className="text-sm opacity-90">Allergènes actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalUsageCount}</div>
                    <div className="text-sm opacity-90">Utilisation totale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalMenuItemsWithAllergens}</div>
                    <div className="text-sm opacity-90">Articles du menu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{averageUsagePerAllergen}</div>
                    <div className="text-sm opacity-90">Utilisation moyenne</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                  <h4 className="font-medium mb-4 text-white">Allergènes les plus utilisés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAllergens
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .slice(0, 4)
                      .map((allergen) => (
                        <Card key={allergen.id} className="bg-white/10 border-white/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                {allergen.imageUrl ? (
                                  <ImageWithFallback
                                    src={allergen.imageUrl}
                                    alt={allergen.nom}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-white text-sm flex items-center gap-2">
                                  {allergen.nom}
                                  <Globe className="w-3 h-3 text-white/70" title={getLanguageLabel(allergen.language)} />
                                </div>
                                <div className="text-xs text-white/70">{getLanguageLabel(allergen.language)}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Utilisations:</span>
                                <span className="text-white font-medium">{allergen.usageCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Articles menu:</span>
                                <span className="text-white font-medium">{allergen.menuItemsWithAllergen}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Status:</span>
                                <span className={`font-medium ${allergen.status === 'Active' ? 'text-green-300' : 'text-red-300'}`}>
                                  {allergen.status}
                                </span>
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#b70f23]">Allergies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergen-name" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="allergen-name"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Langue</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-allergen"
                    />
                    <label
                      htmlFor="image-upload-allergen"
                      className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 text-sm"
                    >
                      Choose File
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {formData.imageFile ? formData.imageFile.name : 'no file selected'}
                    </span>
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <ImageWithFallback
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSaveAllergen}
                className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white"
                disabled={!formData.nom}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#b70f23]">Allergies</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Sl</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Langue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-32">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllergens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun allergène trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAllergens.map((allergen, index) => (
                      <TableRow key={allergen.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{allergen.nom}</div>
                            <div className="text-sm text-muted-foreground">
                              Utilisé {allergen.usageCount} fois
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            {allergen.imageUrl ? (
                              <ImageWithFallback 
                                src={allergen.imageUrl} 
                                alt={allergen.nom} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            {getLanguageLabel(allergen.language)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={allergen.status === 'Active' ? "default" : "destructive"}
                            className={allergen.status === 'Active' ? "bg-green-100 text-green-800" : ""}
                          >
                            {allergen.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllergenStatus(allergen.id)}
                              className="p-1"
                            >
                              {allergen.status === 'Active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAllergen(allergen)}
                              className="p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAllergen(allergen.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}