import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { 
  ShoppingCart, 
  Save,
  Euro,
  Calendar,
  Building2,
  Package,
  Plus,
  X
} from "lucide-react";

interface PurchaseOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface CreatePurchaseOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: (orderData: any) => void;
}

// Mock fournisseurs
const suppliers = [
  { id: 1, name: "Metro Cash & Carry", category: "Grossiste alimentaire" },
  { id: 2, name: "Sysco France", category: "Distribution alimentaire" },
  { id: 3, name: "Pomona", category: "Fruits et légumes" },
  { id: 4, name: "Davigel", category: "Surgelés" },
  { id: 5, name: "Transgourmet", category: "Grossiste alimentaire" }
];

const priorities = [
  { value: 'low', label: 'Basse', color: 'bg-green-100 text-green-700' },
  { value: 'normal', label: 'Normale', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' }
];

const unitOptions = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'unité', label: 'Unité' },
  { value: 'boîte', label: 'Boîte' },
  { value: 'paquet', label: 'Paquet' },
  { value: 'carton', label: 'Carton' },
  { value: 'sac', label: 'Sac' }
];

// Types d'articles
const articleTypes = [
  { value: 'produits', label: 'Produits finis' },
  { value: 'ingredients', label: 'Ingrédients' },
  { value: 'ustensiles', label: 'Ustensiles' }
];

// Mock data pour chaque type d'article
const mockArticles = {
  produits: [
    { id: 1, name: "Burger Classic", price: 4.50, unit: "unité" },
    { id: 2, name: "Salade César", price: 3.20, unit: "portion" },
    { id: 3, name: "Coca-Cola 33cl", price: 0.80, unit: "bouteille" },
    { id: 4, name: "Tarte Tatin", price: 2.10, unit: "portion" },
    { id: 5, name: "Frites maison", price: 1.30, unit: "portion" }
  ],
  ingredients: [
    { id: 1, name: "Tomates fraîches", price: 3.50, unit: "kg" },
    { id: 2, name: "Salade verte", price: 2.80, unit: "kg" },
    { id: 3, name: "Viande de bœuf", price: 24.50, unit: "kg" },
    { id: 4, name: "Pommes Golden", price: 2.20, unit: "kg" },
    { id: 5, name: "Oranges", price: 2.80, unit: "kg" },
    { id: 6, name: "Huile d'olive", price: 8.90, unit: "litre" },
    { id: 7, name: "Farine T55", price: 1.20, unit: "kg" },
    { id: 8, name: "Beurre doux", price: 6.80, unit: "kg" },
    { id: 9, name: "Œufs frais", price: 3.40, unit: "boîte" },
    { id: 10, name: "Lait entier", price: 1.10, unit: "litre" }
  ],
  ustensiles: [
    { id: 1, name: "Couteau de chef 20cm", price: 89.99, unit: "unité" },
    { id: 2, name: "Planche à découper", price: 25.00, unit: "unité" },
    { id: 3, name: "Fouet inox", price: 12.50, unit: "unité" },
    { id: 4, name: "Casserole 3L", price: 45.00, unit: "unité" },
    { id: 5, name: "Poêle antiadhésive 28cm", price: 35.00, unit: "unité" },
    { id: 6, name: "Thermomètre de cuisine", price: 18.50, unit: "unité" },
    { id: 7, name: "Balance de précision", price: 65.00, unit: "unité" },
    { id: 8, name: "Mixer plongeant", price: 125.00, unit: "unité" }
  ]
};

