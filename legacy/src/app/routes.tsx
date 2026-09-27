import { LandingPage } from "./pages/LandingPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage, SignupFormData } from "./pages/SignupPage";
import { RestaurantDashboard } from "./pages/RestaurantDashboard";
import { DeliveryDashboard } from "./pages/DeliveryDashboard";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { AffiliateDashboard } from "./pages/AffiliateDashboard";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { CaseStudyDetailPage } from "./pages/CaseStudyDetailPage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RestaurantDashboardOriginal } from "./pages/RestaurantDashboardOriginal";
import { AdvancedExportDashboard } from "./pages/AdvancedExportDashboard";
import { IndustrializationSuggestions } from "./pages/IndustrializationSuggestions";
import { UserTypeDetailPage } from "./pages/UserTypeDetailPage";
import { VideoLibraryPage } from "./pages/VideoLibraryPage";
import { SolutionDetailPage } from "./pages/SolutionDetailPage";
import { SupportPage } from "./pages/SupportPage";
import { ContactPage } from "./pages/ContactPage";
import { BusinessSelectionPage } from "./pages/BusinessSelectionPage";
import { UnifiedBusinessDashboard } from "./components/UnifiedBusinessDashboard";
import { DashboardPreviewPage } from "./pages/DashboardPreviewPage";
import { SettingsView } from "./components/SettingsView";
import { BusinessInfoView } from "./components/BusinessInfoView";
import { TestPage } from "./pages/TestPage";

export type ViewState = "landing" | "home" | "login" | "signup" | "restaurant" | "delivery" | "company" | "affiliate" | "case-studies" | "case-study-detail" | "news" | "news-detail" | "admin" | "restaurant-export" | "advanced-export" | "industrialization" | "user-type-detail" | "video-library" | "solution-detail" | "support" | "contact" | "business-selection" | "dashboard-preview" | "business-info" | "settings" | "test";

export interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

export interface RouteProps {
  currentView: ViewState;
  selectedUserType: string;
  userSession: UserSession | null;
  selectedCaseStudyId?: string;
  selectedNewsId?: string;
  selectedUserTypeForDetail?: string;
  selectedSolutionType?: string;
  onGoToHome: () => void;
  onGoToSignup: (userType?: string) => void;
  onUserTypeSelect: (userType: string) => void;
  onLogin: (credentials: { email: string; password: string }) => void;
  onSignup: (userData: SignupFormData) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onBackToLanding: () => void;
  onGoToCaseStudies: () => void;
  onGoToCaseStudyDetail: (caseStudyId: string) => void;
  onGoToNews: () => void;
  onGoToNewsDetail: (newsId: string) => void;
  onGoToAdmin: () => void;
  onGoToAdvancedExport: () => void;
  onGoToIndustrialization: () => void;
  onGoToUserTypeDetail: (userType: string) => void;
  onGoToVideoLibrary: () => void;
  onGoToDashboard: () => void;
  onGoToSolutionDetail: (solutionType: string) => void;
  onGoToSupport: () => void;
  onGoToContact: () => void;
  onGoToLogin: () => void;
  onGoToDashboardPreview?: () => void;
  onGoToSettings?: () => void;
  onGoToBusinessInfo?: () => void;
  onGoToTest?: () => void;
}

