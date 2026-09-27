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
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Eye,
  EyeOff,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';

interface Extra {
  id: string;
  name: string;
  price: number;
  language: string;
  status: 'Live' | 'Caché';
  createdAt: string;
  ordersToday: number;
  revenueToday: number;
  popularity: number;
}

interface ExtraFormData {
  name: string;
  price: string;
  language: string;
}

interface ExtraManagementViewProps {
  onBack: () => void;
}

const mockExtras: Extra[] = [
  {
    id: '1',
    name: 'Attieke (une boule)',
    price: 200,
    language: 'French',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 45,
    revenueToday: 9000,
    popularity: 85
  },
  {
    id: '2',
    name: 'Portion de Riz',
    price: 500,
    language: 'French',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 32,
    revenueToday: 16000,
    popularity: 75
  },
  {
    id: '3',
    name: 'Un oeuf',
    price: 100,
    language: 'French',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 28,
    revenueToday: 2800,
    popularity: 65
  },
  {
    id: '4',
    name: 'Portion de légumes',
    price: 300,
    language: 'French',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 18,
    revenueToday: 5400,
    popularity: 55
  },
  {
    id: '5',
    name: 'Sauce piment',
    price: 50,
    language: 'French',
    status: 'Live',
    createdAt: '2024-01-15',
    ordersToday: 67,
    revenueToday: 3350,
    popularity: 95
  }
];

export function ExtraManagementView({ onBack }: ExtraManagementViewProps) {
  const [extras, setExtras] = useState<Extra[]>(mockExtras);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isAddExtraOpen, setIsAddExtraOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState<Extra | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const [formData, setFormData] = useState<ExtraFormData>({
    name: '',
    price: '',
    language: 'French'
  });

  const filteredExtras = extras
    .filter(extra => showOnlyActive ? extra.status === 'Live' : true)
    .filter(extra => 
      searchQuery === '' || 
      extra.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalOrdersToday = extras.reduce((sum, extra) => sum + extra.ordersToday, 0);
  const totalRevenueToday = extras.reduce((sum, extra) => sum + extra.revenueToday, 0);
  const averagePopularity = extras.length > 0 
    ? extras.reduce((sum, extra) => sum + extra.popularity, 0) / extras.length 
    : 0;

  const handleAddExtra = () => {
    setEditingExtra(null);
    setFormData({
      name: '',
      price: '',
      language: selectedLanguage
    });
    setIsAddExtraOpen(true);
  };

  const handleEditExtra = (extra: Extra) => {
    setEditingExtra(extra);
    setFormData({
      name: extra.name,
      price: extra.price.toString(),
      language: extra.language
    });
    setIsAddExtraOpen(true);
  };

  const handleSaveExtra = () => {
    const newExtra: Extra = {
      id: editingExtra?.id || String(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      language: formData.language,
      status: 'Live',
      createdAt: editingExtra?.createdAt || new Date().toISOString().split('T')[0],
      ordersToday: editingExtra?.ordersToday || 0,
      revenueToday: editingExtra?.revenueToday || 0,
      popularity: editingExtra?.popularity || 0
    };

    if (editingExtra) {
      setExtras(prev => prev.map(extra => 
        extra.id === editingExtra.id ? { ...newExtra, id: editingExtra.id } : extra
      ));
    } else {
      setExtras(prev => [newExtra, ...prev]);
    }

    setIsAddExtraOpen(false);
    setFormData({
      name: '',
      price: '',
      language: 'French'
    });
  };

  const toggleExtraStatus = (extraId: string) => {
    setExtras(prev => prev.map(extra => 
      extra.id === extraId 
        ? { ...extra, status: extra.status === 'Live' ? 'Caché' : 'Live' as const }
        : extra
    ));
  };

  const deleteExtra = (extraId: string) => {
    setExtras(prev => prev.filter(extra => extra.id !== extraId));
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
            <h2 className="text-2xl font-medium text-[#b70f23]">Extras</h2>
            <p className="text-muted-foreground">
              Gérez vos suppléments et consultez les performances
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
            onClick={handleAddExtra}
            className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter des extras
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
                  Reporting du jour - Extras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{filteredExtras.length}</div>
                    <div className="text-sm opacity-90">Extras actifs</div>
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
                    <div className="text-2xl font-bold">{averagePopularity.toFixed(1)}%</div>
                    <div className="text-sm opacity-90">Popularité moyenne</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                  <h4 className="font-medium mb-4 text-white">Extras les plus populaires</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExtras
                      .sort((a, b) => b.popularity - a.popularity)
                      .slice(0, 6)
                      .map((extra) => (
                        <Card key={extra.id} className="bg-white/10 border-white/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-white text-sm">{extra.name}</div>
                                <div className="text-xs text-white/70">{extra.ordersToday} commandes</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-white">{extra.popularity}%</div>
                                <div className="text-xs text-white/70">popularité</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Prix:</span>
                                <span className="text-white font-medium">{extra.price} FCFA</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">CA:</span>
                                <span className="text-white font-medium">{(extra.revenueToday / 1000).toFixed(1)}k FCFA</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-[#f4b71b] h-2 rounded-full" 
                                  style={{ width: `${extra.popularity}%` }}
                                ></div>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Add Extra Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#b70f23]">Ajouter des extras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extra-name" className="text-sm font-medium">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="extra-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-2 rounded border">FCFA</span>
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

            <Button
              onClick={handleSaveExtra}
              className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white"
              disabled={!formData.name || !formData.price || !formData.language}
            >
              Submit
            </Button>
          </CardContent>
        </Card>

        {/* Right Column - Extras List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#b70f23]">Tous les suppléments</CardTitle>
              <div className="flex gap-4 items-center">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-40"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showOnlyActive}
                    onCheckedChange={setShowOnlyActive}
                    id="active-only"
                  />
                  <Label htmlFor="active-only" className="text-xs">Actifs</Label>
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
                  <TableHead>Prix</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExtras.map((extra, index) => (
                  <TableRow key={extra.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{extra.name}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{extra.price.toFixed(0)} FCFA</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={extra.status === 'Live' ? "default" : "destructive"}
                        className={extra.status === 'Live' ? "bg-green-100 text-green-800" : ""}
                      >
                        {extra.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExtraStatus(extra.id)}
                          className="p-1 w-8 h-8"
                        >
                          {extra.status === 'Live' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExtra(extra)}
                          className="p-1 w-8 h-8 text-[#00bcd4] hover:text-[#00acc1]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExtra(extra.id)}
                          className="p-1 w-8 h-8 text-red-600 hover:text-red-700"
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
      </div>

      {/* Edit Extra Dialog */}
      <Dialog open={isAddExtraOpen} onOpenChange={setIsAddExtraOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingExtra ? 'Modifier l\'extra' : 'Ajouter un extra'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingExtra ? 'modifier' : 'créer'} un extra.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-extra-name" className="text-sm font-medium">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-extra-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de l'extra"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Prix"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">FCFA</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-language" className="text-sm font-medium">
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
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddExtraOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveExtra}
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