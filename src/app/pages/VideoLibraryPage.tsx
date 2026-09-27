import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { 
  ArrowLeft, 
  Search,
  Filter,
  Play,
  PlayCircle,
  Video,
  Clock,
  Eye,
  Calendar,
  User,
  Tag,
  Grid3X3,
  List,
  SortDesc,
  ChevronDown,
  Star,
  Bookmark,
  X,
  Heart
} from "lucide-react";

interface VideoLibraryPageProps {
  onBack: () => void;
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

export function VideoLibraryPage({ onBack, onGoToCaseStudies, onGoToNews, onGoToVideoLibrary, onGoToDashboard, onGoToSupport, onLogin, onGoToHome, onGoToSignup, onGoToContact, onSolutionSelect, userSession }: VideoLibraryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [favoriteVideos, setFavoriteVideos] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const categories = [
    { id: "all", label: "Toutes les vidéos", count: 24 },
    { id: "getting-started", label: "Prise en main", count: 6 },
    { id: "dashboard", label: "Dashboard", count: 5 },
    { id: "orders", label: "Gestion des commandes", count: 4 },
    { id: "menu", label: "Menu digital", count: 3 },
    { id: "analytics", label: "Analytics", count: 4 },
    { id: "advanced", label: "Fonctions avancées", count: 2 }
  ];

  const videos = [
    {
      id: "1",
      title: "Interface Windows Phone - Vue d'ensemble",
      description: "Découvrez l'interface révolutionnaire inspirée de Windows Phone avec les tuiles dynamiques et la navigation intuitive.",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "3:24",
      views: "2.1K",
      publishedAt: "15 Jan 2025",
      category: "getting-started",
      featured: true,
      tags: ["Interface", "Windows Phone", "Navigation"],
      author: "Équipe CHAPFOODY"
    },
    {
      id: "2",
      title: "Gestion des commandes en temps réel",
      description: "Apprenez à gérer efficacement vos commandes avec les notifications en temps réel et le suivi automatique.",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
      youtubeId: "9bZkp7q19f0",
      duration: "2:45",
      views: "1.8K",
      publishedAt: "12 Jan 2025",
      category: "orders",
      featured: false,
      tags: ["Commandes", "Temps réel", "Notifications"],
      author: "Sophie Moreau"
    },
    {
      id: "3",
      title: "Configuration du menu digital",
      description: "Guide complet pour créer et personnaliser votre menu digital avec photos, descriptions et prix.",
      thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
      youtubeId: "jNQXAC9IVRw",
      duration: "4:12",
      views: "1.5K",
      publishedAt: "10 Jan 2025",
      category: "menu",
      featured: false,
      tags: ["Menu", "Configuration", "Personnalisation"],
      author: "Pierre Dubois"
    },
    {
      id: "4",
      title: "Analytics et rapports détaillés",
      description: "Exploitez la puissance des analytics pour optimiser vos performances et augmenter vos revenus.",
      thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg",
      youtubeId: "L_jWHffIx5E",
      duration: "3:28",
      views: "1.9K",
      publishedAt: "8 Jan 2025",
      category: "analytics",
      featured: true,
      tags: ["Analytics", "Rapports", "Performance"],
      author: "Marie Laurent"
    },
    {
      id: "5",
      title: "Gestion des stocks intelligente",
      description: "Optimisez votre gestion des stocks avec les alertes automatiques et les prévisions de consommation.",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
      youtubeId: "fJ9rUzIMcZQ",
      duration: "5:15",
      views: "1.3K",
      publishedAt: "5 Jan 2025",
      category: "advanced",
      featured: false,
      tags: ["Stocks", "Automatisation", "Prévisions"],
      author: "Thomas Martin"
    },
    {
      id: "6",
      title: "Configuration du site e-commerce",
      description: "Créez votre site de commande en ligne en quelques clics avec le générateur automatique.",
      thumbnail: "https://img.youtube.com/vi/oT3mCybbhf0/maxresdefault.jpg",
      youtubeId: "oT3mCybbhf0",
      duration: "6:30",
      views: "2.3K",
      publishedAt: "3 Jan 2025",
      category: "getting-started",
      featured: true,
      tags: ["E-commerce", "Site web", "Configuration"],
      author: "Claire Dubois"
    },
    {
      id: "7",
      title: "Intégrations avec les plateformes de livraison",
      description: "Connectez CHAPFOODY avec Uber Eats, Deliveroo et autres plateformes de livraison.",
      thumbnail: "https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg",
      youtubeId: "ZZ5LpwO-An4",
      duration: "4:45",
      views: "1.7K",
      publishedAt: "1 Jan 2025",
      category: "advanced",
      featured: false,
      tags: ["Intégrations", "Livraison", "Plateformes"],
      author: "Jean Moreau"
    },
    {
      id: "8",
      title: "Personnalisation des tuiles du dashboard",
      description: "Apprenez à personnaliser votre dashboard avec les tuiles qui correspondent à vos besoins.",
      thumbnail: "https://img.youtube.com/vi/kffacxfA7G4/maxresdefault.jpg",
      youtubeId: "kffacxfA7G4",
      duration: "2:18",
      views: "1.1K",
      publishedAt: "28 Déc 2024",
      category: "dashboard",
      featured: false,
      tags: ["Dashboard", "Tuiles", "Personnalisation"],
      author: "Sophie Moreau"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesFavorites = !showOnlyFavorites || favoriteVideos.has(video.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return parseInt(b.views.replace("K", "000").replace(".", "")) - parseInt(a.views.replace("K", "000").replace(".", ""));
      case "duration":
        const getDurationInSeconds = (duration: string) => {
          const [minutes, seconds] = duration.split(":").map(Number);
          return minutes * 60 + seconds;
        };
        return getDurationInSeconds(b.duration) - getDurationInSeconds(a.duration);
      case "recent":
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const handleVideoClick = (youtubeId: string) => {
    setSelectedVideo(youtubeId);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const toggleFavorite = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavoriteVideos(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  const toggleFavoritesView = () => {
    setShowOnlyFavorites(prev => !prev);
    if (!showOnlyFavorites) {
      setSelectedCategory("all");
    }
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
        subtitle="Vidéothèque"
      />
      
      {/* Modal vidéo YouTube */}
      <Dialog open={isVideoModalOpen} onOpenChange={closeVideoModal}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white">
              {selectedVideo && videos.find(v => v.youtubeId === selectedVideo)?.title}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedVideo && videos.find(v => v.youtubeId === selectedVideo)?.description}
            </DialogDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeVideoModal}
              className="absolute right-4 top-4 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-b-lg"
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
              Retour
            </Button>
            
            <Button 
              variant={showOnlyFavorites ? "default" : "outline"}
              size="sm"
              onClick={toggleFavoritesView}
              className={showOnlyFavorites 
                ? "bg-[#b70f23] text-white hover:bg-[#70070e]" 
                : "border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
              }
            >
              <Heart className={`w-4 h-4 mr-2 ${favoriteVideos.size > 0 ? 'fill-current' : ''}`} />
              Mes favoris ({favoriteVideos.size})
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
            <div className="w-16 h-16 bg-[#b70f23] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vidéothèque
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                {" "}CHAPFOODY
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Apprenez à maîtriser toutes les fonctionnalités de CHAPFOODY avec nos tutoriels vidéo détaillés. 
              De la prise en main aux fonctions avancées, tout est expliqué étape par étape.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une vidéo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white appearance-none pr-8"
              >
                <option value="recent">Plus récentes</option>
                <option value="views">Plus vues</option>
                <option value="duration">Plus longues</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#b70f23] text-white" : ""}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#b70f23] text-white" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full justify-between ${
                          category.id === selectedCategory
                            ? "bg-[#b70f23] hover:bg-[#70070e] text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-gradient-to-br from-[#b70f23] to-[#70070e] text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Statistiques</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/90">Total vidéos</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/90">Durée totale</span>
                      <span className="font-bold">1h 32min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/90">Vues totales</span>
                      <span className="font-bold">47.2K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Videos */}
            {selectedCategory === "all" && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-[#f4b71b]" />
                  Vidéos à la une
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.filter(video => video.featured).slice(0, 2).map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleVideoClick(video.youtubeId)}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <PlayCircle className="w-8 h-8 text-[#b70f23]" />
                            </div>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-[#f4b71b] text-black">
                            À la une
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => toggleFavorite(video.id, e)}
                            className="absolute top-3 right-3 w-8 h-8 p-0 bg-black/60 hover:bg-black/80 text-white border-0"
                          >
                            <Heart className={`w-4 h-4 ${favoriteVideos.has(video.id) ? 'fill-current text-red-500' : 'text-white'}`} />
                          </Button>
                          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#b70f23] transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {video.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {video.views}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {video.publishedAt}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Videos */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {showOnlyFavorites 
                  ? "Mes vidéos favorites" 
                  : selectedCategory === "all" 
                    ? "Toutes les vidéos" 
                    : categories.find(c => c.id === selectedCategory)?.label
                }
              </h2>
              <span className="text-sm text-gray-600">
                {sortedVideos.length} vidéo{sortedVideos.length > 1 ? "s" : ""}
              </span>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => handleVideoClick(video.youtubeId)}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-[#b70f23]" />
                          </div>
                        </div>
                        {video.featured && (
                          <Badge className="absolute top-2 left-2 bg-[#f4b71b] text-black text-xs">
                            ⭐
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => toggleFavorite(video.id, e)}
                          className="absolute top-2 right-2 w-6 h-6 p-0 bg-black/60 hover:bg-black/80 text-white border-0"
                        >
                          <Heart className={`w-3 h-3 ${favoriteVideos.has(video.id) ? 'fill-current text-red-500' : 'text-white'}`} />
                        </Button>
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#b70f23] transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {video.author}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {video.views}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => handleVideoClick(video.youtubeId)}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-48 h-28 flex-shrink-0">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                <Play className="w-5 h-5 text-[#b70f23]" />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => toggleFavorite(video.id, e)}
                              className="absolute top-2 right-2 w-6 h-6 p-0 bg-black/60 hover:bg-black/80 text-white border-0 rounded-lg"
                            >
                              <Heart className={`w-3 h-3 ${favoriteVideos.has(video.id) ? 'fill-current text-red-500' : 'text-white'}`} />
                            </Button>
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-[#b70f23] transition-colors">
                                {video.title}
                              </h3>
                              {video.featured && (
                                <Badge className="bg-[#f4b71b] text-black">À la une</Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {video.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {video.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {video.author}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {video.views}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {video.publishedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {sortedVideos.length === 0 && (
              <div className="text-center py-12">
                {showOnlyFavorites ? (
                  <>
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune vidéo favorite</h3>
                    <p className="text-gray-600 mb-4">
                      Vous n'avez pas encore ajouté de vidéos à vos favoris.
                    </p>
                    <Button
                      variant="outline"
                      onClick={toggleFavoritesView}
                      className="border-[#b70f23] text-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                    >
                      Parcourir toutes les vidéos
                    </Button>
                  </>
                ) : (
                  <>
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune vidéo trouvée</h3>
                    <p className="text-gray-600">
                      Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
                    </p>
                  </>
                )}
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