import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Truck, 
  Users, 
  Star,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface DeliveryCompany {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  contact: {
    email: string;
    phone: string;
    address: string;
    contactPerson: string;
    website?: string;
  };
  serviceDetails: {
    deliveryZones: string[];
    workingHours: {
      start: string;
      end: string;
      daysOfWeek: string[];
    };
    vehicleTypes: string[];
    maxDistance: number;
    deliveryFee: number;
  };
  performance: {
    rating: number;
    completedDeliveries: number;
    onTimeRate: number;
    averageDeliveryTime: number;
  };
  contractInfo: {
    contractNumber: string;
    startDate: string;
    endDate?: string;
    commissionRate: number;
    paymentTerms: string;
  };
  description?: string;
  createdAt: string;
}

export function DeliveryCompanyInfoView() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Données mock d'une entreprise de livraison
  const [companyData, setCompanyData] = useState<DeliveryCompany>({
    id: 1,
    name: "FastDelivery Pro",
    status: "active",
    contact: {
      email: "contact@fastdeliverypro.fr",
      phone: "01 23 45 67 89",
      address: "123 Avenue des Livraisons, 75001 Paris",
      contactPerson: "Marie Dubois",
      website: "https://www.fastdeliverypro.fr"
    },
    serviceDetails: {
      deliveryZones: ["Paris", "Boulogne-Billancourt", "Neuilly-sur-Seine", "Levallois-Perret"],
      workingHours: {
        start: "08:00",
        end: "22:00",
        daysOfWeek: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
      },
      vehicleTypes: ["Vélo", "Scooter", "Voiture"],
      maxDistance: 15,
      deliveryFee: 3.50
    },
    performance: {
      rating: 4.7,
      completedDeliveries: 2847,
      onTimeRate: 94.2,
      averageDeliveryTime: 28
    },
    contractInfo: {
      contractNumber: "FDP-2024-001",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      commissionRate: 12.5,
      paymentTerms: "Hebdomadaire"
    },
    description: "Entreprise de livraison spécialisée dans la restauration rapide et la livraison express en région parisienne.",
    createdAt: "2024-01-15"
  });

  const [formData, setFormData] = useState(companyData);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...companyData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(companyData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCompanyData(formData);
      setIsEditing(false);
      toast.success("Informations de l'entreprise mises à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "inactive": return "bg-gray-100 text-gray-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "suspended": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Actif";
      case "inactive": return "Inactif";
      case "pending": return "En attente";
      case "suspended": return "Suspendu";
      default: return "Inconnu";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Informations de l'entreprise</h1>
            <p className="text-gray-600">Gérez les détails de votre partenaire de livraison</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button 
              onClick={handleEdit}
              className="bg-[#b70f23] hover:bg-[#70070e]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#b70f23] hover:bg-[#70070e]"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom de l'entreprise</Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-gray-900 font-medium">{companyData.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Statut</Label>
              {isEditing ? (
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
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(companyData.status)}>
                  {getStatusText(companyData.status)}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Description de l'entreprise de livraison..."
              />
            ) : (
              <p className="text-gray-700">{companyData.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Personne de contact</Label>
              {isEditing ? (
                <Input
                  value={formData.contact.contactPerson}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, contactPerson: e.target.value }
                  }))}
                />
              ) : (
                <p className="text-gray-900">{companyData.contact.contactPerson}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{companyData.contact.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Téléphone</Label>
              {isEditing ? (
                <Input
                  value={formData.contact.phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{companyData.contact.phone}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Site web</Label>
              {isEditing ? (
                <Input
                  value={formData.contact.website || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contact: { ...prev.contact, website: e.target.value }
                  }))}
                  placeholder="https://..."
                />
              ) : (
                <p className="text-blue-600 hover:underline cursor-pointer">{companyData.contact.website}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Adresse</Label>
            {isEditing ? (
              <Textarea
                value={formData.contact.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contact: { ...prev.contact, address: e.target.value }
                }))}
                rows={2}
              />
            ) : (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-gray-900">{companyData.contact.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Détails du service */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Détails du service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horaires de service</Label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">
                  {companyData.serviceDetails.workingHours.start} - {companyData.serviceDetails.workingHours.end}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {companyData.serviceDetails.workingHours.daysOfWeek.join(", ")}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Distance maximale</Label>
              <p className="text-gray-900 font-medium">{companyData.serviceDetails.maxDistance} km</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Zones de livraison</Label>
            <div className="flex flex-wrap gap-2">
              {companyData.serviceDetails.deliveryZones.map((zone, index) => (
                <Badge key={index} variant="outline">
                  {zone}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Types de véhicules</Label>
            <div className="flex flex-wrap gap-2">
              {companyData.serviceDetails.vehicleTypes.map((vehicle, index) => (
                <Badge key={index} variant="outline">
                  {vehicle}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frais de livraison</Label>
            <p className="text-gray-900 font-medium">{companyData.serviceDetails.deliveryFee}€</p>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{companyData.performance.completedDeliveries}</div>
              <div className="text-sm text-blue-800">Livraisons réalisées</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{companyData.performance.onTimeRate}%</div>
              <div className="text-sm text-green-800">Ponctualité</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{companyData.performance.averageDeliveryTime} min</div>
              <div className="text-sm text-yellow-800">Temps moyen</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                {renderStars(companyData.performance.rating)}
              </div>
              <div className="text-sm text-purple-800">Note moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations contractuelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Informations contractuelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Numéro de contrat</Label>
              <p className="text-gray-900 font-medium">{companyData.contractInfo.contractNumber}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Taux de commission</Label>
              <p className="text-gray-900 font-medium">{companyData.contractInfo.commissionRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <p className="text-gray-900">{new Date(companyData.contractInfo.startDate).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <p className="text-gray-900">
                {companyData.contractInfo.endDate 
                  ? new Date(companyData.contractInfo.endDate).toLocaleDateString('fr-FR')
                  : "Indéterminée"
                }
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Conditions de paiement</Label>
            <p className="text-gray-900">{companyData.contractInfo.paymentTerms}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}