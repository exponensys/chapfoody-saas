import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { UserSession } from "../routes";
import { solutionsData } from "../data/solutionsData";
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Play,
  Download,
  MessageSquare
} from "lucide-react";

interface SolutionDetailPageProps {
  solutionType: string;
  onBackToHome: () => void;
  onGoToSignup: () => void;
  onGoToCaseStudies: () => void;
  onGoToNews: () => void;
  onGoToVideoLibrary: () => void;
  onLogin: () => void;
  onGoToDashboard: () => void;
  onGoToSupport?: () => void;
  userSession: UserSession | null;
}

export function SolutionDetailPage({
  solutionType,
  onBackToHome,
  onGoToSignup,
  onGoToCaseStudies,
  onGoToNews,
  onGoToVideoLibrary,
  onLogin,
  onGoToDashboard,
  onGoToSupport,
  userSession
}: SolutionDetailPageProps) {
  
  const currentSolution = solutionsData[solutionType];
  
  if (!currentSolution) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onLogin={onLogin}
          onGoToDashboard={onGoToDashboard}
          userSession={userSession}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Solution non trouvée</h1>
            <Button onClick={onBackToHome}>Retour à l'accueil</Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = currentSolution.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLogin={onLogin}
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews}
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToDashboard={onGoToDashboard}
        onGoToSignup={onGoToSignup}
        onGoToSupport={onGoToSupport}
        userSession={userSession}
      />
      
      <main className="relative">
        {/* Bande colorée dégradée CHAPFOODY */}
        <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>
        
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bouton retour */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                onClick={onBackToHome}
                className="text-gray-600 hover:text-[#b70f23]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux solutions
              </Button>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${currentSolution.color} flex items-center justify-center mx-auto mb-6`}>
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {currentSolution.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                {currentSolution.subtitle}
              </p>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8">
                {currentSolution.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onGoToSignup}
                  className="bg-[#b70f23] hover:bg-[#70070e] text-white px-8 py-3"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Commencer gratuitement
                </Button>
                <Button variant="outline" className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white px-8 py-3">
                  <Play className="w-4 h-4 mr-2" />
                  Voir la démo
                </Button>
              </div>
            </motion.div>

            {/* Fonctionnalités */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Fonctionnalités clés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentSolution.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#b70f23] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium">{feature}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bénéfices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Résultats mesurables
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentSolution.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <Card className="border-2 border-gray-100 hover:border-[#f4b71b] transition-colors">
                      <CardContent className="p-6">
                        <div className="text-4xl font-bold text-[#b70f23] mb-2">
                          {benefit.value}
                        </div>
                        <p className="text-gray-700 font-medium">{benefit.title}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Témoignages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Ce que disent nos clients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSolution.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#f4b71b] fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white">
                <CardContent className="p-12">
                  <h3 className="text-3xl font-bold mb-4">
                    Prêt à transformer votre activité ?
                  </h3>
                  <p className="text-xl mb-8 opacity-90">
                    Rejoignez des milliers de professionnels qui font confiance à CHAPFOODY
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={onGoToSignup}
                      className="bg-white text-[#b70f23] hover:bg-gray-100 px-8 py-3"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Créer mon compte gratuit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-[#b70f23] px-8 py-3"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Parler à un expert
                    </Button>
                  </div>
                </CardContent>
              </Card>
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