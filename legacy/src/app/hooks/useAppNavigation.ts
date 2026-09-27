import { ViewState, UserSession } from "../routes";
import { SignupFormData } from "../pages/SignupPage";
import { isDemoAccount, getDemoUserType } from "../utils/demoAccounts";

interface UseAppNavigationProps {
  setCurrentView: (view: ViewState) => void;
  setSelectedUserType: (type: string) => void;
  setUserSession: (session: UserSession | null) => void;
  setSelectedCaseStudyId: (id: string) => void;
  setSelectedNewsId: (id: string) => void;
  setSelectedUserTypeForDetail: (type: string) => void;
  setSelectedSolutionType: (type: string) => void;
  selectedUserType: string;
  userSession: UserSession | null;
}

export function useAppNavigation({
  setCurrentView,
  setSelectedUserType,
  setUserSession,
  setSelectedCaseStudyId,
  setSelectedNewsId,
  setSelectedUserTypeForDetail,
  setSelectedSolutionType,
  selectedUserType,
  userSession,
}: UseAppNavigationProps) {
  
  const handleGoToHome = () => {
    setCurrentView("landing");
  };

  const handleGoToSignup = (userType?: string) => {
    if (userType) {
      setSelectedUserType(userType);
    }
    setCurrentView("signup");
  };

  const handleUserTypeSelect = (userType: string) => {
    if (userType === "business") {
      // Rediriger vers la page de sélection du type de business
      setCurrentView("business-selection");
    } else if (userType.includes(":")) {
      // Gestion des types business avec sous-catégorie (business:restaurants-fastfood)
      const [mainType, subCategory] = userType.split(":");
      setSelectedUserType(`${mainType}-${subCategory}`);
      setCurrentView("login");
    } else {
      setSelectedUserType(userType);
      setCurrentView("login");
    }
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    let finalUserType = selectedUserType;
    
    // Vérifier si c'est un compte de démonstration
    if (isDemoAccount(credentials.email, credentials.password)) {
      const demoUserType = getDemoUserType(credentials.email);
      if (demoUserType) {
        finalUserType = demoUserType;
        console.log(`🎭 Connexion avec compte de démonstration: ${demoUserType}`);
      }
    }
    
    // Simulation d'une authentification réussie
    setUserSession({
      email: credentials.email,
      userType: finalUserType,
      isAuthenticated: true
    });
    
    // Mettre à jour le type d'utilisateur sélectionné
    setSelectedUserType(finalUserType);
    
    // Diriger tous les business types vers le dashboard restaurant pour l'instant
    if (finalUserType.startsWith("business-")) {
      setCurrentView("restaurant");
    } else {
      setCurrentView(finalUserType as ViewState);
    }
  };

  const handleSignup = (userData: SignupFormData) => {
    // Simulation d'une inscription réussie puis connexion automatique
    setUserSession({
      email: userData.email,
      userType: userData.userType,
      isAuthenticated: true
    });
    setSelectedUserType(userData.userType);
    
    // Diriger tous les business types vers le dashboard restaurant pour l'instant
    if (userData.userType.startsWith("business-")) {
      setCurrentView("restaurant");
    } else {
      setCurrentView(userData.userType as ViewState);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setSelectedUserType("");
    setCurrentView("landing");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedUserType("");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setSelectedUserType("");
  };

  const handleGoToCaseStudies = () => {
    setCurrentView("case-studies");
  };

  const handleGoToCaseStudyDetail = (caseStudyId: string) => {
    setSelectedCaseStudyId(caseStudyId);
    setCurrentView("case-study-detail");
  };

  const handleGoToNews = () => {
    setCurrentView("news");
  };

  const handleGoToNewsDetail = (newsId: string) => {
    setSelectedNewsId(newsId);
    setCurrentView("news-detail");
  };

  const handleGoToAdmin = () => {
    setCurrentView("admin");
  };

  const handleGoToAdvancedExport = () => {
    setCurrentView("advanced-export");
  };

  const handleGoToIndustrialization = () => {
    setCurrentView("industrialization");
  };

  const handleGoToUserTypeDetail = (userType: string) => {
    setSelectedUserTypeForDetail(userType);
    setCurrentView("user-type-detail");
  };

  const handleGoToVideoLibrary = () => {
    setCurrentView("video-library");
  };

  const handleGoToDashboard = () => {
    if (userSession?.isAuthenticated && userSession?.userType) {
      // Diriger tous les business types vers le dashboard restaurant pour l'instant
      if (userSession.userType.startsWith("business-")) {
        setCurrentView("restaurant");
      } else {
        setCurrentView(userSession.userType as ViewState);
      }
    } else {
      setCurrentView("home");
    }
  };

  const handleGoToSolutionDetail = (solutionType: string) => {
    setSelectedSolutionType(solutionType);
    setCurrentView("solution-detail");
  };

  const handleGoToSupport = () => {
    setCurrentView("support");
  };

  const handleGoToContact = () => {
    setCurrentView("contact");
  };

  const handleGoToLogin = () => {
    setCurrentView("home"); // Aller à home page pour sélectionner le type d'utilisateur
  };

  const handleGoToDashboardPreview = () => {
    setCurrentView("dashboard-preview");
  };

  const handleGoToSettings = () => {
    setCurrentView("settings");
  };

  const handleGoToBusinessInfo = () => {
    // Pour les dashboards business, on reste dans le dashboard et on change juste la section active
    // Cette fonction sera gérée par le dashboard lui-même
    console.log("Navigation vers business info - géré par le dashboard");
  };

  const handleGoToTest = () => {
    setCurrentView("test");
  };

  return {
    handleGoToHome,
    handleGoToSignup,
    handleUserTypeSelect,
    handleLogin,
    handleSignup,
    handleLogout,
    handleBackToHome,
    handleBackToLanding,
    handleGoToCaseStudies,
    handleGoToCaseStudyDetail,
    handleGoToNews,
    handleGoToNewsDetail,
    handleGoToAdmin,
    handleGoToAdvancedExport,
    handleGoToIndustrialization,
    handleGoToUserTypeDetail,
    handleGoToVideoLibrary,
    handleGoToDashboard,
    handleGoToSolutionDetail,
    handleGoToSupport,
    handleGoToContact,
    handleGoToLogin,
    handleGoToDashboardPreview,
    handleGoToSettings,
    handleGoToBusinessInfo,
    handleGoToTest,
  };
}