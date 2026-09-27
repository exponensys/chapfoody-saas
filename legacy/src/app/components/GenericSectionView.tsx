import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Package,
  Plus,
  Settings,
  Star,
  Award,
  Shield,
  Store,
  ChefHat,
  Truck,
  CalendarDays,
  Wine,
  Coffee,
  ClipboardList,
  ShoppingBag,
  Layers,
  Target,
  Zap,
  Apple,
  Repeat,
  Percent
} from 'lucide-react';

interface GenericSectionViewProps {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
  onBack?: () => void;
}

const getSectionIcon = (sectionId: string) => {
  switch (sectionId) {
    case 'production':
      return ChefHat;
    case 'tracabilite':
      return Shield;
    case 'gestion-produits':
      return Store;
    case 'gestion-carte':
      return Wine;
    case 'evenements':
      return CalendarDays;
    case 'stock-boissons':
      return Package;
    case 'programme-fidelite':
      return Award;
    case 'stock-inventaire':
      return ClipboardList;
    case 'click-collect':
      return ShoppingBag;
    case 'gestion-collections':
      return Layers;
    case 'fraicheur':
      return Zap;
    case 'stock-rotation':
      return Repeat;
    case 'promotions-flash':
      return Percent;
    case 'logistique':
      return Truck;
    case 'catalogue-b2b':
      return Store;
    case 'commandes-b2b':
      return ClipboardList;
    case 'clients-b2b':
      return Store;
    case 'menus-prestations':
      return Wine;
    case 'production-cuisine':
      return ChefHat;
    case 'logistique-evenements':
      return Truck;
    case 'equipes':
      return Store;
    case 'clients-entreprises':
      return Store;
    default:
      return Package;
  }
};

const getSectionFeatures = (sectionId: string) => {
  switch (sectionId) {
    case 'production':
      return [
        { label: 'Planning de production', icon: CalendarDays },
        { label: 'Recettes & formules', icon: ChefHat },
        { label: 'Contrôle qualité', icon: Shield },
        { label: 'Gestion des lots', icon: Package }
      ];
    case 'tracabilite':
      return [
        { label: 'Traçabilité HACCP', icon: Shield },
        { label: 'Contrôles sanitaires', icon: ClipboardList },
        { label: 'Températures', icon: Target },
        { label: 'Certifications', icon: Award }
      ];
    case 'gestion-produits':
      return [
        { label: 'Catalogue produits', icon: Store },
        { label: 'Prix & promotions', icon: Percent },
        { label: 'Photos & descriptions', icon: Star },
        { label: 'Stock & disponibilité', icon: Package }
      ];
    case 'programme-fidelite':
      return [
        { label: 'Points de fidélité', icon: Star },
        { label: 'Récompenses', icon: Award },
        { label: 'Niveaux VIP', icon: Target },
        { label: 'Campagnes spéciales', icon: Zap }
      ];
    case 'click-collect':
      return [
        { label: 'Commandes en ligne', icon: ShoppingBag },
        { label: 'Créneaux de retrait', icon: CalendarDays },
        { label: 'Notifications clients', icon: Zap },
        { label: 'Gestion des préparations', icon: Package }
      ];
    case 'evenements':
      return [
        { label: 'Calendrier événements', icon: CalendarDays },
        { label: 'Réservations privées', icon: Store },
        { label: 'Gestion équipes', icon: Target },
        { label: 'Logistique', icon: Truck }
      ];
    default:
      return [
        { label: 'Fonctionnalité 1', icon: Star },
        { label: 'Fonctionnalité 2', icon: Target },
        { label: 'Fonctionnalité 3', icon: Award },
        { label: 'Fonctionnalité 4', icon: Zap }
      ];
  }
};

export function GenericSectionView({ sectionId, sectionTitle, sectionDescription, onBack }: GenericSectionViewProps) {
  const IconComponent = getSectionIcon(sectionId);
  const features = getSectionFeatures(sectionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#b70f23] rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{sectionTitle}</h1>
              <p className="text-gray-600">{sectionDescription}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Retour
            </Button>
          )}
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <Plus className="w-4 h-4" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vue d'ensemble */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                Vue d'ensemble - {sectionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <IconComponent className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  Module en cours de développement
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Cette section sera bientôt disponible avec toutes les fonctionnalités 
                  nécessaires pour gérer {sectionTitle.toLowerCase()}.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
                    <Plus className="w-4 h-4" />
                    Commencer la configuration
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fonctionnalités */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Fonctionnalités prévues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#f4b71b] rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un élément
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Voir la liste
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Star className="w-4 h-4" />
                  Fonctionnalités premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total éléments</p>
                  <p className="text-2xl font-bold">0</p>
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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complétés</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}