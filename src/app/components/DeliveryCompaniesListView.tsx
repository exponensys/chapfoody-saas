import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  Users, 
  Truck,
  Plus,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

// Données mockées des entreprises de livraison partenaires
const deliveryCompanies = [
  {
    id: "uber-eats",
    name: "Uber Eats",
    logo: "🚗",
    status: "active",
    rating: 4.7,
    totalOrders: 1247,
    avgDeliveryTime: "28 min",
    coverage: "Toute la ville",
    phone: "+33 1 XX XX XX XX",
    email: "restaurant@ubereats.fr",
    activeDrivers: 45,
    lastDelivery: "Il y a 12 minutes",
    commission: "15%",
    specialties: ["Rapide", "Zone étendue", "Suivi temps réel"],
    description: "Leader mondial de la livraison de repas avec une couverture exceptionnelle.",
    contractStart: "15 Jan 2024",
    isPremium: true
  },
  {
    id: "deliveroo",
    name: "Deliveroo",
    logo: "🥘",
    status: "active",
    rating: 4.8,
    totalOrders: 892,
    avgDeliveryTime: "25 min",
    coverage: "Centre-ville + zones limitrophes",
    phone: "+33 1 YY YY YY YY",
    email: "partenaire@deliveroo.fr",
    activeDrivers: 32,
    lastDelivery: "Il y a 8 minutes",
    commission: "13%",
    specialties: ["Qualité premium", "Marketing avancé", "Support dédié"],
    description: "Plateforme premium focalisée sur la qualité et l'expérience client.",
    contractStart: "03 Mar 2024",
    isPremium: true
  },
  {
    id: "just-eat",
    name: "Just Eat",
    logo: "🍕",
    status: "pending",
    rating: 4.4,
    totalOrders: 0,
    avgDeliveryTime: "N/A",
    coverage: "À définir",
    phone: "+33 1 ZZ ZZ ZZ ZZ",
    email: "nouveau@justeat.fr",
    activeDrivers: 0,
    lastDelivery: "Aucune",
    commission: "12%",
    specialties: ["Commission réduite", "Flexibilité", "Support local"],
    description: "Nouveau partenariat en cours de validation.",
    contractStart: "En attente",
    isPremium: false
  },
  {
    id: "local-delivery",
    name: "Express Local",
    logo: "🚲",
    status: "active",
    rating: 4.2,
    totalOrders: 156,
    avgDeliveryTime: "35 min",
    coverage: "Hypercentre uniquement",
    phone: "+33 6 AA AA AA AA",
    email: "contact@expresslocal.fr",
    activeDrivers: 8,
    lastDelivery: "Il y a 45 minutes",
    commission: "8%",
    specialties: ["Écologique", "Commission faible", "Service local"],
    description: "Entreprise locale spécialisée en livraison écologique à vélo.",
    contractStart: "20 Juin 2024",
    isPremium: false
  }
];

// Données des entreprises disponibles pour partenariat
const availableCompanies = [
  {
    id: "glovo",
    name: "Glovo",
    logo: "🛵",
    description: "Plateforme multi-services avec livraison rapide et large couverture urbaine.",
    commission: "14%",
    coverage: "Métropoles françaises",
    averageRating: 4.5,
    estimatedOrders: "2000+ commandes/mois",
    specialties: ["Multi-services", "Livraison express", "Grande couverture"],
    isPartner: false
  },
  {
    id: "stuart",
    name: "Stuart",
    logo: "📦",
    description: "Spécialiste de la livraison B2B et dernière mile pour restaurants premium.",
    commission: "16%",
    coverage: "Paris et grandes villes",
    averageRating: 4.6,
    estimatedOrders: "800+ commandes/mois",
    specialties: ["B2B", "Premium", "Livraison programmée"],
    isPartner: false
  },
  {
    id: "frichti",
    name: "Frichti",
    logo: "🥗",
    description: "Plateforme spécialisée dans la livraison de repas frais et healthy.",
    commission: "18%",
    coverage: "Paris et banlieue",
    averageRating: 4.7,
    estimatedOrders: "500+ commandes/mois",
    specialties: ["Repas frais", "Healthy", "Cuisine maison"],
    isPartner: false
  },
  {
    id: "getir",
    name: "Getir",
    logo: "🛒",
    description: "Livraison ultra-rapide en moins de 10 minutes, idéal pour les commandes urgentes.",
    commission: "12%",
    coverage: "Paris centre",
    averageRating: 4.3,
    estimatedOrders: "1200+ commandes/mois",
    specialties: ["Ultra-rapide", "10 min", "Disponibilité 24/7"],
    isPartner: false
  },
  {
    id: "nestor",
    name: "Nestor",
    logo: "🚴",
    description: "Livraison écologique à vélo pour restaurants engagés dans le développement durable.",
    commission: "10%",
    coverage: "Centre-ville uniquement",
    averageRating: 4.4,
    estimatedOrders: "300+ commandes/mois",
    specialties: ["Écologique", "Local", "Vélo uniquement"],
    isPartner: false
  },
  {
    id: "foodles",
    name: "Foodles",
    logo: "🍽️",
    description: "Plateforme B2B spécialisée dans la restauration d'entreprise et les événements.",
    commission: "20%",
    coverage: "Zones d'affaires",
    averageRating: 4.8,
    estimatedOrders: "400+ commandes/mois",
    specialties: ["B2B", "Entreprises", "Événementiel"],
    isPartner: false
  }
];

