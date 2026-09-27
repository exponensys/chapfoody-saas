import { useState } from "react";
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
  CheckCircle 
} from "lucide-react";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated?: (category: CategoryData) => void;
}

interface CategoryData {
  name: string;
  type: 'ingredient' | 'produit' | 'ustensile';
  description: string;
  color: string;
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

export function CreateCategoryModal({ open, onOpenChange, onCategoryCreated }: CreateCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryData>({
    name: '',
    type: 'ingredient' as const,
    description: '',
    color: 'bg-blue-500'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Veuillez saisir un nom pour la catégorie');
      return;
    }

    if (!formData.type) {
      toast.error('Veuillez sélectionner un type de catégorie');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la création de la catégorie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Appeler le callback avec les données de la catégorie
      onCategoryCreated?.(formData);
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Catégorie créée avec succès !</p>
            <p className="text-sm text-gray-600">
              {formData.name} ({categoryTypes.find(t => t.value === formData.type)?.label})
            </p>
          </div>
        </div>
      );

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        type: 'ingredient',
        description: '',
        color: 'bg-blue-500'
      });

      // Fermer le modal
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la création de la catégorie');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Créer une nouvelle catégorie
          </DialogTitle>
          <DialogDescription>
            Organisez votre stock en créant une nouvelle catégorie personnalisée.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de la catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category-name">Nom de la catégorie *</Label>
            <Input
              id="category-name"
              placeholder="Ex: Légumes frais, Ustensiles de service..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Type de catégorie */}
          <div className="space-y-3">
            <Label>Type de catégorie *</Label>
            <Select 
              value={formData.type} 
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
            
            {/* Info sur le type sélectionné */}
            {selectedTypeInfo && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-2">
                  <selectedTypeInfo.icon className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedTypeInfo.label}</p>
                    <p className="text-xs text-gray-600">{selectedTypeInfo.examples}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="category-description">Description (optionnel)</Label>
            <Textarea
              id="category-description"
              placeholder="Décrivez brièvement cette catégorie..."
              rows={3}
              value={formData.description}
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
                value={formData.color} 
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
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className="bg-[#b70f23] hover:bg-[#70070e]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Créer la catégorie
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}