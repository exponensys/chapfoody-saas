import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { OrderTypesConfigView } from './OrderTypesConfigView';
import { PaymentGatewayView } from './PaymentGatewayView';
import { SEOSettingsView } from './SEOSettingsView';
import { DeliveryRadiusSettingsView } from './DeliveryRadiusSettingsView';
import { DeliveryZoneSettingsView } from './DeliveryZoneSettingsView';
import { PWAConfigView } from './PWAConfigView';
import { ExtrasSettingsView } from './ExtrasSettingsView';
import { OneSignalConfigView } from './OneSignalConfigView';
import { PusherConfigView } from './PusherConfigView';
import { TipsConfigView } from './TipsConfigView';
import { RejectionReasonsView } from './RejectionReasonsView';
import { ResponsiveViewLayout } from './ResponsiveViewLayout';
import { ResponsiveGrid } from './ResponsiveGrid';
import { 
  ArrowLeft,
  Settings,
  Mail,
  Sliders,
  ShoppingCart,
  MessageCircle,
  Search,
  Image,
  Truck,
  MapPin,
  Smartphone,
  Bell,
  Plus,
  Layout,
  Wifi,
  CreditCard,
  DollarSign,
  XCircle
} from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
}

type SettingsSection = 
  | 'preferences'
  | 'messaging'
  | 'order-types'
  | 'payment-gateway'
  | 'sms-twilio'
  | 'sms-custom'
  | 'seo'
  | 'icons'
  | 'delivery-radius'
  | 'delivery-zone'
  | 'pwa'
  | 'onesignal'
  | 'extras'
  | 'layout'
  | 'pusher'
  | 'tips'
  | 'rejection-reasons';

interface PreferencesSettings {
  loginButton: boolean;
  hideProductImage: boolean;
  guestLogin: boolean;
  addToCart: boolean;
  taxStatus: boolean;
  securityQuestion: boolean;
  enableCoupon: boolean;
  languageChange: boolean;
  stockStatus: boolean;
  callServer: boolean;
  securityPin: boolean;
  discount: string;
  taxFees: string;
  minimumOrder: string;
  deliveryFees: string;
  preparationTime: string;
  preparationUnit: string;
  securityPinValue: string;
  kdsEnabled: boolean;
  pinKdsEnabled: boolean;
  emailOnPayment: boolean;
  orderMerging: boolean;
  mergingType: 'automatic' | 'manual';
}

const settingsSections = [
  // { 
  //   id: 'messaging' as SettingsSection, 
  //   label: 'Paramètres de messagerie', 
  //   icon: Mail 
  // },
  { 
    id: 'preferences' as SettingsSection, 
    label: 'Préférences', 
    icon: Sliders 
  },
  { 
    id: 'order-types' as SettingsSection, 
    label: 'Configuration des types de commande', 
    icon: ShoppingCart 
  },
  { 
    id: 'payment-gateway' as SettingsSection, 
    label: 'Configuration du portail de paiement', 
    icon: CreditCard 
  },
  { 
    id: 'seo' as SettingsSection, 
    label: 'Paramètres de référencement', 
    icon: Search 
  },
  { 
    id: 'icons' as SettingsSection, 
    label: 'Paramètres des icônes', 
    icon: Image 
  },
  { 
    id: 'delivery-radius' as SettingsSection, 
    label: 'Paramètres de livraison basés sur le rayon', 
    icon: Truck 
  },
  { 
    id: 'delivery-zone' as SettingsSection, 
    label: 'Zone de livraison', 
    icon: MapPin 
  },
  { 
    id: 'pwa' as SettingsSection, 
    label: 'Configuration PWA', 
    icon: Smartphone 
  },
  { 
    id: 'onesignal' as SettingsSection, 
    label: 'Configuration OneSignal', 
    icon: Bell 
  },
  { 
    id: 'extras' as SettingsSection, 
    label: 'Extras', 
    icon: Plus 
  },
  { 
    id: 'layout' as SettingsSection, 
    label: 'Mise en page', 
    icon: Layout 
  },
  { 
    id: 'pusher' as SettingsSection, 
    label: 'Pusher', 
    icon: Wifi 
  },
  { 
    id: 'tips' as SettingsSection, 
    label: 'Pourboire', 
    icon: DollarSign 
  },
  { 
    id: 'rejection-reasons' as SettingsSection, 
    label: 'Raisons de rejet', 
    icon: XCircle 
  }
];

