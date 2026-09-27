import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { SidebarWithSubmenus } from '../components/SidebarWithSubmenus';
import { SettingsView } from '../components/SettingsView';
import { getMenuSections } from '../data/restaurantDashboardData';
import { TestSettingsMenu } from '../test-settings-menu';

interface TestPageProps {
  onBack: () => void;
}

export function TestPage({ onBack }: TestPageProps) {
  const [activeSection, setActiveSection] = useState("tableau-de-bord");
  const [activeSubSection, setActiveSubSection] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  const handleActiveSection = (section: string) => {
    console.log('Setting active section to:', section);
    setActiveSection(section);
  };

  const handleSubSectionNavigation = (section: string, subSection: string) => {
    console.log('Navigating to:', section, subSection);
    setActiveSection(section);
    setActiveSubSection(subSection);
  };

  const menuSections = getMenuSections(
    false, 
    0, 
    activeSection, 
    handleActiveSection, 
    setActiveSubSection, 
    handleSubSectionNavigation
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar de test */}
      <div className="w-64">
        <SidebarWithSubmenus
          userType="restaurant"
          menuSections={menuSections}
          activeSection={activeSection}
          activeSubSection={activeSubSection}
          userEmail="test@chapfoody.com"
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Button onClick={onBack} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-2xl font-bold mb-2">Page de Test - Menu Paramètres</h1>
          <p className="text-gray-600">Section active : <strong>{activeSection}</strong></p>
          {activeSubSection && (
            <p className="text-gray-600">Sous-section active : <strong>{activeSubSection}</strong></p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Actions de test
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  {showDebug ? 'Masquer' : 'Afficher'} Debug
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleActiveSection("parametres")}
                className="w-full"
                variant={activeSection === "parametres" ? "default" : "outline"}
              >
                🔧 Aller aux Paramètres
              </Button>
              <Button 
                onClick={() => handleActiveSection("tableau-de-bord")}
                className="w-full"
                variant={activeSection === "tableau-de-bord" ? "default" : "outline"}
              >
                🏠 Retour au tableau de bord
              </Button>
              <Button 
                onClick={() => {
                  console.log('Current menu sections:', menuSections.length);
                  console.log('Settings found:', menuSections.find(s => s.id === 'parametres'));
                }}
                className="w-full"
                variant="outline"
              >
                🔍 Vérifier le menu dans la console
              </Button>
            </CardContent>
          </Card>

          {showDebug && (
            <Card>
              <CardHeader>
                <CardTitle>Debug du menu</CardTitle>
              </CardHeader>
              <CardContent>
                <TestSettingsMenu />
              </CardContent>
            </Card>
          )}
        </div>

        {activeSection === "parametres" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Paramètres chargés avec succès !</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsView onBack={() => setActiveSection("tableau-de-bord")} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}