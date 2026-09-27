import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { 
  Users, 
  Plus, 
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Eye,
  User,
  Activity,
  Building2,
  UserCheck,
  Bike,
  Car,
  Euro
} from "lucide-react";

interface DeliveryDriver {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'busy' | 'suspended';
  vehicleType: 'bike' | 'scooter' | 'car' | 'van';
  licenseNumber?: string;
  address: string;
  rating: number;
  totalDeliveries: number;
  completionRate: number;
  averageDeliveryTime: number;
  lastActivity: string;
  joinedDate: string;
  type: 'company' | 'independent';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface AvailableDriver {
  id: string;
  name: string;
  avatar?: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'van';
  rating: number;
  totalDeliveries: number;
  completionRate: number;
  coverage: string;
  hourlyRate?: string;
  commission?: string;
  availability: string;
  specialties: string[];
  description: string;
  type: 'company' | 'independent';
  experience: string;
}

// Données des livreurs d'entreprise disponibles
const availableCompanyDrivers: AvailableDriver[] = [
  {
    id: "comp-1",
    name: "Thomas Leroy",
    vehicleType: "scooter",
    rating: 4.7,
    totalDeliveries: 850,
    completionRate: 96.2,
    coverage: "Secteurs 1-5",
    hourlyRate: "12€/h",
    availability: "Temps plein",
    specialties: ["Zone centre", "Livraison rapide", "Fiable"],
    description: "Livreur expérimenté de l'entreprise, spécialisé dans les livraisons en centre-ville.",
    type: "company",
    experience: "2 ans"
  },
  {
    id: "comp-2",
    name: "Nadia Benali",
    vehicleType: "bike",
    rating: 4.9,
    totalDeliveries: 1200,
    completionRate: 98.5,
    coverage: "Zones écologiques",
    hourlyRate: "11€/h",
    availability: "Temps plein",
    specialties: ["Écologique", "Zone piétonne", "Très rapide"],
    description: "Livreuse vélo experte des zones piétonnes et écologiques du centre-ville.",
    type: "company",
    experience: "3 ans"
  },
  {
    id: "comp-3",
    name: "Karim Ouali",
    vehicleType: "car",
    rating: 4.5,
    totalDeliveries: 650,
    completionRate: 94.8,
    coverage: "Banlieue proche",
    hourlyRate: "14€/h",
    availability: "Temps partiel",
    specialties: ["Banlieue", "Gros volumes", "Flexible"],
    description: "Livreur en voiture pour les zones de banlieue et les commandes importantes.",
    type: "company",
    experience: "1.5 ans"
  }
];

// Données des livreurs indépendants disponibles
const availableIndependentDrivers: AvailableDriver[] = [
  {
    id: "ind-1",
    name: "Alex Rodriguez",
    vehicleType: "scooter",
    rating: 4.8,
    totalDeliveries: 2100,
    completionRate: 97.3,
    coverage: "Toute la ville",
    commission: "8% par livraison",
    availability: "24/7 sur demande",
    specialties: ["Nuit", "Urgences", "Expérimenté"],
    description: "Livreur indépendant très expérimenté, disponible pour les livraisons urgentes et nocturnes.",
    type: "independent",
    experience: "5 ans"
  },
  {
    id: "ind-2",
    name: "Marine Dubois",
    vehicleType: "bike",
    rating: 4.6,
    totalDeliveries: 980,
    completionRate: 95.7,
    coverage: "Centre historique",
    commission: "10% par livraison",
    availability: "9h-18h",
    specialties: ["Centre historique", "Écologique", "Ponctuelle"],
    description: "Spécialisée dans la livraison écologique dans le centre historique de la ville.",
    type: "independent",
    experience: "2.5 ans"
  },
  {
    id: "ind-3",
    name: "David Chen",
    vehicleType: "van",
    rating: 4.4,
    totalDeliveries: 550,
    completionRate: 93.2,
    coverage: "Grande couronne",
    commission: "12% par livraison",
    availability: "Lun-Ven 8h-20h",
    specialties: ["Gros volumes", "Grande couronne", "B2B"],
    description: "Spécialisé dans les livraisons de gros volumes pour les entreprises en grande couronne.",
    type: "independent",
    experience: "4 ans"
  },
  {
    id: "ind-4",
    name: "Sarah Müller",
    vehicleType: "scooter",
    rating: 4.7,
    totalDeliveries: 1350,
    completionRate: 96.8,
    coverage: "Zones touristiques",
    commission: "9% par livraison",
    availability: "Week-ends + soirées",
    specialties: ["Tourisme", "Soirées", "Multilingue"],
    description: "Excellente pour les zones touristiques, parle plusieurs langues.",
    type: "independent",
    experience: "3 ans"
  }
];

export function DeliveryDriversListView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<number | null>(null);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);

  // Séparer les livreurs par type
  const [companyDrivers, setCompanyDrivers] = useState<DeliveryDriver[]>([
    {
      id: 1,
      name: "Marc Dubois",
      email: "marc.dubois@email.fr",
      phone: "06 12 34 56 78",
      avatar: "",
      status: "active",
      vehicleType: "scooter",
      licenseNumber: "AB-123-CD",
      address: "15 Rue de la Paix, 75001 Paris",
      rating: 4.8,
      totalDeliveries: 1247,
      completionRate: 96.5,
      averageDeliveryTime: 25,
      lastActivity: "2024-01-16T14:30:00",
      joinedDate: "2023-03-15",
      type: "company",
      currentLocation: {
        lat: 48.8566,
        lng: 2.3522,
        address: "Châtelet, Paris"
      }
    },
    {
      id: 2,
      name: "Sophie Martin",
      email: "sophie.martin@email.fr",
      phone: "06 98 76 54 32",
      avatar: "",
      status: "busy",
      vehicleType: "bike",
      address: "23 Avenue des Champs, 75008 Paris",
      rating: 4.9,
      totalDeliveries: 892,
      completionRate: 98.2,
      averageDeliveryTime: 22,
      lastActivity: "2024-01-16T15:45:00",
      joinedDate: "2023-06-20",
      type: "company",
      currentLocation: {
        lat: 48.8738,
        lng: 2.2950,
        address: "Arc de Triomphe, Paris"
      }
    }
  ]);

  const [independentDrivers, setIndependentDrivers] = useState<DeliveryDriver[]>([
    {
      id: 3,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@freelance.fr",
      phone: "06 45 67 89 12",
      avatar: "",
      status: "active",
      vehicleType: "car",
      licenseNumber: "EF-456-GH",
      address: "78 Boulevard Saint-Germain, 75006 Paris",
      rating: 4.6,
      totalDeliveries: 634,
      completionRate: 94.1,
      averageDeliveryTime: 30,
      lastActivity: "2024-01-16T13:20:00",
      joinedDate: "2023-09-10",
      type: "independent"
    },
    {
      id: 4,
      name: "Julie Lecomte",
      email: "julie.lecomte@indep.fr",
      phone: "06 33 22 11 00",
      avatar: "",
      status: "inactive",
      vehicleType: "scooter",
      licenseNumber: "IJ-789-KL",
      address: "42 Rue de Rivoli, 75004 Paris",
      rating: 4.7,
      totalDeliveries: 1089,
      completionRate: 95.8,
      averageDeliveryTime: 27,
      lastActivity: "2024-01-15T18:00:00",
      joinedDate: "2023-01-20",
      type: "independent"
    }
  ]);

  const allDrivers = [...companyDrivers, ...independentDrivers];

  const filteredCompanyDrivers = companyDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || driver.status === selectedStatus;
    const matchesVehicle = selectedVehicle === "all" || driver.vehicleType === selectedVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const filteredIndependentDrivers = independentDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || driver.status === selectedStatus;
    const matchesVehicle = selectedVehicle === "all" || driver.vehicleType === selectedVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "busy": return "bg-blue-100 text-blue-700";
      case "inactive": return "bg-gray-100 text-gray-700";
      case "suspended": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Disponible";
      case "busy": return "En livraison";
      case "inactive": return "Hors ligne";
      case "suspended": return "Suspendu";
      default: return "Inconnu";
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "bike": return <Bike className="w-4 h-4" />;
      case "scooter": return <Truck className="w-4 h-4" />;
      case "car": return <Car className="w-4 h-4" />;
      case "van": return <Truck className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  };

  const getVehicleText = (vehicleType: string) => {
    switch (vehicleType) {
      case "bike": return "Vélo";
      case "scooter": return "Scooter";
      case "car": return "Voiture";
      case "van": return "Camionnette";
      default: return "Inconnu";
    }
  };

  const handleDeleteDriver = (driverId: number) => {
    setDriverToDelete(driverId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDriver = () => {
    if (driverToDelete) {
      const companyDriver = companyDrivers.find(d => d.id === driverToDelete);
      const independentDriver = independentDrivers.find(d => d.id === driverToDelete);
      
      if (companyDriver) {
        setCompanyDrivers(prev => prev.filter(driver => driver.id !== driverToDelete));
        toast.success(`Livreur d'entreprise "${companyDriver.name}" supprimé avec succès !`);
      } else if (independentDriver) {
        setIndependentDrivers(prev => prev.filter(driver => driver.id !== driverToDelete));
        toast.success(`Livreur indépendant "${independentDriver.name}" supprimé avec succès !`);
      }
      
      setDriverToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleAddDriver = (driverId: string, type: 'company' | 'independent') => {
    const availableDrivers = type === 'company' ? availableCompanyDrivers : availableIndependentDrivers;
    const driver = availableDrivers.find(d => d.id === driverId);
    
    if (driver) {
      const newDriver: DeliveryDriver = {
        id: Date.now(), // Simple ID generation
        name: driver.name,
        email: `${driver.name.toLowerCase().replace(' ', '.')}@${type === 'company' ? 'entreprise.fr' : 'freelance.fr'}`,
        phone: `06 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
        avatar: driver.avatar,
        status: "active",
        vehicleType: driver.vehicleType,
        address: "Adresse à confirmer",
        rating: driver.rating,
        totalDeliveries: driver.totalDeliveries,
        completionRate: driver.completionRate,
        averageDeliveryTime: 25,
        lastActivity: new Date().toISOString(),
        joinedDate: new Date().toISOString().split('T')[0],
        type: type
      };

      if (type === 'company') {
        setCompanyDrivers(prev => [...prev, newDriver]);
      } else {
        setIndependentDrivers(prev => [...prev, newDriver]);
      }

      toast.success(`${type === 'company' ? 'Livreur d\'entreprise' : 'Livreur indépendant'} "${driver.name}" ajouté avec succès !`);
      setIsAddDriverModalOpen(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const getStats = () => {
    return {
      total: allDrivers.length,
      company: companyDrivers.length,
      independent: independentDrivers.length,
      active: allDrivers.filter(d => d.status === 'active').length,
      busy: allDrivers.filter(d => d.status === 'busy').length,
      avgRating: allDrivers.reduce((sum, d) => sum + d.rating, 0) / allDrivers.length
    };
  };

  const stats = getStats();

  const renderDriverCard = (driver: DeliveryDriver) => (
    <div key={driver.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={driver.avatar} />
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{driver.name}</h3>
              <Badge className={getStatusColor(driver.status)}>
                {getStatusText(driver.status)}
              </Badge>
              <div className="flex items-center gap-1 text-gray-600">
                {getVehicleIcon(driver.vehicleType)}
                <span className="text-sm">{getVehicleText(driver.vehicleType)}</span>
              </div>
              <Badge variant="outline" className={driver.type === 'company' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}>
                {driver.type === 'company' ? 'Entreprise' : 'Indépendant'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{driver.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{driver.phone}</span>
              </div>
              {driver.currentLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{driver.currentLocation.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {renderStars(driver.rating)}
            </div>
            <p className="text-sm text-gray-600">
              {driver.totalDeliveries} livraisons
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeleteDriver(driver.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Performance Stats */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-green-600">{driver.completionRate}%</p>
            <p className="text-xs text-gray-600">Taux de réussite</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">{driver.averageDeliveryTime} min</p>
            <p className="text-xs text-gray-600">Temps moyen</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-600">
              {new Date(driver.lastActivity).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-xs text-gray-600">Dernière activité</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#b70f23]" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestion des livreurs</h1>
            <p className="text-gray-600">Gérez vos équipes de livraison d'entreprise et partenaires indépendants</p>
          </div>
        </div>
        
        <Dialog open={isAddDriverModalOpen} onOpenChange={setIsAddDriverModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#b70f23] hover:bg-[#70070e] gap-2">
              <Plus className="w-4 h-4" />
              Ajouter livreur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Ajouter un nouveau livreur
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Choisissez un livreur d'entreprise ou un livreur indépendant à ajouter à votre équipe
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="company" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Livreurs d'entreprise
                </TabsTrigger>
                <TabsTrigger value="independent" className="gap-2">
                  <UserCheck className="w-4 h-4" />
                  Livreurs indépendants
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="company" className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  <p>Livreurs salariés de votre entreprise disponibles pour affectation</p>
                </div>
                {availableCompanyDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{driver.name}</h3>
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Entreprise
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {driver.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-xs">
                              <span className="text-gray-500">Véhicule:</span>
                              <div className="font-medium flex items-center gap-1">
                                {getVehicleIcon(driver.vehicleType)}
                                {getVehicleText(driver.vehicleType)}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Tarif:</span>
                              <div className="font-bold text-[#b70f23]">{driver.hourlyRate}</div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Note:</span>
                              <div className="font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                {driver.rating}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Livraisons:</span>
                              <div className="font-medium">{driver.totalDeliveries}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {driver.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAddDriver(driver.id, 'company')}
                        className="gap-2 bg-[#b70f23] hover:bg-[#70070e] text-white whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter à l'équipe
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="independent" className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  <p>Livreurs indépendants disponibles pour collaboration</p>
                </div>
                {availableIndependentDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{driver.name}</h3>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Indépendant
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {driver.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-xs">
                              <span className="text-gray-500">Véhicule:</span>
                              <div className="font-medium flex items-center gap-1">
                                {getVehicleIcon(driver.vehicleType)}
                                {getVehicleText(driver.vehicleType)}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Commission:</span>
                              <div className="font-bold text-[#b70f23]">{driver.commission}</div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Note:</span>
                              <div className="font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                {driver.rating}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Expérience:</span>
                              <div className="font-medium">{driver.experience}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {driver.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAddDriver(driver.id, 'independent')}
                        className="gap-2 bg-[#b70f23] hover:bg-[#70070e] text-white whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter comme partenaire
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                💡 Les livreurs ajoutés apparaîtront dans vos équipes et pourront commencer à recevoir des affectations
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un livreur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="active">Disponible</option>
                <option value="busy">En livraison</option>
                <option value="inactive">Hors ligne</option>
                <option value="suspended">Suspendu</option>
              </select>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tous véhicules</option>
                <option value="bike">Vélo</option>
                <option value="scooter">Scooter</option>
                <option value="car">Voiture</option>
                <option value="van">Camionnette</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entreprise</p>
                <p className="text-2xl font-bold text-blue-600">{stats.company}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indépendant</p>
                <p className="text-2xl font-bold text-green-600">{stats.independent}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
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
                <p className="text-sm text-gray-600">En livraison</p>
                <p className="text-2xl font-bold text-blue-600">{stats.busy}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moy.</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Drivers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <CardTitle>Livreurs d'entreprise ({companyDrivers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanyDrivers.map(renderDriverCard)}
            
            {filteredCompanyDrivers.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun livreur d'entreprise trouvé</h3>
                <p className="text-gray-500">Aucun livreur d'entreprise ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Independent Drivers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-green-600" />
            <CardTitle>Livreurs indépendants ({independentDrivers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIndependentDrivers.map(renderDriverCard)}
            
            {filteredIndependentDrivers.length === 0 && (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun livreur indépendant trouvé</h3>
                <p className="text-gray-500">Aucun livreur indépendant ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce livreur ? Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteDriver}
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