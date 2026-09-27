import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Logo } from "../components/Logo";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  FileText,
  Users,
  BarChart3,
  Settings,
  Eye,
  MessageCircle,
  Calendar,
  Tag,
  Upload,
  Search,
  Rocket
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
  onGoToIndustrialization?: () => void;
  onGoToDashboardPreview?: () => void;
  onGoToTest?: () => void;
}

export function AdminDashboard({ onBack, onGoToIndustrialization, onGoToDashboardPreview, onGoToTest }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("content");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<"news" | "case-study">("news");

  // Mock data pour les contenus existants
  const [newsItems, setNewsItems] = useState([
    {
      id: "1",
      title: "L'Intelligence Artificielle révolutionne la livraison alimentaire en 2025",
      status: "published",
      author: "Dr. Sophie Moreau",
      publishedAt: "15 Jan 2025",
      views: 2450,
      comments: 23,
      category: "Innovation"
    },
    {
      id: "2",
      title: "Les 10 tendances FoodTech qui vont marquer 2025",
      status: "draft",
      author: "Pierre Dubois",
      publishedAt: "12 Jan 2025",
      views: 1890,
      comments: 15,
      category: "Tendances"
    }
  ]);

  const [caseStudies, setCaseStudies] = useState([
    {
      id: "1",
      title: "Bistrot du Marché",
      status: "published",
      category: "Restaurant",
      results: "+140% revenus",
      publishedAt: "10 Jan 2025",
      views: 1234
    },
    {
      id: "2",
      title: "Express Delivery",
      status: "published",
      category: "Livraison",
      results: "-30% coûts",
      publishedAt: "8 Jan 2025",
      views: 987
    }
  ]);

  const [newContent, setNewContent] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    status: "draft"
  });

  const analytics = {
    totalViews: 15432,
    totalComments: 289,
    totalShares: 156,
    topContent: "L'Intelligence Artificielle révolutionne la livraison alimentaire en 2025",
    engagementRate: "4.2%",
    averageReadTime: "6.3 min"
  };

  const handleCreateContent = () => {
    const newItem = {
      id: Date.now().toString(),
      ...newContent,
      author: "Admin CHAPFOODY",
      publishedAt: new Date().toLocaleDateString('fr-FR'),
      views: 0,
      comments: 0
    };

    if (contentType === "news") {
      setNewsItems([newItem, ...newsItems]);
    } else {
      setCaseStudies([{ ...newItem, results: "Nouveau cas" }, ...caseStudies]);
    }

    setNewContent({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      status: "draft"
    });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <div className="flex items-center gap-3">
                <Logo />
                <div>
                  <h1 className="text-xl font-bold text-[#b70f23]">CHAPFOODY</h1>
                  <p className="text-xs text-gray-600">Administration</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer du contenu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau contenu</DialogTitle>
                    <DialogDescription>
                      Créez un nouvel article d'actualité ou cas d'étude pour la plateforme CHAPFOODY.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type de contenu</label>
                        <Select value={contentType} onValueChange={(value: "news" | "case-study") => setContentType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">Actualité</SelectItem>
                            <SelectItem value="case-study">Cas d'étude</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Statut</label>
                        <Select value={newContent.status} onValueChange={(value) => setNewContent({...newContent, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="published">Publié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre</label>
                      <Input
                        value={newContent.title}
                        onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                        placeholder="Titre du contenu..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Extrait</label>
                      <Textarea
                        value={newContent.excerpt}
                        onChange={(e) => setNewContent({...newContent, excerpt: e.target.value})}
                        placeholder="Description courte..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Contenu complet</label>
                      <Textarea
                        value={newContent.content}
                        onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                        placeholder="Contenu détaillé..."
                        rows={8}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Catégorie</label>
                        <Input
                          value={newContent.category}
                          onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                          placeholder="Innovation, Tendances..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                        <Input
                          value={newContent.tags}
                          onChange={(e) => setNewContent({...newContent, tags: e.target.value})}
                          placeholder="IA, Livraison, Tech..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateContent} className="bg-[#b70f23] hover:bg-[#70070e] text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Créer le contenu
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#b70f23]">{analytics.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Vues totales</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.totalComments}</div>
              <div className="text-sm text-gray-600">Commentaires</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalShares}</div>
              <div className="text-sm text-gray-600">Partages</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.engagementRate}</div>
              <div className="text-sm text-gray-600">Taux d'engagement</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.averageReadTime}</div>
              <div className="text-sm text-gray-600">Temps de lecture</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#f4b71b]">{newsItems.length + caseStudies.length}</div>
              <div className="text-sm text-gray-600">Contenus totaux</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        {onGoToIndustrialization && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prêt pour l'industrialisation ?</h3>
                    <p className="text-white/90">
                      Découvrez nos recommandations pour passer CHAPFOODY en production
                    </p>
                  </div>
                  <Button 
                    onClick={onGoToIndustrialization}
                    className="bg-white text-[#b70f23] hover:bg-gray-100"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Voir les suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Test Debug Section */}
        {onGoToTest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🔧 Mode Debug - Test Menu Paramètres</h3>
                    <p className="text-white/90">
                      Testez l'accès aux paramètres depuis le dashboard restaurant
                    </p>
                  </div>
                  <Button 
                    onClick={onGoToTest}
                    className="bg-white text-orange-600 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Page de test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Commentaires
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* News Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Actualités</span>
                    <Badge>{newsItems.length} articles</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newsItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.author} • {item.publishedAt}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                            {item.status === 'published' ? 'Publié' : 'Brouillon'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {item.comments}
                          </span>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Case Studies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cas d'études</span>
                    <Badge>{caseStudies.length} cas</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caseStudies.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">Publié le {item.publishedAt}</p>
                        </div>
                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                          {item.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.views}
                          </span>
                          <span className="text-[#b70f23] font-medium">
                            {item.results}
                          </span>
                        </div>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs content */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Interface de modération des commentaires à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics détaillées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tableaux de bord analytics détaillés à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres système</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configuration système à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}