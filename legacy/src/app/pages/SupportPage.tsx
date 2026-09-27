import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { UserSession } from "../routes";
import { 
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  FileText,
  Video,
  Book,
  Users,
  Zap,
  Shield,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface SupportPageProps {
  onBack: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onLogin?: () => void;
  onGoToDashboard?: () => void;
  onGoToSignup?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  userSession?: UserSession | null;
}

export function SupportPage({
  onBack,
  onGoToCaseStudies,
  onGoToNews,
  onGoToVideoLibrary,
  onLogin,
  onGoToDashboard,
  onGoToSignup,
  onSolutionSelect,
  userSession
}: SupportPageProps) {
  
  const faqItems = [
    {
      question: "Comment créer mon compte CHAPFOODY ?",
      answer: "Pour créer votre compte, cliquez sur 'Créer un compte' depuis la page d'accueil, choisissez votre profil (Restaurateur, Livreur, Entreprise de livraison ou Affilié marketing), puis remplissez le formulaire d'inscription. Vous recevrez un email de confirmation pour activer votre compte."
    },
    {
      question: "Quels sont les différents forfaits disponibles ?",
      answer: "CHAPFOODY propose plusieurs forfaits adaptés à chaque profil : Starter (29€/mois), Professional (79€/mois) et Enterprise (149€/mois) pour les restaurants. Les livreurs indépendants ont accès à un forfait gratuit et des versions payantes (15€ et 29€/mois). Les entreprises de livraison ont des forfaits de 49€ à 199€/mois."
    },
    {
      question: "Comment intégrer mon site e-commerce existant ?",
      answer: "CHAPFOODY peut s'intégrer à votre site existant via notre API. Vous pouvez également utiliser notre système de mini-sites automatisés qui se synchronise avec votre dashboard. Notre équipe technique peut vous accompagner dans l'intégration."
    },
    {
      question: "Comment fonctionne le système de commissions pour les affiliés ?",
      answer: "Les affiliés touchent entre 5% et 12% de commission selon leur forfait. Les commissions sont calculées sur les ventes générées par vos liens de parrainage et versées mensuellement, bi-mensuellement ou hebdomadairement selon votre niveau."
    },
    {
      question: "Puis-je gérer plusieurs restaurants avec un seul compte ?",
      answer: "Oui, avec le forfait Enterprise, vous pouvez gérer plusieurs établissements depuis un seul compte. Vous avez accès à une gestion centralisée avec des analytics consolidées et la possibilité de déléguer des accès par établissement."
    },
    {
      question: "Comment fonctionne l'optimisation GPS pour les livreurs ?",
      answer: "Notre système utilise l'IA pour optimiser vos tournées en temps réel, en tenant compte du trafic, de la météo et de la densité des commandes. Vous recevez des suggestions d'itinéraires optimaux pour maximiser vos revenus par heure."
    },
    {
      question: "Vos données sont-elles sécurisées ?",
      answer: "Absolument. CHAPFOODY utilise un chiffrement de niveau bancaire, des serveurs sécurisés en Europe et respecte le RGPD. Toutes vos données commerciales et personnelles sont protégées avec les plus hauts standards de sécurité."
    },
    {
      question: "Puis-je exporter mes données ?",
      answer: "Oui, vous pouvez exporter toutes vos données (commandes, clients, analytics, finances) au format Excel, PDF ou CSV. Les exports peuvent être automatisés et programmés selon vos besoins."
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Chat en direct",
      description: "Assistance immédiate 9h-18h",
      action: "Démarrer une conversation",
      color: "from-[#b70f23] to-[#70070e]",
      available: true
    },
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 24h maximum",
      action: "support@chapfoody.com",
      color: "from-[#f4b71b] to-[#b70f23]",
      available: true
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Support vocal personnalisé",
      action: "+33 1 23 45 67 89",
      color: "from-[#70070e] to-[#b70f23]",
      available: true
    },
    {
      icon: Video,
      title: "Visioconférence",
      description: "Démonstration personnalisée",
      action: "Planifier un RDV",
      color: "from-[#b70f23] to-[#f4b71b]",
      available: false
    }
  ];

  const resources = [
    {
      icon: Book,
      title: "Documentation complète",
      description: "Guides d'utilisation détaillés pour chaque fonctionnalité",
      type: "Documentation",
      items: ["Guide de démarrage", "Manuel utilisateur", "API Documentation"]
    },
    {
      icon: PlayCircle,
      title: "Tutoriels vidéo",
      description: "Apprenez en regardant nos tutoriels pas-à-pas",
      type: "Vidéos",
      items: ["Configuration initiale", "Gestion des commandes", "Analytics avancées"]
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Échangez avec d'autres utilisateurs CHAPFOODY",
      type: "Forum",
      items: ["Forum utilisateurs", "Groupes Facebook", "Discord communautaire"]
    },
    {
      icon: FileText,
      title: "Base de connaissances",
      description: "Articles et solutions aux problèmes courants",
      type: "Articles",
      items: ["Résolution de problèmes", "Meilleures pratiques", "Nouveautés"]
    }
  ];

  const quickActions = [
    {
      icon: Download,
      title: "Télécharger l'app mobile",
      description: "Applications iOS et Android disponibles"
    },
    {
      icon: FileText,
      title: "Statut des services",
      description: "Vérifiez la disponibilité de nos services"
    },
    {
      icon: Shield,
      title: "Sécurité et confidentialité",
      description: "Informations sur la protection de vos données"
    },
    {
      icon: ExternalLink,
      title: "Intégrations",
      description: "Connectez CHAPFOODY à vos outils existants"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLogin={onLogin}
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews}
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToDashboard={onGoToDashboard}
        onGoToSignup={onGoToSignup}
        onSolutionSelect={onSolutionSelect}
        userSession={userSession}
      />
      
      <main className="relative">
        {/* Bande colorée dégradée CHAPFOODY */}
        <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>
        
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bouton retour */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-[#b70f23]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#b70f23] to-[#70070e] flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Centre d'aide CHAPFOODY
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Trouvez rapidement les réponses à vos questions et découvrez comment tirer le meilleur parti de votre écosystème CHAPFOODY.
              </p>
              
              {/* Barre de recherche */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Rechercher dans l'aide..."
                    className="pl-12 pr-4 py-4 text-lg rounded-xl border-gray-200 focus:border-[#f4b71b] focus:ring-[#f4b71b]/20"
                  />
                </div>
              </div>
            </motion.div>

            {/* Canaux de support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Contactez notre équipe support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supportChannels.map((channel, index) => {
                  const IconComponent = channel.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${!channel.available ? 'opacity-60' : ''}`}>
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center mx-auto mb-4`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">{channel.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
                          <div className="flex items-center justify-center">
                            {channel.available ? (
                              <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white">
                                {channel.action}
                              </Button>
                            ) : (
                              <Badge variant="secondary">Bientôt disponible</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contenu principal avec onglets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs defaultValue="faq" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="resources">Ressources</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="status">Statut</TabsTrigger>
                </TabsList>

                <TabsContent value="faq">
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions fréquemment posées</CardTitle>
                      <CardDescription>
                        Trouvez rapidement des réponses aux questions les plus courantes sur CHAPFOODY.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((resource, index) => {
                      const IconComponent = resource.icon;
                      return (
                        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#b70f23] flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle>{resource.title}</CardTitle>
                                <Badge variant="secondary">{resource.type}</Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-4">{resource.description}</p>
                            <ul className="space-y-2">
                              {resource.items.map((item, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-700">
                                  <ChevronRight className="w-4 h-4 text-[#f4b71b] mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="contact">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Envoyer un message</CardTitle>
                        <CardDescription>
                          Notre équipe vous répondra dans les plus brefs délais.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Prénom" />
                          <Input placeholder="Nom" />
                        </div>
                        <Input placeholder="Email" type="email" />
                        <Input placeholder="Sujet" />
                        <Textarea placeholder="Votre message..." rows={6} />
                        <Button className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white">
                          <Mail className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Actions rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-[#f4b71b]/10 flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-[#b70f23]" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{action.title}</p>
                                  <p className="text-sm text-gray-600">{action.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Horaires de support</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-[#b70f23]" />
                              <div>
                                <p className="font-medium">Lundi - Vendredi</p>
                                <p className="text-sm text-gray-600">9h00 - 18h00</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-600">Weekend</p>
                                <p className="text-sm text-gray-600">Support par email uniquement</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="status">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statut des services CHAPFOODY</CardTitle>
                      <CardDescription>
                        Vérifiez la disponibilité de nos services en temps réel.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { service: "Application Web", status: "Opérationnel", icon: CheckCircle, color: "text-green-500" },
                          { service: "API REST", status: "Opérationnel", icon: CheckCircle, color: "text-green-500" },
                          { service: "Applications mobiles", status: "Opérationnel", icon: CheckCircle, color: "text-green-500" },
                          { service: "Système de paiement", status: "Maintenance", icon: AlertCircle, color: "text-yellow-500" },
                          { service: "Support client", status: "Opérationnel", icon: CheckCircle, color: "text-green-500" }
                        ].map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <IconComponent className={`w-5 h-5 ${item.color}`} />
                                <span className="font-medium">{item.service}</span>
                              </div>
                              <Badge variant={item.status === "Opérationnel" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">Maintenance programmée</p>
                            <p className="text-sm text-blue-700">
                              Une maintenance du système de paiement est prévue le 20 janvier de 2h à 4h (heure de Paris).
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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