import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { 
  ArrowLeft, 
  Store, 
  Truck, 
  Building2, 
  TrendingUp,
  Check,
  Star,
  ChevronRight,
  BarChart3,
  Smartphone,
  Package,
  Target,
  Shield,
  Zap,
  Euro,
  Clock,
  Users,
  ArrowRight
} from "lucide-react";

interface UserTypeDetailPageProps {
  userType: string;
  onBack: () => void;
  onSignup: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
}

export function UserTypeDetailPage({ userType, onBack, onSignup, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary }: UserTypeDetailPageProps) {
  const getUserTypeData = (type: string) => {
    const data = {
      restaurateur: {
        title: "Solutions pour Restaurateurs & Métiers de bouches",
        subtitle: "Transformez votre établissement en restaurant connecté",
        icon: Store,
        color: "from-[#b70f23] to-[#70070e]",
        iconBg: "bg-[#b70f23]",
        description: "CHAPFOODY offre une suite complète d'outils pour digitaliser votre restaurant, optimiser vos opérations et augmenter vos revenus. De la gestion des commandes au site e-commerce, tout est conçu pour simplifier votre quotidien.",
        features: [
          {
            title: "Menu Digital Intelligent",
            description: "Créez et gérez vos menus avec des photos, descriptions, prix et disponibilité en temps réel",
            icon: Package,
            benefits: ["Mise à jour instantanée", "Photos haute qualité", "Gestion des allergènes", "Prix dynamiques"]
          },
          {
            title: "Site E-commerce Automatisé",
            description: "Votre propre site de commande en ligne avec paiement intégré et gestion des livraisons",
            icon: Smartphone,
            benefits: ["Design responsive", "Paiement sécurisé", "Suivi des commandes", "Programmes de fidélité"]
          },
          {
            title: "Gestion des Stocks",
            description: "Suivez vos ingrédients, gérez les approvisionnements et réduisez le gaspillage",
            icon: BarChart3,
            benefits: ["Alertes de stock", "Prévisions de consommation", "Gestion des fournisseurs", "Analyse des coûts"]
          },
          {
            title: "Analytics Avancées",
            description: "Tableaux de bord complets pour analyser vos performances et optimiser votre activité",
            icon: Target,
            benefits: ["Rapports de ventes", "Analyse des tendances", "Performance des plats", "ROI marketing"]
          }
        ],
        pricing: {
          starter: { price: "29€", features: ["Menu digital basique", "50 commandes/mois", "Support email"] },
          pro: { price: "79€", features: ["Fonctionnalités complètes", "Commandes illimitées", "Site e-commerce", "Support prioritaire"] },
          enterprise: { price: "149€", features: ["Multi-établissements", "API complète", "Formation personnalisée", "Support 24/7"] }
        },
        testimonials: [
          {
            name: "Marie Dubois",
            role: "Propriétaire, Bistrot du Marché",
            content: "Nos commandes en ligne ont augmenté de 40% depuis l'installation de CHAPFOODY. L'interface est intuitive et le support client exceptionnel.",
            rating: 5,
            avatar: "M"
          },
          {
            name: "Jean-Claude Martin",
            role: "Chef propriétaire, La Table de Jean",
            content: "La gestion des stocks m'a fait économiser des heures de travail par semaine. Je recommande vivement cette solution.",
            rating: 5,
            avatar: "J"
          }
        ]
      },
      livreur: {
        title: "Solutions pour Livreurs Indépendants",
        subtitle: "Optimisez vos tournées et maximisez vos revenus",
        icon: Truck,
        color: "from-[#f4b71b] to-[#b70f23]",
        iconBg: "bg-[#f4b71b]",
        description: "Augmentez vos gains de 25% en moyenne avec nos outils d'optimisation GPS, de suivi des revenus et de gestion intelligente de vos courses. Interface simple et efficace pour les professionnels de la livraison.",
        features: [
          {
            title: "Optimisation GPS Intelligente",
            description: "Algorithme avancé pour calculer les meilleures routes et réduire vos temps de trajet",
            icon: Target,
            benefits: ["Routes optimisées", "Économie de carburant", "Plus de livraisons/heure", "Navigation en temps réel"]
          },
          {
            title: "Suivi des Revenus",
            description: "Tableau de bord complet pour analyser vos gains, commissions et performances",
            icon: BarChart3,
            benefits: ["Revenus en temps réel", "Historique détaillé", "Prévisions de gains", "Rapports fiscaux"]
          },
          {
            title: "Gestion des Courses",
            description: "Interface intuitive pour accepter, suivre et finaliser vos livraisons",
            icon: Package,
            benefits: ["Acceptation rapide", "Statut en temps réel", "Communication client", "Historique complet"]
          },
          {
            title: "Analytics Personnelles",
            description: "Statistiques détaillées pour améliorer vos performances et votre rentabilité",
            icon: Smartphone,
            benefits: ["Performance par zone", "Heures de pointe", "Satisfaction client", "Conseils d'optimisation"]
          }
        ],
        pricing: {
          starter: { price: "0€", features: ["Fonctionnalités de base", "30 jours d'historique", "Support communauté"] },
          pro: { price: "15€", features: ["GPS avancé", "Historique illimité", "Analytics", "Support email"] },
          enterprise: { price: "29€", features: ["Toutes fonctionnalités", "Prédictions IA", "Formation", "Support prioritaire"] }
        },
        testimonials: [
          {
            name: "Thomas Martin",
            role: "Livreur indépendant",
            content: "J'ai augmenté mes gains de 25% grâce à l'optimisation GPS. L'application est vraiment bien pensée pour nous, livreurs.",
            rating: 5,
            avatar: "T"
          },
          {
            name: "Sarah Dubois",
            role: "Livreuse freelance",
            content: "Le suivi des revenus m'aide énormément pour mes déclarations. Interface claire et données précises.",
            rating: 5,
            avatar: "S"
          }
        ]
      },
      entreprise: {
        title: "Solutions pour Entreprises de Livraison",
        subtitle: "Gérez votre flotte et optimisez vos opérations",
        icon: Building2,
        color: "from-[#70070e] to-[#b70f23]",
        iconBg: "bg-[#70070e]",
        description: "Réduisez vos coûts opérationnels de 30% avec notre plateforme de gestion d'équipes, d'optimisation logistique et d'analytics en temps réel. Conçue pour les entreprises de livraison modernes.",
        features: [
          {
            title: "Gestion d'Équipe",
            description: "Outils complets pour gérer vos livreurs, plannings et affectations",
            icon: Users,
            benefits: ["Planning intelligent", "Affectation automatique", "Suivi en temps réel", "Gestion des congés"]
          },
          {
            title: "Zones de Couverture",
            description: "Optimisez vos zones de livraison et analysez la rentabilité par secteur",
            icon: Target,
            benefits: ["Cartographie avancée", "Analyse de rentabilité", "Optimisation des zones", "Prévision de demande"]
          },
          {
            title: "Analytics Prédictives",
            description: "Intelligence artificielle pour anticiper la demande et optimiser les ressources",
            icon: BarChart3,
            benefits: ["Prévision de demande", "Optimisation des ressources", "KPIs en temps réel", "Rapports personnalisés"]
          },
          {
            title: "Intégrations Avancées",
            description: "API complète pour intégrer CHAPFOODY à vos systèmes existants",
            icon: Smartphone,
            benefits: ["API REST", "Webhooks", "Intégrations ERP", "Synchronisation en temps réel"]
          }
        ],
        pricing: {
          starter: { price: "49€", features: ["Jusqu'à 10 livreurs", "Rapports standards", "Support email"] },
          pro: { price: "99€", features: ["Jusqu'à 50 livreurs", "Analytics avancées", "Optimisation zones", "Support prioritaire"] },
          enterprise: { price: "199€", features: ["Livreurs illimités", "IA prédictive", "API complète", "Support 24/7"] }
        },
        testimonials: [
          {
            name: "Sophie Laurent",
            role: "Directrice Opérations, Express Delivery",
            content: "Nos coûts opérationnels ont diminué de 30% depuis l'implémentation. Les analytics nous permettent d'optimiser en continu.",
            rating: 5,
            avatar: "S"
          },
          {
            name: "Pierre Moreau",
            role: "CEO, Livraison Plus",
            content: "La gestion d'équipe n'a jamais été aussi simple. Nos livreurs sont plus efficaces et nos clients plus satisfaits.",
            rating: 5,
            avatar: "P"
          }
        ]
      },
      affilie: {
        title: "Programme d'Affiliation CHAPFOODY",
        subtitle: "Générez des revenus passifs dans la foodtech",
        icon: TrendingUp,
        color: "from-[#b70f23] to-[#f4b71b]",
        iconBg: "bg-[#b70f23]",
        description: "Rejoignez notre programme d'affiliation et gagnez jusqu'à 12% de commission sur chaque vente. Outils marketing avancés, formation complète et support dédié pour maximiser vos revenus.",
        features: [
          {
            title: "Commissions Attractives",
            description: "Jusqu'à 12% de commission récurrente sur tous les abonnements de vos filleuls",
            icon: Euro,
            benefits: ["5-12% de commission", "Revenus récurrents", "Paiements automatiques", "Pas de limite de gains"]
          },
          {
            title: "Outils Marketing",
            description: "Suite complète d'outils pour promouvoir CHAPFOODY efficacement",
            icon: Target,
            benefits: ["Liens personnalisés", "Banners créatives", "Landing pages", "Campagnes email"]
          },
          {
            title: "Analytics Détaillées",
            description: "Suivez vos performances, conversions et revenus en temps réel",
            icon: BarChart3,
            benefits: ["Tracking en temps réel", "Rapports détaillés", "Analyse de conversion", "Prévisions de revenus"]
          },
          {
            title: "Formation & Support",
            description: "Formation complète et support dédié pour optimiser vos campagnes",
            icon: Shield,
            benefits: ["Formation marketing", "Webinaires exclusifs", "Manager dédié", "Support prioritaire"]
          }
        ],
        pricing: {
          starter: { price: "0€", features: ["5% commission", "Outils de base", "Paiements mensuels"] },
          pro: { price: "49€", features: ["8% commission", "Outils avancés", "Formation", "Paiements bi-mensuels"] },
          enterprise: { price: "99€", features: ["12% commission", "Territories exclusifs", "Manager dédié", "Paiements hebdomadaires"] }
        },
        testimonials: [
          {
            name: "Jean-Pierre Moreau",
            role: "Affilié VIP",
            content: "J'ai généré plus de 3000€ le mois dernier avec CHAPFOODY. Le système de commission est transparent et les paiements automatiques.",
            rating: 5,
            avatar: "J"
          },
          {
            name: "Claire Dubois",
            role: "Influenceuse FoodTech",
            content: "Excellent programme d'affiliation avec de vrais outils pour promouvoir. Je le recommande à tous les marketeurs.",
            rating: 5,
            avatar: "C"
          }
        ]
      }
    };

    return data[type as keyof typeof data] || data.restaurateur;
  };

  const typeData = getUserTypeData(userType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onLogin={onSignup}
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        title="CHAPFOODY"
        subtitle="Solutions sur mesure"
      />
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className={`w-20 h-20 ${typeData.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
              <typeData.icon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {typeData.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {typeData.subtitle}
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {typeData.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités clés
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les outils conçus spécialement pour votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {typeData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#b70f23] rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-[#f4b71b] mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tarifs transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez la formule qui correspond à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(typeData.pricing).map(([plan, details], index) => (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${index === 1 ? 'border-2 border-[#b70f23] shadow-xl' : 'hover:shadow-lg'} transition-shadow`}>
                  {index === 1 && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#b70f23] text-white">
                      Populaire
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl capitalize">{plan}</CardTitle>
                    <div className="text-4xl font-bold text-[#b70f23] mb-2">
                      {details.price}
                      <span className="text-lg text-gray-600">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {details.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-[#f4b71b] mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={onSignup}
                      className={`w-full ${index === 1 ? 'bg-[#b70f23] hover:bg-[#70070e] text-white' : 'border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white'}`}
                      variant={index === 1 ? "default" : "outline"}
                    >
                      Commencer maintenant
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Témoignages clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos clients disent de CHAPFOODY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {typeData.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Prêt à transformer votre activité ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Rejoignez les milliers de professionnels qui font déjà confiance à CHAPFOODY 
              pour développer leur business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={onSignup}
                className="bg-[#f4b71b] hover:bg-[#f4b71b]/90 text-black text-lg px-8 py-3"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-[rgba(255,46,25,1)] hover:bg-white hover:text-[#b70f23] text-lg px-8 py-3"
              >
                Planifier une démo
                <Clock className="w-5 h-5 ml-2" />
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