interface DeliveryCompaniesListViewProps {
  onSelectCompany: (companyId: string) => void;
}

export function DeliveryCompaniesListView({ onSelectCompany }: DeliveryCompaniesListViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "pending">("all");
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);

  const filteredCompanies = deliveryCompanies.filter(company => {
    if (selectedFilter === "all") return true;
    return company.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAddPartner = (companyId: string) => {
    // Simuler l'ajout d'un partenaire
    console.log(`Demande de partenariat envoyée à ${companyId}`);
    setIsAddPartnerModalOpen(false);
    // Ici on pourrait ajouter une notification toast
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Entreprises de livraison partenaires</h2>
          <p className="text-gray-600 mt-1">Gérez vos partenariats de livraison et consultez leurs performances</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddPartnerModalOpen} onOpenChange={setIsAddPartnerModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau partenaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Ajouter un nouveau partenaire de livraison
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Sélectionnez une entreprise de livraison pour établir un nouveau partenariat
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 mt-4">
                {availableCompanies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                          {company.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{company.name}</h3>
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              Disponible
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {company.description}
                          </p>
                          
                          {/* Informations clés */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-xs">
                              <span className="text-gray-500">Commission:</span>
                              <div className="font-bold text-[#b70f23]">{company.commission}</div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Zone:</span>
                              <div className="font-medium">{company.coverage}</div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Note moy.:</span>
                              <div className="font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                {company.averageRating}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">Estimé:</span>
                              <div className="font-medium">{company.estimatedOrders}</div>
                            </div>
                          </div>
                          
                          {/* Spécialités */}
                          <div className="flex flex-wrap gap-1">
                            {company.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAddPartner(company.id)}
                        className="gap-2 bg-[#b70f23] hover:bg-[#70070e] text-white whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter comme partenaire
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  💡 Une fois la demande envoyée, vous recevrez une confirmation par email dans les 24-48h
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Paramètres généraux
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-blue-100" />
            <span className="text-sm text-blue-100">Total</span>
          </div>
          <div className="text-2xl font-bold">{deliveryCompanies.length}</div>
          <div className="text-xs text-blue-100">Partenaires</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-100" />
            <span className="text-sm text-green-100">Actifs</span>
          </div>
          <div className="text-2xl font-bold">{deliveryCompanies.filter(c => c.status === "active").length}</div>
          <div className="text-xs text-green-100">En service</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-5 h-5 text-purple-100" />
            <span className="text-sm text-purple-100">Commandes</span>
          </div>
          <div className="text-2xl font-bold">{deliveryCompanies.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
          <div className="text-xs text-purple-100">Total</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-orange-100" />
            <span className="text-sm text-orange-100">Livreurs</span>
          </div>
          <div className="text-2xl font-bold">{deliveryCompanies.reduce((sum, c) => sum + c.activeDrivers, 0)}</div>
          <div className="text-xs text-orange-100">Actifs</div>
        </motion.div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("all")}
        >
          Tous ({deliveryCompanies.length})
        </Button>
        <Button
          variant={selectedFilter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("active")}
        >
          Actifs ({deliveryCompanies.filter(c => c.status === "active").length})
        </Button>
        <Button
          variant={selectedFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("pending")}
        >
          En attente ({deliveryCompanies.filter(c => c.status === "pending").length})
        </Button>
      </div>

      {/* Liste des entreprises */}
      <div className="grid gap-6">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#b70f23]">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {company.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{company.name}</CardTitle>
                        <Badge className={`${getStatusColor(company.status)} gap-1`}>
                          {getStatusIcon(company.status)}
                          {company.status === "active" ? "Actif" : "En attente"}
                        </Badge>
                        {company.isPremium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{company.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectCompany(company.id)}
                      className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Métriques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{company.rating}</span>
                    </div>
                    <div className="text-xs text-gray-600">Note moyenne</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Truck className="w-4 h-4" />
                      <span className="font-bold">{company.totalOrders}</span>
                    </div>
                    <div className="text-xs text-gray-600">Commandes</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{company.avgDeliveryTime}</span>
                    </div>
                    <div className="text-xs text-gray-600">Temps moyen</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">{company.activeDrivers}</span>
                    </div>
                    <div className="text-xs text-gray-600">Livreurs</div>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Zone : </span>
                      <span className="font-medium">{company.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Email : </span>
                      <span className="font-medium">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Téléphone : </span>
                      <span className="font-medium">{company.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Dernière livraison : </span>
                      <span className="font-medium">{company.lastDelivery}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Commission : </span>
                      <span className="font-medium text-[#b70f23]">{company.commission}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Contrat depuis : </span>
                      <span className="font-medium">{company.contractStart}</span>
                    </div>
                  </div>
                </div>

                {/* Spécialités */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Spécialités :</div>
                  <div className="flex flex-wrap gap-2">
                    {company.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
          <p className="text-gray-500">Essayez de modifier les filtres ou ajoutez un nouveau partenaire.</p>
        </div>
      )}
    </div>
  );
}