export function CreatePurchaseOrderModal({ open, onOpenChange, onOrderCreated }: CreatePurchaseOrderModalProps) {
  const [formData, setFormData] = useState({
    reference: "",
    supplierId: 0,
    deliveryDate: "",
    priority: "normal",
    notes: ""
  });
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    articleType: "",
    name: "",
    quantity: 0,
    unit: "",
    unitPrice: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour obtenir les articles disponibles selon le type sélectionné
  const getAvailableArticles = () => {
    if (!currentItem.articleType) return [];
    return mockArticles[currentItem.articleType as keyof typeof mockArticles] || [];
  };

  // Fonction pour gérer le changement de type d'article
  const handleArticleTypeChange = (type: string) => {
    setCurrentItem(prev => ({
      ...prev,
      articleType: type,
      name: "",
      unit: "",
      unitPrice: 0
    }));
  };

  // Fonction pour gérer la sélection d'un article
  const handleArticleSelect = (articleId: string) => {
    const availableArticles = getAvailableArticles();
    const selectedArticle = availableArticles.find(article => article.id.toString() === articleId);
    
    if (selectedArticle) {
      setCurrentItem(prev => ({
        ...prev,
        name: selectedArticle.name,
        unit: selectedArticle.unit,
        unitPrice: selectedArticle.price
      }));
    }
  };

  const addItem = () => {
    if (!currentItem.articleType || !currentItem.name.trim() || currentItem.quantity <= 0 || currentItem.unitPrice <= 0 || !currentItem.unit) {
      toast.error('Veuillez remplir tous les champs de l\'article');
      return;
    }

    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      name: currentItem.name,
      quantity: currentItem.quantity,
      unit: currentItem.unit,
      unitPrice: currentItem.unitPrice,
      total: currentItem.quantity * currentItem.unitPrice
    };

    setItems(prev => [...prev, newItem]);
    setCurrentItem({ articleType: "", name: "", quantity: 0, unit: "", unitPrice: 0 });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reference.trim()) {
      toast.error('Veuillez saisir une référence de commande');
      return;
    }

    if (!formData.supplierId) {
      toast.error('Veuillez sélectionner un fournisseur');
      return;
    }

    if (!formData.deliveryDate) {
      toast.error('Veuillez sélectionner une date de livraison');
      return;
    }

    if (items.length === 0) {
      toast.error('Veuillez ajouter au moins un article à la commande');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la création de commande
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const supplierName = suppliers.find(s => s.id === formData.supplierId)?.name || "Fournisseur inconnu";
      
      const orderData = {
        id: Date.now(),
        reference: formData.reference,
        supplierId: formData.supplierId,
        supplierName,
        deliveryDate: formData.deliveryDate,
        priority: formData.priority,
        notes: formData.notes,
        items: items,
        totalAmount: getTotalAmount(),
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      onOrderCreated(orderData);
      
      toast.success(`Commande "${formData.reference}" créée avec succès !`);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        reference: "",
        supplierId: 0,
        deliveryDate: "",
        priority: "normal",
        notes: ""
      });
      setItems([]);
      setCurrentItem({ articleType: "", name: "", quantity: 0, unit: "", unitPrice: 0 });

    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReference = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    setFormData(prev => ({ ...prev, reference: `CMD${year}${month}${day}-${random}` }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            Nouvelle commande d'achat
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle commande auprès de vos fournisseurs. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-reference">Référence de commande *</Label>
                <div className="flex gap-2">
                  <Input
                    id="order-reference"
                    placeholder="Ex: CMD240115-001"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  />
                  <Button type="button" variant="outline" onClick={generateReference}>
                    <Package className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fournisseur *</Label>
                <Select 
                  value={formData.supplierId.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un fournisseur..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-xs text-gray-500">{supplier.category}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Date de livraison souhaitée *</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-notes">Notes / Instructions</Label>
              <Textarea
                id="order-notes"
                placeholder="Instructions spéciales, conditions de livraison..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Articles à commander */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Articles à commander</h3>
            
            {/* Ajouter un article */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Ajouter un article</h4>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <Select 
                  value={currentItem.articleType} 
                  onValueChange={handleArticleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'article" />
                  </SelectTrigger>
                  <SelectContent>
                    {articleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {currentItem.articleType ? (
                  <Select 
                    value={getAvailableArticles().find(article => article.name === currentItem.name)?.id.toString() || ""} 
                    onValueChange={handleArticleSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un article" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableArticles().map((article) => (
                        <SelectItem key={article.id} value={article.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{article.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{article.price.toFixed(2)}€/{article.unit}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    disabled
                    placeholder="Sélectionnez d'abord un type"
                    className="bg-gray-100"
                  />
                )}
                
                <Input
                  type="number"
                  placeholder="Quantité"
                  value={currentItem.quantity || ""}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                />
                
                <Input
                  placeholder="Unité"
                  value={currentItem.unit}
                  disabled
                  className="bg-gray-100"
                />
                
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Prix unitaire"
                    className="pl-10 bg-gray-100"
                    value={currentItem.unitPrice || ""}
                    disabled
                  />
                </div>
                
                <Button type="button" onClick={addItem} disabled={!currentItem.articleType || !currentItem.name}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Liste des articles */}
            {items.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Articles de la commande</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3">Article</th>
                        <th className="text-left p-3">Quantité</th>
                        <th className="text-left p-3">Prix unitaire</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-left p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">
                            <div className="font-medium">{item.name}</div>
                          </td>
                          <td className="p-3">{item.quantity} {item.unit}</td>
                          <td className="p-3">{item.unitPrice.toFixed(2)}€</td>
                          <td className="p-3 font-medium">{item.total.toFixed(2)}€</td>
                          <td className="p-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="p-3 font-medium text-right">Total de la commande :</td>
                        <td className="p-3 font-bold text-lg">{getTotalAmount().toFixed(2)}€</td>
                        <td className="p-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.reference.trim() || !formData.supplierId || !formData.deliveryDate || items.length === 0}
            className="bg-[#b70f23] hover:bg-[#70070e]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer la commande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}