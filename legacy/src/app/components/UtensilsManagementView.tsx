import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreateUtensilModal } from "./CreateUtensilModal";
import { EditUtensilModal } from "./EditUtensilModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Utensils, 
  Plus, 
  Search,
  Edit,
  Trash,
  Eye,
  Calendar,
  Euro,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle
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

export function UtensilsManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUtensil, setSelectedUtensil] = useState<Utensil | null>(null);
  const [utensilToDelete, setUtensilToDelete] = useState<number | null>(null);
  const [utensils, setUtensils] = useState<Utensil[]>([
    {
      id: 1,
      name: "Couteau de chef Sabatier",
      category: "couteaux",
      brand: "Sabatier",
      model: "K Sabatier",
      serialNumber: "SAB-2024-001",
      purchaseDate: "2024-01-10",
      purchasePrice: 89.99,
      condition: "excellent",
      location: "cuisine-principale",
      notes: "Couteau principal du chef, entretien régulier",
      maintenanceDate: "2024-01-10",
      warranty: "2 ans",
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Four mixte Rational",
      category: "four",
      brand: "Rational",
      model: "SCC 101G",
      serialNumber: "RAT-2023-SCC101-456",
      purchaseDate: "2023-12-15",
      purchasePrice: 12500.00,
      condition: "good",
      location: "cuisine-principale",
      notes: "Four principal - maintenance trimestrielle requise",
      maintenanceDate: "2024-01-05",
      warranty: "3 ans - expire 2026-12-15",
      createdAt: "2023-12-15"
    },
    {
      id: 3,
      name: "Robot Coupe R301 Ultra",
      category: "preparation",
      brand: "Robot Coupe",
      model: "R301 Ultra",
      serialNumber: "RC-R301-789",
      purchaseDate: "2023-11-20",
      purchasePrice: 850.00,
      condition: "good",
      location: "cuisine-froide",
      notes: "Robot multifonctions - lames changées récemment",
      maintenanceDate: "2024-01-08",
      warranty: "2 ans",
      createdAt: "2023-11-20"
    },
    {
      id: 4,
      name: "Mandoline défectueuse",
      category: "preparation",
      brand: "Bron Coucke",
      model: "Classic",
      serialNumber: "BC-CL-123",
      purchaseDate: "2022-06-15",
      purchasePrice: 65.00,
      condition: "poor",
      location: "maintenance",
      notes: "Système de réglage cassé - à réparer ou remplacer",
      maintenanceDate: "2023-12-20",
      warranty: "Expirée",
      createdAt: "2022-06-15"
    },
    {
      id: 5,
      name: "Réfrigérateur Liebherr",
      category: "refrigeration",
      brand: "Liebherr",
      model: "FKUv 1613",
      serialNumber: "LH-FKU-2024-001",
      purchaseDate: "2024-01-05",
      purchasePrice: 1890.00,
      condition: "excellent",
      location: "cuisine-froide",
      notes: "Nouveau réfrigérateur - garantie complète",
      maintenanceDate: "2024-01-05",
      warranty: "5 ans",
      createdAt: "2024-01-05"
    }
  ]);

  const categories = ["all", "couteaux", "casseroles", "electromenager", "four", "refrigeration", "preparation", "service", "nettoyage", "securite", "autre"];
  const conditions = ["all", "excellent", "good", "fair", "poor"];

  // Fonction pour ajouter un nouvel ustensile
  const handleUtensilCreated = (newUtensilData: any) => {
    const newUtensil: Utensil = {
      id: Date.now(),
      ...newUtensilData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUtensils(prev => [newUtensil, ...prev]);
    toast.success(`Ustensile "${newUtensilData.name}" ajouté avec succès !`);
  };

  // Fonction pour éditer un ustensile
  const handleEditUtensil = (utensil: Utensil) => {
    setSelectedUtensil(utensil);
    setShowEditModal(true);
  };

  // Fonction pour mettre à jour un ustensile
  const handleUtensilUpdated = (updatedUtensil: Utensil) => {
    setUtensils(prev => 
      prev.map(utensil => 
        utensil.id === updatedUtensil.id ? updatedUtensil : utensil
      )
    );
    toast.success(`Ustensile "${updatedUtensil.name}" modifié avec succès !`);
  };

  // Fonction pour initier la suppression d'un ustensile
  const handleDeleteUtensil = (utensilId: number) => {
    setUtensilToDelete(utensilId);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteUtensil = () => {
    if (utensilToDelete) {
      const utensil = utensils.find(u => u.id === utensilToDelete);
      setUtensils(prev => prev.filter(utensil => utensil.id !== utensilToDelete));
      toast.success(`Ustensile "${utensil?.name}" supprimé avec succès !`);
      setUtensilToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const filteredUtensils = utensils.filter(utensil => {
    const matchesSearch = utensil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         utensil.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         utensil.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         utensil.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || utensil.category === selectedCategory;
    const matchesCondition = selectedCondition === "all" || utensil.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "bg-green-100 text-green-700";
      case "good": return "bg-blue-100 text-blue-700";
      case "fair": return "bg-yellow-100 text-yellow-700";
      case "poor": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "excellent": return "Excellent";
      case "good": return "Bon";
      case "fair": return "Acceptable";
      case "poor": return "Mauvais";
      default: return "Inconnu";
    }
  };

  const getCategoryText = (category: string) => {
    const categoryLabels: Record<string, string> = {
      "couteaux": "Couteaux",
      "casseroles": "Casseroles et poêles",
      "electromenager": "Électroménager",
      "four": "Fours et plaques",
      "refrigeration": "Réfrigération",
      "preparation": "Préparation",
      "service": "Service",
      "nettoyage": "Nettoyage",
      "securite": "Sécurité",
      "autre": "Autre"
    };
    return categoryLabels[category] || category;
  };

  const getLocationText = (location: string) => {
    const locationLabels: Record<string, string> = {
      "cuisine-principale": "Cuisine principale",
      "cuisine-froide": "Cuisine froide",
      "patisserie": "Pâtisserie",
      "plonge": "Plonge",
      "reserve": "Réserve",
      "salle": "Salle de service",
      "bureau": "Bureau",
      "maintenance": "Maintenance",
      "autre": "Autre"
    };
    return locationLabels[location] || location;
  };

  const getTotalValue = () => {
    return utensils.reduce((sum, utensil) => sum + (utensil.purchasePrice || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des ustensiles</h1>
            <p className="text-gray-600">Inventaire de vos ustensiles et équipements</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel ustensile
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un ustensile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Toutes catégories</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {getCategoryText(category)}
                  </option>
                ))}
              </select>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous états</option>
                {conditions.slice(1).map((condition) => (
                  <option key={condition} value={condition}>
                    {getConditionText(condition)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total ustensiles</p>
                <p className="text-2xl font-bold text-gray-900">{utensils.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En mauvais état</p>
                <p className="text-2xl font-bold text-red-600">
                  {utensils.filter(u => u.condition === "poor").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Excellent état</p>
                <p className="text-2xl font-bold text-green-600">
                  {utensils.filter(u => u.condition === "excellent").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getTotalValue().toFixed(0)}€
                </p>
              </div>
              <Euro className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utensils List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des ustensiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUtensils.map((utensil) => (
              <div key={utensil.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{utensil.name}</h3>
                      <p className="text-sm text-gray-600">{getCategoryText(utensil.category)}</p>
                      {utensil.brand && (
                        <p className="text-xs text-gray-500">{utensil.brand} {utensil.model}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emplacement</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">{getLocationText(utensil.location)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">État</p>
                      <Badge className={getConditionColor(utensil.condition)}>
                        {getConditionText(utensil.condition)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valeur</p>
                      <p className="font-medium text-gray-900">
                        {utensil.purchasePrice ? `${utensil.purchasePrice.toFixed(2)}€` : "N/A"}
                      </p>
                      {utensil.purchaseDate && (
                        <p className="text-xs text-gray-500">
                          Acheté le {new Date(utensil.purchaseDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Maintenance</p>
                      {utensil.maintenanceDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-900">
                            {new Date(utensil.maintenanceDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Aucune</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Garantie</p>
                      <p className="text-sm text-gray-900">{utensil.warranty || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {/* TODO: Implement view */}}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUtensil(utensil)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUtensil(utensil.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Serial Number */}
                {utensil.serialNumber && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">N° série: {utensil.serialNumber}</p>
                  </div>
                )}
                
                {/* Notes */}
                {utensil.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{utensil.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modale de création d'ustensile */}
      <CreateUtensilModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onUtensilCreated={handleUtensilCreated}
      />

      {/* Modale d'édition d'ustensile */}
      <EditUtensilModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        utensil={selectedUtensil}
        onUtensilUpdated={handleUtensilUpdated}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet ustensile ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUtensil}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}