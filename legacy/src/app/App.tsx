import { renderRoute } from "./routes";
import { useAppState } from "./hooks/useAppState";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  try {
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
          onGoToBusinessInfo: navigationHandlers.handleGoToBusinessInfo,
          onGoToSettings: navigationHandlers.handleGoToSettings,
          onGoToTest: navigationHandlers.handleGoToTest,
        })}
        <Toaster />
      </div>
    );
  } catch (error) {
    console.error("App Error:", error);
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4 text-red-600">Erreur de chargement</h1>
          <p className="text-gray-600 mb-4">Une erreur est survenue lors du chargement de l'application</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#b70f23] text-white rounded"
          >
            Recharger la page
          </button>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer">Détails de l'erreur</summary>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        </div>
        <Toaster />
      </div>
    );
  }
}