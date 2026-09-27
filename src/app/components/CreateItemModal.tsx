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
  Save,
  Euro,
  Calendar,
  Plus,
  ChefHat,
  Package2,
  Utensils,
  AlertCircle,
  Thermometer,
  User,
  Package
} from "lucide-react";

interface CreateItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryType: 'ingredient' | 'produit' | 'ustensile';
  categoryName: string;
  onItemCreated?: (item: any) => void;
}

interface BaseItemData {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  status: string;
  notes?: string;
}

interface IngredientData extends BaseItemData {
  type: 'ingredient';
  expiryDate?: string;
  storage: string;
  allergens: string[];
  unitPrice: number;
}

interface ProductData extends BaseItemData {
  type: 'produit';
  price: number;
  cost?: number;
  sku?: string;
  preparationTime?: number;
  ingredients: string[];
  allergens: string[];
}

interface UtensilData extends BaseItemData {
  type: 'ustensile';
  brand?: string;
  model?: string;
  serialNumber?: string;
  location: string;
  purchasePrice?: number;
  purchaseDate?: string;
  maintenanceSchedule?: string;
}

const unitOptionsByType = {
  ingredient: [
    { value: 'kg', label: 'Kilogramme (kg)' },
    { value: 'g', label: 'Gramme (g)' },
    { value: 'l', label: 'Litre (L)' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'pièce', label: 'Pièce' },
    { value: 'botte', label: 'Botte' },
    { value: 'barquette', label: 'Barquette' }
  ],
  produit: [
    { value: 'unité', label: 'Unité' },
    { value: 'portion', label: 'Portion' },
    { value: 'assiette', label: 'Assiette' },
    { value: 'verre', label: 'Verre' },
    { value: 'bouteille', label: 'Bouteille' },
    { value: 'kg', label: 'Kilogramme (kg)' },
    { value: 'l', label: 'Litre (L)' }
  ],
  ustensile: [
    { value: 'unité', label: 'Unité' },
    { value: 'pièce', label: 'Pièce' },
    { value: 'set', label: 'Set/Ensemble' },
    { value: 'paire', label: 'Paire' }
  ]
};

const statusOptionsByType = {
  ingredient: [
    { value: 'stock', label: 'En stock', color: 'bg-green-100 text-green-700' },
    { value: 'low', label: 'Stock faible', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'out', label: 'Épuisé', color: 'bg-red-100 text-red-700' },
    { value: 'expired', label: 'Périmé', color: 'bg-red-100 text-red-700' }
  ],
  produit: [
    { value: 'available', label: 'Disponible', color: 'bg-green-100 text-green-700' },
    { value: 'unavailable', label: 'Indisponible', color: 'bg-red-100 text-red-700' },
    { value: 'seasonal', label: 'Saisonnier', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'discontinued', label: 'Arrêté', color: 'bg-gray-100 text-gray-700' }
  ],
  ustensile: [
    { value: 'operational', label: 'Opérationnel', color: 'bg-green-100 text-green-700' },
    { value: 'maintenance', label: 'En maintenance', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'broken', label: 'En panne', color: 'bg-red-100 text-red-700' },
    { value: 'retired', label: 'Retiré', color: 'bg-gray-100 text-gray-700' }
  ]
};

const storageOptions = [
  'Réfrigérateur', 'Congélateur', 'Chambre froide', 'Réserve sèche', 
  'Cave', 'Température ambiante', 'Zone de préparation'
];

const locationOptions = [
  'Cuisine principale', 'Cuisine froide', 'Pâtisserie', 'Office', 
  'Salle', 'Bar', 'Plonge', 'Réserve', 'Local technique'
];

const commonAllergens = [
  'Gluten', 'Lactose', 'Œufs', 'Fruits à coque', 'Arachides', 
  'Poisson', 'Crustacés', 'Soja', 'Céleri', 'Moutarde'
];

