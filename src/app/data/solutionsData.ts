import { 
  Store, 
  Wine, 
  Utensils, 
  Truck, 
  ShoppingBag, 
  Apple, 
  Building2 
} from "lucide-react";

export interface SolutionData {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  benefits: Array<{ title: string; value: string }>;
  testimonials: Array<{ name: string; role: string; comment: string }>;
}

export interface SolutionsDataType {
  [key: string]: SolutionData;
}

export const solutionsData: SolutionsDataType = {
  "restaurants-fastfood": {
    title: "Restaurants & Fast-food",
    subtitle: "Solutions complètes pour la restauration rapide et traditionnelle",
    description: "Optimisez votre service, gérez vos commandes et développez votre clientèle avec notre écosystème dédié aux restaurants et fast-foods.",
    icon: Utensils,
    color: "from-[#b70f23] to-[#70070e]",
    features: [
      "Gestion des commandes en temps réel",
      "Menu digital interactif",
      "Caisse et paiements intégrés",
      "Gestion des stocks alimentaires",
      "Livraison et click & collect",
      "Programme de fidélité client",
      "Analyses et reporting avancés",
      "Interface avec les plateformes de livraison"
    ],
    benefits: [
      { title: "Réduction des temps d'attente", value: "40%" },
      { title: "Augmentation des ventes", value: "25%" },
      { title: "Économies sur les coûts", value: "30%" },
      { title: "Satisfaction client", value: "95%" }
    ],
    testimonials: [
      {
        name: "Marie Dubois",
        role: "Propriétaire, Burger Palace",
        comment: "CHAPFOODY a révolutionné notre service. Nos clients adorent commander depuis leur table!"
      },
      {
        name: "Ahmed Hassan",
        role: "Gérant, Fast Délice",
        comment: "L'intégration avec les plateformes de livraison nous a fait gagner un temps précieux."
      }
    ]
  },
  "bars-maquis": {
    title: "Bars & Maquis",
    subtitle: "Solutions adaptées aux établissements de boisson et snacking",
    description: "Gérez efficacement votre bar ou maquis avec des outils pensés pour l'ambiance conviviale et le service rapide.",
    icon: Wine,
    color: "from-[#f4b71b] to-[#e09900]",
    features: [
      "Gestion des boissons et cocktails",
      "Carte numérique interactive",
      "Gestion des événements et soirées",
      "Programme de fidélité",
      "Commandes à table",
      "Gestion des stocks de boissons",
      "Intégration musique et ambiance",
      "Réservations et privatisations"
    ],
    benefits: [
      { title: "Optimisation du service", value: "35%" },
      { title: "Gestion des stocks", value: "50%" },
      { title: "Fidélisation client", value: "45%" },
      { title: "Rentabilité", value: "28%" }
    ],
    testimonials: [
      {
        name: "Sylvie Martin",
        role: "Propriétaire, Le Tropical",
        comment: "Perfect pour gérer les soirées à thème et les commandes de groupe!"
      }
    ]
  },
  "metiers-bouche": {
    title: "Métiers de bouche",
    subtitle: "Pâtisseries, boucheries, poissonneries, charcuteries",
    description: "Solutions spécialisées pour les artisans de l'alimentation avec respect des normes sanitaires et traçabilité.",
    icon: Store,
    color: "from-[#b70f23] to-[#f4b71b]",
    features: [
      "Traçabilité des produits",
      "Gestion des dates de péremption",
      "Conformité sanitaire HACCP",
      "Commandes spécialisées",
      "Gestion des fournisseurs",
      "Étiquetage intelligent",
      "Vente en ligne spécialisée",
      "Gestion des allergènes"
    ],
    benefits: [
      { title: "Conformité réglementaire", value: "100%" },
      { title: "Réduction du gaspillage", value: "40%" },
      { title: "Traçabilité complète", value: "100%" },
      { title: "Efficacité opérationnelle", value: "35%" }
    ],
    testimonials: [
      {
        name: "Pierre Boulanger",
        role: "Artisan boulanger",
        comment: "La traçabilité CHAPFOODY nous aide énormément pour la conformité sanitaire."
      }
    ]
  },
  "producteurs-fournisseurs": {
    title: "Producteurs & Fournisseurs",
    subtitle: "Solutions pour producteurs et acteurs agroalimentaires",
    description: "Connectez-vous directement avec les restaurateurs et gérez vos distributions avec notre écosystème B2B.",
    icon: Truck,
    color: "from-[#70070e] to-[#b70f23]",
    features: [
      "Plateforme B2B dédiée",
      "Gestion des commandes en gros",
      "Logistique et distribution",
      "Catalogue produits détaillé",
      "Facturation automatisée",
      "Suivi des livraisons",
      "Analyse des marchés",
      "Certification qualité"
    ],
    benefits: [
      { title: "Nouveaux clients", value: "+60%" },
      { title: "Optimisation logistique", value: "45%" },
      { title: "Visibilité produits", value: "+80%" },
      { title: "Chiffre d'affaires", value: "+35%" }
    ],
    testimonials: [
      {
        name: "François Legrand",
        role: "Producteur bio",
        comment: "CHAPFOODY nous a ouvert de nouveaux marchés dans toute la région."
      }
    ]
  },
  "boutiques-superettes": {
    title: "Boutiques & Superettes",
    subtitle: "Solutions pour commerces de proximité",
    description: "Modernisez votre commerce de proximité avec des outils adaptés à la vente de détail alimentaire.",
    icon: ShoppingBag,
    color: "from-[#f4b71b] to-[#70070e]",
    features: [
      "Caisse enregistreuse moderne",
      "Gestion multi-rayons",
      "E-commerce local",
      "Programme de fidélité",
      "Gestion des promotions",
      "Inventaire automatisé",
      "Drive et click & collect",
      "Livraison à domicile"
    ],
    benefits: [
      { title: "Ventes en ligne", value: "+50%" },
      { title: "Fidélité client", value: "40%" },
      { title: "Gestion des stocks", value: "35%" },
      { title: "Marge bénéficiaire", value: "+20%" }
    ],
    testimonials: [
      {
        name: "Nathalie Petit",
        role: "Gérante, Épicerie du coin",
        comment: "Le click & collect a sauvé notre business pendant la pandémie!"
      }
    ]
  },
  "epiceries": {
    title: "Épiceries",
    subtitle: "Solutions spécialisées pour épiceries",
    description: "Gérez votre épicerie avec des fonctionnalités adaptées aux produits d'épicerie fine et de proximité.",
    icon: Store,
    color: "from-[#b70f23] to-[#f4b71b]",
    features: [
      "Catalogue épicerie fine",
      "Gestion des produits régionaux",
      "Commandes personnalisées",
      "Conseils et recommandations",
      "Vente de paniers thématiques",
      "Gestion des producteurs locaux",
      "Service traiteur léger",
      "Livraison de proximité"
    ],
    benefits: [
      { title: "Produits locaux", value: "+70%" },
      { title: "Panier moyen", value: "+30%" },
      { title: "Satisfaction client", value: "92%" },
      { title: "Croissance", value: "+25%" }
    ],
    testimonials: [
      {
        name: "Jean-Claude Moreau",
        role: "Épicier",
        comment: "Excellent pour mettre en valeur nos produits du terroir!"
      }
    ]
  },
  "fruiteries": {
    title: "Fruiteries",
    subtitle: "Solutions pour commerces de fruits et légumes",
    description: "Optimisez la gestion de vos produits frais avec des outils adaptés à la saisonnalité et à la fraîcheur.",
    icon: Apple,
    color: "from-[#70070e] to-[#f4b71b]",
    features: [
      "Gestion de la fraîcheur",
      "Calendrier de saisonnalité",
      "Prix variables journaliers",
      "Gestion des invendus",
      "Origine des produits",
      "Promotions anti-gaspillage",
      "Livraison express",
      "Paniers personnalisés"
    ],
    benefits: [
      { title: "Réduction gaspillage", value: "45%" },
      { title: "Rotation des stocks", value: "40%" },
      { title: "Qualité produits", value: "95%" },
      { title: "Rentabilité", value: "+22%" }
    ],
    testimonials: [
      {
        name: "Fatima Benali",
        role: "Primeur",
        comment: "La gestion de la fraîcheur nous aide à réduire les pertes considérablement."
      }
    ]
  },
  "catering": {
    title: "Catering",
    subtitle: "Services traiteur, repas bureau et événementiel",
    description: "Gérez vos prestations traiteur avec des outils professionnels pour l'événementiel et la restauration d'entreprise.",
    icon: Building2,
    color: "from-[#f4b71b] to-[#b70f23]",
    features: [
      "Planification d'événements",
      "Devis et facturation",
      "Gestion des menus",
      "Logistique événementielle",
      "Suivi client entreprise",
      "Gestion des équipes",
      "Matériel et services",
      "Récurrence des commandes"
    ],
    benefits: [
      { title: "Événements gérés", value: "+150%" },
      { title: "Satisfaction client", value: "98%" },
      { title: "Marge opérationnelle", value: "+40%" },
      { title: "Croissance annuelle", value: "+55%" }
    ],
    testimonials: [
      {
        name: "Michel Delacroix",
        role: "Traiteur événementiel",
        comment: "Indispensable pour gérer nos prestations d'entreprise et mariages!"
      }
    ]
  }
};