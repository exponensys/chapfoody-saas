import React from 'react';
import { getMenuSections } from './data/restaurantDashboardData';

// Test pour vérifier que le menu Paramètres est bien présent
export function TestSettingsMenu() {
  const mockHandleActiveSection = (section: string) => {
    console.log('Active section:', section);
  };
  
  const mockSetActiveSubSection = (section: string) => {
    console.log('Active sub-section:', section);
  };

  const mockHandleSubSectionNavigation = (section: string, subSection: string) => {
    console.log('Navigation:', section, subSection);
  };

  const menuSections = getMenuSections(
    false, // hasNewOrders
    0, // unreadOrdersCount
    "tableau-de-bord", // activeSection
    mockHandleActiveSection,
    mockSetActiveSubSection,
    mockHandleSubSectionNavigation
  );

  console.log('Total menu sections:', menuSections.length);
  console.log('Menu sections:', menuSections.map(s => ({ id: s.id, label: s.label })));

  // Vérifier si "parametres" est présent
  const settingsSection = menuSections.find(section => section.id === 'parametres');
  console.log('Settings section found:', settingsSection);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Test Menu Paramètres</h2>
      <div className="space-y-2">
        {menuSections.map((section, index) => (
          <div key={section.id} className="p-2 border border-gray-200 rounded">
            <span className="font-medium">{index + 1}. {section.label}</span>
            <span className="text-sm text-gray-500 ml-2">({section.id})</span>
            {section.id === 'parametres' && (
              <span className="ml-2 text-green-600 font-bold">✓ TROUVÉ!</span>
            )}
          </div>
        ))}
      </div>
      {settingsSection && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800">Section Paramètres trouvée :</h3>
          <pre className="text-sm mt-2">{JSON.stringify(settingsSection, null, 2)}</pre>
        </div>
      )}
      {!settingsSection && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-bold text-red-800">⚠️ Section Paramètres NON trouvée !</h3>
        </div>
      )}
    </div>
  );
}