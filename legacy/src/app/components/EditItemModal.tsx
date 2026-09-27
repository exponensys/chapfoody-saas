import { useState, useEffect } from "react";
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
  AlertTriangle,
  User,
  Package
} from "lucide-react";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any | null;
  onItemUpdated?: (item: any) => void;
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

export function EditItemModal({ open, onOpenChange, item, onItemUpdated }: EditItemModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Déterminer le type d'item basé sur les propriétés
  const getItemType = (item: any) => {
    if (item?.price !== undefined) return 'produit';
    if (item?.location !== undefined) return 'ustensile';
    return 'ingredient';
  };

  const itemType = item ? getItemType(item) : 'ingredient';

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setSelectedAllergens(item.allergens || []);
      setHasChanges(false);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      const hasActualChanges = JSON.stringify(formData) !== JSON.stringify(item) ||
                              JSON.stringify(selectedAllergens) !== JSON.stringify(item.allergens || []);
      setHasChanges(hasActualChanges);
    }
  }, [formData, selectedAllergens, item]);

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

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedItem = {
        ...formData,
        allergens: selectedAllergens,
        lastUpdate: new Date().toISOString().split('T')[0]
      };
      
      onItemUpdated?.(updatedItem);
      
      toast.success(
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Article mis à jour !</p>
            <p className="text-sm text-gray-600">
              {formData.name} a été modifié avec succès
            </p>
          </div>
        </div>
      );

      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment fermer sans sauvegarder ?')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
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
    switch (itemType) {
      case 'ingredient': return ChefHat;
      case 'produit': return Package2;
      case 'ustensile': return Utensils;
      default: return Package;
    }
  };

  const getTypeLabel = () => {
    switch (itemType) {
      case 'ingredient': return 'ingrédient';
      case 'produit': return 'produit';
      case 'ustensile': return 'ustensile';
      default: return 'article';
    }
  };

  if (!item) return null;

  const Icon = getIcon();
  const unitOptions = unitOptionsByType[itemType] || [];
  const statusOptions = statusOptionsByType[itemType] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            Modifier {getTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de "{item.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Nom *</Label>
              <Input
                id="edit-item-name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-item-description">Description</Label>
              <Textarea
                id="edit-item-description"
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
                <Label htmlFor="edit-item-quantity">Quantité *</Label>
                <Input
                  id="edit-item-quantity"
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

          {/* Champs spécifiques selon le type */}
          {itemType === 'ingredient' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations spécifiques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unit-price">Prix unitaire (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-unit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      value={formData.unitPrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-expiry-date">Date de péremption</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-expiry-date"
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
                    <SelectValue />
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
          )}

          {itemType === 'produit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Prix et production</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-product-price">Prix de vente (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-product-cost">Coût (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-product-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      value={formData.cost || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-prep-time">Préparation (min)</Label>
                  <Input
                    id="edit-prep-time"
                    type="number"
                    min="0"
                    value={formData.preparationTime || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-product-sku">Code article (SKU)</Label>
                <Input
                  id="edit-product-sku"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                />
              </div>

              {/* Ingrédients */}
              <div className="space-y-4">
                <h4 className="font-medium">Ingrédients</h4>
                
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
            </div>
          )}

          {itemType === 'ustensile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Caractéristiques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-utensil-brand">Marque</Label>
                  <Input
                    id="edit-utensil-brand"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-utensil-model">Modèle</Label>
                  <Input
                    id="edit-utensil-model"
                    value={formData.model || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-serial-number">Numéro de série</Label>
                  <Input
                    id="edit-serial-number"
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emplacement</Label>
                  <Select 
                    value={formData.location || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="edit-purchase-price">Prix d'achat (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-purchase-price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      value={formData.purchasePrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-purchase-date">Date d'achat</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="edit-purchase-date"
                      type="date"
                      className="pl-10"
                      value={formData.purchaseDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Allergènes pour produits uniquement */}
          {itemType === 'produit' && (
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
          )}

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-item-notes">Notes additionnelles</Label>
              <Textarea
                id="edit-item-notes"
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name?.trim() || !hasChanges}
            className="bg-[#b70f23] hover:bg-[#70070e]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sauvegarde...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder {hasChanges ? '*' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}