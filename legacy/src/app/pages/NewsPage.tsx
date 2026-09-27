import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AdvancedSearch } from "../components/AdvancedSearch";
import { toast } from "sonner@2.0.3";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ChevronRight,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  Bell,
  BellOff,
  Tag
} from "lucide-react";

interface NewsPageProps {
  onBack: () => void;
  onNewsClick: (newsId: string) => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToDashboard?: () => void;
  onGoToSupport?: () => void;
  onLogin?: () => void;
  onGoToHome?: () => void;
  onGoToSignup?: () => void;
  onGoToContact?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  userSession?: any;
}

export function NewsPage({ onBack, onNewsClick, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary, onGoToDashboard, onGoToSupport, onLogin, onGoToHome, onGoToSignup, onGoToContact, onSolutionSelect, userSession }: NewsPageProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleNewsCount, setVisibleNewsCount] = useState(4); // Nombre initial d'articles visibles
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  
  const allNews = [
    {
      id: "tendances-foodtech-2025",
      title: "Les 10 tendances FoodTech qui vont marquer 2025",
      excerpt: "Découvrez les innovations technologiques qui transformeront l'industrie alimentaire cette année.",
      author: "Pierre Dubois",
      authorRole: "Analyste secteur FoodTech",
      publishedAt: "12 Jan 2025",
      readTime: "6 min",
      category: "Tendances",
      tags: ["FoodTech", "Innovation", "Tendances"],
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400",
      views: 1890,
      comments: 15,
      featured: false
    },
    {
      id: "regulation-europenne-livraison",
      title: "Nouvelle réglementation européenne sur la livraison durable",
      excerpt: "L'UE annonce de nouvelles mesures pour encourager la livraison écologique dans le secteur alimentaire.",
      author: "Marie Laurent",
      authorRole: "Consultante réglementaire",
      publishedAt: "10 Jan 2025",
      readTime: "5 min",
      category: "Réglementation",
      tags: ["Réglementation", "Environnement", "Europe"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
      views: 1234,
      comments: 8,
      featured: false
    },
    {
      id: "partenariat-chapfoody-startup",
      title: "CHAPFOODY s'associe à 5 startups innovantes",
      excerpt: "Annonce d'un programme d'incubation pour accélérer l'innovation dans l'écosystème alimentaire.",
      author: "Équipe CHAPFOODY",
      authorRole: "Communication officielle",
      publishedAt: "8 Jan 2025",
      readTime: "4 min",
      category: "Entreprise",
      tags: ["Partenariat", "Startup", "Innovation"],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=400",
      views: 987,
      comments: 12,
      featured: false
    },
    {
      id: "etude-comportement-consommateurs",
      title: "Étude exclusive : évolution des habitudes alimentaires post-COVID",
      excerpt: "Analyse détaillée des changements durables dans les comportements de consommation alimentaire.",
      author: "Dr. Antoine Rousseau",
      authorRole: "Sociologue alimentaire",
      publishedAt: "5 Jan 2025",
      readTime: "10 min",
      category: "Études",
      tags: ["Étude", "Consommation", "Sociologie"],
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
      views: 1567,
      comments: 19,
      featured: false
    },
    {
      id: "blockchain-tracabilite-alimentaire",
      title: "La blockchain au service de la traçabilité alimentaire",
      excerpt: "Comment la technologie blockchain révolutionne la traçabilité et la sécurité alimentaire.",
      author: "Thomas Bernard",
      authorRole: "Expert blockchain",
      publishedAt: "3 Jan 2025",
      readTime: "7 min",
      category: "Innovation",
      tags: ["Blockchain", "Traçabilité", "Sécurité"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400",
      views: 2100,
      comments: 31,
      featured: false
    },
    {
      id: "robots-livraison-autonome",
      title: "Les robots de livraison autonome arrivent en France",
      excerpt: "Premier déploiement de robots livreurs autonomes dans plusieurs villes françaises.",
      author: "Julien Martin",
      authorRole: "Journaliste tech",
      publishedAt: "1 Jan 2025",
      readTime: "5 min",
      category: "Innovation",
      tags: ["Robotique", "Livraison", "Autonome"],
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400",
      views: 3210,
      comments: 45,
      featured: false
    }
  ];

  const [filteredNews, setFilteredNews] = useState(allNews);
  
  const featuredNews = {
    id: "ia-livraison-2025",
    title: "L'Intelligence Artificielle révolutionne la livraison alimentaire en 2025",
    excerpt: "Une étude approfondie sur l'impact de l'IA dans l'optimisation des tournées de livraison et la prédiction de la demande.",
    content: "L'année 2025 marque un tournant décisif pour l'industrie de la livraison alimentaire...",
    author: "Dr. Sophie Moreau",
    authorRole: "Experte en IA appliquée",
    publishedAt: "15 Jan 2025",
    readTime: "8 min",
    category: "Innovation",
    tags: ["IA", "Livraison", "Technologie"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    views: 2450,
    comments: 23,
    featured: true
  };

  const categories = [
    { id: "all", label: "Toutes les actualités", count: allNews.length + 1 },
    { id: "innovation", label: "Innovation", count: 3 },
    { id: "tendances", label: "Tendances", count: 2 },
    { id: "entreprise", label: "CHAPFOODY", count: 1 },
    { id: "reglementation", label: "Réglementation", count: 1 },
    { id: "etudes", label: "Études", count: 1 }
  ];

  const popularTags = [
    "IA", "Innovation", "Livraison", "FoodTech", "Blockchain", 
    "Environnement", "Startup", "Tendances", "Réglementation"
  ];

  // Fonction pour filtrer les actualités
  const filterNews = (categoryFilter: string = selectedCategory, searchFilters?: any) => {
    let filtered = [...allNews];
    
    // Filtrage par catégorie
    if (categoryFilter && categoryFilter !== "all") {
      const categoryMap: { [key: string]: string } = {
        "innovation": "Innovation",
        "tendances": "Tendances", 
        "entreprise": "Entreprise",
        "reglementation": "Réglementation",
        "etudes": "Études"
      };
      const mappedCategory = categoryMap[categoryFilter] || categoryFilter;
      filtered = filtered.filter(news => news.category === mappedCategory);
    }
    
    // Filtrage par recherche avancée si fourni
    if (searchFilters) {
      if (searchFilters.query) {
        filtered = filtered.filter(news => 
          news.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          news.excerpt.toLowerCase().includes(searchFilters.query.toLowerCase())
        );
      }
      
      if (searchFilters.category && searchFilters.category !== "all") {
        filtered = filtered.filter(news => 
          news.category.toLowerCase() === searchFilters.category.toLowerCase()
        );
      }
      
      if (searchFilters.author && searchFilters.author !== "all") {
        filtered = filtered.filter(news => 
          news.author.toLowerCase().includes(searchFilters.author.toLowerCase())
        );
      }
      
      if (searchFilters.tags && searchFilters.tags.length > 0) {
        filtered = filtered.filter(news =>
          searchFilters.tags.some((tag: string) => 
            news.tags.some(newsTag => newsTag.toLowerCase().includes(tag.toLowerCase()))
          )
        );
      }
    }
    
    setFilteredNews(filtered);
    // Réinitialiser le compteur d'articles visibles après un filtrage
    setVisibleNewsCount(4);
  };

  const handleSearch = (filters: any) => {
    filterNews(selectedCategory, filters);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    filterNews(categoryId);
  };

  const handleTagClick = (tag: string) => {
    handleSearch({ tags: [tag] });
  };

  const handleLoadMore = () => {
    setVisibleNewsCount(prev => Math.min(prev + 4, filteredNews.length));
  };

  // Articles à afficher (limités par visibleNewsCount)
  const visibleNews = filteredNews.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < filteredNews.length;

  // Charger l'état d'abonnement depuis le localStorage au montage
  useEffect(() => {
    const savedSubscription = localStorage.getItem('chapfoody_news_subscription');
    if (savedSubscription) {
      const subscriptionData = JSON.parse(savedSubscription);
      setIsSubscribed(subscriptionData.subscribed);
      if (subscriptionData.email) {
        setNewsletterEmail(subscriptionData.email);
      }
    }
  }, []);

  // Gestion de l'abonnement/désabonnement aux actualités
  const handleSubscriptionToggle = () => {
    const newSubscriptionState = !isSubscribed;
    setIsSubscribed(newSubscriptionState);
    
    // Sauvegarder dans localStorage
    const subscriptionData = {
      subscribed: newSubscriptionState,
      email: newsletterEmail,
      date: new Date().toISOString()
    };
    localStorage.setItem('chapfoody_news_subscription', JSON.stringify(subscriptionData));
    
    // Afficher une notification
    if (newSubscriptionState) {
      toast.success("✅ Abonnement activé !", {
        description: "Vous recevrez désormais les dernières actualités CHAPFOODY.",
        duration: 3000,
      });
    } else {
      toast.info("🔔 Abonnement désactivé", {
        description: "Vous ne recevrez plus de notifications d'actualités.",
        duration: 3000,
      });
    }
  };

  // Gestion de l'abonnement newsletter
  const handleNewsletterSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      toast.error("⚠️ Email requis", {
        description: "Veuillez saisir votre adresse email.",
        duration: 3000,
      });
      return;
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast.error("⚠️ Email invalide", {
        description: "Veuillez saisir une adresse email valide.",
        duration: 3000,
      });
      return;
    }

    // Activer l'abonnement
    setIsSubscribed(true);
    
    // Sauvegarder dans localStorage
    const subscriptionData = {
      subscribed: true,
      email: newsletterEmail,
      date: new Date().toISOString()
    };
    localStorage.setItem('chapfoody_news_subscription', JSON.stringify(subscriptionData));
    
    toast.success("🎉 Inscription réussie !", {
      description: `Vous recevrez la newsletter CHAPFOODY à l'adresse ${newsletterEmail}`,
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToDashboard={onGoToDashboard}
        onGoToSupport={onGoToSupport}
        onLogin={onLogin}
        onGoToHome={onGoToHome}
        onGoToSignup={onGoToSignup}
        onGoToContact={onGoToContact}
        onSolutionSelect={onSolutionSelect}
        userSession={userSession}
        title="CHAPFOODY"
        subtitle="Actualités"
      />
      
      {/* Back Button & Subscribe */}
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
              Retour
            </Button>
            
            <Button
              size="sm"
              variant={isSubscribed ? "default" : "outline"}
              onClick={handleSubscriptionToggle}
              className={isSubscribed 
                ? "bg-[#b70f23] hover:bg-[#70070e] text-white border-[#b70f23]" 
                : "border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
              }
            >
              {isSubscribed ? (
                <BellOff className="w-4 h-4 mr-2" />
              ) : (
                <Bell className="w-4 h-4 mr-2" />
              )}
              {isSubscribed ? "Se désabonner" : "S'abonner"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#b70f23]/5 to-[#f4b71b]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Actualités
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                {" "}& Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Restez à la pointe de l'innovation dans l'écosystème alimentaire avec nos analyses, 
              études de marché et actualités sectorielles.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch
            onSearch={handleSearch}
            isExpanded={isSearchExpanded}
            onToggleExpanded={() => setIsSearchExpanded(!isSearchExpanded)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-[#b70f23]" />
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={category.id === selectedCategory ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full justify-between ${
                          category.id === selectedCategory
                            ? "bg-[#b70f23] hover:bg-[#70070e] text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{category.label}</span>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            category.id === selectedCategory
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-[#b70f23]" />
                    Tags populaires
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-[#b70f23] hover:text-white hover:border-[#b70f23] transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    Newsletter CHAPFOODY
                    {isSubscribed && (
                      <Badge className="ml-2 bg-[#f4b71b] text-black text-xs">
                        Actif
                      </Badge>
                    )}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {isSubscribed 
                      ? `Vous recevez déjà notre newsletter${newsletterEmail ? ` à l'adresse ${newsletterEmail}` : ''}.`
                      : "Recevez les dernières actualités du secteur alimentaire."
                    }
                  </p>
                  {!isSubscribed ? (
                    <form onSubmit={handleNewsletterSubscription} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        required
                      />
                      <Button 
                        type="submit"
                        className="w-full bg-[#f4b71b] hover:bg-[#f4b71b]/90 text-black"
                      >
                        S'abonner
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleSubscriptionToggle}
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10"
                      >
                        <BellOff className="w-4 h-4 mr-2" />
                        Se désabonner
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured News */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => onNewsClick(featuredNews.id)}
              className="cursor-pointer group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-[#b70f23] text-white">
                      À la une
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-3 bg-[#f4b71b] text-black">
                      {featuredNews.category}
                    </Badge>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#b70f23] transition-colors">
                      {featuredNews.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredNews.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{featuredNews.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{featuredNews.publishedAt}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{featuredNews.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{featuredNews.views}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{featuredNews.comments}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-[#b70f23] font-medium group-hover:translate-x-1 transition-transform">
                        Lire l'article
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => onNewsClick(news.id)}
                  className="cursor-pointer group"
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-[#f4b71b] text-black">
                        {news.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#b70f23] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {news.excerpt}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <User className="w-4 h-4 mr-1" />
                        <span className="mr-3">{news.author}</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-3">{news.publishedAt}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{news.readTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{news.views}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>{news.comments}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-[#b70f23]"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMoreNews && (
              <div className="text-center">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                >
                  Charger plus d'articles ({filteredNews.length - visibleNewsCount} restants)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16"></div>

      <Footer 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews} 
        onGoToVideoLibrary={onGoToVideoLibrary}
      />
    </div>
  );
}