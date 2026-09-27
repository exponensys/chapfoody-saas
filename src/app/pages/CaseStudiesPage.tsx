import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Building2,
  Store,
  Truck
} from "lucide-react";

interface CaseStudiesPageProps {
  onBack: () => void;
  onCaseStudyClick: (caseStudyId: string) => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToDashboard?: () => void;
  onGoToSupport?: () => void;
  onLogin?: () => void;
  onGoToHome?: () => void;
  onGoToSignup?: () => void;
  onGoToContact?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  userSession?: any;
}

export function CaseStudiesPage({ onBack, onCaseStudyClick, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary, onGoToDashboard, onGoToSupport, onLogin, onGoToHome, onGoToSignup, onGoToContact, onSolutionSelect, userSession }: CaseStudiesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const allCaseStudies = [
    {
      id: "bistrot-du-marche",
      title: "Bistrot du Marché",
      subtitle: "Restaurant traditionnel parisien",
      category: "Restaurant",
      sector: "restaurant",
      description: "Comment un bistrot traditionnel a augmenté ses revenus de 140% en 6 mois grâce à CHAPFOODY.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "+140%", label: "Revenus" },
        { metric: "+350", label: "Commandes/mois" },
        { metric: "4.8/5", label: "Satisfaction client" }
      ],
      featured: true,
      challenges: ["Faible visibilité en ligne", "Gestion manuelle des commandes", "Optimisation des stocks"],
      solutions: ["Menu digital interactif", "Système de commandes automatisé", "Analytics en temps réel"],
      duration: "6 mois"
    },
    {
      id: "express-delivery",
      title: "Express Delivery",
      subtitle: "Entreprise de livraison urbaine",
      category: "Livraison",
      sector: "delivery",
      description: "Optimisation de la logistique et réduction des coûts de 30% pour cette société de livraison.",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "-30%", label: "Coûts opérationnels" },
        { metric: "+25%", label: "Efficacité" },
        { metric: "1500+", label: "Livraisons/jour" }
      ],
      featured: false,
      challenges: ["Routes non optimisées", "Manque de visibilité temps réel", "Coûts élevés"],
      solutions: ["Optimisation GPS intelligente", "Suivi en temps réel", "Analytics prédictives"],
      duration: "4 mois"
    },
    {
      id: "les-delices",
      title: "Les Délices",
      subtitle: "Chaîne de boulangeries artisanales",
      category: "Boulangerie",
      sector: "restaurant",
      description: "Digitalisation complète de 12 points de vente avec harmonisation des processus.",
      image: "https://images.unsplash.com/photo-1509440159596-0249440159596?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "12", label: "Points de vente connectés" },
        { metric: "+85%", label: "Précommandes" },
        { metric: "-15%", label: "Gaspillage alimentaire" }
      ],
      featured: false,
      challenges: ["Gestion multi-sites complexe", "Stocks non synchronisés", "Processus hétérogènes"],
      solutions: ["Plateforme centralisée", "Synchronisation temps réel", "Standardisation des processus"],
      duration: "8 mois"
    },
    {
      id: "pizza-rapido",
      title: "Pizza Rapido",
      subtitle: "Chaîne de pizzerias",
      category: "Pizzeria",
      sector: "restaurant",
      description: "Transformation digitale complète d'une chaîne de 8 pizzerias avec amélioration des délais de livraison.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "-40%", label: "Temps de livraison" },
        { metric: "+200%", label: "Commandes en ligne" },
        { metric: "92%", label: "Satisfaction client" }
      ],
      featured: false,
      challenges: ["Délais de livraison longs", "Peu de commandes en ligne", "Coordination difficile"],
      solutions: ["Optimisation des cuisines", "App de commande intuitive", "Système de dispatch intelligent"],
      duration: "5 mois"
    },
    {
      id: "fresh-market",
      title: "Fresh Market",
      subtitle: "Marketplace alimentaire locale",
      category: "Marketplace",
      sector: "company",
      description: "Création d'une marketplace connectant 50+ producteurs locaux avec une croissance de 300%.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "50+", label: "Producteurs partenaires" },
        { metric: "+300%", label: "Croissance mensuelle" },
        { metric: "95%", label: "Taux de rétention" }
      ],
      featured: true,
      challenges: ["Connecter producteurs et consommateurs", "Logistique complexe", "Confiance des utilisateurs"],
      solutions: ["Plateforme multi-vendeurs", "Système logistique intégré", "Programme de fidélité"],
      duration: "12 mois"
    },
    {
      id: "speed-delivery",
      title: "Speed Delivery",
      subtitle: "Livreurs indépendants",
      category: "Coursiers",
      sector: "courier",
      description: "Optimisation des revenus de 150 livreurs indépendants grâce à l'IA prédictive.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600",
      results: [
        { metric: "+45%", label: "Revenus moyens" },
        { metric: "150", label: "Livreurs actifs" },
        { metric: "-25%", label: "Temps morts" }
      ],
      featured: false,
      challenges: ["Revenus irréguliers", "Temps morts importants", "Manque de visibilité"],
      solutions: ["IA prédictive de demande", "Optimisation des créneaux", "Dashboard personnel"],
      duration: "3 mois"
    }
  ];

  const categories = [
    { id: "all", label: "Tous les secteurs", icon: Building2 },
    { id: "restaurant", label: "Restaurants & Métiers de bouche", icon: Store },
    { id: "delivery", label: "Entreprises de livraison", icon: Building2 },
    { id: "courier", label: "Livreurs indépendants", icon: Truck },
    { id: "company", label: "Entreprises alimentaires", icon: Building2 }
  ];

  // Fonction de filtrage des cas d'études
  const filteredCaseStudies = allCaseStudies.filter(caseStudy => {
    const matchesSearch = searchQuery === "" || 
      caseStudy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStudy.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStudy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStudy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseStudy.challenges.some(challenge => challenge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      caseStudy.solutions.some(solution => solution.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || caseStudy.sector === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToDashboard={onGoToDashboard}
        onGoToSupport={onGoToSupport}
        onLogin={onLogin}
        onGoToHome={onGoToHome}
        onGoToSignup={onGoToSignup}
        onGoToContact={onGoToContact}
        onSolutionSelect={onSolutionSelect}
        userSession={userSession}
        title="CHAPFOODY"
        subtitle="Cas d'études"
      />
      
      {/* Back Button & Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un cas d'étude..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Cas d'études
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                {" "}& Success Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez comment nos clients transforment leurs activités et atteignent 
              leurs objectifs grâce aux solutions innovantes de CHAPFOODY.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { metric: "500+", label: "Clients satisfaits" },
                { metric: "+156%", label: "ROI moyen" },
                { metric: "98%", label: "Taux de satisfaction" },
                { metric: "24/7", label: "Support dédié" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#b70f23] mb-1">
                    {stat.metric}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 flex-shrink-0 mr-4">Filtrer par :</span>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={category.id === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 ${
                  category.id === selectedCategory
                    ? "bg-[#b70f23] hover:bg-[#70070e] text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message si aucun résultat */}
          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun cas d'étude trouvé</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres mots-clés.`
                  : "Aucun cas d'étude ne correspond aux critères sélectionnés."
                }
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
          
          {/* Grille des cas d'études */}
          {filteredCaseStudies.length > 0 && (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  {filteredCaseStudies.length} cas d'étude{filteredCaseStudies.length > 1 ? 's' : ''} trouvé{filteredCaseStudies.length > 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCaseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => onCaseStudyClick(caseStudy.id)}
                className="cursor-pointer group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={caseStudy.image} 
                      alt={caseStudy.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#f4b71b] text-black">
                        {caseStudy.category}
                      </Badge>
                    </div>
                    {caseStudy.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#b70f23] text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Vedette
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b70f23] transition-colors">
                      {caseStudy.title}
                    </h3>
                    
                    <p className="text-[#f4b71b] font-medium mb-3">
                      {caseStudy.subtitle}
                    </p>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {caseStudy.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {caseStudy.results.slice(0, 3).map((result, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-bold text-[#b70f23] mb-1">
                            {result.metric}
                          </div>
                          <div className="text-xs text-gray-600">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Durée: {caseStudy.duration}
                      </div>
                      
                      <div className="flex items-center text-[#b70f23] font-medium group-hover:translate-x-1 transition-transform">
                        Lire plus
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#b70f23] to-[#70070e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Prêt à écrire votre propre success story ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez les centaines d'entreprises qui transforment déjà leur activité avec CHAPFOODY.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#f4b71b] hover:bg-[#f4b71b]/90 text-black"
              >
                Demander une démo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#b70f23]"
              >
                Nous contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
      />
    </div>
  );
}