import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { 
  ChefHat, 
  Package2, 
  Utensils, 
  Palette,
  Save,
  AlertTriangle 
} from "lucide-react";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryToEdit | null;
  onCategoryUpdated?: (category: CategoryToEdit) => void;
}

interface CategoryToEdit {
  id: number;
  name: string;
  type: 'ingredient' | 'produit' | 'ustensile';
  description: string;
  color: string;
  items: number;
}

const categoryTypes = [
  {
    value: 'ingredient',
    label: 'Ingrédient',
    description: 'Matières premières pour la cuisine',
    icon: ChefHat,
    examples: 'Ex: légumes, viandes, épices...'
  },
  {
    value: 'produit',
    label: 'Produit à vendre',
    description: 'Articles destinés à la vente',
    icon: Package2,
    examples: 'Ex: plats préparés, boissons, desserts...'
  },
  {
    value: 'ustensile',
    label: 'Ustensile/Équipement',
    description: 'Matériel et équipements de cuisine',
    icon: Utensils,
    examples: 'Ex: casseroles, couteaux, machines...'
  }
];

const colorOptions = [
  { value: 'bg-red-500', label: 'Rouge', color: '#ef4444' },
  { value: 'bg-blue-500', label: 'Bleu', color: '#3b82f6' },
  { value: 'bg-green-500', label: 'Vert', color: '#22c55e' },
  { value: 'bg-yellow-500', label: 'Jaune', color: '#eab308' },
  { value: 'bg-purple-500', label: 'Violet', color: '#a855f7' },
  { value: 'bg-orange-500', label: 'Orange', color: '#f97316' },
  { value: 'bg-teal-500', label: 'Sarcelle', color: '#14b8a6' },
  { value: 'bg-pink-500', label: 'Rose', color: '#ec4899' },
  { value: 'bg-indigo-500', label: 'Indigo', color: '#6366f1' },
  { value: 'bg-gray-500', label: 'Gris', color: '#6b7280' }
];

export function EditCategoryModal({ open, onOpenChange, category, onCategoryUpdated }: EditCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<CategoryToEdit>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        description: category.description,
        color: category.color
      });
      setHasChanges(false);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      const hasActualChanges = 
        formData.name !== category.name ||
        formData.type !== category.type ||
        formData.description !== category.description ||
        formData.color !== category.color;
      setHasChanges(hasActualChanges);
    }
  }, [formData, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) return;

    if (!formData.name?.trim()) {
      toast.error('Veuillez saisir un nom pour la catégorie');
      return;
    }

    if (!formData.type) {
      toast.error('Veuillez sélectionner un type de catégorie');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la mise à jour de la catégorie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCategory: CategoryToEdit = {
        ...category,
        name: formData.name!,
        type: formData.type!,
        description: formData.description || '',
        color: formData.color!
      };
      
      // Appeler le callback avec les données mises à jour
      onCategoryUpdated?.(updatedCategory);
      
      toast.success(
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Catégorie mise à jour !</p>
            <p className="text-sm text-gray-600">
              {formData.name} ({categoryTypes.find(t => t.value === formData.type)?.label})
            </p>
          </div>
        </div>
      );

      // Fermer le modal
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la catégorie');
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

  if (!category) return null;

  const selectedTypeInfo = categoryTypes.find(type => type.value === formData.type);
  const selectedColorInfo = colorOptions.find(color => color.value === formData.color);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${formData.color} flex items-center justify-center`}>
              {selectedTypeInfo && <selectedTypeInfo.icon className="w-4 h-4 text-white" />}
            </div>
            Modifier la catégorie
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la catégorie "{category.name}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Information sur les articles existants */}
          {category.items > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Attention : Cette catégorie contient {category.items} articles
                  </p>
                  <p className="text-xs text-yellow-700">
                    Les modifications peuvent affecter l'organisation de votre stock.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nom de la catégorie */}
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Nom de la catégorie *</Label>
            <Input
              id="edit-category-name"
              placeholder="Ex: Légumes frais, Ustensiles de service..."
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Type de catégorie */}
          <div className="space-y-3">
            <Label>Type de catégorie *</Label>
            <Select 
              value={formData.type || ''} 
              onValueChange={(value: 'ingredient' | 'produit' | 'ustensile') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un type..." />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-3 py-2">
                      <type.icon className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-category-description">Description (optionnel)</Label>
            <Textarea
              id="edit-category-description"
              placeholder="Décrivez brièvement cette catégorie..."
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="resize-none"
            />
          </div>

          {/* Couleur */}
          <div className="space-y-3">
            <Label>Couleur d'identification</Label>
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-gray-600" />
              <Select 
                value={formData.color || ''} 
                onValueChange={(value: string) => 
                  setFormData(prev => ({ ...prev, color: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-4 h-4 rounded ${color.value}`}
                          style={{ backgroundColor: color.color }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-500">
                Couleur : <span className="font-medium">{selectedColorInfo?.label}</span>
              </div>
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