export function SettingsView({ onBack }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('preferences');
  const [preferences, setPreferences] = useState<PreferencesSettings>({
    loginButton: false,
    hideProductImage: false,
    guestLogin: true,
    addToCart: true,
    taxStatus: false,
    securityQuestion: false,
    enableCoupon: true,
    languageChange: false,
    stockStatus: false,
    callServer: false,
    securityPin: false,
    discount: '10',
    taxFees: '0',
    minimumOrder: '10000',
    deliveryFees: '0',
    preparationTime: '30',
    preparationUnit: 'Minutes',
    securityPinValue: '',
    kdsEnabled: true,
    pinKdsEnabled: false,
    emailOnPayment: false,
    orderMerging: false,
    mergingType: 'automatic'
  });

  const handlePreferenceChange = (key: keyof PreferencesSettings, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Logic to save settings
    console.log('Saving settings:', preferences);
    // You can add a toast notification here
  };

  const renderPreferences = () => (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-[#b70f23]">Configuration</h3>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        {/* Login Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Login Button</div>
            <div className="text-sm text-muted-foreground">Bouton se connecter dans le menu</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.loginButton}
              onCheckedChange={(checked) => handlePreferenceChange('loginButton', checked)}
            />
            {!preferences.loginButton && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Hide Product Image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Hide product image</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.hideProductImage}
              onCheckedChange={(checked) => handlePreferenceChange('hideProductImage', checked)}
            />
            {!preferences.hideProductImage && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Login invité */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Login invité</div>
            <div className="text-sm text-muted-foreground">Activer pour permettre le login par invitation pour le dîner</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.guestLogin}
              onCheckedChange={(checked) => handlePreferenceChange('guestLogin', checked)}
            />
            {preferences.guestLogin && (
              <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
            )}
          </div>
        </div>

        {/* Ajouter panier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">ajouter panier 🛒</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.addToCart}
              onCheckedChange={(checked) => handlePreferenceChange('addToCart', checked)}
            />
            {preferences.addToCart && (
              <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
            )}
          </div>
        </div>

        {/* Statut fiscal de l'article */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Statut fiscal de l'article</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.taxStatus}
              onCheckedChange={(checked) => handlePreferenceChange('taxStatus', checked)}
            />
            {!preferences.taxStatus && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Activer la question de sécurité */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Activer la question de sécurité</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.securityQuestion}
              onCheckedChange={(checked) => handlePreferenceChange('securityQuestion', checked)}
            />
            {!preferences.securityQuestion && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Activer le coupon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Activer le coupon</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.enableCoupon}
              onCheckedChange={(checked) => handlePreferenceChange('enableCoupon', checked)}
            />
            {preferences.enableCoupon && (
              <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
            )}
          </div>
        </div>

        {/* Changement de langue */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Changement de langue</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.languageChange}
              onCheckedChange={(checked) => handlePreferenceChange('languageChange', checked)}
            />
            {!preferences.languageChange && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* État du stock */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">État du stock</div>
            <div className="text-sm text-muted-foreground">Activer pour autoriser dans votre système</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.stockStatus}
              onCheckedChange={(checked) => handlePreferenceChange('stockStatus', checked)}
            />
            {!preferences.stockStatus && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Appeler le serveur */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Appeler le serveur</div>
            <div className="text-sm text-muted-foreground">Activer pour autoriser le service d'appel</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.callServer}
              onCheckedChange={(checked) => handlePreferenceChange('callServer', checked)}
            />
            {!preferences.callServer && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>

        {/* Broche de sécurité */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">Broche de sécurité</div>
            <div className="text-sm text-muted-foreground">Activer l'épingle lorsque le client quit sa commande et lorsqu'il appelle le serveur</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.securityPin}
              onCheckedChange={(checked) => handlePreferenceChange('securityPin', checked)}
            />
            {!preferences.securityPin && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <ResponsiveGrid cols={{ base: 1, md: 2 }} gap={6}>
        {/* Remise */}
        <div className="space-y-2">
          <Label>remise</Label>
          <div className="relative">
            <Input
              value={preferences.discount}
              onChange={(e) => handlePreferenceChange('discount', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Frais de taxes */}
        <div className="space-y-2">
          <Label>Frais de taxes</Label>
          <div className="relative">
            <Input
              value={preferences.taxFees}
              onChange={(e) => handlePreferenceChange('taxFees', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Commande minimum */}
        <div className="space-y-2">
          <Label>Commande minimum</Label>
          <div className="relative">
            <Input
              value={preferences.minimumOrder}
              onChange={(e) => handlePreferenceChange('minimumOrder', e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">F CFA</span>
          </div>
        </div>

        {/* Frais de livraison */}
        <div className="space-y-2">
          <Label>frais de livraison</Label>
          <Input
            value={preferences.deliveryFees}
            onChange={(e) => handlePreferenceChange('deliveryFees', e.target.value)}
          />
        </div>
      </ResponsiveGrid>

      {/* Heure de préparation */}
      <ResponsiveGrid cols={{ base: 1, md: 2 }} gap={6}>
        <div className="space-y-2">
          <Label>Heure de préparation par défaut</Label>
          <Input
            value={preferences.preparationTime}
            onChange={(e) => handlePreferenceChange('preparationTime', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Select 
            value={preferences.preparationUnit} 
            onValueChange={(value) => handlePreferenceChange('preparationUnit', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Minutes">Minutes</SelectItem>
              <SelectItem value="Heures">Heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ResponsiveGrid>

      {/* Broche de sécurité */}
      <div className="space-y-2">
        <Label>Broche de sécurité</Label>
        <Input
          placeholder="Broche de sécurité"
          value={preferences.securityPinValue}
          onChange={(e) => handlePreferenceChange('securityPinValue', e.target.value)}
        />
      </div>

      {/* KDS Settings */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">KDS</div>
            <div className="text-sm text-muted-foreground">Activer pour autoriser dans votre système</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.kdsEnabled}
              onCheckedChange={(checked) => handlePreferenceChange('kdsEnabled', checked)}
            />
            {preferences.kdsEnabled && (
              <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">PIN KDS</div>
            <div className="text-sm text-muted-foreground">activer pour permettre</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.pinKdsEnabled}
              onCheckedChange={(checked) => handlePreferenceChange('pinKdsEnabled', checked)}
            />
            {!preferences.pinKdsEnabled && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
            <Badge className="bg-[#b70f23] text-white text-xs">Nouveau</Badge>
          </div>
        </div>
      </div>

      {/* PIN KDS Input */}
      <div className="space-y-2">
        <Label>PIN KDS</Label>
        <Input placeholder="PIN KDS" />
      </div>

      {/* Email on Payment */}
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={preferences.emailOnPayment}
          onChange={(e) => handlePreferenceChange('emailOnPayment', e.target.checked)}
          className="rounded"
        />
        <label className="text-sm">Activer le courriel lors du paiement</label>
      </div>

      {/* Order Merging */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium">fusion de commande</div>
            <div className="text-sm text-muted-foreground">activer la fusion des commandes</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Switch
              checked={preferences.orderMerging}
              onCheckedChange={(checked) => handlePreferenceChange('orderMerging', checked)}
            />
            {!preferences.orderMerging && (
              <Badge variant="destructive" className="text-xs">désactivé</Badge>
            )}
            <Badge className="bg-[#b70f23] text-white text-xs">Nouveau</Badge>
          </div>
        </div>

        {preferences.orderMerging && (
          <RadioGroup 
            value={preferences.mergingType} 
            onValueChange={(value) => handlePreferenceChange('mergingType', value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="automatic" id="automatic" />
              <label htmlFor="automatic" className="text-sm">fusionner automatiquement</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <label htmlFor="manual" className="text-sm">Permettre aux clients de sélectionner</label>
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <Button 
          onClick={handleSaveSettings}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
        >
          🔄 Sauvegarder la Mise à Jour
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'preferences':
        return renderPreferences();
      case 'order-types':
        return <OrderTypesConfigView onBack={() => setActiveSection('preferences')} />;
      case 'payment-gateway':
        return <PaymentGatewayView onBack={() => setActiveSection('preferences')} />;
      case 'seo':
        return <SEOSettingsView onBack={() => setActiveSection('preferences')} />;
      case 'delivery-radius':
        return <DeliveryRadiusSettingsView onBack={() => setActiveSection('preferences')} />;
      case 'delivery-zone':
        return <DeliveryZoneSettingsView onBack={() => setActiveSection('preferences')} />;
      case 'pwa':
        return <PWAConfigView onBack={() => setActiveSection('preferences')} />;
      case 'onesignal':
        return <OneSignalConfigView onBack={() => setActiveSection('preferences')} />;
      case 'extras':
        return <ExtrasSettingsView onBack={() => setActiveSection('preferences')} />;
      case 'pusher':
        return <PusherConfigView onBack={() => setActiveSection('preferences')} />;
      case 'tips':
        return <TipsConfigView onBack={() => setActiveSection('preferences')} />; // Change here
      case 'rejection-reasons':
        return <RejectionReasonsView onBack={() => setActiveSection('preferences')} />;
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
      title="Paramètres"
      subtitle="Configuration du système"
      sections={settingsSections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onBack={onBack}
    >
      {renderContent()}
    </ResponsiveViewLayout>
  );
}