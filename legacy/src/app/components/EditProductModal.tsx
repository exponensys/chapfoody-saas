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
  Package2, 
  Save,
  Euro,
  Tag,
  Palette,
  Calendar,
  AlertCircle,
  Plus,
  X
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description: string;
  price: number;
  cost?: number;
  quantity: number;
  unit: string;
  sku?: string;
  status: 'available' | 'unavailable' | 'seasonal';
  allergens: string[];
  ingredients: string[];
  preparationTime?: number;
  image?: string;
  createdAt: string;
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdated: (updatedProduct: Product) => void;
}

// Mock categories de type "produit"
const productCategories = [
  { id: 7, name: "Boissons", type: "produit", color: "bg-teal-500" },
  { id: 9, name: "Plats principaux", type: "produit", color: "bg-red-500" },
  { id: 10, name: "Entrées", type: "produit", color: "bg-green-500" },
  { id: 11, name: "Desserts", type: "produit", color: "bg-purple-500" },
  { id: 12, name: "Accompagnements", type: "produit", color: "bg-orange-500" }
];

const unitOptions = [
  { value: 'unité', label: 'Unité' },
  { value: 'portion', label: 'Portion' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'bouteille', label: 'Bouteille' },
  { value: 'verre', label: 'Verre' },
  { value: 'assiette', label: 'Assiette' }
];

const statusOptions = [
  { value: 'available', label: 'Disponible', color: 'bg-green-100 text-green-700' },
  { value: 'unavailable', label: 'Indisponible', color: 'bg-red-100 text-red-700' },
  { value: 'seasonal', label: 'Saisonnier', color: 'bg-yellow-100 text-yellow-700' }
];

const commonAllergens = [
  'Gluten', 'Lactose', 'Œufs', 'Fruits à coque', 'Arachides', 
  'Poisson', 'Crustacés', 'Soja', 'Céleri', 'Moutarde', 
  'Graines de sésame', 'Sulfites', 'Lupin', 'Mollusques'
];

export function EditProductModal({ open, onOpenChange, product, onProductUpdated }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: 0,
    description: "",
    price: 0,
    cost: 0,
    quantity: 0,
    unit: "",
    sku: "",
    status: "available" as 'available' | 'unavailable' | 'seasonal',
    preparationTime: 0
  });
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        price: product.price,
        cost: product.cost || 0,
        quantity: product.quantity,
        unit: product.unit,
        sku: product.sku || "",
        status: product.status,
        preparationTime: product.preparationTime || 0
      });
      setSelectedAllergens(product.allergens);
      setIngredients(product.ingredients);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    if (!formData.name.trim()) {
      toast.error('Veuillez saisir un nom pour le produit');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error('Veuillez saisir un prix valide');
      return;
    }

    if (formData.quantity < 0) {
      toast.error('Veuillez saisir une quantité valide');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la mise à jour du produit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock des catégories pour obtenir le nom
      const categoryNames: Record<number, string> = {
        7: "Boissons",
        9: "Plats principaux", 
        10: "Entrées",
        11: "Desserts",
        12: "Accompagnements"
      };

      const updatedProduct: Product = {
        ...product,
        name: formData.name,
        categoryId: formData.categoryId,
        categoryName: categoryNames[formData.categoryId] || "Autre",
        description: formData.description,
        price: formData.price,
        cost: formData.cost || undefined,
        quantity: formData.quantity,
        unit: formData.unit,
        sku: formData.sku || undefined,
        status: formData.status,
        allergens: selectedAllergens,
        ingredients: ingredients,
        preparationTime: formData.preparationTime || undefined
      };
      
      onProductUpdated(updatedProduct);
      
      toast.success(`Produit "${formData.name}" modifié avec succès !`);
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la modification du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        price: product.price,
        cost: product.cost || 0,
        quantity: product.quantity,
        unit: product.unit,
        sku: product.sku || "",
        status: product.status,
        preparationTime: product.preparationTime || 0
      });
      setSelectedAllergens(product.allergens);
      setIngredients(product.ingredients);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients(prev => [...prev, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Package2 className="w-4 h-4 text-white" />
            </div>
            Modifier le produit
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre produit. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nom du produit *</Label>
                <Input
                  id="product-name"
                  placeholder="Ex: Burger classique, Salade César..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select 
                  value={formData.categoryId.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie..." />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${category.color}`} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                placeholder="Décrivez votre produit..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-sku">Code article (SKU)</Label>
              <Input
                id="product-sku"
                placeholder="Ex: BGR001, SAL002..."
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              />
            </div>
          </div>

          {/* Prix et stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prix et stock</h3>
            
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
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-cost">Coût de production (€)</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="product-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-margin">Marge</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {formData.price && formData.cost ? (
                    <span className="text-sm font-medium text-green-600">
                      {((formData.price - formData.cost) / formData.price * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">- %</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-quantity">Quantité disponible *</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Unité *</Label>
                <Select 
                  value={formData.unit} 
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
                  value={formData.status} 
                  onValueChange={(value: 'available' | 'unavailable' | 'seasonal') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
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

            <div className="space-y-2">
              <Label htmlFor="product-prep-time">Temps de préparation (minutes)</Label>
              <Input
                id="product-prep-time"
                type="number"
                min="0"
                placeholder="Ex: 15"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Ingrédients */}
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

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
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

          {/* Allergènes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Allergènes</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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

            {selectedAllergens.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Allergènes détectés : {selectedAllergens.join(', ')}
                    </p>
                    <p className="text-xs text-yellow-700">
                      Ces informations seront affichées sur votre menu.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
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
            disabled={isSubmitting || !formData.name.trim() || !formData.categoryId || !formData.price}
            className="bg-[#b70f23] hover:bg-[#70070e]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Modification...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}