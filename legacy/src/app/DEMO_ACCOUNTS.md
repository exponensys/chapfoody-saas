# Comptes de Démonstration CHAPFOODY

⚠️ **ATTENTION : Ce fichier est uniquement pour le développement - À SUPPRIMER EN PRODUCTION !**

## Vue d'ensemble

Les comptes de démonstration permettent aux développeurs et testeurs d'accéder facilement aux différents dashboards de CHAPFOODY sans avoir à créer de vrais comptes utilisateurs.

## Comptes disponibles

### Comptes Principaux

| Type d'utilisateur | Email | Mot de passe | Dashboard |
|-------------------|-------|--------------|-----------|
| **Restaurant** | `demo@restaurant.com` | `demo123` | Dashboard Restaurant |
| **Livreur** | `demo@livreur.com` | `demo123` | Dashboard Livreur |
| **Entreprise** | `demo@entreprise.com` | `demo123` | Dashboard Entreprise |
| **Affilié** | `demo@affilie.com` | `demo123` | Dashboard Affilié |

### Comptes Business Spécialisés

| Secteur d'activité | Email | Mot de passe | Dashboard |
|-------------------|-------|--------------|-----------|
| **Restaurants/Fast-food** | `demo@restaurant-fastfood.com` | `demo123` | Dashboard Business Restaurant |
| **Bars/Maquis** | `demo@bar-maquis.com` | `demo123` | Dashboard Business Bar |
| **Métiers de Bouche** | `demo@metier-bouche.com` | `demo123` | Dashboard Business Métiers |
| **Épiceries** | `demo@epicerie.com` | `demo123` | Dashboard Business Épicerie |
| **Fruiteries** | `demo@fruiterie.com` | `demo123` | Dashboard Business Fruiterie |
| **Producteurs** | `demo@producteur.com` | `demo123` | Dashboard Business Producteurs |
| **Catering** | `demo@catering.com` | `demo123` | Dashboard Business Catering |
| **Boutiques** | `demo@boutique.com` | `demo123` | Dashboard Business Boutiques |

### Compte par Défaut

| Email | Mot de passe | Utilisation |
|-------|--------------|-------------|
| `demo@chapfoody.com` | `demo123` | Compte de fallback universel |

## Utilisation

### Dans l'Interface

1. **Page de Connexion** : Une section "Compte de démonstration" s'affiche automatiquement
2. **Page d'Inscription** : Une section "Tester sans créer de compte" redirige vers la connexion
3. **Bouton "Utiliser le compte démo"** : Remplit automatiquement les champs et se connecte

### Détection Automatique

Le système détecte automatiquement les comptes de démonstration et :
- Assigne le bon type d'utilisateur selon l'email
- Affiche un message dans la console : `🎭 Connexion avec compte de démonstration: [type]`
- Redirige vers le dashboard approprié

## Architecture Technique

### Fichiers Impliqués

- `/utils/demoAccounts.ts` - Configuration centralisée des comptes
- `/components/DemoAccountSection.tsx` - Composant d'interface réutilisable
- `/pages/LoginPage.tsx` - Page de connexion avec support démo
- `/pages/SignupPage.tsx` - Page d'inscription avec lien démo
- `/hooks/useAppNavigation.ts` - Logique d'authentification avec détection démo

### Fonctions Utilitaires

```typescript
// Obtenir le compte démo pour un type d'utilisateur
getDemoAccount(userType: string): DemoAccount

// Vérifier si des identifiants correspondent à un compte démo
isDemoAccount(email: string, password: string): boolean

// Obtenir le type d'utilisateur d'un compte démo
getDemoUserType(email: string): string | null

// Obtenir tous les comptes démo disponibles
getAllDemoAccounts(): DemoAccount[]
```

## Suppression en Production

### Étapes à suivre :

1. **Supprimer les fichiers** :
   - `/utils/demoAccounts.ts`
   - `/components/DemoAccountSection.tsx`
   - `/DEMO_ACCOUNTS.md`

2. **Nettoyer les imports** dans :
   - `/pages/LoginPage.tsx`
   - `/pages/SignupPage.tsx`
   - `/hooks/useAppNavigation.ts`

3. **Retirer les composants** :
   - `<DemoAccountSection />` des pages de connexion/inscription

4. **Simplifier la logique d'auth** :
   - Retirer les vérifications `isDemoAccount()` et `getDemoUserType()`

### Script de nettoyage suggéré :

```bash
# Supprimer les fichiers de démonstration
rm utils/demoAccounts.ts
rm components/DemoAccountSection.tsx
rm DEMO_ACCOUNTS.md

# Rechercher et supprimer toutes les références
grep -r "DemoAccountSection\|demoAccounts\|isDemoAccount" src/
```

## Sécurité

⚠️ **Points d'attention** :
- Ces comptes ne doivent **JAMAIS** être déployés en production
- Ils contiennent des mots de passe faibles par design
- Un warning s'affiche dans la console lors de l'import du module
- La section démo contient un avertissement visible

## Support Développeur

Pour ajouter un nouveau compte de démonstration, modifiez l'objet `demoAccounts` dans `/utils/demoAccounts.ts` :

```typescript
"nouveau-type": {
  email: "demo@nouveau-type.com",
  password: "demo123",
  userType: "nouveau-type",
  displayName: "Nouveau Type Démo"
}
```

---

**Rappel Important** : Ces comptes sont uniquement pour faciliter le développement et les tests. Ils doivent être supprimés avant la mise en production !