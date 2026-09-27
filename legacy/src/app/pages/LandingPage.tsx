import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Logo } from "../components/Logo";
import { HeroMockupSVG } from "../components/HeroMockupSVG";
import {
  Store,
  Truck,
  Building2,
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Star,
  ArrowRight,
  Check,
  MapPin,
  Euro,
  Smartphone,
  BarChart3,
  Package,
  Target,
  Award,
  Zap,
  Shield,
  ChevronRight,
  Play,
  Calendar,
  User,
  Mail,
  Send,
  ExternalLink,
  Video,
  PlayCircle,
  Globe,
  ChevronDown,
  Menu,
  Phone,
  Info,
  Home,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Users2,
  Newspaper,
  BookOpen,
  FileText,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onGoToCaseStudies?: () => void;
  onGoToCaseStudyDetail?: (caseStudyId: string) => void;
  onGoToNews?: () => void;
  onGoToNewsDetail?: (newsId: string) => void;
  onGoToAdmin?: () => void;
  onGoToUserTypeDetail?: (userType: string) => void;
  onGoToVideoLibrary?: () => void;
  onGoToDashboard?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  onGoToSupport?: () => void;
  onGoToContact?: () => void;
  userSession?: any;
}

export function LandingPage({
  onLogin,
  onSignup,
  onGoToCaseStudies,
  onGoToCaseStudyDetail,
  onGoToNews,
  onGoToNewsDetail,
  onGoToAdmin,
  onGoToUserTypeDetail,
  onGoToVideoLibrary,
  onGoToDashboard,
  onSolutionSelect,
  onGoToSupport,
  onGoToContact,
  userSession,
}: LandingPageProps) {
  const userTypes = [
    {
      id: "restaurateur",
      icon: Store,
      title: "Restaurateurs & Métiers de bouches",
      description:
        "Solutions complètes pour restaurants, boulangeries, traiteurs...",
      features: [
        "Menu digital",
        "Gestion des commandes",
        "Suivi des stocks",
        "Mini-site e-commerce",
      ],
      color: "from-[#b70f23] to-[#70070e]",
      iconBg: "bg-[#b70f23]",
    },
    {
      id: "livreur",
      icon: Truck,
      title: "Livreurs indépendants",
      description:
        "Outils pour optimiser vos tournées et revenus",
      features: [
        "Gestion des courses",
        "Optimisation GPS",
        "Suivi des revenus",
        "Historique détaillé",
      ],
      color: "from-[#f4b71b] to-[#b70f23]",
      iconBg: "bg-[#f4b71b]",
    },
    {
      id: "entreprise",
      icon: Building2,
      title: "Entreprises de livraison",
      description:
        "Plateforme de gestion d'équipes et logistique",
      features: [
        "Gestion d'équipe",
        "Zones de couverture",
        "Rapports analytiques",
        "Performance",
      ],
      color: "from-[#70070e] to-[#b70f23]",
      iconBg: "bg-[#70070e]",
    },
    {
      id: "affilie",
      icon: TrendingUp,
      title: "Affiliés marketing",
      description:
        "Programme d'affiliation dans l'alimentation",
      features: [
        "Commissions attractives",
        "Campagnes ciblées",
        "Analytics avancées",
        "Paiements automatiques",
      ],
      color: "from-[#b70f23] to-[#f4b71b]",
      iconBg: "bg-[#b70f23]",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Interface Windows Phone",
      description:
        "Design innovant avec tuiles dynamiques et navigation intuitive",
    },
    {
      icon: BarChart3,
      title: "Analytics en temps réel",
      description:
        "Tableaux de bord complets avec données actualisées en direct",
    },
    {
      icon: Package,
      title: "Gestion des stocks",
      description:
        "Suivi intelligent des ingrédients et approvisionnements",
    },
    {
      icon: Target,
      title: "Marketing ciblé",
      description:
        "Outils de promotion et fidélisation client intégrés",
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description:
        "Protection des données avec chiffrement de niveau bancaire",
    },
    {
      icon: Smartphone,
      title: "Multi-plateforme",
      description:
        "Accessible sur desktop, tablette et mobile avec synchronisation",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Rapide et efficace",
      description:
        "Interface optimisée pour une utilisation quotidienne fluide",
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description:
        "Vos données sont protégées avec les derniers standards de sécurité",
    },
    {
      icon: Smartphone,
      title: "Responsive",
      description:
        "Fonctionne parfaitement sur tous vos appareils",
    },
    {
      icon: Award,
      title: "Professionnel",
      description:
        "Outils de niveau professionnel pour développer votre activité",
    },
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Propriétaire, Bistrot du Marché",
      avatar: "M",
      content:
        "CHAPFOODY a transformé la gestion de mon restaurant. Les commandes en ligne ont augmenté de 40% et je gagne un temps précieux sur la gestion des stocks.",
      rating: 5,
    },
    {
      name: "Thomas Martin",
      role: "Livreur indépendant",
      avatar: "T",
      content:
        "Grâce à l'optimisation GPS et au suivi des revenus, j'ai pu augmenter mes gains de 25%. L'interface est vraiment intuitive.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Directrice, Livraison Express",
      avatar: "S",
      content:
        "La gestion d'équipe n'a jamais été aussi simple. Les rapports analytics nous permettent d'optimiser nos zones de livraison en continu.",
      rating: 5,
    },
    {
      name: "Jean-Pierre Moreau",
      role: "Affilié marketing",
      avatar: "J",
      content:
        "Le système de commissions est transparent et les paiements automatiques. J'ai généré plus de 3000€ de revenus passifs le mois dernier.",
      rating: 5,
    },
  ];

  const pricingData = {
    restaurant: {
      title: "Restaurants & Métiers de bouches",
      plans: [
        {
          name: "Starter",
          price: "29€",
          period: "/mois",
          description: "Idéal pour débuter",
          features: [
            "Menu digital basique",
            "Gestion de 50 commandes/mois",
            "Suivi des stocks simple",
            "Support email",
            "Mini-site vitrine",
          ],
          popular: false,
        },
        {
          name: "Professional",
          price: "79€",
          period: "/mois",
          description: "Pour restaurants établis",
          features: [
            "Menu digital avancé",
            "Commandes illimitées",
            "Gestion des stocks complète",
            "Analytics détaillées",
            "Mini-site e-commerce",
            "Support prioritaire",
            "Intégrations tiers",
          ],
          popular: true,
        },
        {
          name: "Enterprise",
          price: "149€",
          period: "/mois",
          description: "Chaînes et franchises",
          features: [
            "Multi-établissements",
            "API complète",
            "Gestion centralisée",
            "Analytics avancées",
            "Formation personnalisée",
            "Support dédié 24/7",
            "Personnalisation complète",
          ],
          popular: false,
        },
      ],
    },
    delivery: {
      title: "Entreprises de livraison",
      plans: [
        {
          name: "Starter",
          price: "49€",
          period: "/mois",
          description: "Petites équipes",
          features: [
            "Gestion jusqu'à 10 livreurs",
            "Zones de livraison basiques",
            "Rapports standards",
            "Support email",
            "Planning simple",
          ],
          popular: false,
        },
        {
          name: "Professional",
          price: "99€",
          period: "/mois",
          description: "Équipes moyennes",
          features: [
            "Gestion jusqu'à 50 livreurs",
            "Optimisation des zones",
            "Analytics en temps réel",
            "Gestion des performances",
            "Planning avancé",
            "Support prioritaire",
            "Intégrations GPS",
          ],
          popular: true,
        },
        {
          name: "Enterprise",
          price: "199€",
          period: "/mois",
          description: "Grandes flottes",
          features: [
            "Livreurs illimités",
            "IA d'optimisation",
            "Analytics prédictives",
            "API complète",
            "Formation équipes",
            "Support 24/7",
            "Personnalisation totale",
          ],
          popular: false,
        },
      ],
    },
    courier: {
      title: "Livreurs indépendants",
      plans: [
        {
          name: "Gratuit",
          price: "0€",
          period: "/mois",
          description: "Découverte",
          features: [
            "Gestion basique des courses",
            "Suivi des revenus simple",
            "Historique 30 jours",
            "Support communauté",
          ],
          popular: false,
        },
        {
          name: "Pro",
          price: "15€",
          period: "/mois",
          description: "Livreurs actifs",
          features: [
            "Optimisation GPS avancée",
            "Suivi détaillé des revenus",
            "Historique illimité",
            "Analytics personnelles",
            "Notifications prioritaires",
            "Support email",
            "Exportation données",
          ],
          popular: true,
        },
        {
          name: "Expert",
          price: "29€",
          period: "/mois",
          description: "Professionnels confirmés",
          features: [
            "Toutes les fonctionnalités Pro",
            "Prédictions de revenus",
            "Formation business",
            "Support prioritaire",
            "Conseils personnalisés",
            "Accès beta features",
          ],
          popular: false,
        },
      ],
    },
    affiliate: {
      title: "Affiliés marketing",
      plans: [
        {
          name: "Découverte",
          price: "0€",
          period: "/mois",
          description: "Premiers pas",
          features: [
            "5% commission sur ventes",
            "Liens de parrainage basiques",
            "Statistiques simples",
            "Paiements mensuels",
            "Support email",
          ],
          popular: false,
        },
        {
          name: "Partenaire",
          price: "49€",
          period: "/mois",
          description: "Marketeurs confirmés",
          features: [
            "8% commission sur ventes",
            "Outils marketing avancés",
            "Analytics détaillées",
            "Campagnes personnalisées",
            "Paiements bi-mensuels",
            "Support prioritaire",
            "Formation marketing",
          ],
          popular: true,
        },
        {
          name: "VIP",
          price: "99€",
          period: "/mois",
          description: "Top performers",
          features: [
            "12% commission sur ventes",
            "Accès API complète",
            "Territories exclusifs",
            "Manager dédié",
            "Paiements hebdomadaires",
            "Formation personnalisée",
            "Événements exclusifs",
          ],
          popular: false,
        },
      ],
    },
  };

  const stats = [
    { value: "500+", label: "Professionnels partenaires" },
    { value: "1200+", label: "Utilisateurs actifs" },
    { value: "50K+", label: "Transactions par mois" },
    { value: "4.9/5", label: "Satisfaction client" },
  ];

  const blogPosts = [
    {
      title:
        "L'avenir de la livraison : IA et optimisation des tournées",
      excerpt:
        "Découvrez comment l'intelligence artificielle révolutionne la logistique de livraison et permet d'optimiser les tournées en temps réel.",
      author: "Sophie Moreau",
      date: "15 Jan 2025",
      readTime: "5 min",
      category: "Innovation",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400",
      featured: true,
    },
    {
      title: "10 conseils pour digitaliser votre restaurant",
      excerpt:
        "Guide pratique pour transformer votre établissement traditionnel en restaurant connecté et augmenter vos revenus.",
      author: "Pierre Dubois",
      date: "12 Jan 2025",
      readTime: "8 min",
      category: "Guide",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400",
      featured: false,
    },
    {
      title: "Marketing d'affiliation dans la foodtech",
      excerpt:
        "Comment maximiser vos revenus grâce aux programmes d'affiliation dans l'écosystème de la restauration numérique.",
      author: "Marie Laurent",
      date: "8 Jan 2025",
      readTime: "6 min",
      category: "Marketing",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
      featured: false,
    },
  ];

  const caseStudies = [
    {
      id: "bistrot-du-marche",
      title: "Bistrot du Marché",
      subtitle: "Restaurant traditionnel parisien",
      category: "Restaurant",
      description:
        "Comment un bistrot traditionnel a augmenté ses revenus de 140% en 6 mois grâce à CHAPFOODY.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
      results: [
        { metric: "+140%", label: "Revenus" },
        { metric: "+350", label: "Commandes/mois" },
        { metric: "4.8/5", label: "Satisfaction client" },
      ],
      featured: true,
    },
    {
      id: "express-delivery",
      title: "Express Delivery",
      subtitle: "Entreprise de livraison urbaine",
      category: "Livraison",
      description:
        "Optimisation de la logistique et réduction des coûts de 30% pour cette société de livraison.",
      image:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=400",
      results: [
        { metric: "-30%", label: "Coûts opérationnels" },
        { metric: "+25%", label: "Efficacité" },
        { metric: "1500+", label: "Livraisons/jour" },
      ],
      featured: false,
    },
    {
      id: "les-delices",
      title: "Les Délices",
      subtitle: "Chaîne de boulangeries artisanales",
      category: "Boulangerie",
      description:
        "Digitalisation complète de 12 points de vente avec harmonisation des processus.",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
      results: [
        { metric: "12", label: "Points de vente connectés" },
        { metric: "+85%", label: "Précommandes" },
        { metric: "-15%", label: "Gaspillage alimentaire" },
      ],
      featured: false,
    },
  ];

  // Navigation menu items
  const navigationItems = [
    { label: "Accueil", href: "#", icon: Home },
    {
      label: "Solutions",
      href: "#solutions",
      icon: Briefcase,
      hasDropdown: true,
    },
    {
      label: "Cas d'usage",
      href: "#case-studies",
      icon: Users2,
      onClick: onGoToCaseStudies,
    },
    {
      label: "Actualités",
      href: "#news",
      icon: Newspaper,
      onClick: onGoToNews,
    },
    {
      label: "Vidéothèque",
      href: "#videos",
      icon: Video,
      onClick: onGoToVideoLibrary,
    },
    { label: "Support", href: "#support", icon: HelpCircle },
    { label: "Contact", href: "#contact", icon: MessageSquare },
  ];

  // E-commerce examples
  const ecommerceExamples = [
    {
      title: "Bistrot du Coin",
      category: "Restaurant traditionnel",
      description:
        "Site e-commerce complet avec menu interactif et commande en ligne",
      image:
        "https://images.unsplash.com/photo-1679232329247-56ba5563b86a?auto=format&fit=crop&q=80&w=400",
      features: [
        "Menu interactif",
        "Réservation en ligne",
        "Commande à emporter",
        "Paiement sécurisé",
      ],
      revenue: "+180% de revenus",
    },
    {
      title: "La Boulangerie Moderne",
      category: "Boulangerie artisanale",
      description:
        "Plateforme de précommande avec slot de retrait optimisés",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
      features: [
        "Précommande",
        "Slot de retrait",
        "Fidélité digitale",
        "Stock en temps réel",
      ],
      revenue: "+95% de précommandes",
    },
    {
      title: "Pizza Express",
      category: "Livraison rapide",
      description:
        "Interface optimisée pour la livraison avec tracking en temps réel",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&q=80&w=400",
      features: [
        "Tracking live",
        "Estimation précise",
        "Menu personnalisable",
        "Promotions auto",
      ],
      revenue: "+220% de commandes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        onLogin={onLogin}
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews}
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToAdmin={onGoToAdmin}
        onGoToSignup={onSignup}
        onGoToDashboard={onGoToDashboard}
        onSolutionSelect={onSolutionSelect}
        onGoToSupport={onGoToSupport}
        onGoToHome={onLogin}
        onGoToContact={onGoToContact}
        userSession={userSession}
        showAdminButton={!!onGoToAdmin}
        title="CHAPFOODY"
        subtitle="Écosystème alimentaire"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
                🚀 Plateforme tout-en-un pour la livraison
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Révolutionnez votre
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                  {" "}
                  business{" "}
                </span>
                alimentaire
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                CHAPFOODY connecte tous les acteurs de la
                restauration et de l'alimentation dans un
                écosystème digital innovant et performant.
              </p>

              {/* Slogan */}
              <div className="mb-8">
                <p className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]">
                  Gérez. Vendez. Automatisez. Dépassez vos
                  limites.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                onClick={onSignup}
                className="bg-[#b70f23] hover:bg-[#70070e] text-white text-lg px-8 py-3"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white text-lg px-8 py-3"
              >
                Découvrir la demo
              </Button>
            </motion.div>

            {/* Hero Images */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              {/* Interface Mobile Showcase */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-3 mb-4">
                    <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
                      Dashboard Mobile
                    </Badge>
                    <Badge className="bg-[#b70f23]/10 text-[#b70f23] border-[#b70f23]/20">
                      Site E-commerce
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Interface Windows Phone & E-commerce Intégré
                  </h3>
                  <p className="text-gray-600">
                    Découvrez l'interface révolutionnaire avec
                    tuiles dynamiques et votre site de commande
                    automatisé
                  </p>
                </div>

                <div className="relative flex justify-center">
                  <HeroMockupSVG />
                </div>

                {/* Features highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#b70f23] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Responsive Design
                    </div>
                    <div className="text-xs text-gray-600">
                      Adapté à tous les écrans
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#f4b71b] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-5 h-5 text-black" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Temps Réel
                    </div>
                    <div className="text-xs text-gray-600">
                      Données actualisées en direct
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#70070e] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Sécurisé
                    </div>
                    <div className="text-xs text-gray-600">
                      Paiements protégés
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#b70f23] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Une solution pour chaque profil
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              De la restauration traditionnelle aux entreprises
              agroalimentaires, CHAPFOODY s'adapte à tous les
              métiers de l'alimentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >
                <Card
                  className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-[#f4b71b]"
                  onClick={() =>
                    onGoToUserTypeDetail &&
                    onGoToUserTypeDetail(type.id)
                  }
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${type.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {type.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm"
                        >
                          <Check className="w-4 h-4 text-[#f4b71b] mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <div className="flex items-center text-[#b70f23] text-sm font-medium group-hover:translate-x-1 transition-transform">
                        En savoir plus
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E-commerce Examples Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Exemples de sites e-commerce de restaurants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment nos clients ont transformé leur
              activité grâce aux mini-sites e-commerce
              automatisés de CHAPFOODY. Des résultats concrets
              et mesurables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ecommerceExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={example.image}
                    alt={example.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#f4b71b] text-black">
                      {example.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white">
                      {example.revenue}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b70f23] transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {example.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {example.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm"
                    >
                      <Check className="w-4 h-4 text-[#f4b71b] mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                >
                  Voir le site
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils innovants conçus pour optimiser chaque
              aspect de votre activité dans l'écosystème
              alimentaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-[#b70f23] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CHAPFOODY ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme conçue pour simplifier et optimiser
              votre activité dans l'écosystème de la
              restauration et de l'alimentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Découvrez CHAPFOODY en action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visionnez nos fonctionnalités en direct et
              comprenez comment CHAPFOODY révolutionne la
              gestion de votre activité alimentaire.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Video principale */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="relative bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-xl overflow-hidden aspect-video mb-4 group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-[#b70f23]" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 rounded-lg p-3">
                    <h3 className="text-white font-bold mb-1">
                      Interface Windows Phone - Vue d'ensemble
                    </h3>
                    <p className="text-white/90 text-sm">
                      Découvrez l'interface révolutionnaire
                      inspirée de Windows Phone
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#b70f23]" />
                  <span className="text-sm text-gray-600">
                    3:24 min
                  </span>
                </div>
                <Badge className="bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
                  Nouveauté
                </Badge>
              </div>
            </motion.div>

            {/* Miniatures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  title: "Gestion des commandes en temps réel",
                  duration: "2:45",
                  views: "1.2K",
                },
                {
                  title: "Configuration du menu digital",
                  duration: "4:12",
                  views: "856",
                },
                {
                  title: "Analytics et rapports détaillés",
                  duration: "3:28",
                  views: "1.5K",
                },
              ].map((video, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#b70f23]/5 to-[#f4b71b]/5 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="w-16 h-12 bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-[#b70f23] transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.views} vues</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-center">
            <Button
              onClick={onGoToVideoLibrary}
              className="bg-[#b70f23] hover:bg-[#70070e] text-white"
            >
              Voir toutes les vidéos
              <Video className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients qui ont
              transformé leur activité grâce à CHAPFOODY.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ),
                  )}
                </div>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Cas d'usage concrets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nos clients ont transformé leur
              activité avec des résultats mesurables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                onClick={() =>
                  onGoToCaseStudyDetail &&
                  onGoToCaseStudyDetail(study.id)
                }
                className="group cursor-pointer"
              >
                <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-[#f4b71b] text-black">
                      {study.category}
                    </Badge>
                    {study.featured && (
                      <Badge className="absolute top-3 right-3 bg-[#b70f23] text-white">
                        ⭐ Vedette
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b70f23] transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {study.subtitle}
                    </p>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                      {study.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-bold text-[#b70f23]">
                            {result.metric}
                          </div>
                          <div className="text-xs text-gray-600">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-[#b70f23] text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Lire l'étude complète
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={onGoToCaseStudies}
              variant="outline"
              size="lg"
              className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
            >
              Voir tous les cas d'usage
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Actualités & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Restez informé des dernières tendances et
              innovations dans l'écosystème alimentaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                onClick={() =>
                  onGoToNewsDetail &&
                  onGoToNewsDetail(`post-${index}`)
                }
                className="group cursor-pointer"
              >
                <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-[#f4b71b] text-black">
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Badge className="absolute top-3 right-3 bg-[#b70f23] text-white">
                        ⚡ Trending
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#b70f23] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {post.date}
                      </span>
                      <div className="flex items-center text-[#b70f23] text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Lire l'article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={onGoToNews}
              variant="outline"
              size="lg"
              className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
            >
              Voir toutes les actualités
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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
              Prêt à révolutionner votre activité alimentaire ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Rejoignez plus de 1200 professionnels qui font
              déjà confiance à CHAPFOODY pour développer leur
              business dans l'écosystème alimentaire.
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
                className="border-white text-white hover:bg-white hover:text-[#b70f23] text-lg px-8 py-3"
              >
                Planifier une démo
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}