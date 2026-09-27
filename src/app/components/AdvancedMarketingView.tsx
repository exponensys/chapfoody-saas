import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Megaphone, 
  Mail, 
  Send, 
  Users, 
  Target, 
  BarChart3,
  Plus, 
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Gift,
  Crown,
  Award,
  TrendingUp,
  Calendar,
  Filter,
  Star,
  ThumbsUp,
  Smartphone,
  Bell,
  RotateCcw,
  UserPlus,
  PieChart,
  Zap,
  ShoppingCart,
  Facebook,
  Cake,
  Settings
} from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

// Import all the new Marketing views
import { SurveysAfterPurchaseView } from './SurveysAfterPurchaseView';
import { MarketingCampaignsView } from './MarketingCampaignsView';
import { GoogleReviewsView } from './GoogleReviewsView';
import { FacebookAudienceSyncView } from './FacebookAudienceSyncView';
import { AbandonedCartsView } from './AbandonedCartsView';
import { LoyaltyProgramView } from './LoyaltyProgramView';
import { SMSMarketingView } from './SMSMarketingView';
import { CustomerSegmentationView } from './CustomerSegmentationView';
import { AutomationTriggersView } from './AutomationTriggersView';
import { ReferralProgramView } from './ReferralProgramView';
import { EmailMarketingView } from './EmailMarketingView';
import { WinbackCampaignsView } from './WinbackCampaignsView';
import { BirthdayRewardsView } from './BirthdayRewardsView';
import { PushNotificationsView } from './PushNotificationsView';

// Marketing module definition
interface MarketingModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'surveys' | 'campaigns' | 'email' | 'sms' | 'loyalty' | 'segmentation' | 'automation' | 'social' | 'push';
  isPremium: boolean;
  badge?: string;
}

const marketingModules: MarketingModule[] = [
  {
    id: 'surveys',
    name: 'Sondages Après-Achat',
    description: 'Collectez des avis clients automatiquement après chaque commande',
    icon: <MessageSquare className="w-6 h-6" />,
    category: 'surveys',
    isPremium: true,
    badge: 'IA'
  },
  {
    id: 'campaigns',
    name: 'Campagnes Multi-Canaux',
    description: 'Orchestrez des campagnes sur tous vos canaux de communication',
    icon: <Megaphone className="w-6 h-6" />,
    category: 'campaigns',
    isPremium: true,
    badge: 'Omni-canal'
  },
  {
    id: 'google-reviews',
    name: 'Gestion Avis Google',
    description: 'Surveillez et répondez aux avis Google automatiquement',
    icon: <Star className="w-6 h-6" />,
    category: 'social',
    isPremium: true,
    badge: 'Auto'
  },
  {
    id: 'facebook-sync',
    name: 'Facebook Audience Sync',
    description: 'Synchronisez vos segments clients avec Facebook Ads',
    icon: <Facebook className="w-6 h-6" />,
    category: 'social',
    isPremium: true,
    badge: 'Sync'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Newsletters, promotions et automatisations par email',
    icon: <Mail className="w-6 h-6" />,
    category: 'email',
    isPremium: false
  },
  {
    id: 'abandoned-carts',
    name: 'Paniers Abandonnés',
    description: 'Récupérez les commandes non finalisées automatiquement',
    icon: <ShoppingCart className="w-6 h-6" />,
    category: 'email',
    isPremium: true,
    badge: 'Smart'
  },
  {
    id: 'winback',
    name: 'Campagnes Reconquête',
    description: 'Réactivez vos clients inactifs avec des offres ciblées',
    icon: <RotateCcw className="w-6 h-6" />,
    category: 'email',
    isPremium: true,
    badge: 'IA'
  },
  {
    id: 'sms-marketing',
    name: 'SMS Marketing',
    description: 'Communications instantanées par SMS avec 98% d\'ouverture',
    icon: <Smartphone className="w-6 h-6" />,
    category: 'sms',
    isPremium: true
  },
  {
    id: 'push-notifications',
    name: 'Notifications Push',
    description: 'Notifications mobiles et web géolocalisées',
    icon: <Bell className="w-6 h-6" />,
    category: 'push',
    isPremium: true,
    badge: 'Géoloc'
  },
  {
    id: 'loyalty-program',
    name: 'Programme de Fidélité',
    description: 'Points, niveaux VIP et récompenses personnalisées',
    icon: <Crown className="w-6 h-6" />,
    category: 'loyalty',
    isPremium: true,
    badge: 'Gamification'
  },
  {
    id: 'birthday-rewards',
    name: 'Cadeaux d\'Anniversaire',
    description: 'Récompenses automatiques pour les anniversaires clients',
    icon: <Cake className="w-6 h-6" />,
    category: 'loyalty',
    isPremium: true,
    badge: 'Auto'
  },
  {
    id: 'referral-program',
    name: 'Programme de Parrainage',
    description: 'Développez votre clientèle grâce aux recommandations',
    icon: <UserPlus className="w-6 h-6" />,
    category: 'loyalty',
    isPremium: true,
    badge: 'Viral'
  },
  {
    id: 'segmentation',
    name: 'Segmentation Clients',
    description: 'Analyse RFM et scoring automatique des clients',
    icon: <Filter className="w-6 h-6" />,
    category: 'segmentation',
    isPremium: true,
    badge: 'RFM'
  },
  {
    id: 'automation',
    name: 'Déclencheurs Automatiques',
    description: 'Automatisez vos interactions marketing selon les comportements',
    icon: <Zap className="w-6 h-6" />,
    category: 'automation',
    isPremium: true,
    badge: 'Behavior'
  }
];

