import { motion } from "motion/react";
import { Button } from "./ui/button";
import { 
  Utensils, 
  Wine, 
  Store, 
  ShoppingBag, 
  Apple, 
  Building2, 
  Truck,
  ChefHat,
  ArrowLeft
} from "lucide-react";

interface BusinessCategoryGridProps {
  onSelect: (businessType: string, subCategory: string) => void;
  onBack?: () => void;
}

export function BusinessCategoryGrid({ onSelect, onBack }: BusinessCategoryGridProps) {
  // Données des catégories avec notre charte graphique
  const categories = [
    {
      id: "restaurants-fastfood",
      label: "Restaurants & Fast-food",
      description: "Service rapide et traditionnel",
      icon: Utensils,
      color: "bg-gradient-to-br from-[#b70f23] to-[#70070e]",
      hoverColor: "hover:from-[#d41e39] hover:to-[#85081a]"
    },
    {
      id: "bars-maquis", 
      label: "Bars & Maquis",
      description: "Boissons et ambiance conviviale",
      icon: Wine,
      color: "bg-gradient-to-br from-[#f4b71b] to-[#e09900]", 
      hoverColor: "hover:from-[#f6c441] hover:to-[#eca810]"
    },
    {
      id: "metiers-bouche",
      label: "Métiers de bouche",
      description: "Artisans de l'alimentation",
      icon: ChefHat,
      color: "bg-gradient-to-br from-[#70070e] to-[#b70f23]",
      hoverColor: "hover:from-[#85081a] hover:to-[#d41e39]"
    },
    {
      id: "epiceries",
      label: "Épiceries",
      description: "Commerce alimentaire de proximité", 
      icon: Store,
      color: "bg-gradient-to-br from-[#b70f23] to-[#f4b71b]",
      hoverColor: "hover:from-[#d41e39] hover:to-[#f6c441]"
    },
    {
      id: "boutiques",
      label: "Boutiques",
      description: "Commerce spécialisé",
      icon: ShoppingBag,
      color: "bg-gradient-to-br from-[#70070e] to-[#f4b71b]",
      hoverColor: "hover:from-[#85081a] hover:to-[#f6c441]"
    },
    {
      id: "fruiteries", 
      label: "Fruiteries",
      description: "Fruits et légumes frais",
      icon: Apple,
      color: "bg-gradient-to-br from-[#f4b71b] to-[#70070e]",
      hoverColor: "hover:from-[#f6c441] hover:to-[#85081a]"
    },
    {
      id: "producteurs-fournisseurs",
      label: "Producteurs",
      description: "Production et distribution", 
      icon: Truck,
      color: "bg-gradient-to-br from-[#70070e] to-[#b70f23]",
      hoverColor: "hover:from-[#85081a] hover:to-[#d41e39]"
    },
    {
      id: "catering",
      label: "Catering",
      description: "Services traiteur événementiel",
      icon: Building2,
      color: "bg-gradient-to-br from-[#f4b71b] to-[#b70f23]",
      hoverColor: "hover:from-[#f6c441] hover:to-[#d41e39]"
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    onSelect("business", categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Bouton retour */}
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-8 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        )}

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Découvrez comment{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4b71b] to-[#b70f23]">
              CHAPFOODY
            </span>
            {" "}peut faire évoluer votre entreprise.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Quel type de commerce exploitez-vous ?
          </p>
        </motion.div>

        {/* Grille de catégories */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleCategorySelect(category.id)}
                className={`
                  relative h-32 md:h-40 w-full p-4 rounded-2xl border-0 text-white 
                  ${category.color} ${category.hoverColor}
                  transition-all duration-300 shadow-lg hover:shadow-2xl
                  flex flex-col items-center justify-center gap-2 md:gap-3
                  group overflow-hidden
                `}
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icône */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10"
                >
                  <category.icon className="w-8 h-8 md:w-10 md:h-10" />
                </motion.div>
                
                {/* Texte */}
                <div className="relative z-10 text-center">
                  <div className="font-semibold text-sm md:text-base leading-tight mb-1">
                    {category.label}
                  </div>
                  <div className="text-xs md:text-sm text-white/80 leading-tight">
                    {category.description}
                  </div>
                </div>

                {/* Effet de particules au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-white/50 rounded-full animate-pulse" />
                  <div className="absolute top-4 right-3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-150" />
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-300" />
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Section informative en bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 md:p-8 max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Interface personnalisée pour chaque métier
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Accédez directement aux fonctionnalités adaptées à votre secteur d'activité 
              avec des modules spécialisés et une interface optimisée.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="px-4 py-2 bg-[#b70f23]/20 text-[#f4b71b] rounded-full text-sm border border-[#b70f23]/30">
                ✨ Modules métier spécialisés
              </div>
              <div className="px-4 py-2 bg-[#f4b71b]/20 text-[#b70f23] rounded-full text-sm border border-[#f4b71b]/30">
                🎯 Interface adaptée
              </div>
              <div className="px-4 py-2 bg-[#70070e]/20 text-white rounded-full text-sm border border-[#70070e]/30">
                🔗 Écosystème unifié
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}