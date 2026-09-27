import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  Star,
  Quote,
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

interface CaseStudyDetailPageProps {
  caseStudyId: string;
  onBack: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
}

export function CaseStudyDetailPage({ caseStudyId, onBack, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary }: CaseStudyDetailPageProps) {
  // En production, ces données viendraient d'une API ou base de données
  const caseStudyData = {
    "bistrot-du-marche": {
      title: "Bistrot du Marché",
      subtitle: "Restaurant traditionnel parisien",
      category: "Restaurant",
      location: "Paris, France",
      duration: "6 mois",
      teamSize: "8 employés",
      description: "Le Bistrot du Marché, restaurant familial parisien établi depuis 1985, cherchait à moderniser ses opérations tout en préservant son authenticité. Grâce à CHAPFOODY, l'établissement a connu une transformation digitale remarquable.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      challenge: {
        title: "Le défi",
        description: "Le Bistrot du Marché faisait face à plusieurs défis majeurs qui limitaient sa croissance et son efficacité opérationnelle.",
        points: [
          "Faible visibilité en ligne et absence de présence digitale",
          "Gestion manuelle des commandes entraînant des erreurs fréquentes",
          "Optimisation des stocks difficile et gaspillage alimentaire",
          "Manque de données pour analyser les performances",
          "Difficulté à attirer une clientèle plus jeune",
          "Processus de paiement lents en période d'affluence"
        ]
      },
      solution: {
        title: "La solution CHAPFOODY",
        description: "Une approche complète et progressive pour digitaliser l'établissement sans perdre son âme.",
        features: [
          {
            icon: Zap,
            title: "Menu digital interactif",
            description: "Interface intuitive avec photos HD et descriptions détaillées des plats."
          },
          {
            icon: BarChart3,
            title: "Système de commandes automatisé",
            description: "Intégration complète entre salle, cuisine et gestion des stocks."
          },
          {
            icon: Shield,
            title: "Analytics en temps réel",
            description: "Tableaux de bord pour suivre les ventes, stocks et satisfaction client."
          }
        ]
      },
      results: [
        { metric: "+140%", label: "Augmentation des revenus", color: "text-green-600" },
        { metric: "+350", label: "Commandes par mois", color: "text-blue-600" },
        { metric: "4.8/5", label: "Satisfaction client", color: "text-yellow-600" },
        { metric: "-25%", label: "Réduction du gaspillage", color: "text-green-600" },
        { metric: "+60%", label: "Nouveaux clients", color: "text-purple-600" },
        { metric: "15min", label: "Temps d'attente moyen", color: "text-orange-600" }
      ],
      timeline: [
        {
          phase: "Audit et stratégie",
          duration: "2 semaines",
          description: "Analyse approfondie des processus existants et définition de la stratégie de transformation."
        },
        {
          phase: "Mise en place technique",
          duration: "1 mois",
          description: "Installation des équipements, configuration du système et formation de base."
        },
        {
          phase: "Formation et adaptation",
          duration: "3 semaines",
          description: "Formation complète de l'équipe et ajustements selon les retours utilisateurs."
        },
        {
          phase: "Optimisation",
          duration: "Continu",
          description: "Suivi des performances, optimisations et nouvelles fonctionnalités."
        }
      ],
      testimonial: {
        content: "CHAPFOODY a transformé notre restaurant sans nous faire perdre notre identité. Nos clients apprécient la modernité du service tout en retrouvant la chaleur humaine qui nous caractérise. Les résultats dépassent toutes nos attentes.",
        author: "Marie Dubois",
        role: "Propriétaire du Bistrot du Marché",
        avatar: "M"
      },
      nextSteps: [
        "Extension du système à la terrasse d'été",
        "Lancement du programme de fidélité digital",
        "Intégration avec les plateformes de livraison",
        "Mise en place du système de réservation en ligne"
      ]
    }
    // Ajouter d'autres cas d'études ici...
  };

  const currentCase = caseStudyData[caseStudyId as keyof typeof caseStudyData];

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cas d'étude non trouvé</h1>
          <Button onClick={onBack}>Retour aux cas d'études</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        title="CHAPFOODY"
        subtitle="Cas d'étude"
        showLoginButton={false}
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
            Retour aux cas d'études
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b70f23]/10 to-[#f4b71b]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-[#f4b71b] text-black">
                {currentCase.category}
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {currentCase.title}
              </h1>
              
              <p className="text-xl text-[#f4b71b] font-medium mb-6">
                {currentCase.subtitle}
              </p>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {currentCase.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-[#b70f23]" />
                  <span>{currentCase.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-[#b70f23]" />
                  <span>{currentCase.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-[#b70f23]" />
                  <span>{currentCase.teamSize}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={currentCase.image}
                alt={currentCase.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Résultats obtenus
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des résultats concrets et mesurables qui témoignent du succès de la transformation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {currentCase.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <div className={`text-3xl font-bold mb-2 ${result.color}`}>
                  {result.metric}
                </div>
                <div className="text-gray-600 text-sm">
                  {result.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-16 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Target className="w-8 h-8 text-[#b70f23] mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentCase.challenge.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {currentCase.challenge.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {currentCase.challenge.points.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[#b70f23] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentCase.solution.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {currentCase.solution.description}
                  </p>
                  
                  <div className="space-y-4">
                    {currentCase.solution.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-10 h-10 bg-[#b70f23] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Chronologie du projet
            </h2>
            <p className="text-xl text-gray-600">
              Le déroulement étape par étape de la transformation.
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#b70f23] to-[#f4b71b]"></div>
            
            <div className="space-y-8">
              {currentCase.timeline.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative flex items-start ml-8"
                >
                  <div className="absolute -left-6 w-3 h-3 bg-[#b70f23] rounded-full border-2 border-white shadow-lg"></div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {phase.phase}
                      </h3>
                      <Badge variant="outline" className="border-[#b70f23] text-[#b70f23]">
                        {phase.duration}
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Quote className="w-12 h-12 text-[#b70f23] mx-auto mb-6" />
            
            <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
              "{currentCase.testimonial.content}"
            </blockquote>
            
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-bold mr-4">
                {currentCase.testimonial.avatar}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {currentCase.testimonial.author}
                </div>
                <div className="text-gray-600">
                  {currentCase.testimonial.role}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Prochaines étapes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#f4b71b] mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
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
              Votre succès nous inspire
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Contactez-nous pour découvrir comment CHAPFOODY peut transformer votre activité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#f4b71b] hover:bg-[#f4b71b]/90 text-black"
              >
                Planifier une démo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#b70f23]"
              >
                Télécharger le PDF
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