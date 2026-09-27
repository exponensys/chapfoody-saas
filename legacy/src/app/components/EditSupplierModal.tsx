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
  Building2, 
  Save,
  Mail,
  Phone,
  MapPin,
  FileText,
  X,
  Star
} from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  category: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    contactPerson: string;
  };
  contractDetails: {
    contractNumber?: string;
    contractType: 'standard' | 'premium' | 'exclusive';
    paymentTerms: string;
    deliveryZone: string;
  };
  performance: {
    rating: number;
    onTimeDeliveryRate: number;
    qualityScore: number;
    lastDelivery?: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  notes?: string;
  createdAt: string;
}

interface EditSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSupplierUpdated: (updatedSupplier: Supplier) => void;
}

const categories = [
  { value: 'Grossiste alimentaire', label: 'Grossiste alimentaire' },
  { value: 'Distribution alimentaire', label: 'Distribution alimentaire' },
  { value: 'Fruits et légumes', label: 'Fruits et légumes' },
  { value: 'Produits surgelés', label: 'Produits surgelés' },
  { value: 'Épicerie fine', label: 'Épicerie fine' },
  { value: 'Viandes', label: 'Viandes' },
  { value: 'Poissonnerie', label: 'Poissonnerie' },
  { value: 'Boulangerie', label: 'Boulangerie' },
  { value: 'Produits laitiers', label: 'Produits laitiers' },
  { value: 'Boissons', label: 'Boissons' }
];

