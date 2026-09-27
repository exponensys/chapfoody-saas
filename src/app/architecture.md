# Architecture CHAPFOODY - Dashboard Multi-Utilisateurs

## Vue d'Ensemble

CHAPFOODY est une application SaaS multi-dashboard pour l'écosystème de la restauration et de l'alimentation, supportant 4 types d'utilisateurs distincts avec une charte graphique basée sur les couleurs rouge vif (#b70f23), jaune-orangé (#f4b71b), et bordeaux profond (#70070e).

## Architecture Générale

```
┌─────────────────┐
│     App.tsx     │ ← Point d'entrée unique
└─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐
│  useAppState()  │◄───┤ useAppNavigation │
│   (État Global) │    │   (Navigation)   │
└─────────────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   routes.tsx    │    │   Handlers de    │
│  (Routing)      │    │   Navigation     │
└─────────────────┘    └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Pages/Views   │
│   Components    │
└─────────────────┘
```

## 1. Couche d'Entrée - App.tsx

### Responsabilités
- Point d'entrée unique de l'application
- Orchestration des hooks de navigation et d'état
- Gestion globale des erreurs
- Rendu des routes avec tous les handlers

### Structure
```typescript
export default function App() {
  // État global via useAppState()
  const { currentView, selectedUserType, userSession, ... } = useAppState();
  
  // Handlers de navigation via useAppNavigation()
  const navigationHandlers = useAppNavigation({ ... });
  
  // Rendu de la route active
  return renderRoute({ ... });
}
```

## 2. Couche de Gestion d'État

### useAppState() - `/hooks/useAppState.ts`
Gère l'état global de l'application :
- **currentView**: Vue active (ViewState)
- **selectedUserType**: Type d'utilisateur sélectionné
- **userSession**: Session utilisateur active
- **selectedCaseStudyId**: ID de l'étude de cas sélectionnée
- **selectedNewsId**: ID de l'actualité sélectionnée
- **selectedUserTypeForDetail**: Type d'utilisateur pour les détails
- **selectedSolutionType**: Type de solution sélectionné

