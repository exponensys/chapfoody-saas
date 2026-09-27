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
  Utensils, 
  Save,
  Euro,
  Calendar,
  AlertCircle,
  X
} from "lucide-react";

interface Utensil {
  id: number;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  notes?: string;
  maintenanceDate?: string;
  warranty?: string;
  createdAt: string;
}

interface EditUtensilModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utensil: Utensil | null;
  onUtensilUpdated: (updatedUtensil: Utensil) => void;
}

const categories = [
  { value: 'couteaux', label: 'Couteaux' },
  { value: 'casseroles', label: 'Casseroles et poêles' },
  { value: 'electromenager', label: 'Électroménager' },
  { value: 'four', label: 'Fours et plaques' },
  { value: 'refrigeration', label: 'Réfrigération' },
  { value: 'preparation', label: 'Préparation' },
  { value: 'service', label: 'Service' },
  { value: 'nettoyage', label: 'Nettoyage' },
  { value: 'securite', label: 'Sécurité' },
  { value: 'autre', label: 'Autre' }
];

const conditions = [
  { value: 'excellent', label: 'Excellent', color: 'bg-green-100 text-green-700' },
  { value: 'good', label: 'Bon', color: 'bg-blue-100 text-blue-700' },
  { value: 'fair', label: 'Acceptable', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'poor', label: 'Mauvais', color: 'bg-red-100 text-red-700' }
];

const locations = [
  { value: 'cuisine-principale', label: 'Cuisine principale' },
  { value: 'cuisine-froide', label: 'Cuisine froide' },
  { value: 'patisserie', label: 'Pâtisserie' },
  { value: 'plonge', label: 'Plonge' },
  { value: 'reserve', label: 'Réserve' },
  { value: 'salle', label: 'Salle de service' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'autre', label: 'Autre' }
];

export function EditUtensilModal({ open, onOpenChange, utensil, onUtensilUpdated }: EditUtensilModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    purchasePrice: 0,
    condition: "good" as 'excellent' | 'good' | 'fair' | 'poor',
    location: "",
    notes: "",
    maintenanceDate: "",
    warranty: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (utensil && open) {
      setFormData({
        name: utensil.name,
        category: utensil.category,
        brand: utensil.brand || "",
        model: utensil.model || "",
        serialNumber: utensil.serialNumber || "",
        purchaseDate: utensil.purchaseDate || "",
        purchasePrice: utensil.purchasePrice || 0,
        condition: utensil.condition,
        location: utensil.location,
        notes: utensil.notes || "",
        maintenanceDate: utensil.maintenanceDate || "",
        warranty: utensil.warranty || ""
      });
    }
  }, [utensil, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utensil) return;

    if (!formData.name.trim()) {
      toast.error('Veuillez saisir un nom pour l\'ustensile');
      return;
    }

    if (!formData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.location) {
      toast.error('Veuillez sélectionner un emplacement');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la mise à jour de l'ustensile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUtensil: Utensil = {
        ...utensil,
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        serialNumber: formData.serialNumber || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice || undefined,
        condition: formData.condition,
        location: formData.location,
        notes: formData.notes || undefined,
        maintenanceDate: formData.maintenanceDate || undefined,
        warranty: formData.warranty || undefined
      };
      
      onUtensilUpdated(updatedUtensil);
      
      toast.success(`Ustensile "${formData.name}" modifié avec succès !`);
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la modification de l\'ustensile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (utensil) {
      setFormData({
        name: utensil.name,
        category: utensil.category,
        brand: utensil.brand || "",
        model: utensil.model || "",
        serialNumber: utensil.serialNumber || "",
        purchaseDate: utensil.purchaseDate || "",
        purchasePrice: utensil.purchasePrice || 0,
        condition: utensil.condition,
        location: utensil.location,
        notes: utensil.notes || "",
        maintenanceDate: utensil.maintenanceDate || "",
        warranty: utensil.warranty || ""
      });
    }
  };

  const getCategoryLabel = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const getLocationLabel = (locationValue: string) => {
    return locations.find(loc => loc.value === locationValue)?.label || locationValue;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            Modifier l'ustensile
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre ustensile. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utensil-name">Nom de l'ustensile *</Label>
                <Input
                  id="utensil-name"
                  placeholder="Ex: Couteau de chef, Four mixte..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utensil-brand">Marque</Label>
                <Input
                  id="utensil-brand"
                  placeholder="Ex: Sabatier, Robot Coupe..."
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utensil-model">Modèle</Label>
                <Input
                  id="utensil-model"
                  placeholder="Référence ou modèle"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utensil-serial">Numéro de série</Label>
              <Input
                id="utensil-serial"
                placeholder="Numéro de série ou d'identification"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
              />
            </div>
          </div>

          {/* Achat et valeur */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Achat et valeur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Date d'achat</Label>
                <Input
                  id="purchase-date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>

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
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Garantie</Label>
              <Input
                id="warranty"
                placeholder="Ex: 2 ans, Jusqu'au 2025-12-31..."
                value={formData.warranty}
                onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
              />
            </div>
          </div>

          {/* État et localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">État et localisation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>État *</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => 
                    setFormData(prev => ({ ...prev, condition: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        <Badge className={condition.color}>
                          {condition.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Emplacement *</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un emplacement..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance-date">Dernière maintenance</Label>
              <Input
                id="maintenance-date"
                type="date"
                value={formData.maintenanceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, maintenanceDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="utensil-notes">Notes et observations</Label>
              <Textarea
                id="utensil-notes"
                placeholder="Instructions d'utilisation, état particulier, historique..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Alertes conditionnelles */}
          {formData.condition === 'poor' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Ustensile en mauvais état
                  </p>
                  <p className="text-xs text-red-700">
                    Cet ustensile nécessite une attention particulière ou un remplacement.
                  </p>
                </div>
              </div>
            </div>
          )}
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
            disabled={isSubmitting || !formData.name.trim() || !formData.category || !formData.location}
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