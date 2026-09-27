import { renderRoute } from "./routes";
import { useAppState } from "./hooks/useAppState";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const {
    currentView,
    selectedUserType,
    userSession,
    selectedCaseStudyId,
    selectedNewsId,
    selectedUserTypeForDetail,
    selectedSolutionType,
    setCurrentView,
    setSelectedUserType,
    setUserSession,
    setSelectedCaseStudyId,
    setSelectedNewsId,
    setSelectedUserTypeForDetail,
    setSelectedSolutionType,
  } = useAppState();

  const navigationHandlers = useAppNavigation({
    setCurrentView,
    setSelectedUserType,
    setUserSession,
    setSelectedCaseStudyId,
    setSelectedNewsId,
    setSelectedUserTypeForDetail,
    setSelectedSolutionType,
    selectedUserType,
    userSession,
  });

  return (
    <div className="size-full">
      {renderRoute({
        currentView,
        selectedUserType,
        userSession,
        selectedCaseStudyId,
        selectedNewsId,
        selectedUserTypeForDetail,
        selectedSolutionType,
        onGoToHome: navigationHandlers.handleGoToHome,
        onGoToSignup: navigationHandlers.handleGoToSignup,
        onUserTypeSelect: navigationHandlers.handleUserTypeSelect,
        onLogin: navigationHandlers.handleLogin,
        onSignup: navigationHandlers.handleSignup,
        onLogout: navigationHandlers.handleLogout,
        onBackToHome: navigationHandlers.handleBackToHome,
        onBackToLanding: navigationHandlers.handleBackToLanding,
        onGoToCaseStudies: navigationHandlers.handleGoToCaseStudies,
        onGoToCaseStudyDetail: navigationHandlers.handleGoToCaseStudyDetail,
        onGoToNews: navigationHandlers.handleGoToNews,
        onGoToNewsDetail: navigationHandlers.handleGoToNewsDetail,
        onGoToAdmin: navigationHandlers.handleGoToAdmin,
        onGoToAdvancedExport: navigationHandlers.handleGoToAdvancedExport,
        onGoToIndustrialization: navigationHandlers.handleGoToIndustrialization,
        onGoToUserTypeDetail: navigationHandlers.handleGoToUserTypeDetail,
        onGoToVideoLibrary: navigationHandlers.handleGoToVideoLibrary,
        onGoToDashboard: navigationHandlers.handleGoToDashboard,
        onGoToSolutionDetail: navigationHandlers.handleGoToSolutionDetail,
        onGoToSupport: navigationHandlers.handleGoToSupport,
        onGoToContact: navigationHandlers.handleGoToContact,
        onGoToLogin: navigationHandlers.handleGoToLogin,
        onGoToDashboardPreview: navigationHandlers.handleGoToDashboardPreview,
      })}
      <Toaster />
    </div>
  );
}