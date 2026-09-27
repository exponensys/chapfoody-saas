import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Eye,
  MessageCircle,
  Share2,
  Heart,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  BarChart3,
  Calendar,
  Target,
  Zap,
  Award
} from "lucide-react";

interface AnalyticsData {
  period: string;
  views: number;
  comments: number;
  shares: number;
  likes: number;
  readTime: number;
  bounceRate: number;
}

interface ContentMetrics {
  title: string;
  type: "news" | "case-study";
  views: number;
  engagement: number;
  comments: number;
  shares: number;
  conversionRate: number;
  averageReadTime: string;
  publishedAt: string;
}

interface EngagementAnalyticsProps {
  contentId?: string;
  showGlobalStats?: boolean;
}

export function EngagementAnalytics({ contentId, showGlobalStats = false }: EngagementAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("views");

  // Mock analytics data
  const analyticsData: AnalyticsData[] = [
    { period: "Lun", views: 1250, comments: 23, shares: 45, likes: 120, readTime: 6.2, bounceRate: 35 },
    { period: "Mar", views: 1580, comments: 31, shares: 67, likes: 156, readTime: 5.8, bounceRate: 32 },
    { period: "Mer", views: 2100, comments: 45, shares: 89, likes: 210, readTime: 7.1, bounceRate: 28 },
    { period: "Jeu", views: 1890, comments: 38, shares: 72, likes: 189, readTime: 6.8, bounceRate: 30 },
    { period: "Ven", views: 2450, comments: 52, shares: 98, likes: 245, readTime: 7.5, bounceRate: 25 },
    { period: "Sam", views: 1670, comments: 29, shares: 56, likes: 167, readTime: 5.9, bounceRate: 40 },
    { period: "Dim", views: 1420, comments: 22, shares: 41, likes: 142, readTime: 5.5, bounceRate: 42 }
  ];

  const topContent: ContentMetrics[] = [
    {
      title: "L'Intelligence Artificielle révolutionne la livraison alimentaire",
      type: "news",
      views: 2450,
      engagement: 8.7,
      comments: 23,
      shares: 34,
      conversionRate: 4.2,
      averageReadTime: "8:30",
      publishedAt: "15 Jan 2025"
    },
    {
      title: "Bistrot du Marché - Cas d'étude",
      type: "case-study",
      views: 1890,
      engagement: 12.3,
      comments: 15,
      shares: 28,
      conversionRate: 7.8,
      averageReadTime: "12:45",
      publishedAt: "10 Jan 2025"
    },
    {
      title: "Les 10 tendances FoodTech qui vont marquer 2025",
      type: "news",
      views: 1670,
      engagement: 6.9,
      comments: 19,
      shares: 22,
      conversionRate: 3.1,
      averageReadTime: "6:20",
      publishedAt: "12 Jan 2025"
    }
  ];

  const audienceData = [
    { name: "Restaurateurs", value: 35, color: "#b70f23" },
    { name: "Livreurs", value: 25, color: "#f4b71b" },
    { name: "Entreprises", value: 20, color: "#70070e" },
    { name: "Affiliés", value: 12, color: "#ff6b35" },
    { name: "Autres", value: 8, color: "#4ecdc4" }
  ];

  const getCurrentMetrics = () => {
    const totalViews = analyticsData.reduce((sum, item) => sum + item.views, 0);
    const totalComments = analyticsData.reduce((sum, item) => sum + item.comments, 0);
    const totalShares = analyticsData.reduce((sum, item) => sum + item.shares, 0);
    const totalLikes = analyticsData.reduce((sum, item) => sum + item.likes, 0);
    const avgReadTime = analyticsData.reduce((sum, item) => sum + item.readTime, 0) / analyticsData.length;
    const avgBounceRate = analyticsData.reduce((sum, item) => sum + item.bounceRate, 0) / analyticsData.length;

    return {
      totalViews,
      totalComments,
      totalShares,
      totalLikes,
      avgReadTime,
      avgBounceRate,
      engagementRate: ((totalComments + totalShares + totalLikes) / totalViews * 100).toFixed(1)
    };
  };

  const metrics = getCurrentMetrics();

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "views": return <Eye className="w-5 h-5" />;
      case "comments": return <MessageCircle className="w-5 h-5" />;
      case "shares": return <Share2 className="w-5 h-5" />;
      case "likes": return <Heart className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "views": return "#3b82f6";
      case "comments": return "#10b981";
      case "shares": return "#f59e0b";
      case "likes": return "#ef4444";
      default: return "#6366f1";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-blue-600 mb-2">
              <Eye className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Vues</div>
            <div className="flex items-center justify-center text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-green-600 mb-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalComments}</div>
            <div className="text-sm text-gray-600">Commentaires</div>
            <div className="flex items-center justify-center text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-orange-600 mb-2">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalShares}</div>
            <div className="text-sm text-gray-600">Partages</div>
            <div className="flex items-center justify-center text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-red-600 mb-2">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalLikes}</div>
            <div className="text-sm text-gray-600">Likes</div>
            <div className="flex items-center justify-center text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-purple-600 mb-2">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.engagementRate}%</div>
            <div className="text-sm text-gray-600">Engagement</div>
            <div className="flex items-center justify-center text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center text-[#b70f23] mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.avgReadTime.toFixed(1)}m</div>
            <div className="text-sm text-gray-600">Temps lecture</div>
            <div className="flex items-center justify-center text-red-600 text-xs mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Top Contenu</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Évolution de l'engagement</span>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === "7d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod("7d")}
                    >
                      7J
                    </Button>
                    <Button
                      variant={selectedPeriod === "30d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod("30d")}
                    >
                      30J
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Vues"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="comments" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Commentaires"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="shares" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Partages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Taux d'engagement</span>
                    <span className="font-semibold text-[#b70f23]">{metrics.engagementRate}%</span>
                  </div>
                  <Progress value={parseFloat(metrics.engagementRate)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Taux de rebond</span>
                    <span className="font-semibold text-orange-600">{metrics.avgBounceRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.avgBounceRate} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Temps de lecture</span>
                    <span className="font-semibold text-green-600">{metrics.avgReadTime.toFixed(1)}m</span>
                  </div>
                  <Progress value={(metrics.avgReadTime / 10) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#b70f23]">A+</div>
                    <div className="text-sm text-gray-600">Score de performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition de l'audience</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {audienceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Données démographiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Âge</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">25-34 ans</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">35-44 ans</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">45-54 ans</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Localisation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>France</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Belgique</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suisse</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Autres</span>
                      <span className="font-medium">3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu le plus performant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={item.type === "news" ? "default" : "secondary"}>
                          {item.type === "news" ? "Actualité" : "Cas d'étude"}
                        </Badge>
                        {index === 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Award className="w-3 h-3 mr-1" />
                            Top
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">Publié le {item.publishedAt}</p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{item.views.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Vues</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{item.engagement}%</div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{item.conversionRate}%</div>
                        <div className="text-xs text-gray-600">Conversion</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#b70f23]">{item.averageReadTime}</div>
                        <div className="text-xs text-gray-600">Lecture</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance globale</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                  <Bar dataKey="comments" fill="#10b981" name="Commentaires" />
                  <Bar dataKey="shares" fill="#f59e0b" name="Partages" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}