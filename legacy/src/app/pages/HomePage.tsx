import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { UserTypeCard } from "../components/UserTypeCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Store, Truck, Building2, TrendingUp, ArrowLeft } from "lucide-react";

interface HomePageProps {
  onUserTypeSelect: (userType: string) => void;
  onGoToSignup: (userType?: string) => void;
  onBack: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToDashboard?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  onGoToSupport?: () => void;
  onLogin?: () => void;
  onGoToHome?: () => void;
  onGoToContact?: () => void;
  userSession?: any;
}

export function HomePage({ onUserTypeSelect, onGoToSignup, onBack, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary, onGoToDashboard, onSolutionSelect, onGoToSupport, onLogin, onGoToHome, onGoToContact, userSession }: HomePageProps) {
  // Types d'utilisateurs simplifiés et regroupés
  const userTypes = [
    {
      id: "business",
      icon: Store,
      title: "Professionnels de l'alimentation",
      description: "Restaurants, commerces, artisans, producteurs - Tous métiers de l'écosystème alimentaire",
      features: ["Dashboard adapté", "Outils métier", "Gestion complète", "Écosystème unifié"],
      color: "from-[#b70f23] to-[#70070e]",
      isMain: true
    },
    {
      id: "delivery",
      icon: Truck,
      title: "Livreurs indépendants",
      description: "Optimisez vos livraisons et suivez vos revenus",
      features: ["Courses disponibles", "Navigation GPS", "Suivi des revenus", "Historique"],
      color: "from-[#f4b71b] to-[#b70f23]"
    },
    {
      id: "company",
      icon: Building2,
      title: "Entreprises de livraison",
      description: "Supervisez vos équipes et optimisez vos performances",
      features: ["Gestion d'équipe", "Zones de livraison", "Rapports", "Performance"],
      color: "from-[#70070e] to-[#b70f23]"
    },
    {
      id: "affiliate",
      icon: TrendingUp,
      title: "Affiliés marketing",
      description: "Suivez vos commissions et gérez vos campagnes",
      features: ["Commissions", "Campagnes", "Analytics", "Paiements"],
      color: "from-[#b70f23] to-[#f4b71b]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToSignup={onGoToSignup}
        onGoToDashboard={onGoToDashboard}
        onSolutionSelect={onSolutionSelect}
        onGoToSupport={onGoToSupport}
        onLogin={onLogin}
        onGoToHome={onGoToHome}
        onGoToContact={onGoToContact}
        userSession={userSession}
        title="CHAPFOODY"
        subtitle="Choisissez votre profil"
      />
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Bande colorée dégradée CHAPFOODY */}
        <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>
        
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Quel type d'utilisateur
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                {" "}êtes-vous{" "}
              </span>
              ?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sélectionnez votre profil pour accéder à une interface adaptée à vos besoins spécifiques.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Carte principale pour les professionnels */}
            {userTypes.filter(type => type.isMain).map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="max-w-4xl mx-auto"
              >
                <UserTypeCard
                  title={type.title}
                  description={type.description}
                  icon={type.icon}
                  color={type.color}
                  features={type.features}
                  onClick={() => onUserTypeSelect(type.id)}
                />
              </motion.div>
            ))}

            {/* Autres types d'utilisateurs en grille */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {userTypes.filter(type => !type.isMain).map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                >
                  <UserTypeCard
                    title={type.title}
                    description={type.description}
                    icon={type.icon}
                    color={type.color}
                    features={type.features}
                    onClick={() => onUserTypeSelect(type.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pas encore de compte ?
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre compte gratuitement et découvrez toutes les fonctionnalités de CHAPFOODY.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => onGoToSignup()}
                  className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                >
                  Créer un compte
                </Button>
                <Button variant="outline" className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white">
                  En savoir plus
                </Button>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </main>

      <Footer 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
      />
    </div>
  );
}