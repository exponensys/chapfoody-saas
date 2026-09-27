// Utility pour gérer les comptes de démonstration
// À SUPPRIMER EN PRODUCTION

export interface DemoAccount {
  email: string;
  password: string;
  userType: string;
  displayName: string;
}

// Configuration des comptes de démonstration par type d'utilisateur
export const demoAccounts: Record<string, DemoAccount> = {
  restaurant: {
    email: "demo@restaurant.com",
    password: "demo123",
    userType: "restaurant",
    displayName: "Restaurant Démo"
  },
  delivery: {
    email: "demo@livreur.com", 
    password: "demo123",
    userType: "delivery",
    displayName: "Livreur Démo"
  },
  company: {
    email: "demo@entreprise.com",
    password: "demo123", 
    userType: "company",
    displayName: "Entreprise Démo"
  },
  affiliate: {
    email: "demo@affilie.com",
    password: "demo123",
    userType: "affiliate", 
    displayName: "Affilié Démo"
  },
  // Comptes business spécialisés
  "business-restaurants-fastfood": {
    email: "demo@restaurant-fastfood.com",
    password: "demo123",
    userType: "business-restaurants-fastfood",
    displayName: "Restaurant/Fast-food Démo"
  },
  "business-bars-maquis": {
    email: "demo@bar-maquis.com", 
    password: "demo123",
    userType: "business-bars-maquis",
    displayName: "Bar/Maquis Démo"
  },
  "business-metiers-bouche": {
    email: "demo@metier-bouche.com",
    password: "demo123", 
    userType: "business-metiers-bouche",
    displayName: "Métier de Bouche Démo"
  },
  "business-epiceries": {
    email: "demo@epicerie.com",
    password: "demo123",
    userType: "business-epiceries", 
    displayName: "Épicerie Démo"
  },
  "business-fruiteries": {
    email: "demo@fruiterie.com",
    password: "demo123",
    userType: "business-fruiteries",
    displayName: "Fruiterie Démo"
  },
  "business-producteurs-fournisseurs": {
    email: "demo@producteur.com",
    password: "demo123",
    userType: "business-producteurs-fournisseurs", 
    displayName: "Producteur Démo"
  },
  "business-catering": {
    email: "demo@catering.com",
    password: "demo123",
    userType: "business-catering",
    displayName: "Catering Démo"
  },
  "business-boutiques-superettes": {
    email: "demo@boutique.com", 
    password: "demo123",
    userType: "business-boutiques-superettes",
    displayName: "Boutique Démo"
  }
};

// Compte de démonstration par défaut
export const defaultDemoAccount: DemoAccount = {
  email: "demo@chapfoody.com",
  password: "demo123", 
  userType: "restaurant",
  displayName: "Démo CHAPFOODY"
};

/**
 * Récupère le compte de démonstration pour un type d'utilisateur donné
 * @param userType - Le type d'utilisateur
 * @returns Le compte de démonstration correspondant ou le compte par défaut
 */
export function getDemoAccount(userType: string): DemoAccount {
  return demoAccounts[userType] || defaultDemoAccount;
}

/**
 * Vérifie si les identifiants correspondent à un compte de démonstration
 * @param email - L'email fourni
 * @param password - Le mot de passe fourni
 * @returns true si c'est un compte de démonstration valide
 */
export function isDemoAccount(email: string, password: string): boolean {
  return Object.values(demoAccounts).some(
    account => account.email === email && account.password === password
  ) || (email === defaultDemoAccount.email && password === defaultDemoAccount.password);
}

/**
 * Récupère le type d'utilisateur à partir des identifiants de démonstration
 * @param email - L'email du compte de démonstration
 * @returns Le type d'utilisateur correspondant ou null
 */
export function getDemoUserType(email: string): string | null {
  const account = Object.values(demoAccounts).find(acc => acc.email === email);
  return account?.userType || (email === defaultDemoAccount.email ? defaultDemoAccount.userType : null);
}

/**
 * Récupère tous les comptes de démonstration disponibles
 * @returns Liste de tous les comptes de démonstration
 */
export function getAllDemoAccounts(): DemoAccount[] {
  return Object.values(demoAccounts);
}
