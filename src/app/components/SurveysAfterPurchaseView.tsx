import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ClipboardList, 
  Plus, 
  Eye, 
  Edit, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle,
  Send,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface Survey {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  questions: SurveyQuestion[];
  responses: number;
  satisfactionScore: number;
  createdDate: string;
  completionRate: number;
  avgResponseTime: number;
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'choice' | 'nps';
  question: string;
  required: boolean;
  options?: string[];
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  customerName: string;
  rating: number;
  feedback: string;
  date: string;
  orderValue: number;
}

const mockSurveys: Survey[] = [
  {
    id: '1',
    name: 'Satisfaction Livraison',
    status: 'active',
    questions: [
      { id: '1', type: 'rating', question: 'Comment notez-vous votre livraison ?', required: true },
      { id: '2', type: 'text', question: 'Commentaires sur le service', required: false }
    ],
    responses: 234,
    satisfactionScore: 4.3,
    createdDate: '2024-01-01',
    completionRate: 78,
    avgResponseTime: 2.5
  },
  {
    id: '2',
    name: 'Qualité des Plats',
    status: 'active',
    questions: [
      { id: '1', type: 'rating', question: 'Qualité de votre commande ?', required: true },
      { id: '2', type: 'choice', question: 'Recommanderiez-vous ?', required: true, options: ['Oui', 'Non', 'Peut-être'] }
    ],
    responses: 189,
    satisfactionScore: 4.6,
    createdDate: '2024-01-05',
    completionRate: 85,
    avgResponseTime: 1.8
  }
];

const mockResponses: SurveyResponse[] = [
  {
    id: '1',
    surveyId: '1',
    customerName: 'Marie Dubois',
    rating: 5,
    feedback: 'Excellente livraison, très rapide !',
    date: '2024-01-14',
    orderValue: 35.50
  },
  {
    id: '2',
    surveyId: '1',
    customerName: 'Jean Martin',
    rating: 4,
    feedback: 'Bon service, quelques minutes de retard',
    date: '2024-01-13',
    orderValue: 28.00
  }
];

interface SurveysAfterPurchaseViewProps {
  onBack?: () => void;
}

export function SurveysAfterPurchaseView({ onBack }: SurveysAfterPurchaseViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Sondages Après-Achat</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Collectez les avis de vos clients automatiquement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Rapports
          </Button>
          <Button 
            className="gap-2 bg-[#b70f23] hover:bg-[#70070e]"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau sondage
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sondages actifs</p>
                  <p className="text-2xl font-bold">{mockSurveys.filter(s => s.status === 'active').length}</p>
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Réponses collectées</p>
                  <p className="text-2xl font-bold">{mockSurveys.reduce((sum, s) => sum + s.responses, 0)}</p>
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
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold">
                    {(mockSurveys.reduce((sum, s) => sum + s.satisfactionScore, 0) / mockSurveys.length).toFixed(1)}/5
                  </p>
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
                  <p className="text-sm text-gray-600">Taux de completion</p>
                  <p className="text-2xl font-bold">
                    {Math.round(mockSurveys.reduce((sum, s) => sum + s.completionRate, 0) / mockSurveys.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Surveys List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes sondages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockSurveys.map((survey) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{survey.name}</h4>
                      <p className="text-sm text-gray-600">
                        Créé le {new Date(survey.createdDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(survey.status)}>
                      {survey.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{survey.responses}</p>
                    <p className="text-sm text-gray-600">Réponses</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {renderStars(Math.round(survey.satisfactionScore))}
                    </div>
                    <p className="text-sm text-gray-600">{survey.satisfactionScore}/5</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{survey.completionRate}%</p>
                    <p className="text-sm text-gray-600">Complété</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{survey.avgResponseTime}min</p>
                    <p className="text-sm text-gray-600">Temps moyen</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Réponses récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResponses.map((response) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {response.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{response.customerName}</h4>
                      <div className="flex items-center gap-2 my-1">
                        {renderStars(response.rating)}
                        <span className="text-sm text-gray-600">({response.rating}/5)</span>
                      </div>
                      <p className="text-sm text-gray-700">{response.feedback}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Commande de €{response.orderValue} • {new Date(response.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {response.rating >= 4 ? (
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Survey Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau sondage</DialogTitle>
            <DialogDescription>
              Configurez votre sondage après-achat pour collecter des avis clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="surveyName">Nom du sondage</Label>
              <Input id="surveyName" placeholder="Ex: Satisfaction Livraison" />
            </div>
            
            <div>
              <Label htmlFor="trigger">Déclencheur</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Quand envoyer le sondage ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Après livraison</SelectItem>
                  <SelectItem value="pickup">Après retrait</SelectItem>
                  <SelectItem value="24h">24h après commande</SelectItem>
                  <SelectItem value="week">1 semaine après</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question1">Question principale</Label>
              <Input id="question1" placeholder="Comment notez-vous votre expérience ?" />
            </div>

            <div>
              <Label htmlFor="followup">Question de suivi (optionnel)</Label>
              <Textarea id="followup" placeholder="Commentaires ou suggestions ?" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                <Send className="w-4 h-4 mr-2" />
                Créer le sondage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}