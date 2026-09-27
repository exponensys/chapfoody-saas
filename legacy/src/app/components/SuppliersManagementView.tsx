import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CreateSupplierModal } from "./CreateSupplierModal";
import { EditSupplierModal } from "./EditSupplierModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Building2, 
  Plus, 
  Search,
  Edit,
  Trash,
  Eye,
  Phone,
  Mail,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock
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

export function SuppliersManagementView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: "Metro Cash & Carry",
      category: "Grossiste alimentaire",
      contact: {
        email: "commandes@metro.fr",
        phone: "01 45 67 89 10",
        address: "Zone Industrielle, 94150 Rungis",
        contactPerson: "Sophie Martin"
      },
      contractDetails: {
        contractNumber: "MTR-2024-001",
        contractType: "premium",
        paymentTerms: "30 jours fin de mois",
        deliveryZone: "Île-de-France"
      },
      performance: {
        rating: 4.8,
        onTimeDeliveryRate: 95,
        qualityScore: 4.6,
        lastDelivery: "2024-01-15"
      },
      status: "active",
      notes: "Fournisseur principal - Excellent service",
      createdAt: "2023-03-15"
    },
    {
      id: 2,
      name: "Sysco France",
      category: "Distribution alimentaire",
      contact: {
        email: "contact@sysco.fr",
        phone: "01 42 33 44 55",
        address: "15 Avenue des Champs, 75008 Paris",
        contactPerson: "Laurent Dubois"
      },
      contractDetails: {
        contractNumber: "SYS-2024-002",
        contractType: "standard",
        paymentTerms: "45 jours",
        deliveryZone: "National"
      },
      performance: {
        rating: 4.2,
        onTimeDeliveryRate: 88,
        qualityScore: 4.1,
        lastDelivery: "2024-01-14"
      },
      status: "active",
      notes: "Bon rapport qualité-prix",
      createdAt: "2023-06-20"
    },
    {
      id: 3,
      name: "Pomona Fruits & Légumes",
      category: "Fruits et légumes",
      contact: {
        email: "ventes@pomona.fr",
        phone: "01 56 78 90 12",
        address: "Marché de Rungis, Pavillon C4",
        contactPerson: "Marie Lecomte"
      },
      contractDetails: {
        contractNumber: "POM-2024-003",
        contractType: "exclusive",
        paymentTerms: "15 jours",
        deliveryZone: "Région parisienne"
      },
      performance: {
        rating: 4.9,
        onTimeDeliveryRate: 98,
        qualityScore: 4.8,
        lastDelivery: "2024-01-16"
      },
      status: "active",
      notes: "Fournisseur exclusif fruits et légumes bio",
      createdAt: "2023-01-10"
    },
    {
      id: 4,
      name: "Nouveau Fournisseur Test",
      category: "Épicerie fine",
      contact: {
        email: "test@nouveau.fr",
        phone: "01 11 22 33 44",
        address: "123 Rue Test, 75000 Paris",
        contactPerson: "Jean Test"
      },
      contractDetails: {
        contractNumber: "",
        contractType: "standard",
        paymentTerms: "30 jours",
        deliveryZone: "Local"
      },
      performance: {
        rating: 0,
        onTimeDeliveryRate: 0,
        qualityScore: 0
      },
      status: "pending",
      notes: "En cours d'évaluation",
      createdAt: "2024-01-16"
    },
    {
      id: 5,
      name: "Ancien Fournisseur Suspendu",
      category: "Produits surgelés",
      contact: {
        email: "ancien@suspendu.fr",
        phone: "01 99 88 77 66",
        address: "456 Avenue Fermée, 69000 Lyon",
        contactPerson: "Paul Suspendu"
      },
      contractDetails: {
        contractNumber: "OLD-2023-005",
        contractType: "standard",
        paymentTerms: "60 jours",
        deliveryZone: "Rhône-Alpes"
      },
      performance: {
        rating: 2.1,
        onTimeDeliveryRate: 45,
        qualityScore: 2.5,
        lastDelivery: "2023-11-20"
      },
      status: "suspended",
      notes: "Suspendu pour non-respect des délais",
      createdAt: "2023-05-01"
    }
  ]);

  const categories = ["all", "Grossiste alimentaire", "Distribution alimentaire", "Fruits et légumes", "Produits surgelés", "Épicerie fine", "Viandes", "Poissonnerie", "Boulangerie"];
  const statuses = ["all", "active", "inactive", "pending", "suspended"];

  // Fonction pour ajouter un nouveau fournisseur
  const handleSupplierCreated = (newSupplierData: any) => {
    const newSupplier: Supplier = {
      id: Date.now(),
      ...newSupplierData,
      performance: {
        rating: 0,
        onTimeDeliveryRate: 0,
        qualityScore: 0
      },
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setSuppliers(prev => [newSupplier, ...prev]);
    toast.success(`Fournisseur "${newSupplierData.name}" ajouté avec succès !`);
  };

  // Fonction pour éditer un fournisseur
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  // Fonction pour mettre à jour un fournisseur
  const handleSupplierUpdated = (updatedSupplier: Supplier) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
    toast.success(`Fournisseur "${updatedSupplier.name}" modifié avec succès !`);
  };

  // Fonction pour initier la suppression d'un fournisseur
  const handleDeleteSupplier = (supplierId: number) => {
    setSupplierToDelete(supplierId);
    setShowDeleteDialog(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteSupplier = () => {
    if (supplierToDelete) {
      const supplier = suppliers.find(s => s.id === supplierToDelete);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierToDelete));
      toast.success(`Fournisseur "${supplier?.name}" supprimé avec succès !`);
      setSupplierToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || supplier.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case "standard": return "bg-blue-100 text-blue-700";
      case "premium": return "bg-purple-100 text-purple-700";
      case "exclusive": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getContractTypeText = (type: string) => {
    switch (type) {
      case "standard": return "Standard";
      case "premium": return "Premium";
      case "exclusive": return "Exclusif";
      default: return "Standard";
    }
  };

  const getPerformanceStats = () => {
    const activeSuppliers = suppliers.filter(s => s.status === "active");
    const avgRating = activeSuppliers.reduce((sum, s) => sum + s.performance.rating, 0) / activeSuppliers.length || 0;
    const avgOnTime = activeSuppliers.reduce((sum, s) => sum + s.performance.onTimeDeliveryRate, 0) / activeSuppliers.length || 0;
    
    return {
      total: suppliers.length,
      active: activeSuppliers.length,
      avgRating: avgRating.toFixed(1),
      avgOnTime: avgOnTime.toFixed(0)
    };
  };

  const stats = getPerformanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des fournisseurs</h1>
            <p className="text-gray-600">Gérez vos relations fournisseurs et partenaires</p>
          </div>
        </div>
        <Button 
          className="bg-[#b70f23] hover:bg-[#70070e]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau fournisseur
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un fournisseur..."
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
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous statuts</option>
                {statuses.slice(1).map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
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
                <p className="text-sm text-gray-600">Total fournisseurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fournisseurs actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}/5</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livraisons à temps</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgOnTime}%</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-600">{supplier.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getContractTypeColor(supplier.contractDetails.contractType)}>
                          {getContractTypeText(supplier.contractDetails.contractType)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{supplier.contact.email}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-900">{supplier.contact.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">Note: {supplier.performance.rating}/5</p>
                        <p className="text-sm text-gray-900">Ponctualité: {supplier.performance.onTimeDeliveryRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paiement</p>
                      <p className="text-sm text-gray-900">{supplier.contractDetails.paymentTerms}</p>
                      <p className="text-xs text-gray-500">Zone: {supplier.contractDetails.deliveryZone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <Badge className={getStatusColor(supplier.status)}>
                        {getStatusText(supplier.status)}
                      </Badge>
                      {supplier.performance.lastDelivery && (
                        <p className="text-xs text-gray-500 mt-1">
                          Dernière livraison: {new Date(supplier.performance.lastDelivery).toLocaleDateString('fr-FR')}
                        </p>
                      )}
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
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Contact Person & Address */}
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Contact principal</p>
                      <p className="text-sm text-gray-900">{supplier.contact.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Adresse</p>
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-900">{supplier.contact.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {supplier.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{supplier.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modale de création de fournisseur */}
      <CreateSupplierModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSupplierCreated={handleSupplierCreated}
      />

      {/* Modale d'édition de fournisseur */}
      <EditSupplierModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        supplier={selectedSupplier}
        onSupplierUpdated={handleSupplierUpdated}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSupplier}
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