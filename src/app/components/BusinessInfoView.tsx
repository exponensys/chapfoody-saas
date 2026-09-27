import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft,
  Settings,
  Store,
  Calendar,
  MapPin,
  Utensils,
  Building,
  Wrench,
  QrCode,
  BedDouble,
  Link,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

// Import des composants spécialisés existants
import { RestaurantConfigView } from './RestaurantConfigView';
import { AvailabilityDaysView } from './AvailabilityDaysView';
import { PickupPointsView } from './PickupPointsView';
import { TablesView } from './TablesView';
import { EmplacementsView } from './EmplacementsView';
import { QRBuilderView } from './QRBuilderView';
import { RoomServicesView } from './RoomServicesView';
import { ResponsiveViewLayout } from './ResponsiveViewLayout';
import { TwoColumnLayout } from './ResponsiveForm';

interface BusinessInfoViewProps {
  onBack: () => void;
}

type BusinessInfoSection = 
  | 'general'
  | 'restaurant-config'
  | 'available-days'
  | 'pickup-points'
  | 'tables'
  | 'locations'
  | 'or-builder'
  | 'table-qr'
  | 'room-service'
  | 'connections-list';

interface BusinessInfo {
  username: string;
  fullName: string;
  location: string;
  slogan: string;
  address: string;
  shortAbout: string;
  about: string;
  logo: string;
  coverPhoto: string;
}

const businessInfoSections = [
  { 
    id: 'general' as BusinessInfoSection, 
    label: 'Général', 
    icon: Settings 
  },
  { 
    id: 'restaurant-config' as BusinessInfoSection, 
    label: 'Configuration du restaurant', 
    icon: Store 
  },
  { 
    id: 'available-days' as BusinessInfoSection, 
    label: 'Jours disponibles', 
    icon: Calendar 
  },
  { 
    id: 'pickup-points' as BusinessInfoSection, 
    label: 'Points de retrait', 
    icon: MapPin 
  },
  { 
    id: 'tables' as BusinessInfoSection, 
    label: 'Tables', 
    icon: Utensils 
  },
  { 
    id: 'locations' as BusinessInfoSection, 
    label: 'Emplacements', 
    icon: Building 
  },
  { 
    id: 'or-builder' as BusinessInfoSection, 
    label: 'Qr Builder', 
    icon: Wrench 
  },
  { 
    id: 'table-qr' as BusinessInfoSection, 
    label: 'Code QR de la table', 
    icon: QrCode 
  },
  { 
    id: 'room-service' as BusinessInfoSection, 
    label: 'Service en chambre', 
    icon: BedDouble 
  },
  { 
    id: 'connections-list' as BusinessInfoSection, 
    label: 'Liste des liaisons', 
    icon: Link 
  }
];

export function BusinessInfoView({ onBack }: BusinessInfoViewProps) {
  const [activeSection, setActiveSection] = useState<BusinessInfoSection>('general');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    username: 'yatt_food',
    fullName: 'Yatt Food',
    location: 'YYV',
    slogan: 'Tu commandes une fois tu en redemandes',
    address: 'Koumassi Remblais, Non loin de l\'hôtel la Pivoine',
    shortAbout: 'Yatt Food est un restaurant qui à Koumassi remblais qui vous propose des plats africains, occidentaux et asiatiques.',
    about: 'Yatt Food est un restaurant',
    logo: '',
    coverPhoto: ''
  });

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving business info:', businessInfo);
    // Logic to save business information
  };

  const renderGeneralSection = () => {
    const formFields = (
      <div className="space-y-6">
        {/* Restaurant Username */}
        <div className="space-y-2">
          <Label className="font-medium text-[#b70f23]">
            Nom d'utilisateur du restaurant
          </Label>
          <Input
            value={businessInfo.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Full Restaurant Name */}
        <div className="space-y-2">
          <Label className="font-medium">
            Nom complet du restaurant
          </Label>
          <Input
            value={businessInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="font-medium">
            Emplacement
          </Label>
          <Input
            value={businessInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Slogan */}
        <div className="space-y-2">
          <Label className="font-medium">
            slogan
          </Label>
          <Input
            value={businessInfo.slogan}
            onChange={(e) => handleInputChange('slogan', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="font-medium">
            Adresse
          </Label>
          <Textarea
            value={businessInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full min-h-[80px]"
          />
        </div>

        {/* Short About */}
        <div className="space-y-2">
          <Label className="font-medium">
            À propos de texte court (Max 150)
          </Label>
          <Textarea
            value={businessInfo.shortAbout}
            onChange={(e) => handleInputChange('shortAbout', e.target.value)}
            className="w-full min-h-[80px]"
            maxLength={150}
          />
        </div>

        {/* About - Rich Text Editor */}
        <div className="space-y-2">
          <Label className="font-medium">about</Label>
          
          {/* Rich Text Toolbar */}
          <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" className="p-1">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
            <Button variant="ghost" size="sm" className="p-1">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <AlignRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
            <Button variant="ghost" size="sm" className="p-1">
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Textarea
            value={businessInfo.about}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="w-full min-h-[120px] rounded-t-none border-t-0"
            placeholder="Yatt Food est un restaurant"
          />
        </div>
      </div>
    );

    const uploadSections = (
      <div className="space-y-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#b70f23]">Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center border">
                  <span className="text-xl sm:text-2xl">🍽️</span>
                </div>
                <div>
                  <Button variant="outline" className="mb-2 w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Télécharger le logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG jusqu'à 2MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cover Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de couverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1647998270792-69ac80570183?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcmVzdGF1cmFudCUyMGZvb2QlMjBkaXNofGVufDF8fHx8MTc1NzkwMDE1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Couverture restaurant"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <Button variant="outline" className="mb-2 w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Changer la photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG jusqu'à 5MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );

    return (
      <div className="space-y-6">
        <TwoColumnLayout
          left={formFields}
          right={uploadSections}
          stackOnMobile={true}
        />

        {/* Save Button */}
        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSave}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2 w-full sm:w-auto"
          >
            💾 Sauvegarder la Mise à jour
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSection();
      case 'restaurant-config':
        return <RestaurantConfigView onBack={() => setActiveSection('general')} />;
      case 'available-days':
        return <AvailabilityDaysView onBack={() => setActiveSection('general')} />;
      case 'pickup-points':
        return <PickupPointsView onBack={() => setActiveSection('general')} />;
      case 'tables':
        return <TablesView onBack={() => setActiveSection('general')} />;
      case 'locations':
        return <EmplacementsView onBack={() => setActiveSection('general')} />;
      case 'or-builder':
      case 'table-qr':
        return <QRBuilderView onBack={() => setActiveSection('general')} />;
      case 'room-service':
        return <RoomServicesView onBack={() => setActiveSection('general')} />;
      case 'connections-list':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Link className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Liste des liaisons</h3>
              <p className="text-muted-foreground">Gestion des connexions et intégrations externes.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Section en cours de développement</h3>
              <p className="text-muted-foreground">Cette section sera bientôt disponible.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ResponsiveViewLayout
      title="Infos Business"
      subtitle="Configuration de l'entreprise"
      sections={businessInfoSections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onBack={onBack}
    >
      {renderContent()}
    </ResponsiveViewLayout>
  );
}