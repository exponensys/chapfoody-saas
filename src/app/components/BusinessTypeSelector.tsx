import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { solutionsData } from "../data/solutionsData";

interface BusinessTypeSelectorProps {
  onSelect: (businessType: string, subCategory?: string) => void;
  onBack?: () => void;
}

export function BusinessTypeSelector({ onSelect, onBack }: BusinessTypeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Organisation des catégories principales
  const mainCategories = [
    {
      id: "restauration",
      title: "Restauration",
      description: "Restaurants, bars, fast-food, maquis",
      color: "from-[#b70f23] to-[#70070e]",
      icon: "🍽️",
      subCategories: ["restaurants-fastfood", "bars-maquis"]
    },
    {
      id: "commerce",
      title: "Commerce alimentaire", 
      description: "Épiceries, superettes, boutiques",
      color: "from-[#f4b71b] to-[#e09900]",
      icon: "🛒",
      subCategories: ["epiceries", "boutiques-superettes", "fruiteries"]
    },
    {
      id: "artisans",
      title: "Métiers de bouche",
      description: "Boulangeries, boucheries, pâtisseries",
      color: "from-[#70070e] to-[#b70f23]", 
      icon: "👨‍🍳",
      subCategories: ["metiers-bouche"]
    },
    {
      id: "producteurs",
      title: "Production & Distribution",
      description: "Producteurs, fournisseurs, catering",
      color: "from-[#b70f23] to-[#f4b71b]",
      icon: "🚚",
      subCategories: ["producteurs-fournisseurs", "catering"]
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    const category = mainCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    if (category.subCategories.length === 1) {
      // Sélection directe si une seule sous-catégorie
      onSelect("business", category.subCategories[0]);
    } else {
      // Afficher les sous-catégories
      setSelectedCategory(categoryId);
    }
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    onSelect("business", subCategoryId);
  };

  if (selectedCategory) {
    const category = mainCategories.find(cat => cat.id === selectedCategory);
    if (!category) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Retour */}
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory(null)}
            className="mb-8 flex items-center gap-2"
          >
            ← Retour aux catégories
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez votre spécialité en {category.title.toLowerCase()}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sélectionnez le type qui correspond le mieux à votre activité pour une expérience personnalisée.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.subCategories.map((subCategoryId, index) => {
              const solution = solutionsData[subCategoryId];
              if (!solution) return null;

              return (
                <motion.div
                  key={subCategoryId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer group"
                        onClick={() => handleSubCategorySelect(subCategoryId)}>
                    <div className={`h-3 bg-gradient-to-r ${solution.color}`}></div>
                    
                    <CardHeader className="text-center pb-4 pt-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <solution.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <CardTitle className="text-lg font-bold mb-2">{solution.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">
                        {solution.subtitle}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {solution.features.slice(0, 4).map((feature, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary" 
                            className="text-xs w-full justify-center py-1.5 px-2 rounded-lg bg-gray-100"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <motion.div className="flex items-center justify-center text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        <span className="mr-2">Accéder au dashboard spécialisé</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-8 flex items-center gap-2"
          >
            ← Retour
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Quel est votre 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
              {" "}secteur d'activité{" "}
            </span>
            ?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sélectionnez votre domaine pour accéder à des fonctionnalités adaptées à vos besoins métier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mainCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer group"
                    onClick={() => handleCategorySelect(category.id)}>
                <div className={`h-4 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                
                <CardHeader className="text-center pb-4 pt-8">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10"></div>
                    <div className="relative z-10 text-white text-3xl">
                      {category.icon}
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-xl font-bold mb-3">{category.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600 px-4">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 px-6 pb-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.subCategories.map((subId) => {
                      const solution = solutionsData[subId];
                      return solution ? (
                        <Badge 
                          key={subId}
                          variant="secondary" 
                          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          {solution.title}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full bg-gradient-to-br ${category.color} text-white hover:opacity-90 transition-all duration-200 rounded-xl py-4 font-medium shadow-lg group`}
                    >
                      <span className="mr-2">Explorer cette catégorie</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Section informative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Un seul dashboard, toutes vos fonctionnalités
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chaque secteur bénéficie d'une interface personnalisée avec les modules spécifiques à votre métier, 
              tout en gardant l'avantage d'un écosystème unifié CHAPFOODY.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge className="bg-[#b70f23] text-white px-4 py-2">Interface adaptée</Badge>
              <Badge className="bg-[#f4b71b] text-white px-4 py-2">Modules métier</Badge>
              <Badge className="bg-[#70070e] text-white px-4 py-2">Écosystème unifié</Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}