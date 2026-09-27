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
  Building2, 
  Save,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react";

interface CreateSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierCreated: (supplierData: any) => void;
}

const categories = [
  { value: 'grossiste-alimentaire', label: 'Grossiste alimentaire' },
  { value: 'distribution-alimentaire', label: 'Distribution alimentaire' },
  { value: 'fruits-legumes', label: 'Fruits et légumes' },
  { value: 'produits-surgeles', label: 'Produits surgelés' },
  { value: 'epicerie-fine', label: 'Épicerie fine' },
  { value: 'viandes', label: 'Viandes' },
  { value: 'poissonnerie', label: 'Poissonnerie' },
  { value: 'boulangerie', label: 'Boulangerie' },
  { value: 'produits-laitiers', label: 'Produits laitiers' },
  { value: 'boissons', label: 'Boissons' }
];

const contractTypes = [
  { value: 'standard', label: 'Standard', color: 'bg-blue-100 text-blue-700' },
  { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  { value: 'exclusive', label: 'Exclusif', color: 'bg-orange-100 text-orange-700' }
];

const statuses = [
  { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' }
];

const paymentTermsOptions = [
  { value: '15-jours', label: '15 jours' },
  { value: '30-jours', label: '30 jours' },
  { value: '30-jours-fin-mois', label: '30 jours fin de mois' },
  { value: '45-jours', label: '45 jours' },
  { value: '60-jours', label: '60 jours' },
  { value: 'comptant', label: 'Comptant' },
  { value: 'livraison', label: 'À la livraison' }
];

export function CreateSupplierModal({ open, onOpenChange, onSupplierCreated }: CreateSupplierModalProps) {
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
    status: "pending" as 'active' | 'inactive' | 'pending',
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Simulation de la création du fournisseur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const supplierData = {
        name: formData.name,
        category: categories.find(cat => cat.value === formData.category)?.label || formData.category,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          contactPerson: formData.contact.contactPerson
        },
        contractDetails: {
          contractNumber: formData.contractDetails.contractNumber || undefined,
          contractType: formData.contractDetails.contractType,
          paymentTerms: paymentTermsOptions.find(term => term.value === formData.contractDetails.paymentTerms)?.label || formData.contractDetails.paymentTerms,
          deliveryZone: formData.contractDetails.deliveryZone
        },
        status: formData.status,
        notes: formData.notes || undefined
      };
      
      onSupplierCreated(supplierData);
      
      toast.success(`Fournisseur "${formData.name}" créé avec succès !`);
      onOpenChange(false);
      
      // Reset form
      setFormData({
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
          contractType: "standard",
          paymentTerms: "",
          deliveryZone: ""
        },
        status: "pending",
        notes: ""
      });

    } catch (error) {
      toast.error('Erreur lors de la création du fournisseur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateContractNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const prefix = formData.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        contractNumber: `${prefix}-${year}-${month}-${random}`
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b70f23] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            Nouveau fournisseur
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau fournisseur à votre base de données. Tous les champs marqués d'un * sont obligatoires.
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
                onValueChange={(value: 'active' | 'inactive' | 'pending') => 
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
                <div className="flex gap-2">
                  <div className="relative flex-1">
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateContractNumber}
                    disabled={!formData.name.trim()}
                  >
                    Auto
                  </Button>
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
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Création...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer le fournisseur
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}