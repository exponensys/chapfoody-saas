import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { 
  ShoppingCart, 
  Save,
  Euro,
  Calendar,
  Plus,
  Minus,
  Trash,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Package,
  ChefHat,
  Package2,
  Utensils
} from "lucide-react";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (order: OrderData) => void;
}

interface OrderData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderType: 'purchase' | 'internal' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deliveryDate: string;
  deliveryAddress?: string;
  supplier?: string;
  items: OrderItem[];
  notes?: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

interface OrderItem {
  categoryId: number;
  categoryName: string;
  categoryType: 'ingredient' | 'produit' | 'ustensile';
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// Toutes les catégories disponibles
const allCategories = [
  // Ingrédients
  { id: 1, name: "Légumes frais", type: "ingredient" as const, color: "bg-green-500" },
  { id: 2, name: "Viandes & Poissons", type: "ingredient" as const, color: "bg-red-500" },
  { id: 3, name: "Produits laitiers", type: "ingredient" as const, color: "bg-blue-500" },
  { id: 4, name: "Épices & Aromates", type: "ingredient" as const, color: "bg-orange-500" },
  { id: 5, name: "Féculents", type: "ingredient" as const, color: "bg-yellow-500" },
  { id: 6, name: "Huiles & Vinaigres", type: "ingredient" as const, color: "bg-purple-500" },
  // Produits
  { id: 7, name: "Boissons", type: "produit" as const, color: "bg-teal-500" },
  { id: 9, name: "Plats principaux", type: "produit" as const, color: "bg-red-500" },
  { id: 10, name: "Entrées", type: "produit" as const, color: "bg-green-500" },
  { id: 11, name: "Desserts", type: "produit" as const, color: "bg-purple-500" },
  { id: 12, name: "Accompagnements", type: "produit" as const, color: "bg-orange-500" },
  // Ustensiles
  { id: 8, name: "Ustensiles de service", type: "ustensile" as const, color: "bg-gray-500" },
  { id: 13, name: "Équipement de cuisson", type: "ustensile" as const, color: "bg-red-500" },
  { id: 14, name: "Électroménager", type: "ustensile" as const, color: "bg-blue-500" },
  { id: 15, name: "Matériel de préparation", type: "ustensile" as const, color: "bg-green-500" },
  { id: 16, name: "Ustensiles de mesure", type: "ustensile" as const, color: "bg-purple-500" },
  { id: 17, name: "Matériel de stockage", type: "ustensile" as const, color: "bg-orange-500" }
];

const orderTypeOptions = [
  { value: 'purchase', label: 'Commande d\'achat', description: 'Achat de produits/matériel' },
  { value: 'internal', label: 'Commande interne', description: 'Transfert entre services' },
  { value: 'maintenance', label: 'Commande maintenance', description: 'Réparation/entretien' }
];

const priorityOptions = [
  { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'Élevée', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' }
];

const unitOptions = [
  { value: 'unité', label: 'Unité' },
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'l', label: 'Litre (L)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'pièce', label: 'Pièce' },
  { value: 'botte', label: 'Botte' },
  { value: 'barquette', label: 'Barquette' },
  { value: 'carton', label: 'Carton' },
  { value: 'palette', label: 'Palette' }
];

export function CreateOrderModal({ open, onOpenChange, onOrderCreated }: CreateOrderModalProps) {
  const [formData, setFormData] = useState<Partial<OrderData>>({
    orderType: 'purchase',
    priority: 'medium',
    status: 'draft',
    items: [],
    totalAmount: 0
  });
  
  const [currentItem, setCurrentItem] = useState<Partial<OrderItem>>({
    quantity: 1,
    unit: 'unité',
    unitPrice: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      orderType: 'purchase',
      priority: 'medium',
      status: 'draft',
      items: [],
      totalAmount: 0
    });
    setCurrentItem({
      quantity: 1,
      unit: 'unité',
      unitPrice: 0
    });
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const addItem = () => {
    if (!currentItem.categoryId || !currentItem.itemName?.trim() || !currentItem.quantity || currentItem.unitPrice < 0) {
      toast.error('Veuillez remplir tous les champs de l\'article');
      return;
    }

    const category = allCategories.find(cat => cat.id === currentItem.categoryId);
    if (!category) return;

    const totalPrice = currentItem.quantity! * currentItem.unitPrice!;
    
    const newItem: OrderItem = {
      categoryId: currentItem.categoryId!,
      categoryName: category.name,
      categoryType: category.type,
      itemName: currentItem.itemName!,
      quantity: currentItem.quantity!,
      unit: currentItem.unit!,
      unitPrice: currentItem.unitPrice!,
      totalPrice,
      notes: currentItem.notes
    };

    const newItems = [...(formData.items || []), newItem];
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems)
    }));

    // Réinitialiser le formulaire d'article
    setCurrentItem({
      quantity: 1,
      unit: 'unité',
      unitPrice: 0
    });

    toast.success('Article ajouté à la commande');
  };

  const removeItem = (index: number) => {
    const newItems = formData.items?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems)
    }));
    toast.success('Article retiré de la commande');
  };

  const updateItemQuantity = (index: number, change: number) => {
    if (!formData.items) return;
    
    const newItems = [...formData.items];
    const item = newItems[index];
    const newQuantity = Math.max(1, item.quantity + change);
    
    newItems[index] = {
      ...item,
      quantity: newQuantity,
      totalPrice: newQuantity * item.unitPrice
    };

    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName?.trim()) {
      toast.error('Veuillez saisir un nom de client/demandeur');
      return;
    }

    if (!formData.deliveryDate) {
      toast.error('Veuillez spécifier une date de livraison');
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error('Veuillez ajouter au moins un article à la commande');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la création de la commande
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder: OrderData = {
        customerName: formData.customerName!,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        orderType: formData.orderType!,
        priority: formData.priority!,
        deliveryDate: formData.deliveryDate!,
        deliveryAddress: formData.deliveryAddress,
        supplier: formData.supplier,
        items: formData.items!,
        notes: formData.notes,
        totalAmount: formData.totalAmount!,
        status: formData.status!
      };
      
      // Appeler le callback avec les données de la nouvelle commande
      onOrderCreated?.(newOrder);
      
      toast.success(
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Commande créée avec succès !</p>
            <p className="text-sm text-gray-600">
              {formData.items!.length} articles pour {formData.totalAmount!.toFixed(2)}€
            </p>
          </div>
        </div>
      );

      // Réinitialiser le formulaire et fermer le modal
      resetForm();
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasData = formData.customerName || formData.items?.length || formData.notes;
    if (hasData) {
      if (window.confirm('Vous avez des données non sauvegardées. Voulez-vous vraiment fermer sans sauvegarder ?')) {
        resetForm();
        onOpenChange(false);
      }
    } else {
      resetForm();
      onOpenChange(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ingredient': return ChefHat;
      case 'produit': return Package2;
      case 'ustensile': return Utensils;
      default: return Package;
    }
  };

  const selectedCategory = allCategories.find(cat => cat.id === currentItem.categoryId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            Créer une nouvelle commande
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle commande d'achat ou commande interne. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Nom du client/demandeur *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="customer-name"
                    placeholder="Ex: Restaurant Dupont, Service Cuisine..."
                    className="pl-10"
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type de commande *</Label>
                <Select 
                  value={formData.orderType || ''} 
                  onValueChange={(value: 'purchase' | 'internal' | 'maintenance') => 
                    setFormData(prev => ({ ...prev, orderType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="py-2">
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="contact@restaurant.com"
                    className="pl-10"
                    value={formData.customerEmail || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="customer-phone"
                    type="tel"
                    placeholder="01 23 45 67 89"
                    className="pl-10"
                    value={formData.customerPhone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select 
                  value={formData.priority || ''} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-date">Date de livraison souhaitée *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="delivery-date"
                    type="datetime-local"
                    className="pl-10"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Input
                  id="supplier"
                  placeholder="Ex: Metro, Carrefour Pro..."
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-address">Adresse de livraison</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="delivery-address"
                    placeholder="Adresse complète..."
                    className="pl-10"
                    value={formData.deliveryAddress || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Articles de la commande */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Articles de la commande</h3>
            
            {/* Formulaire d'ajout d'article */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Ajouter un article</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select 
                      value={currentItem.categoryId?.toString() || ''} 
                      onValueChange={(value) => setCurrentItem(prev => ({ ...prev, categoryId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((category) => {
                          const TypeIcon = getTypeIcon(category.type);
                          return (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4" />
                                <div className={`w-3 h-3 rounded ${category.color}`} />
                                {category.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Nom de l'article</Label>
                    <Input
                      placeholder="Ex: Tomates cerises..."
                      value={currentItem.itemName || ''}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, itemName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={currentItem.quantity || ''}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unité</Label>
                    <Select 
                      value={currentItem.unit || ''} 
                      onValueChange={(value) => setCurrentItem(prev => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prix unitaire (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={currentItem.unitPrice || ''}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Total</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <span className="font-medium">
                        {((currentItem.quantity || 0) * (currentItem.unitPrice || 0)).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" onClick={addItem} size="sm" className="bg-[#b70f23] hover:bg-[#70070e]">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter l'article
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des articles ajoutés */}
            {formData.items && formData.items.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4">Articles de la commande ({formData.items.length})</h4>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => {
                      const TypeIcon = getTypeIcon(item.categoryType);
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-gray-600" />
                            <Badge variant="outline" className="text-xs">
                              {item.categoryName}
                            </Badge>
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium">{item.itemName}</p>
                            <p className="text-sm text-gray-600">
                              {item.unitPrice.toFixed(2)}€ / {item.unit}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">{item.totalPrice.toFixed(2)}€</p>
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total de la commande :</span>
                      <span className="text-xl font-bold text-[#b70f23]">
                        {formData.totalAmount?.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes et instructions</h3>
            
            <div className="space-y-2">
              <Label htmlFor="order-notes">Notes additionnelles</Label>
              <Textarea
                id="order-notes"
                placeholder="Instructions spéciales, conditions de livraison..."
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.customerName?.trim() || !formData.deliveryDate || !formData.items?.length}
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