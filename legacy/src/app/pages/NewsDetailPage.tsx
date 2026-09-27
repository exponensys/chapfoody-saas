import { motion } from "motion/react";
import "../../styles/article-content.css";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CommentSystem } from "../components/CommentSystem";
import { EngagementAnalytics } from "../components/EngagementAnalytics";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  MessageCircle,
  Share2,
  Heart,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Tag,
  ChevronRight,
  ThumbsUp
} from "lucide-react";

interface NewsDetailPageProps {
  newsId: string;
  onBack: () => void;
  onNewsClick: (newsId: string) => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
}

export function NewsDetailPage({ newsId, onBack, onNewsClick, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary }: NewsDetailPageProps) {
  // En production, ces données viendraient d'une API
  const newsData = {
    "ia-livraison-2025": {
      title: "L'Intelligence Artificielle révolutionne la livraison alimentaire en 2025",
      subtitle: "Une analyse approfondie des innovations technologiques qui transforment le secteur",
      excerpt: "L'année 2025 marque un tournant décisif pour l'industrie de la livraison alimentaire avec l'intégration massive de l'intelligence artificielle.",
      content: `
        <p>L'année 2025 marque un tournant décisif pour l'industrie de la livraison alimentaire. L'intégration massive de l'intelligence artificielle dans les processus opérationnels transforme radicalement la façon dont les entreprises optimisent leurs livraisons, prédisent la demande et améliorent l'expérience client.</p>

        <h2>Une révolution silencieuse mais impactante</h2>
        
        <p>Selon notre dernière étude menée auprès de 500 entreprises du secteur, 73% des acteurs majeurs de la livraison alimentaire ont déjà intégré des solutions d'IA dans leurs opérations quotidiennes. Cette adoption massive s'explique par des gains de performance spectaculaires :</p>
        
        <ul>
          <li><strong>Réduction de 30% des temps de livraison</strong> grâce à l'optimisation intelligente des itinéraires</li>
          <li><strong>Amélioration de 45% de la précision des prédictions de demande</strong>, permettant une meilleure gestion des stocks</li>
          <li><strong>Diminution de 25% des coûts opérationnels</strong> par l'automatisation des processus décisionnels</li>
        </ul>

        <h2>Les technologies clés qui transforment le secteur</h2>

        <h3>1. L'optimisation prédictive des tournées</h3>
        <p>Les algorithmes d'apprentissage automatique analysent en temps réel une multitude de variables : conditions météorologiques, trafic, habitudes de consommation locales, événements spéciaux. Cette analyse permet de créer des itinéraires dynamiques qui s'adaptent continuellement aux conditions changeantes.</p>

        <h3>2. La prédiction comportementale des consommateurs</h3>
        <p>L'IA permet aujourd'hui d'anticiper avec une précision remarquable les préférences et habitudes de commande des clients. Ces systèmes analysent l'historique d'achat, les tendances saisonnières, et même les données météorologiques pour prédire ce qu'un client pourrait commander.</p>

        <h3>3. L'automatisation intelligente des entrepôts</h3>
        <p>Les centres de distribution s'automatisent grâce à des robots guidés par IA qui optimisent le stockage, la préparation des commandes et la gestion des flux. Cette automatisation réduit les erreurs humaines et accélère considérablement les processus.</p>

        <h2>Impact sur l'emploi et les compétences</h2>
        
        <p>Contrairement aux craintes initiales, l'intégration de l'IA dans la livraison alimentaire ne détruit pas massivement l'emploi mais le transforme. Les postes évoluent vers des rôles plus stratégiques et techniques :</p>
        
        <ul>
          <li>Les livreurs deviennent des "ambassadeurs client" avec des missions élargies</li>
          <li>De nouveaux métiers émergent : data analysts, spécialistes en optimisation IA, coordinateurs humain-machine</li>
          <li>Les managers développent des compétences en pilotage de systèmes intelligents</li>
        </ul>

        <h2>Défis et perspectives d'avenir</h2>
        
        <p>Malgré ces avancées prometteuses, plusieurs défis persistent :</p>
        
        <p><strong>La protection des données personnelles</strong> reste un enjeu majeur. Les entreprises doivent naviguer entre personnalisation poussée et respect de la vie privée des utilisateurs.</p>
        
        <p><strong>L'équité algorithmique</strong> pose question : comment s'assurer que les systèmes d'IA ne créent pas de discriminations dans l'attribution des livraisons ou la tarification ?</p>
        
        <p><strong>La dépendance technologique</strong> inquiète certains acteurs qui craignent une perte de contrôle sur leurs opérations.</p>

        <h2>Conclusion : vers une livraison augmentée</h2>
        
        <p>L'intelligence artificielle ne remplace pas l'humain dans la livraison alimentaire, elle l'augmente. Les entreprises qui réussissent sont celles qui trouvent le bon équilibre entre automatisation intelligente et expertise humaine. L'avenir appartient à ceux qui sauront orchestrer cette symbiose technologie-humain pour créer des expériences client exceptionnelles tout en optimisant leurs opérations.</p>
        
        <p>2025 n'est que le début de cette révolution. Les prochaines années verront émerger des innovations encore plus disruptives : livraison par drones autonomes, prédiction alimentaire personnalisée en temps réel, ou encore cuisine robotisée intégrée aux plateformes de livraison.</p>
      `,
      author: {
        name: "Dr. Sophie Moreau",
        role: "Experte en IA appliquée",
        bio: "Docteure en informatique spécialisée en intelligence artificielle, Sophie Moreau dirige le laboratoire d'innovation technologique de l'École Polytechnique. Elle conseille de nombreuses entreprises du secteur alimentaire.",
        avatar: "/api/placeholder/60/60"
      },
      publishedAt: "15 Jan 2025",
      updatedAt: "15 Jan 2025",
      readTime: "8 min",
      category: "Innovation",
      tags: ["IA", "Livraison", "Technologie", "Innovation", "Optimisation"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
      views: 2450,
      comments: 23,
      likes: 89,
      shares: 34,
      featured: true,
      relatedNews: [
        {
          id: "tendances-foodtech-2025",
          title: "Les 10 tendances FoodTech qui vont marquer 2025",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=300"
        },
        {
          id: "blockchain-tracabilite-alimentaire",
          title: "La blockchain au service de la traçabilité alimentaire",
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=300"
        },
        {
          id: "robots-livraison-autonome",
          title: "Les robots de livraison autonome arrivent en France",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300"
        }
      ]
    }
  };

  const currentNews = newsData[newsId as keyof typeof newsData];

  if (!currentNews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Button onClick={onBack}>Retour aux actualités</Button>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    // Solution simple et efficace : utilise dangerouslySetInnerHTML directement
    // Les styles CSS de article-content.css se chargeront du formatage approprié
    const cleanedContent = content
      .trim()
      .replace(/^\s+/gm, '') // Supprime les espaces en début de ligne
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // Normalise les multiples sauts de ligne
    
    return (
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: cleanedContent }} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        title="CHAPFOODY"
        subtitle="Actualité"
        showLoginButton={false}
      />
      
      {/* Back Button & Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux actualités
            </Button>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge className="mb-4 bg-[#f4b71b] text-black">
            {currentNews.category}
          </Badge>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {currentNews.title}
          </h1>
          
          {currentNews.subtitle && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {currentNews.subtitle}
            </p>
          )}
          
          <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src={currentNews.author.avatar} alt={currentNews.author.name} />
                  <AvatarFallback>{currentNews.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{currentNews.author.name}</p>
                  <p className="text-sm text-gray-600">{currentNews.author.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{currentNews.publishedAt}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{currentNews.readTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{currentNews.views}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{currentNews.comments}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>{currentNews.likes}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <img 
            src={currentNews.image}
            alt={currentNews.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none mb-8"
        >
          {formatContent(currentNews.content)}
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-5 h-5 text-[#b70f23]" />
            <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
            {currentNews.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-[#b70f23] hover:text-white hover:border-[#b70f23] transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Social Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600">
              <ThumbsUp className="w-4 h-4 mr-2" />
              {currentNews.likes} J'aime
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              {currentNews.comments} Commentaires
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Partager:</span>
            <Button variant="outline" size="sm">
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Link2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentNews.author.avatar} alt={currentNews.author.name} />
                  <AvatarFallback>{currentNews.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {currentNews.author.name}
                  </h3>
                  <p className="text-[#b70f23] font-medium mb-3">
                    {currentNews.author.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {currentNews.author.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics de l'article</h3>
          <EngagementAnalytics contentId={newsId} />
        </motion.div>

        {/* Comment System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <CommentSystem 
            articleId={newsId} 
            moderationEnabled={true}
            currentUser={{
              name: "Utilisateur connecté",
              avatar: "/api/placeholder/40/40"
            }}
          />
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Articles liés</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentNews.relatedNews.map((article, index) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-xl transition-shadow group"
                onClick={() => onNewsClick(article.id)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-[#b70f23] transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center text-[#b70f23] text-sm font-medium mt-3 group-hover:translate-x-1 transition-transform">
                    Lire l'article
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
      />
    </div>
  );
}