interface AdvancedMarketingViewProps {
  onBack?: () => void;
  initialView?: string;
}

export function AdvancedMarketingView({ onBack, initialView }: AdvancedMarketingViewProps) {
  const [currentView, setCurrentView] = useState<string>(initialView || 'dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Render specific view component
  const renderView = () => {
    switch (currentView) {
      case 'surveys':
        return <SurveysAfterPurchaseView onBack={() => setCurrentView('dashboard')} />;
      case 'campaigns':
        return <MarketingCampaignsView onBack={() => setCurrentView('dashboard')} />;
      case 'google-reviews':
        return <GoogleReviewsView onBack={() => setCurrentView('dashboard')} />;
      case 'facebook-sync':
        return <FacebookAudienceSyncView onBack={() => setCurrentView('dashboard')} />;
      case 'email-marketing':
        return <EmailMarketingView onBack={() => setCurrentView('dashboard')} />;
      case 'abandoned-carts':
        return <AbandonedCartsView onBack={() => setCurrentView('dashboard')} />;
      case 'winback':
        return <WinbackCampaignsView onBack={() => setCurrentView('dashboard')} />;
      case 'sms-marketing':
        return <SMSMarketingView onBack={() => setCurrentView('dashboard')} />;
      case 'push-notifications':
        return <PushNotificationsView onBack={() => setCurrentView('dashboard')} />;
      case 'loyalty-program':
        return <LoyaltyProgramView onBack={() => setCurrentView('dashboard')} />;
      case 'birthday-rewards':
        return <BirthdayRewardsView onBack={() => setCurrentView('dashboard')} />;
      case 'referral-program':
        return <ReferralProgramView onBack={() => setCurrentView('dashboard')} />;
      case 'segmentation':
        return <CustomerSegmentationView onBack={() => setCurrentView('dashboard')} />;
      case 'automation':
        return <AutomationTriggersView onBack={() => setCurrentView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  const filteredModules = selectedCategory === 'all' 
    ? marketingModules 
    : marketingModules.filter(module => module.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'surveys': return <MessageSquare className="w-4 h-4" />;
      case 'campaigns': return <Megaphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      case 'loyalty': return <Crown className="w-4 h-4" />;
      case 'segmentation': return <Filter className="w-4 h-4" />;
      case 'automation': return <Zap className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => (

    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Marketing Avancé</h1>
            <PremiumBadge />
          </div>
          <p className="text-gray-600">Suite complète d'outils marketing intelligents et automatisés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics Globales
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configuration
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modules actifs</p>
                  <p className="text-2xl font-bold">{marketingModules.length}</p>
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
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI moyen</p>
                  <p className="text-2xl font-bold">+347%</p>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients engagés</p>
                  <p className="text-2xl font-bold">2,847</p>
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
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Automatisations</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories Marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-[#b70f23] hover:bg-[#70070e]' : ''}
            >
              Tous les modules
            </Button>
            {['surveys', 'campaigns', 'email', 'sms', 'push', 'loyalty', 'segmentation', 'automation', 'social'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`gap-2 ${selectedCategory === category ? 'bg-[#b70f23] hover:bg-[#70070e]' : ''}`}
              >
                {getCategoryIcon(category)}
                <span className="capitalize">
                  {category === 'surveys' && 'Sondages'}
                  {category === 'campaigns' && 'Campagnes'}
                  {category === 'email' && 'Email'}
                  {category === 'sms' && 'SMS'}
                  {category === 'push' && 'Push'}
                  {category === 'loyalty' && 'Fidélité'}
                  {category === 'segmentation' && 'Segmentation'}
                  {category === 'automation' && 'Automation'}
                  {category === 'social' && 'Social'}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Modules Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Modules Marketing Disponibles</CardTitle>
          <p className="text-gray-600">Cliquez sur un module pour l'ouvrir et commencer à l'utiliser</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#f4b71b] group-hover:scale-105"
                  onClick={() => setCurrentView(module.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#b70f23] to-[#70070e] rounded-xl flex items-center justify-center text-white group-hover:from-[#f4b71b] group-hover:to-[#b70f23] transition-all duration-200">
                        {module.icon}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {module.isPremium && <PremiumBadge />}
                        {module.badge && (
                          <Badge variant="outline" className="text-xs bg-[#f4b71b] text-white border-[#f4b71b]">
                            {module.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-[#b70f23] transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {module.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs capitalize">
                        {module.category === 'surveys' && 'Sondages'}
                        {module.category === 'campaigns' && 'Campagnes'}
                        {module.category === 'email' && 'Email'}
                        {module.category === 'sms' && 'SMS'}
                        {module.category === 'push' && 'Push'}
                        {module.category === 'loyalty' && 'Fidélité'}
                        {module.category === 'segmentation' && 'Segmentation'}
                        {module.category === 'automation' && 'Automation'}
                        {module.category === 'social' && 'Social'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Ouvrir →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setCurrentView('email-marketing')}
            >
              <Mail className="w-8 h-8" />
              <span>Email Newsletter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setCurrentView('sms-marketing')}
            >
              <Smartphone className="w-8 h-8" />
              <span>SMS Flash</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setCurrentView('loyalty-program')}
            >
              <Crown className="w-8 h-8" />
              <span>Fidélité</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-[#f4b71b] hover:text-white transition-colors"
              onClick={() => setCurrentView('segmentation')}
            >
              <Target className="w-8 h-8" />
              <span>Segmentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {currentView !== 'dashboard' && (
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView('dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux modules
          </Button>
        </div>
      )}
      {renderView()}
    </div>
  );
}