export function renderRoute({
  currentView,
  selectedUserType,
  userSession,
  selectedCaseStudyId,
  selectedNewsId,
  selectedUserTypeForDetail,
  selectedSolutionType,
  onGoToHome,
  onGoToSignup,
  onUserTypeSelect,
  onLogin,
  onSignup,
  onLogout,
  onBackToHome,
  onBackToLanding,
  onGoToCaseStudies,
  onGoToCaseStudyDetail,
  onGoToNews,
  onGoToNewsDetail,
  onGoToAdmin,
  onGoToAdvancedExport,
  onGoToIndustrialization,
  onGoToUserTypeDetail,
  onGoToVideoLibrary,
  onGoToDashboard,
  onGoToSolutionDetail,
  onGoToSupport,
  onGoToContact,
  onGoToLogin,
  onGoToDashboardPreview,
  onGoToSettings,
  onGoToBusinessInfo,
  onGoToTest
}: RouteProps): JSX.Element {
  switch (currentView) {
    case "home":
      return (
        <HomePage 
          onUserTypeSelect={onUserTypeSelect} 
          onGoToSignup={onGoToSignup}
          onBack={onBackToLanding}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onSolutionSelect={onGoToSolutionDetail}
          onGoToSupport={onGoToSupport}
          onLogin={onGoToLogin}
          onGoToHome={onGoToHome}
          onGoToContact={onGoToContact}
          userSession={userSession}
        />
      );
    
    case "login":
      return (
        <LoginPage
          userType={selectedUserType}
          onLogin={onLogin}
          onGoToSignup={onGoToSignup}
          onBack={onBackToHome}
        />
      );
    
    case "signup":
      return (
        <SignupPage
          selectedUserType={selectedUserType}
          onSignup={onSignup}
          onBack={onBackToHome}
        />
      );
    
    case "restaurant":
      return (
        userSession?.userType?.startsWith('business-') ? (
          <UnifiedBusinessDashboard 
            onBack={onLogout}
            userSession={userSession}
            onGoToAdvancedExport={onGoToAdvancedExport}
            onGoToBusinessInfo={onGoToBusinessInfo}
            onGoToSettings={onGoToSettings}
          />
        ) : (
          <RestaurantDashboard 
            onBack={onLogout}
            userSession={userSession}
            onGoToAdvancedExport={onGoToAdvancedExport}
          />
        )
      );
    
    case "delivery":
      return (
        <DeliveryDashboard 
          onBack={onLogout}
          userSession={userSession}
        />
      );
    
    case "company":
      return (
        <CompanyDashboard 
          onBack={onLogout}
          userSession={userSession}
        />
      );
    
    case "affiliate":
      return (
        <AffiliateDashboard 
          onBack={onLogout}
          userSession={userSession}
        />
      );
    
    case "case-studies":
      return (
        <CaseStudiesPage
          onBack={onBackToLanding}
          onCaseStudyClick={onGoToCaseStudyDetail}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onGoToSupport={onGoToSupport}
          onLogin={onGoToLogin}
          onGoToHome={onGoToHome}
          onGoToSignup={onGoToSignup}
          onGoToContact={onGoToContact}
          onSolutionSelect={onGoToSolutionDetail}
          userSession={userSession}
        />
      );
    
    case "case-study-detail":
      return (
        <CaseStudyDetailPage
          caseStudyId={selectedCaseStudyId || ""}
          onBack={onGoToCaseStudies}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
        />
      );
    
    case "news":
      return (
        <NewsPage
          onBack={onBackToLanding}
          onNewsClick={onGoToNewsDetail}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onGoToSupport={onGoToSupport}
          onLogin={onGoToLogin}
          onGoToHome={onGoToHome}
          onGoToSignup={onGoToSignup}
          onGoToContact={onGoToContact}
          onSolutionSelect={onGoToSolutionDetail}
          userSession={userSession}
        />
      );
    
    case "news-detail":
      return (
        <NewsDetailPage
          newsId={selectedNewsId || ""}
          onBack={onGoToNews}
          onNewsClick={onGoToNewsDetail}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
        />
      );
    
    case "admin":
      return (
        <AdminDashboard
          onBack={onBackToLanding}
          onGoToIndustrialization={onGoToIndustrialization}
          onGoToDashboardPreview={onGoToDashboardPreview}
          onGoToTest={onGoToTest}
        />
      );
    
    case "advanced-export":
      return (
        <AdvancedExportDashboard
          onBack={onBackToLanding}
          userSession={userSession}
        />
      );
    
    case "industrialization":
      return (
        <IndustrializationSuggestions
          onBack={onBackToLanding}
        />
      );
    
    case "user-type-detail":
      return (
        <UserTypeDetailPage
          userType={selectedUserTypeForDetail || "restaurateur"}
          onBack={onBackToLanding}
          onSignup={onGoToSignup}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
        />
      );
    
    case "video-library":
      return (
        <VideoLibraryPage
          onBack={onBackToLanding}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onGoToSupport={onGoToSupport}
          onLogin={onGoToLogin}
          onGoToHome={onGoToHome}
          onGoToSignup={onGoToSignup}
          onGoToContact={onGoToContact}
          onSolutionSelect={onGoToSolutionDetail}
          userSession={userSession}
        />
      );
    
    case "solution-detail":
      return (
        <SolutionDetailPage
          solutionType={selectedSolutionType || ""}
          onBackToHome={onGoToHome}
          onGoToSignup={onGoToSignup}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onLogin={onGoToLogin}
          onGoToDashboard={onGoToDashboard}
          onGoToSupport={onGoToSupport}
          userSession={userSession}
        />
      );
    
    case "support":
      return (
        <SupportPage
          onBack={onBackToLanding}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onLogin={onGoToLogin}
          onGoToDashboard={onGoToDashboard}
          onGoToSignup={onGoToSignup}
          onSolutionSelect={onGoToSolutionDetail}
          userSession={userSession}
        />
      );
    
    case "contact":
      return (
        <ContactPage
          onBack={onBackToLanding}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onLogin={onGoToLogin}
          onGoToDashboard={onGoToDashboard}
          onGoToSignup={onGoToSignup}
          onSolutionSelect={onGoToSolutionDetail}
          onGoToSupport={onGoToSupport}
          userSession={userSession}
        />
      );
    
    case "business-selection":
      return (
        <BusinessSelectionPage
          onUserTypeSelect={onUserTypeSelect}
          onBack={onBackToHome}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToNews={onGoToNews}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onSolutionSelect={onGoToSolutionDetail}
          onGoToSupport={onGoToSupport}
          onLogin={onGoToLogin}
          onGoToHome={onGoToHome}
          onGoToContact={onGoToContact}
          onGoToSignup={onGoToSignup}
          userSession={userSession}
        />
      );
    
    case "dashboard-preview":
      return (
        <DashboardPreviewPage
          onBack={onBackToLanding}
        />
      );
    
    case "settings":
      return (
        <SettingsView
          onBack={onBackToLanding}
        />
      );
    
    case "test":
      return (
        <TestPage
          onBack={onBackToLanding}
        />
      );
    
    case "business-info":
      return (
        <BusinessInfoView
          onBack={onBackToLanding}
        />
      );
    
    default:
      return (
        <LandingPage 
          onLogin={onGoToLogin} 
          onSignup={onGoToSignup}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToCaseStudyDetail={onGoToCaseStudyDetail}
          onGoToNews={onGoToNews}
          onGoToNewsDetail={onGoToNewsDetail}
          onGoToAdmin={onGoToAdmin}
          onGoToUserTypeDetail={onGoToUserTypeDetail}
          onGoToVideoLibrary={onGoToVideoLibrary}
          onGoToDashboard={onGoToDashboard}
          onSolutionSelect={onGoToSolutionDetail}
          onGoToSupport={onGoToSupport}
          onGoToContact={onGoToContact}
          userSession={userSession}
        />
      );
  }
}