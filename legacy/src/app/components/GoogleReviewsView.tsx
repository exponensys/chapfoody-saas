import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  ThumbsUp, 
  Star, 
  Eye, 
  MessageSquare, 
  ExternalLink,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface GoogleReview {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  replied: boolean;
  response?: string;
  responseDate?: string;
  helpful: number;
  source: 'Google' | 'Facebook' | 'TripAdvisor';
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  responseRate: number;
  recentTrend: 'up' | 'down' | 'stable';
}

const mockReviews: GoogleReview[] = [
  {
    id: '1',
    customerName: 'Marie Dubois',
    rating: 5,
    text: 'Excellent restaurant ! La qualité des plats est exceptionnelle et le service très attentionné. Je recommande vivement !',
    date: '2024-01-14',
    verified: true,
    replied: true,
    response: 'Merci beaucoup Marie pour ce merveilleux commentaire ! Nous sommes ravis que vous ayez apprécié votre expérience.',
    responseDate: '2024-01-14',
    helpful: 3,
    source: 'Google'
  },
  {
    id: '2',
    customerName: 'Jean Martin',
    rating: 4,
    text: 'Très bon restaurant, plats savoureux. Seul petit bémol : un peu d\'attente en soirée mais ça vaut le coup !',
    date: '2024-01-12',
    verified: true,
    replied: false,
    helpful: 2,
    source: 'Google'
  },
  {
    id: '3',
    customerName: 'Sophie Laurent',
    rating: 5,
    text: 'Une découverte formidable ! L\'ambiance est chaleureuse et la cuisine délicieuse. Parfait pour un dîner en famille.',
    date: '2024-01-10',
    verified: true,
    replied: true,
    response: 'Sophie, votre avis nous touche énormément ! Merci de nous avoir fait confiance pour votre soirée famille.',
    responseDate: '2024-01-11',
    helpful: 5,
    source: 'Google'
  },
  {
    id: '4',
    customerName: 'Pierre Durand',
    rating: 3,
    text: 'Restaurant correct sans plus. Le service était un peu lent et les portions moyennes pour le prix.',
    date: '2024-01-08',
    verified: true,
    replied: false,
    helpful: 1,
    source: 'Google'
  }
];

const reviewStats: ReviewStats = {
  totalReviews: 127,
  averageRating: 4.3,
  ratingDistribution: { 5: 65, 4: 32, 3: 18, 2: 8, 1: 4 },
  responseRate: 78,
  recentTrend: 'up'
};

interface GoogleReviewsViewProps {
  onBack?: () => void;
}

export function GoogleReviewsView({ onBack }: GoogleReviewsViewProps) {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null);
  const [autoResponse, setAutoResponse] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`${starSize} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Google': return 'bg-blue-100 text-blue-800';
      case 'Facebook': return 'bg-blue-600 text-white';
      case 'TripAdvisor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReviews = filterRating 
    ? mockReviews.filter(review => review.rating === filterRating)
    : mockReviews;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Avis Google</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Gérez votre réputation en ligne et répondez aux avis clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Rapports
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <ExternalLink className="w-4 h-4" />
            Voir sur Google
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{reviewStats.averageRating}</p>
                    <div className="flex">{renderStars(Math.round(reviewStats.averageRating))}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total avis</p>
                  <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de réponse</p>
                  <p className="text-2xl font-bold">{reviewStats.responseRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tendance</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">+12%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Répartition des notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating] || 0;
              const percentage = (count / reviewStats.totalReviews) * 100;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600 w-20 text-right">
                    {count} avis ({percentage.toFixed(0)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Auto-response Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres des réponses automatiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Réponses automatiques</h4>
                <p className="text-sm text-gray-600">Répondre automatiquement aux avis 5 étoiles</p>
              </div>
              <Switch checked={autoResponse} onCheckedChange={setAutoResponse} />
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label htmlFor="autoMessage" className="text-sm font-medium">Message automatique</Label>
              <Textarea 
                id="autoMessage"
                className="mt-2"
                placeholder="Merci beaucoup pour votre excellent avis ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous."
                defaultValue="Merci beaucoup pour votre excellent avis ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Avis récents</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className="p-2"
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setFilterRating(null)}>
                Tous
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {review.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{review.customerName}</h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                        <Badge className={getSourceBadgeColor(review.source)}>
                          {review.source}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className={`font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                        <span className="text-sm text-gray-500">
                          • {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.text}</p>
                      {review.helpful > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <ThumbsUp className="w-4 h-4" />
                          {review.helpful} personnes ont trouvé cet avis utile
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!review.replied && (
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          setSelectedReview(review);
                          setShowResponseModal(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Répondre
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {review.replied && review.response && (
                  <div className="ml-16 mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#b70f23] rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">R</span>
                      </div>
                      <span className="font-medium text-sm">Réponse du restaurant</span>
                      <span className="text-xs text-gray-500">
                        • {review.responseDate && new Date(review.responseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.response}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Modal */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Répondre à l'avis</DialogTitle>
            <DialogDescription>
              Rédigez une réponse professionnelle et personnalisée.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              {/* Review Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedReview.customerName}</span>
                  <div className="flex">{renderStars(selectedReview.rating)}</div>
                </div>
                <p className="text-sm text-gray-700">{selectedReview.text}</p>
              </div>

              {/* Response Form */}
              <div>
                <Label htmlFor="response">Votre réponse</Label>
                <Textarea 
                  id="response"
                  placeholder="Rédigez votre réponse ici..."
                  className="mt-2 min-h-[120px]"
                  defaultValue={
                    selectedReview.rating >= 4 
                      ? `Bonjour ${selectedReview.customerName.split(' ')[0]}, merci beaucoup pour votre excellent avis ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous.`
                      : `Bonjour ${selectedReview.customerName.split(' ')[0]}, merci pour votre retour. Nous prenons vos commentaires très au sérieux et travaillons constamment à améliorer notre service.`
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowResponseModal(false)}>
                  Annuler
                </Button>
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Send className="w-4 h-4 mr-2" />
                  Publier la réponse
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}