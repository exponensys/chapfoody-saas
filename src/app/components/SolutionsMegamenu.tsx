import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Store, Wine, Utensils, Truck, ShoppingBag, Apple, Coffee, Building2 } from "lucide-react";

interface SolutionsMegamenuProps {
  onSolutionSelect?: (solutionType: string) => void;
}

export function SolutionsMegamenu({ onSolutionSelect }: SolutionsMegamenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const solutionCategories = [
    {
      id: "restaurants-fastfood",
      title: "Restaurants / Fast-food",
      description: "Solutions pour restauration rapide et traditionnelle",
      icon: Utensils,
      color: "from-[#b70f23] to-[#70070e]"
    },
    {
      id: "bars-maquis",
      title: "Bars / Maquis",
      description: "Gestion pour établissements de boisson et snacking",
      icon: Wine,
      color: "from-[#f4b71b] to-[#e09900]"
    },
    {
      id: "metiers-bouche",
      title: "Métiers de bouche",
      description: "Pâtisseries, boucheries, poissonneries, charcuteries",
      icon: Store,
      color: "from-[#b70f23] to-[#f4b71b]"
    },
    {
      id: "producteurs-fournisseurs",
      title: "Producteurs / Fournisseurs",
      description: "Solutions pour producteurs et agroalimentaires",
      icon: Truck,
      color: "from-[#70070e] to-[#b70f23]"
    },
    {
      id: "boutiques-superettes",
      title: "Boutiques / Superettes",
      description: "Gestion pour commerces de proximité",
      icon: ShoppingBag,
      color: "from-[#f4b71b] to-[#70070e]"
    },
    {
      id: "epiceries",
      title: "Épiceries",
      description: "Solutions spécialisées pour épiceries",
      icon: Store,
      color: "from-[#b70f23] to-[#f4b71b]"
    },
    {
      id: "fruiteries",
      title: "Fruiteries",
      description: "Gestion optimisée pour commerces de fruits et légumes",
      icon: Apple,
      color: "from-[#70070e] to-[#f4b71b]"
    },
    {
      id: "catering",
      title: "Catering",
      description: "Services traiteur, repas bureau et événementiel",
      icon: Building2,
      color: "from-[#f4b71b] to-[#b70f23]"
    }
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-2 text-gray-600 hover:text-[#b70f23] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        <Store className="w-4 h-4" />
        Solutions
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-[900px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
          >
            {/* Bande colorée dégradée CHAPFOODY */}
            <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e] rounded-t-2xl mb-6"></div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nos solutions par secteur</h3>
              <p className="text-gray-600">Découvrez les fonctionnalités adaptées à votre métier</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {solutionCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      onSolutionSelect?.(category.id);
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group p-4 rounded-xl border border-gray-100 hover:border-[#f4b71b] hover:shadow-lg transition-all duration-200 text-left bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#b70f23] transition-colors">
                      {category.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Besoin d'aide pour choisir ?</p>
                  <p className="text-xs text-gray-600">Nos experts vous accompagnent dans votre choix</p>
                </div>
                <button className="bg-[#b70f23] hover:bg-[#70070e] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Nous contacter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}