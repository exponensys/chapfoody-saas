import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ChefHat, Save, X } from "lucide-react";

interface Ingredient {
  id: number;
  name: string;
  category: string;
  stock: string;
  stockLevel: number;
  minStock: number;
  unit: string;
  price: string;
  supplier: string;
  lastOrder: string;
  status: string;
  trend: string;
}

interface EditIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onIngredientUpdated: (updatedIngredient: Ingredient) => void;
}

export function EditIngredientModal({ 
  open, 
  onOpenChange, 
  ingredient, 
  onIngredientUpdated 
}: EditIngredientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    unit: "",
    price: "",
    supplier: "",
    minStock: 0,
    description: ""
  });

  const categories = ["Légumes", "Huiles", "Fromages", "Herbes", "Féculents", "Viandes", "Poissons", "Épices"];
  const units = ["kg", "g", "L", "mL", "pièce", "bottes"];

  useEffect(() => {
    if (ingredient && open) {
      // Extraire la quantité et l'unité du stock
      const stockParts = ingredient.stock.split(" ");
      const stockQuantity = stockParts[0] || "";
      const stockUnit = stockParts[1] || "";
      
      // Extraire le prix sans l'unité
      const priceMatch = ingredient.price.match(/^(\d+\.?\d*)€/);
      const priceValue = priceMatch ? priceMatch[1] : "";

      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        stock: stockQuantity,
        unit: stockUnit,
        price: priceValue,
        supplier: ingredient.supplier,
        minStock: ingredient.minStock,
        description: ""
      });
    }
  }, [ingredient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredient) return;

    // Calculer le niveau de stock basé sur le stock actuel et minimum
    const currentStock = parseFloat(formData.stock) || 0;
    const minStock = formData.minStock || 1;
    const stockLevel = Math.min(100, Math.max(0, (currentStock / (minStock * 5)) * 100));
    
    // Déterminer le statut basé sur le niveau de stock
    let status = "ok";
    if (stockLevel < 20) status = "critical";
    else if (stockLevel < 50) status = "low";

    const updatedIngredient: Ingredient = {
      ...ingredient,
      name: formData.name,
      category: formData.category,
      stock: `${formData.stock} ${formData.unit}`,
      unit: formData.unit,
      price: `${formData.price}€/${formData.unit}`,
      supplier: formData.supplier,
      minStock: formData.minStock,
      stockLevel: Math.round(stockLevel),
      status,
      lastOrder: new Date().toISOString().split('T')[0]
    };

    onIngredientUpdated(updatedIngredient);
    onOpenChange(false);
  };

  const handleReset = () => {
    if (ingredient) {
      const stockParts = ingredient.stock.split(" ");
      const stockQuantity = stockParts[0] || "";
      const stockUnit = stockParts[1] || "";
      const priceMatch = ingredient.price.match(/^(\d+\.?\d*)€/);
      const priceValue = priceMatch ? priceMatch[1] : "";

      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        stock: stockQuantity,
        unit: stockUnit,
        price: priceValue,
        supplier: ingredient.supplier,
        minStock: ingredient.minStock,
        description: ""
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#b70f23]" />
            Modifier l'ingrédient
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de l'ingrédient */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'ingrédient *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Tomates cerises"
              required
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock et unité */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock actuel *</Label>
              <Input
                id="stock"
                type="number"
                step="0.1"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="Ex: 12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unité" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prix et stock minimum */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Prix unitaire (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Ex: 4.50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Stock minimum</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Fournisseur */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Fournisseur</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="Nom du fournisseur"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Informations complémentaires..."
              rows={3}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4">
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
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#b70f23] hover:bg-[#70070e]"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}