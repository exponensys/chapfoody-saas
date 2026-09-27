import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
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
  CheckCircle,
  ArrowLeft,
  Folder
} from "lucide-react";

interface CreateCategoryPageProps {
  onBack?: () => void;
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
    examples: 'Ex: légumes, viandes, épices, huiles...',
    color: 'bg-green-100 border-green-200'
  },
  {
    value: 'produit',
    label: 'Produit à vendre',
    description: 'Articles destinés à la vente',
    icon: Package2,
    examples: 'Ex: plats préparés, boissons, desserts...',
    color: 'bg-blue-100 border-blue-200'
  },
  {
    value: 'ustensile',
    label: 'Ustensile/Équipement',
    description: 'Matériel et équipements de cuisine',
    icon: Utensils,
    examples: 'Ex: casseroles, couteaux, machines...',
    color: 'bg-purple-100 border-purple-200'
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

export function CreateCategoryPage({ onBack, onCategoryCreated }: CreateCategoryPageProps) {
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

    } catch (error) {
      toast.error('Erreur lors de la création de la catégorie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTypeInfo = categoryTypes.find(type => type.value === formData.type);
  const selectedColorInfo = colorOptions.find(color => color.value === formData.color);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${formData.color} flex items-center justify-center`}>
            {selectedTypeInfo ? (
              <selectedTypeInfo.icon className="w-5 h-5 text-white" />
            ) : (
              <Folder className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Créer une nouvelle catégorie</h1>
            <p className="text-gray-600">Organisez votre stock avec des catégories personnalisées</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la catégorie</CardTitle>
              <CardDescription>
                Remplissez les informations ci-dessous pour créer votre nouvelle catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description (optionnel)</Label>
                  <Textarea
                    id="category-description"
                    placeholder="Décrivez brièvement cette catégorie..."
                    rows={4}
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
                      <SelectTrigger className="w-48">
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
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
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
                  {onBack && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      Annuler
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu et informations */}
        <div className="space-y-6">
          {/* Aperçu de la catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${selectedTypeInfo?.color || 'bg-gray-100 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${formData.color} flex items-center justify-center`}>
                      {selectedTypeInfo ? (
                        <selectedTypeInfo.icon className="w-5 h-5 text-white" />
                      ) : (
                        <Folder className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {formData.name || "Nom de la catégorie"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedTypeInfo?.label || "Type non sélectionné"}
                      </p>
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-gray-700">{formData.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur le type sélectionné */}
          {selectedTypeInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedTypeInfo.icon className="w-5 h-5" />
                  {selectedTypeInfo.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedTypeInfo.description}</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedTypeInfo.examples}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}