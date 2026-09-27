import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { StockCategoriesView } from './StockCategoriesView';
import { IngredientsManagementView } from './IngredientsManagementView';
import { ProductsManagementView } from './ProductsManagementView';
import { UtensilsManagementView } from './UtensilsManagementView';
import { PurchaseOrdersView } from './PurchaseOrdersView';
import { 
  ArrowLeft, 
  Package, 
  ChefHat, 
  Utensils, 
  ShoppingCart,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';

interface StockViewProps {
  onBack: () => void;
  activeSubSection?: string;
}

export function StockView({ onBack, activeSubSection }: StockViewProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'categories' | 'ingredients' | 'products' | 'utensils' | 'purchases'>('overview');
  const [showReporting, setShowReporting] = useState(false);

  // Gérer la navigation basée sur activeSubSection
  useEffect(() => {
    if (activeSubSection === 'categories') {
      setCurrentView('categories');
    } else if (activeSubSection === 'ingredients') {
      setCurrentView('ingredients');
    } else if (activeSubSection === 'produits') {
      setCurrentView('products');
    } else if (activeSubSection === 'ustensiles') {
      setCurrentView('utensils');
    } else if (activeSubSection === 'achats') {
      setCurrentView('purchases');
    } else {
      setCurrentView('overview');
    }
  }, [activeSubSection]);

  // Vue de gestion des catégories
  if (currentView === 'categories') {
    return (
      <StockCategoriesView 
        onBack={() => {
          setCurrentView('overview');
        }} 
      />
    );
  }

  // Vue de gestion des ingrédients
  if (currentView === 'ingredients') {
    return (
      <IngredientsManagementView 
        onBack={() => {
          setCurrentView('overview');
        }} 
      />
    );
  }

  // Vue de gestion des produits à vendre
  if (currentView === 'products') {
    return (
      <ProductsManagementView 
        onBack={() => {
          setCurrentView('overview');
        }} 
      />
    );
  }

  // Vue de gestion des ustensiles
  if (currentView === 'utensils') {
    return (
      <UtensilsManagementView 
        onBack={() => {
          setCurrentView('overview');
        }} 
      />
    );
  }

  // Vue des achats/commandes
  if (currentView === 'purchases') {
    return (
      <PurchaseOrdersView 
        onBack={() => {
          setCurrentView('overview');
        }} 
      />
    );
  }

  // Vue principale (overview)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-medium text-[#b70f23]">Stock & Ingrédients</h2>
            <p className="text-muted-foreground">
              Gérez vos ingrédients, produits à vendre et ustensiles
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant={showReporting ? "default" : "outline"}
            onClick={() => setShowReporting(!showReporting)}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Reporting
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('categories')}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Gérer catégories
          </Button>
        </div>
      </div>

      {/* Reporting Section */}
      <AnimatePresence>
        {showReporting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Reporting du jour - Stock & Ingrédients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">487</div>
                    <div className="text-sm opacity-90">Articles en stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm opacity-90">Ruptures de stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1.2M</div>
                    <div className="text-sm opacity-90">Valeur du stock (FCFA)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm opacity-90">Commandes en cours</div>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-4 text-white">Ingrédients</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">En stock:</span>
                        <span className="text-white font-medium">245 articles</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Ruptures:</span>
                        <span className="text-red-300 font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Valeur:</span>
                        <span className="text-white font-medium">680k FCFA</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4 text-white">Produits à vendre</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">En stock:</span>
                        <span className="text-white font-medium">156 articles</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Ruptures:</span>
                        <span className="text-red-300 font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Valeur:</span>
                        <span className="text-white font-medium">420k FCFA</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4 text-white">Ustensiles</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">En stock:</span>
                        <span className="text-white font-medium">86 articles</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Défaillants:</span>
                        <span className="text-red-300 font-medium">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Valeur:</span>
                        <span className="text-white font-medium">120k FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ingrédients */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('ingredients')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-[#b70f23]">Ingrédients</CardTitle>
                <p className="text-sm text-muted-foreground">Pour la préparation des repas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles en stock</span>
                <Badge className="bg-green-100 text-green-800">245</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ruptures de stock</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valeur totale</span>
                <span className="font-medium">680k FCFA</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">5 articles à renouveler</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produits à vendre */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('products')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-[#b70f23]">Produits à vendre</CardTitle>
                <p className="text-sm text-muted-foreground">Boissons, sucreries, etc.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles en stock</span>
                <Badge className="bg-blue-100 text-blue-800">156</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ruptures de stock</span>
                <Badge variant="destructive">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valeur totale</span>
                <span className="font-medium">420k FCFA</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Ventes en hausse</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ustensiles & Équipements */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('utensils')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-[#b70f23]">Ustensiles</CardTitle>
                <p className="text-sm text-muted-foreground">Équipements de cuisine</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Articles disponibles</span>
                <Badge className="bg-purple-100 text-purple-800">86</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Défaillants</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valeur totale</span>
                <span className="font-medium">120k FCFA</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">État général bon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achats / Commandes */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer md:col-span-2 lg:col-span-3" onClick={() => setCurrentView('purchases')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-[#b70f23]">Achats / Commandes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Passez des commandes pour renforcer vos stocks
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">8</div>
                <div className="text-sm text-muted-foreground">Commandes en cours</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">24</div>
                <div className="text-sm text-muted-foreground">Livrées cette semaine</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">340k</div>
                <div className="text-sm text-muted-foreground">Montant en cours (FCFA)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">15</div>
                <div className="text-sm text-muted-foreground">Fournisseurs actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap">
        <Button 
          variant="outline"
          onClick={() => setCurrentView('ingredients')}
          className="gap-2"
        >
          <ChefHat className="w-4 h-4" />
          Gérer ingrédients
        </Button>
        <Button 
          variant="outline"
          onClick={() => setCurrentView('products')}
          className="gap-2"
        >
          <Package className="w-4 h-4" />
          Gérer produits
        </Button>
        <Button 
          variant="outline"
          onClick={() => setCurrentView('utensils')}
          className="gap-2"
        >
          <Utensils className="w-4 h-4" />
          Gérer ustensiles
        </Button>
        <Button 
          onClick={() => setCurrentView('purchases')}
          className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Nouvelle commande
        </Button>
      </div>
    </div>
  );
}