export function CreateItemModal({ open, onOpenChange, categoryType, categoryName, onItemCreated }: CreateItemModalProps) {
  const [formData, setFormData] = useState<any>({
    quantity: 1,
    unit: unitOptionsByType[categoryType][0]?.value || '',
    status: statusOptionsByType[categoryType][0]?.value || '',
    allergens: [],
    ingredients: []
  });
  
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      quantity: 1,
      unit: unitOptionsByType[categoryType][0]?.value || '',
      status: statusOptionsByType[categoryType][0]?.value || '',
      allergens: [],
      ingredients: []
    });
    setSelectedAllergens([]);
    setCurrentIngredient("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('Veuillez saisir un nom pour l\'article');
      return;
    }

    if (!formData.quantity || formData.quantity <= 0) {
      toast.error('Veuillez saisir une quantité valide');
      return;
    }

    // Validations spécifiques par type
    if (categoryType === 'produit' && (!formData.price || formData.price <= 0)) {
      toast.error('Veuillez saisir un prix valide');
      return;
    }

    if (categoryType === 'ustensile' && !formData.location?.trim()) {
      toast.error('Veuillez spécifier un emplacement');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newItem = {
        id: Date.now(),
        name: formData.name,
        type: categoryType,
        description: formData.description || '',
        quantity: formData.quantity,
        unit: formData.unit,
        status: formData.status,
        notes: formData.notes,
        lastUpdate: new Date().toISOString().split('T')[0],
        ...formData,
        // Les allergènes sont uniquement pour les produits
        ...(categoryType === 'produit' && { allergens: selectedAllergens })
      };
      
      onItemCreated?.(newItem);
      
      const typeLabels = {
        ingredient: 'ingrédient',
        produit: 'produit', 
        ustensile: 'ustensile'
      };
      
      toast.success(
        <div className="flex items-center gap-2">
          {categoryType === 'ingredient' && <ChefHat className="w-5 h-5 text-green-600" />}
          {categoryType === 'produit' && <Package2 className="w-5 h-5 text-green-600" />}
          {categoryType === 'ustensile' && <Utensils className="w-5 h-5 text-green-600" />}
          <div>
            <p className="font-medium">Article créé avec succès !</p>
            <p className="text-sm text-gray-600">
              {formData.name} ajouté à {categoryName}
            </p>
          </div>
        </div>
      );

      resetForm();
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la création de l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !formData.ingredients?.includes(currentIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), currentIngredient.trim()]
      }));
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ing => ing !== ingredient) || []
    }));
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const getIcon = () => {
    switch (categoryType) {
      case 'ingredient': return ChefHat;
      case 'produit': return Package2;
      case 'ustensile': return Utensils;
      default: return Package;
    }
  };

  const getTypeLabel = () => {
    switch (categoryType) {
      case 'ingredient': return 'ingrédient';
      case 'produit': return 'produit';
      case 'ustensile': return 'ustensile';
      default: return 'article';
    }
  };

  const Icon = getIcon();
  const unitOptions = unitOptionsByType[categoryType] || [];
  const statusOptions = statusOptionsByType[categoryType] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            Créer un nouvel {getTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel {getTypeLabel()} à la catégorie "{categoryName}". 
            Les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Nom *</Label>
                <Input
                  id="item-name"
                  placeholder={`Ex: ${categoryType === 'ingredient' ? 'Tomates cerises' : categoryType === 'produit' ? 'Burger classique' : 'Mixeur professionnel'}`}
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>


            </div>

            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                placeholder="Décrivez l'article..."
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Quantité et statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stock et statut</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-quantity">Quantité *</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Unité *</Label>
                <Select 
                  value={formData.unit || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
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
                <Label>Statut</Label>
                <Select 
                  value={formData.status || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Champs spécifiques aux ingrédients */}
          {categoryType === 'ingredient' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations spécifiques</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Prix unitaire (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="unit-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.unitPrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Date de péremption</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="expiry-date"
                        type="date"
                        className="pl-10"
                        value={formData.expiryDate || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Stockage</Label>
                  <Select 
                    value={formData.storage || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, storage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un mode de stockage..." />
                    </SelectTrigger>
                    <SelectContent>
                      {storageOptions.map((storage) => (
                        <SelectItem key={storage} value={storage}>
                          {storage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>


            </>
          )}

          {/* Champs spécifiques aux produits */}
          {categoryType === 'produit' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Prix et production</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Prix de vente * (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.price || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-cost">Coût (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="product-cost"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.cost || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prep-time">Préparation (min)</Label>
                    <Input
                      id="prep-time"
                      type="number"
                      min="0"
                      placeholder="15"
                      value={formData.preparationTime || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-sku">Code article (SKU)</Label>
                  <Input
                    id="product-sku"
                    placeholder="Ex: BGR001"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  />
                </div>
              </div>

              {/* Ingrédients pour produits */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ingrédients</h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un ingrédient..."
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <Button type="button" onClick={addIngredient} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.ingredients && formData.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergènes pour produits */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Allergènes</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonAllergens.map((allergen) => (
                    <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAllergens.includes(allergen)}
                        onChange={() => toggleAllergen(allergen)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Champs spécifiques aux ustensiles */}
          {categoryType === 'ustensile' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Caractéristiques</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="utensil-brand">Marque</Label>
                    <Input
                      id="utensil-brand"
                      placeholder="Ex: KitchenAid"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utensil-model">Modèle</Label>
                    <Input
                      id="utensil-model"
                      placeholder="Ex: Professional 600"
                      value={formData.model || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serial-number">Numéro de série</Label>
                    <Input
                      id="serial-number"
                      placeholder="Ex: ABC123456"
                      value={formData.serialNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Emplacement *</Label>
                    <Select 
                      value={formData.location || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un emplacement..." />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-price">Prix d'achat (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="purchase-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.purchasePrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Date d'achat</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="purchase-date"
                        type="date"
                        className="pl-10"
                        value={formData.purchaseDate || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="item-notes">Notes additionnelles</Label>
              <Textarea
                id="item-notes"
                placeholder="Ajoutez des notes, instructions..."
                rows={2}
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
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name?.trim() || !formData.quantity}
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
                Créer l'article
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}