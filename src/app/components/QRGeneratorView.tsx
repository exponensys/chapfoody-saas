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
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Search,
  QrCode,
  Eye,
  EyeOff,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  Clock,
  Star,
  Smartphone,
  Printer,
  Share2,
  Copy,
  RefreshCw,
  Table as TableIcon
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface QRCodeData {
  id: string;
  menuName: string;
  selectedItems: MenuItem[];
  totalPrice: number;
  originalPrice: number;
  isDiscount: boolean;
  hasDifferentCodes: boolean;
  tableNumber: string;
  details: string;
  qrCodeUrl: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  scansToday: number;
  ordersGenerated: number;
  revenueGenerated: number;
}

interface QRFormData {
  menuName: string;
  selectedItems: string[];
  totalPrice: string;
  originalPrice: string;
  isDiscount: boolean;
  hasDifferentCodes: boolean;
  tableNumber: string;
  details: string;
}

interface QRGeneratorViewProps {
  onBack: () => void;
}

// Mock items disponibles pour créer des QR codes
const availableItems: MenuItem[] = [
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

const mockQRCodes: QRCodeData[] = [
  {
    id: '1',
    menuName: 'Menu Table 5',
    selectedItems: [
      { id: '1', name: 'Attieke + Poisson braisé', price: 2500 },
      { id: '7', name: 'Coca Cola', price: 500 }
    ],
    totalPrice: 2800,
    originalPrice: 3000,
    isDiscount: true,
    hasDifferentCodes: false,
    tableNumber: '5',
    details: 'Menu spécial pour la table 5 avec remise de bienvenue',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CHAPFOODY_MENU_TABLE_5',
    status: 'Active',
    createdAt: '2024-01-15',
    scansToday: 12,
    ordersGenerated: 8,
    revenueGenerated: 22400
  },
  {
    id: '2',
    menuName: 'Menu VIP Terrasse',
    selectedItems: [
      { id: '5', name: 'Kedjenou de poulet', price: 3000 },
      { id: '6', name: 'Soupe de poisson', price: 2200 },
      { id: '8', name: 'Jus de bissap', price: 400 }
    ],
    totalPrice: 5100,
    originalPrice: 5600,
    isDiscount: true,
    hasDifferentCodes: true,
    tableNumber: 'VIP-1',
    details: 'Menu premium pour la zone VIP avec différents codes par article',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CHAPFOODY_MENU_VIP_TERRASSE',
    status: 'Active',
    createdAt: '2024-01-15',
    scansToday: 7,
    ordersGenerated: 5,
    revenueGenerated: 25500
  }
];

const availableTables = [
  'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8',
  'VIP-1', 'VIP-2', 'Terrasse-A', 'Terrasse-B', 'Salon privé', 'Bar'
];

export function QRGeneratorView({ onBack }: QRGeneratorViewProps) {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(mockQRCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isCreateQROpen, setIsCreateQROpen] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCodeData | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [formData, setFormData] = useState<QRFormData>({
    menuName: '',
    selectedItems: [],
    totalPrice: '',
    originalPrice: '',
    isDiscount: false,
    hasDifferentCodes: false,
    tableNumber: '',
    details: ''
  });

  const filteredQRCodes = qrCodes
    .filter(qr => showOnlyActive ? qr.status === 'Active' : true)
    .filter(qr => 
      searchQuery === '' || 
      qr.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalScansToday = qrCodes.reduce((sum, qr) => sum + qr.scansToday, 0);
  const totalOrdersGenerated = qrCodes.reduce((sum, qr) => sum + qr.ordersGenerated, 0);
  const totalRevenueGenerated = qrCodes.reduce((sum, qr) => sum + qr.revenueGenerated, 0);
  const averageConversionRate = totalScansToday > 0 
    ? (totalOrdersGenerated / totalScansToday * 100) 
    : 0;

  const calculateItemsTotal = (selectedItemIds: string[]) => {
    return selectedItemIds.reduce((total, itemId) => {
      const item = availableItems.find(i => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);
  };

  const generateQRCodeUrl = (menuName: string, tableNumber: string) => {
    const qrData = `CHAPFOODY_MENU_${tableNumber}_${menuName.replace(/\s+/g, '_').toUpperCase()}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const handleCreateQR = () => {
    setEditingQR(null);
    setFormData({
      menuName: '',
      selectedItems: [],
      totalPrice: '',
      originalPrice: '',
      isDiscount: false,
      hasDifferentCodes: false,
      tableNumber: '',
      details: ''
    });
    setIsCreateQROpen(true);
  };

  const handleEditQR = (qr: QRCodeData) => {
    setEditingQR(qr);
    setFormData({
      menuName: qr.menuName,
      selectedItems: qr.selectedItems.map(item => item.id),
      totalPrice: qr.totalPrice.toString(),
      originalPrice: qr.originalPrice.toString(),
      isDiscount: qr.isDiscount,
      hasDifferentCodes: qr.hasDifferentCodes,
      tableNumber: qr.tableNumber,
      details: qr.details
    });
    setIsCreateQROpen(true);
  };

  const handleSaveQR = () => {
    const selectedItemObjects = formData.selectedItems.map(itemId => 
      availableItems.find(item => item.id === itemId)!
    );

    const newQRCode: QRCodeData = {
      id: editingQR?.id || String(Date.now()),
      menuName: formData.menuName,
      selectedItems: selectedItemObjects,
      totalPrice: parseFloat(formData.totalPrice),
      originalPrice: parseFloat(formData.originalPrice || formData.totalPrice),
      isDiscount: formData.isDiscount,
      hasDifferentCodes: formData.hasDifferentCodes,
      tableNumber: formData.tableNumber,
      details: formData.details,
      qrCodeUrl: generateQRCodeUrl(formData.menuName, formData.tableNumber),
      status: 'Active',
      createdAt: editingQR?.createdAt || new Date().toISOString().split('T')[0],
      scansToday: editingQR?.scansToday || 0,
      ordersGenerated: editingQR?.ordersGenerated || 0,
      revenueGenerated: editingQR?.revenueGenerated || 0
    };

    if (editingQR) {
      setQRCodes(prev => prev.map(qr => 
        qr.id === editingQR.id ? { ...newQRCode, id: editingQR.id } : qr
      ));
    } else {
      setQRCodes(prev => [newQRCode, ...prev]);
    }

    setIsCreateQROpen(false);
    setFormData({
      menuName: '',
      selectedItems: [],
      totalPrice: '',
      originalPrice: '',
      isDiscount: false,
      hasDifferentCodes: false,
      tableNumber: '',
      details: ''
    });
  };

  const toggleQRStatus = (qrId: string) => {
    setQRCodes(prev => prev.map(qr => 
      qr.id === qrId 
        ? { ...qr, status: qr.status === 'Active' ? 'Inactive' : 'Active' as const }
        : qr
    ));
  };

  const deleteQR = (qrId: string) => {
    setQRCodes(prev => prev.filter(qr => qr.id !== qrId));
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

  const downloadQRCode = (qrCode: QRCodeData) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeUrl;
    link.download = `QR_${qrCode.menuName}_${qrCode.tableNumber}.png`;
    link.click();
  };

  const copyQRLink = (qrCode: QRCodeData) => {
    navigator.clipboard.writeText(qrCode.qrCodeUrl);
    // Ici vous pourriez ajouter une notification toast
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
            <h2 className="text-2xl font-medium text-[#b70f23]">Générateur QR</h2>
            <p className="text-muted-foreground">
              Créez des QR codes pour vos menus et consultez les performances
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
            onClick={handleCreateQR}
            className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer QR
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
                  Reporting du jour - QR Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{filteredQRCodes.length}</div>
                    <div className="text-sm opacity-90">QR codes actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalScansToday}</div>
                    <div className="text-sm opacity-90">Scans aujourd'hui</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalOrdersGenerated}</div>
                    <div className="text-sm opacity-90">Commandes générées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{averageConversionRate.toFixed(1)}%</div>
                    <div className="text-sm opacity-90">Taux de conversion</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div>
                  <h4 className="font-medium mb-4 text-white">Performance par QR Code</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredQRCodes.map((qr) => (
                      <Card key={qr.id} className="bg-white/10 border-white/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <QrCode className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm flex items-center gap-2">
                                {qr.menuName}
                                {qr.hasDifferentCodes && (
                                  <Badge className="bg-[#f4b71b] text-black text-xs">Multi-codes</Badge>
                                )}
                              </div>
                              <div className="text-xs text-white/70">{qr.tableNumber}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Scans:</span>
                              <span className="text-white font-medium">{qr.scansToday}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Commandes:</span>
                              <span className="text-white font-medium">{qr.ordersGenerated}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">CA:</span>
                              <span className="text-white font-medium">{(qr.revenueGenerated / 1000).toFixed(1)}k FCFA</span>
                            </div>
                            {qr.isDiscount && (
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">Économie:</span>
                                <span className="text-[#f4b71b] font-medium">
                                  {((qr.originalPrice - qr.totalPrice) / qr.originalPrice * 100).toFixed(0)}%
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
            placeholder="Rechercher par nom ou table..."
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

      {/* QR Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#b70f23]">QR Codes Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Sl</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Nom du menu</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQRCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun QR code créé pour le moment
                  </TableCell>
                </TableRow>
              ) : (
                filteredQRCodes.map((qr, index) => (
                  <TableRow key={qr.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                        <img 
                          src={qr.qrCodeUrl} 
                          alt={`QR ${qr.menuName}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {qr.menuName}
                          {qr.hasDifferentCodes && (
                            <Badge className="bg-[#f4b71b] text-black text-xs">Multi-codes</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Table {qr.tableNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{qr.totalPrice.toFixed(0)} FCFA</span>
                        {qr.isDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            {qr.originalPrice.toFixed(0)} FCFA
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{qr.selectedItems.length} articles</span>
                        <div className="text-xs text-muted-foreground">
                          {qr.selectedItems.slice(0, 2).map(item => item.name).join(', ')}
                          {qr.selectedItems.length > 2 && '...'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={qr.status === 'Active' ? "default" : "destructive"}
                        className={qr.status === 'Active' ? "bg-green-100 text-green-800" : ""}
                      >
                        {qr.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadQRCode(qr)}
                          className="p-1"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyQRLink(qr)}
                          className="p-1"
                          title="Copier le lien"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQRStatus(qr.id)}
                          className="p-1"
                        >
                          {qr.status === 'Active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQR(qr)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQR(qr.id)}
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

      {/* Create/Edit QR Dialog */}
      <Dialog open={isCreateQROpen} onOpenChange={setIsCreateQROpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingQR ? 'Modifier le QR' : 'Créer QR'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingQR ? 'modifier' : 'créer'} un QR code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="menu-name" className="text-sm font-medium">
                Nom du menu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="menu-name"
                value={formData.menuName}
                onChange={(e) => setFormData(prev => ({ ...prev, menuName: e.target.value }))}
                placeholder="Nom du Package"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Articles <span className="text-red-500">*</span>
              </Label>
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="text-sm text-muted-foreground mb-3">Sélectionnez articles</div>
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
              <Label className="text-sm font-medium">Prix <span className="text-red-500">*</span></Label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: e.target.value }))}
                    placeholder="Prix de vente"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="different-codes"
                      checked={formData.hasDifferentCodes}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, hasDifferentCodes: checked as boolean }))
                      }
                    />
                    <Label htmlFor="different-codes" className="text-sm bg-[#00bcd4] text-white px-2 py-1 rounded text-xs">
                      avec différents codes
                    </Label>
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
              <Label className="text-sm font-medium">Table <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.tableNumber} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tableNumber: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">Détails</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Description du menu..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateQROpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveQR}
              className="flex-1 bg-[#b70f23] hover:bg-[#70070e] text-white"
              disabled={!formData.menuName || formData.selectedItems.length === 0 || !formData.totalPrice || !formData.tableNumber}
            >
              Générer le QR code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}