const contractTypes = [
  { value: 'standard', label: 'Standard', color: 'bg-blue-100 text-blue-700' },
  { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  { value: 'exclusive', label: 'Exclusif', color: 'bg-orange-100 text-orange-700' }
];

const statuses = [
  { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'suspended', label: 'Suspendu', color: 'bg-red-100 text-red-700' }
];

const paymentTermsOptions = [
  "15 jours",
  "30 jours",
  "30 jours fin de mois",
  "45 jours",
  "60 jours",
  "Comptant",
  "À la livraison"
];

export function EditSupplierModal({ open, onOpenChange, supplier, onSupplierUpdated }: EditSupplierModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    contact: {
      email: "",
      phone: "",
      address: "",
      contactPerson: ""
    },
    contractDetails: {
      contractNumber: "",
      contractType: "standard" as 'standard' | 'premium' | 'exclusive',
      paymentTerms: "",
      deliveryZone: ""
    },
    performance: {
      rating: 0,
      onTimeDeliveryRate: 0,
      qualityScore: 0,
      lastDelivery: ""
    },
    status: "active" as 'active' | 'inactive' | 'pending' | 'suspended',
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supplier && open) {
      setFormData({
        name: supplier.name,
        category: supplier.category,
        contact: {
          email: supplier.contact.email,
          phone: supplier.contact.phone,
          address: supplier.contact.address,
          contactPerson: supplier.contact.contactPerson
        },
        contractDetails: {
          contractNumber: supplier.contractDetails.contractNumber || "",
          contractType: supplier.contractDetails.contractType,
          paymentTerms: supplier.contractDetails.paymentTerms,
          deliveryZone: supplier.contractDetails.deliveryZone
        },
        performance: {
          rating: supplier.performance.rating,
          onTimeDeliveryRate: supplier.performance.onTimeDeliveryRate,
          qualityScore: supplier.performance.qualityScore,
          lastDelivery: supplier.performance.lastDelivery || ""
        },
        status: supplier.status,
        notes: supplier.notes || ""
      });
    }
  }, [supplier, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplier) return;

    if (!formData.name.trim()) {
      toast.error('Veuillez saisir le nom du fournisseur');
      return;
    }

    if (!formData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.contact.email.trim()) {
      toast.error('Veuillez saisir l\'email de contact');
      return;
    }

    if (!formData.contact.contactPerson.trim()) {
      toast.error('Veuillez saisir le nom de la personne de contact');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation de la mise à jour du fournisseur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSupplier: Supplier = {
        ...supplier,
        name: formData.name,
        category: formData.category,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          contactPerson: formData.contact.contactPerson
        },
        contractDetails: {
          contractNumber: formData.contractDetails.contractNumber || undefined,
          contractType: formData.contractDetails.contractType,
          paymentTerms: formData.contractDetails.paymentTerms,
          deliveryZone: formData.contractDetails.deliveryZone
        },
        performance: {
          rating: formData.performance.rating,
          onTimeDeliveryRate: formData.performance.onTimeDeliveryRate,
          qualityScore: formData.performance.qualityScore,
          lastDelivery: formData.performance.lastDelivery || undefined
        },
        status: formData.status,
        notes: formData.notes || undefined
      };
      
      onSupplierUpdated(updatedSupplier);
      
      toast.success(`Fournisseur "${formData.name}" modifié avec succès !`);
      onOpenChange(false);

    } catch (error) {
      toast.error('Erreur lors de la modification du fournisseur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        category: supplier.category,
        contact: {
          email: supplier.contact.email,
          phone: supplier.contact.phone,
          address: supplier.contact.address,
          contactPerson: supplier.contact.contactPerson
        },
        contractDetails: {
          contractNumber: supplier.contractDetails.contractNumber || "",
          contractType: supplier.contractDetails.contractType,
          paymentTerms: supplier.contractDetails.paymentTerms,
          deliveryZone: supplier.contractDetails.deliveryZone
        },
        performance: {
          rating: supplier.performance.rating,
          onTimeDeliveryRate: supplier.performance.onTimeDeliveryRate,
          qualityScore: supplier.performance.qualityScore,
          lastDelivery: supplier.performance.lastDelivery || ""
        },
        status: supplier.status,
        notes: supplier.notes || ""
      });
    }
  };

  const renderStarRating = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star 
              className={`w-4 h-4 ${
                star <= rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            Modifier le fournisseur
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre fournisseur. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-name">Nom du fournisseur *</Label>
                <Input
                  id="supplier-name"
                  placeholder="Ex: Metro Cash & Carry"
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

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive' | 'pending' | 'suspended') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
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

          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Personne de contact *</Label>
                <Input
                  id="contact-person"
                  placeholder="Ex: Sophie Martin"
                  value={formData.contact.contactPerson}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, contactPerson: e.target.value }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@fournisseur.fr"
                    className="pl-10"
                    value={formData.contact.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="contact-phone"
                    placeholder="01 23 45 67 89"
                    className="pl-10"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-zone">Zone de livraison</Label>
                <Input
                  id="delivery-zone"
                  placeholder="Ex: Île-de-France, National..."
                  value={formData.contractDetails.deliveryZone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contractDetails: { ...prev.contractDetails, deliveryZone: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-address">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Textarea
                  id="contact-address"
                  placeholder="Adresse complète du fournisseur..."
                  className="pl-10"
                  rows={3}
                  value={formData.contact.address}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, address: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Informations contractuelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations contractuelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract-number">Numéro de contrat</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="contract-number"
                    placeholder="AUTO-2024-001"
                    className="pl-10"
                    value={formData.contractDetails.contractNumber}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contractDetails: { ...prev.contractDetails, contractNumber: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type de contrat</Label>
                <Select 
                  value={formData.contractDetails.contractType} 
                  onValueChange={(value: 'standard' | 'premium' | 'exclusive') => 
                    setFormData(prev => ({ 
                      ...prev, 
                      contractDetails: { ...prev.contractDetails, contractType: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <Badge className={type.color}>
                          {type.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Conditions de paiement</Label>
              <Select 
                value={formData.contractDetails.paymentTerms} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  contractDetails: { ...prev.contractDetails, paymentTerms: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez les conditions..." />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Évaluation de performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Note générale</Label>
                {renderStarRating(formData.performance.rating, (rating) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    performance: { ...prev.performance, rating }
                  }))
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ontime-rate">Taux de ponctualité (%)</Label>
                <Input
                  id="ontime-rate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="95"
                  value={formData.performance.onTimeDeliveryRate}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    performance: { ...prev.performance, onTimeDeliveryRate: parseFloat(e.target.value) || 0 }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Note qualité</Label>
                {renderStarRating(formData.performance.qualityScore, (qualityScore) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    performance: { ...prev.performance, qualityScore }
                  }))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-delivery">Dernière livraison</Label>
              <Input
                id="last-delivery"
                type="date"
                value={formData.performance.lastDelivery}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  performance: { ...prev.performance, lastDelivery: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes et observations</h3>
            
            <div className="space-y-2">
              <Label htmlFor="supplier-notes">Notes</Label>
              <Textarea
                id="supplier-notes"
                placeholder="Informations supplémentaires, conditions particulières..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
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
            disabled={isSubmitting || !formData.name.trim() || !formData.category || !formData.contact.email.trim() || !formData.contact.contactPerson.trim()}
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