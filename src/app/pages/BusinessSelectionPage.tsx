import { BusinessCategoryGrid } from "../components/BusinessCategoryGrid";
import { BusinessTypeSelector } from "../components/BusinessTypeSelector";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState } from "react";

interface BusinessSelectionPageProps {
  onUserTypeSelect: (userType: string, subCategory?: string) => void;
  onBack: () => void;
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToDashboard?: () => void;
  onSolutionSelect?: (solutionType: string) => void;
  onGoToSupport?: () => void;
  onLogin?: () => void;
  onGoToHome?: () => void;
  onGoToContact?: () => void;
  onGoToSignup?: (userType?: string) => void;
  userSession?: any;
}

export function BusinessSelectionPage({
  onUserTypeSelect,
  onBack,
  onGoToCaseStudies,
  onGoToNews,
  onGoToVideoLibrary,
  onGoToDashboard,
  onSolutionSelect,
  onGoToSupport,
  onLogin,
  onGoToHome,
  onGoToContact,
  onGoToSignup,
  userSession
}: BusinessSelectionPageProps) {
  const [useNewGrid, setUseNewGrid] = useState(true); // Switch entre les deux versions

  const handleBusinessSelect = (userType: string, subCategory?: string) => {
    // Passer les informations du type de business sélectionné
    onUserTypeSelect(`${userType}:${subCategory}`);
  };

  const handleToggleView = () => {
    setUseNewGrid(!useNewGrid);
  };

  if (useNewGrid) {
    // Nouvelle version avec grille inspirée de l'image
    return (
      <div className="min-h-screen">
        <BusinessCategoryGrid 
          onSelect={handleBusinessSelect}
          onBack={onBack}
        />
        
        {/* Bouton pour tester l'ancienne version - à retirer en production */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleToggleView}
            className="px-4 py-2 bg-white/20 backdrop-blur text-white text-sm rounded-lg border border-white/30 hover:bg-white/30"
          >
            Tester ancienne version
          </button>
        </div>
      </div>
    );
  }

  // Version originale (fallback)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews}
        onGoToVideoLibrary={onGoToVideoLibrary}
        onGoToSignup={onGoToSignup}
        onGoToDashboard={onGoToDashboard}
        onSolutionSelect={onSolutionSelect}
        onGoToSupport={onGoToSupport}
        onLogin={onLogin}
        onGoToHome={onGoToHome}
        onGoToContact={onGoToContact}
        userSession={userSession}
        title="CHAPFOODY"
        subtitle="Sélection de votre activité"
      />
      
      <main className="flex-1">
        <div className="h-1 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e]"></div>
        <BusinessTypeSelector 
          onSelect={handleBusinessSelect}
          onBack={onBack}
        />
      </main>

      <Footer 
        onGoToCaseStudies={onGoToCaseStudies}
        onGoToNews={onGoToNews}
        onGoToVideoLibrary={onGoToVideoLibrary}
      />
      
      {/* Bouton pour revenir à la nouvelle version */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggleView}
          className="px-4 py-2 bg-[#b70f23] text-white text-sm rounded-lg hover:bg-[#d41e39]"
        >
          Nouvelle version
        </button>
      </div>
    </div>
  );
}