### useAppNavigation() - `/hooks/useAppNavigation.ts`
Centralise tous les handlers de navigation :
- Navigation entre les vues
- Gestion des authentifications
- Navigation contextuelle (dashboard selon type d'utilisateur)
- Handlers spécialisés (paramètres, test, export avancé, etc.)

## 3. Couche de Routing - routes.tsx

### Types de Vues Supportées
```typescript
type ViewState = 
  | "landing" | "home" | "login" | "signup" 
  | "restaurant" | "delivery" | "company" | "affiliate"
  | "case-studies" | "news" | "admin" | "support"
  | "settings" | "test" | "dashboard-preview"
  | // ... autres vues
```

### Logique de Routing
- **Routing conditionnel** : Différents dashboards selon le type d'utilisateur
- **UnifiedBusinessDashboard** pour les types business-*
- **RestaurantDashboard** pour les restaurants classiques
- **Dashboards spécialisés** pour delivery, company, affiliate

## 4. Architecture des Dashboards

### Dashboard Restaurant (Principal)
**Fichier**: `/pages/RestaurantDashboard.tsx`

```
RestaurantDashboard
├── LiveOrdersProvider (Context)
├── SidebarWithSubmenus
├── TopBar (notifications, export, déconnexion)
└── Main Content Area
    ├── StockView
    ├── MenuView  
    ├── AccountingView
    ├── SettingsView
    ├── LiveOrdersView
    ├── KitchenView
    ├── ReservationView
    └── POSView
```

#### Sections du Dashboard Restaurant
1. **Tableau de bord** - Vue d'ensemble avec métriques
2. **Commande Live** - Gestion temps réel des commandes
3. **Vue Cuisine** - Interface dédiée à la cuisine
4. **Réservation** - Gestion des réservations
5. **Liste de commandes** - Avec sous-sections (attente, préparation, etc.)
6. **Gestion Cuisine** - Menu, catégories, spécialités, etc.
7. **Stock & Ingrédients** - Gestion complète des stocks
8. **Entreprises de livraison** - Partenaires et logistique
9. **Comptabilité** - Finances, factures, analytics
10. **Logiciels Caisse** - Interface PDV
11. **Rapports** - Analytics et reporting
12. **Paramètres** - Configuration système

### Autres Dashboards
- **DeliveryDashboard** - Interface livreurs
- **CompanyDashboard** - Interface entreprises
- **AffiliateDashboard** - Interface affiliés marketing
- **UnifiedBusinessDashboard** - Interface business unifiée

## 5. Composants d'Infrastructure

### SidebarWithSubmenus - `/components/SidebarWithSubmenus.tsx`
- **Navigation hiérarchique** avec sections et sous-sections
- **État d'expansion** pour les menus
- **Indicateurs visuels** (notifications, badges premium)
- **Responsive** avec sidebar mobile

### Configuration du Menu - `/data/restaurantDashboardData.ts`
```typescript
export const getMenuSections = (
  hasNewOrders: boolean, 
  unreadOrdersCount: number, 
  activeSection: string, 
  handleActiveSection: Function,
  setActiveSubSection: Function, 
  handleSubSectionNavigation?: Function
) => [
  // Définition complète des sections et sous-sections
];
```

## 6. Gestion des Données

### Structure des Données
```
/data/
├── restaurantDashboardData.ts     # Configuration menu restaurant
├── businessDashboardConfigurations.ts  # Configurations business
├── mockOrdersData.ts              # Données de commandes simulées  
├── solutionsData.ts               # Données des solutions
└── updatedBusinessDashboardConfigurations.ts
```

### Contextes React
```
/contexts/
└── LiveOrdersContext.tsx          # Gestion état commandes temps réel
```

## 7. Composants Spécialisés

### Vues Métier
```
/components/
├── AccountingView.tsx             # Comptabilité
├── StockView.tsx                  # Gestion des stocks
├── MenuView.tsx                   # Gestion du menu
├── LiveOrdersView.tsx             # Commandes temps réel
├── KitchenView.tsx                # Interface cuisine
├── ReservationView.tsx            # Réservations
├── SettingsView.tsx               # Paramètres système
└── POSView.tsx                    # Point de vente
```

### Sous-vues Spécialisées
```
├── FinancialAnalyticsView.tsx     # Analytics financiers
├── InvoiceManagementView.tsx      # Gestion factures
├── TransactionsView.tsx           # Transactions
├── CashClosureView.tsx            # Clôture caisse
├── VATManagementView.tsx          # Gestion TVA
├── StockCategoriesView.tsx        # Catégories stock
├── IngredientsManagementView.tsx  # Gestion ingrédients
├── ProductsManagementView.tsx     # Gestion produits
└── SuppliersManagementView.tsx    # Gestion fournisseurs
```

## 8. Architecture des Pages

### Pages Principales
```
/pages/
├── RestaurantDashboard.tsx        # Dashboard restaurant complet
├── DeliveryDashboard.tsx          # Dashboard livraison
├── CompanyDashboard.tsx           # Dashboard entreprise
├── AffiliateDashboard.tsx         # Dashboard affilié
├── AdminDashboard.tsx             # Dashboard admin
├── LandingPage.tsx                # Page d'accueil
├── HomePage.tsx                   # Page d'accueil connectée
├── LoginPage.tsx                  # Authentification
├── SignupPage.tsx                 # Inscription
└── TestPage.tsx                   # Page de diagnostic
```

### Pages de Support
```
├── BusinessSelectionPage.tsx      # Sélection type business
├── CaseStudiesPage.tsx           # Études de cas
├── NewsPage.tsx                   # Actualités
├── SupportPage.tsx                # Support client
├── ContactPage.tsx                # Contact
└── AdvancedExportDashboard.tsx    # Export avancé
```

## 9. Services et Utilitaires

### Services
```
/services/
└── ExportService.tsx              # Service d'export PDF/Excel
```

### Utilitaires
```
/utils/
├── orderUtils.ts                  # Utilitaires commandes
├── soundUtils.ts                  # Gestion des sons/notifications
└── supabase/
    └── info.tsx                   # Configuration Supabase
```

### Hooks Spécialisés
```
/hooks/
├── useAppState.ts                 # État global application
├── useAppNavigation.ts            # Navigation globale
├── useDashboardConfig.ts          # Configuration dashboard
└── useLiveOrders.ts               # Commandes temps réel
```

## 10. Composants UI et Design System

### Composants UI Shadcn/ui
```
/components/ui/
├── button.tsx, card.tsx, input.tsx, select.tsx
├── dialog.tsx, sheet.tsx, dropdown-menu.tsx
├── table.tsx, tabs.tsx, accordion.tsx
├── chart.tsx, calendar.tsx, form.tsx
└── // ... 40+ composants UI standardisés
```

### Composants Spécifiques CHAPFOODY
```
├── Logo.tsx                       # Logo avec variantes
├── BlinkingIndicator.tsx          # Indicateurs clignotants
├── PremiumBadge.tsx              # Badges premium
├── WindowsPhoneTiles.tsx          # Tuiles style Windows Phone
├── OrderCard.tsx                  # Cartes de commandes
├── OrderStats.tsx                 # Statistiques commandes
└── SyncStatusIndicator.tsx        # Indicateur de synchronisation
```

## 11. Système de Style

### Configuration Tailwind v4
```css
/* /styles/globals.css */
:root {
  --font-size: 14px;
  --background: #ffffff;
  /* Variables CSS pour le design system */
}
```

### Charte Graphique CHAPFOODY
- **Rouge vif** : #b70f23 (couleur principale)
- **Jaune-orangé** : #f4b71b (accents)  
- **Bordeaux profond** : #70070e (foncé)
- **Style Windows Phone** : Tuiles dynamiques et design épuré

## 12. Flux de Navigation Typique

### Authentification → Dashboard
```
Landing → Login → Dashboard (selon type utilisateur)
   │        │         ├── Restaurant Dashboard
   │        │         ├── Delivery Dashboard  
   │        │         ├── Company Dashboard
   │        │         └── Affiliate Dashboard
   │        │
   │        └── Signup → Même logique
   │
   └── Navigation publique (case studies, news, support)
```

### Navigation dans le Dashboard Restaurant
```
Dashboard Restaurant
├── Sidebar Navigation
│   ├── Section Selection
│   └── Subsection Navigation
├── Main Content Area
│   ├── Conditional Rendering par section
│   └── Props drilling pour navigation
└── Context Providers
    └── LiveOrdersContext pour état temps réel
```

## 13. Gestion des États et Performances

### État Local vs Global
- **État global** (useAppState) : Navigation, session utilisateur
- **État local** : États spécifiques aux composants
- **Contextes** : États partagés métier (LiveOrders)

### Optimisations
- **Lazy loading** des composants lourds
- **Conditional rendering** pour les sections non actives
- **Memoization** des données de configuration
- **Debouncing** pour les recherches et filtres

## 14. Sécurité et Backend

### Supabase Integration
```
/supabase/functions/server/
├── index.tsx                      # Serveur Hono principal
└── kv_store.tsx                   # Store clé-valeur protégé
```

### Authentification
- **Session management** via useAppState
- **Route protection** selon le type d'utilisateur
- **API calls** sécurisées vers Supabase

## 15. Tests et Debugging

### Pages de Test
- **TestPage.tsx** : Diagnostic complet du système
- **AdminDashboard.tsx** : Outils d'administration
- **dev_journal.md** : Journal de développement et debug

### Monitoring
- **Error boundaries** dans App.tsx
- **Console logging** pour le debug
- **Sound notifications** pour les événements temps réel

Cette architecture modulaire permet une maintenance facilitée, une scalabilité élevée et une expérience utilisateur cohérente à travers tous les types de dashboards CHAPFOODY.