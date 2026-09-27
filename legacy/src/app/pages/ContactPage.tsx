import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Header } from "../components/Header";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Building,
  Truck,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

interface ContactPageProps {
  onBack: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onLogin?: () => void;
  onGoToDashboard?: () => void;
  onGoToSignup?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  onGoToSupport?: () => void;
  userSession?: any;
}

export function ContactPage({ 
  onBack, 
  onGoToCaseStudies, 
  onGoToNews, 
  onGoToVideoLibrary, 
  onLogin,
  onGoToDashboard,
  onGoToSignup,
  onSolutionSelect,
  onGoToSupport,
  userSession 
}: ContactPageProps) {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@chapfoody.com",
      description: "Réponse sous 24h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "123 Avenue de la Innovation\n75001 Paris, France",
      description: "Siège social"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "Lundi - Vendredi\n9h00 - 18h00",
      description: "Support technique"
    }
  ];

  const userTypes = [
    {
      icon: Building,
      title: "Restaurateurs",
      description: "Questions sur les solutions restaurant",
      email: "restaurants@chapfoody.com"
    },
    {
      icon: Truck,
      title: "Livreurs & Entreprises",
      description: "Support pour la logistique",
      email: "livraison@chapfoody.com"
    },
    {
      icon: TrendingUp,
      title: "Affiliés Marketing",
      description: "Programme de partenariat",
      email: "partenaires@chapfoody.com"
    },
    {
      icon: Users,
      title: "Support Général",
      description: "Toute autre question",
      email: "support@chapfoody.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onLogin={onLogin}
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToSignup={onGoToSignup}
        onGoToDashboard={onGoToDashboard}
        onSolutionSelect={onSolutionSelect}
        onGoToSupport={onGoToSupport}
        onGoToHome={onBack}
        onGoToContact={() => {}}
        userSession={userSession}
        title="CHAPFOODY"
        subtitle="Contact"
      />

      {/* Bande colorée CHAPFOODY */}
      <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-[#b70f23] p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-[#f4b71b]/10 text-[#b70f23] border-[#f4b71b]/20">
            📞 Contactez-nous
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Parlons de votre
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
              {" "}projet{" "}
            </span>
            ensemble
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe d'experts est là pour vous accompagner dans votre transformation digitale. 
            Contactez-nous pour découvrir comment CHAPFOODY peut révolutionner votre activité.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-100 hover:border-[#f4b71b]/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6 text-[#b70f23]" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <Input placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <Input placeholder="Votre nom" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input type="email" placeholder="votre.email@exemple.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input type="tel" placeholder="+33 1 23 45 67 89" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entreprise
                  </label>
                  <Input placeholder="Nom de votre entreprise" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'activité
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b70f23] focus:border-transparent">
                    <option value="">Sélectionnez votre activité</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="boulangerie">Boulangerie</option>
                    <option value="traiteur">Traiteur</option>
                    <option value="livraison">Entreprise de livraison</option>
                    <option value="livreur">Livreur indépendant</option>
                    <option value="affilie">Affilié marketing</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea 
                    rows={5} 
                    placeholder="Décrivez-nous votre projet, vos besoins ou vos questions..."
                  />
                </div>
                
                <Button className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Coordonnées */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#b70f23] rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{info.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{info.value}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact par type d'utilisateur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact spécialisé</CardTitle>
                <CardDescription>
                  Contactez directement l'équipe spécialisée pour votre activité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userTypes.map((type, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-[#f4b71b]/10 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#f4b71b] rounded-lg flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{type.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <a 
                          href={`mailto:${type.email}`}
                          className="text-sm text-[#b70f23] hover:underline"
                        >
                          {type.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Horaires d'ouverture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Disponibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lundi - Vendredi</span>
                    <span className="font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Samedi</span>
                    <span className="font-medium">10h00 - 16h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dimanche</span>
                    <span className="text-gray-500">Fermé</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[#b70f23]/10 rounded-lg">
                  <p className="text-sm text-[#b70f23]">
                    <strong>Support technique :</strong> Assistance disponible 24h/24 pour les clients Premium
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section FAQ rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Questions fréquentes</CardTitle>
              <CardDescription>
                Trouvez rapidement les réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Combien de temps faut-il pour installer CHAPFOODY ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      L'installation complète prend généralement 24-48h selon la complexité de votre établissement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Y a-t-il une période d'essai gratuite ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Oui, nous proposons 30 jours d'essai gratuit pour toutes nos solutions.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Le support technique est-il inclus ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Oui, le support technique est inclus dans tous nos plans avec des niveaux de service différents.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Peut-on intégrer CHAPFOODY avec nos systèmes existants ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Absolument, nous proposons des APIs et des intégrations avec les principaux systèmes du marché.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}