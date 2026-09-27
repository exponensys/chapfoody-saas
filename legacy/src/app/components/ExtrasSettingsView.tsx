import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface ExtrasSettings {
  googleTranslation: string;
  defaultLanguage: string;
  languages: {
    english: boolean;
    french: boolean;
  };
  thirdPartyChat: string;
  whatsappAppId: string;
  cookiesAppId: string;
  status: 'active' | 'inactive';
  paginationLimit: string;
  scrollToTop: string;
  modifyOrder: string;
  articleLimit: string;
  termsConditions: string;
}

interface ExtrasSettingsViewProps {
  onBack: () => void;
}

export function ExtrasSettingsView({ onBack }: ExtrasSettingsViewProps) {
  const [settings, setSettings] = useState<ExtrasSettings>({
    googleTranslation: 'traduction-google',
    defaultLanguage: 'afrikaans',
    languages: {
      english: true,
      french: true
    },
    thirdPartyChat: 'elfsight',
    whatsappAppId: '',
    cookiesAppId: '',
    status: 'active',
    paginationLimit: '15',
    scrollToTop: 'activer',
    modifyOrder: 'details-commande',
    articleLimit: '6',
    termsConditions: ''
  });

  const handleInputChange = (field: keyof ExtrasSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (language: 'english' | 'french', checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      languages: {
        ...prev.languages,
        [language]: checked
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving extras settings:', settings);
    // Logique de sauvegarde
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-medium text-[#b70f23]">Extras</h2>
          <p className="text-sm text-muted-foreground">Configuration des fonctionnalités supplémentaires</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Google Translation */}
          <div className="space-y-2">
            <Label className="font-medium">Traduction Google</Label>
            <Select 
              value={settings.googleTranslation}
              onValueChange={(value) => handleInputChange('googleTranslation', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traduction-google">Traduction Google</SelectItem>
                <SelectItem value="microsoft-translator">Microsoft Translator</SelectItem>
                <SelectItem value="deepl">DeepL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Language */}
          <div className="space-y-2">
            <Label className="font-medium">Langue par défaut</Label>
            <Select 
              value={settings.defaultLanguage}
              onValueChange={(value) => handleInputChange('defaultLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="afrikaans">Afrikaans</SelectItem>
                <SelectItem value="francais">Français</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="espagnol">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label className="font-medium">Langues</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="english"
                  checked={settings.languages.english}
                  onCheckedChange={(checked) => handleLanguageChange('english', checked as boolean)}
                />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="french"
                  checked={settings.languages.french}
                  onCheckedChange={(checked) => handleLanguageChange('french', checked as boolean)}
                />
                <Label htmlFor="french">Français</Label>
              </div>
            </div>
          </div>

          {/* Third Party Chat Applications */}
          <div className="space-y-4">
            <Label className="font-medium">Applications de chat tierces</Label>
            
            <div className="space-y-2">
              <Label className="text-sm">Choisir une application</Label>
              <Select 
                value={settings.thirdPartyChat}
                onValueChange={(value) => handleInputChange('thirdPartyChat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elfsight">Elfsight</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="messenger">Messenger</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Identifiant de l'application (Message whatsapp)</Label>
              <Input
                placeholder="Identifiant de l'application"
                value={settings.whatsappAppId}
                onChange={(e) => handleInputChange('whatsappAppId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Identifiant de l'application (Cookies & Confidentialité)</Label>
              <Input
                placeholder="Identifiant de l'application"
                value={settings.cookiesAppId}
                onChange={(e) => handleInputChange('cookiesAppId', e.target.value)}
              />
            </div>
          </div>

          {/* Status Radio Group */}
          <div className="space-y-3">
            <RadioGroup 
              value={settings.status} 
              onValueChange={(value) => handleInputChange('status', value)}
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="font-medium">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive" className="font-medium">Désactive</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pagination Limit */}
            <div className="space-y-2">
              <Label className="font-medium">Limite de pagination</Label>
              <Input
                value={settings.paginationLimit}
                onChange={(e) => handleInputChange('paginationLimit', e.target.value)}
              />
            </div>

            {/* Scroll to Top */}
            <div className="space-y-2">
              <Label className="font-medium">Flécher de défilement vers le haut</Label>
              <Select 
                value={settings.scrollToTop}
                onValueChange={(value) => handleInputChange('scrollToTop', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activer">Activer</SelectItem>
                  <SelectItem value="desactiver">Désactiver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modify Order */}
            <div className="space-y-2">
              <Label className="font-medium">Modifier la commande</Label>
              <Select 
                value={settings.modifyOrder}
                onValueChange={(value) => handleInputChange('modifyOrder', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="details-commande">Détails de la commande</SelectItem>
                  <SelectItem value="modifier-produits">Modifier les produits</SelectItem>
                  <SelectItem value="annuler-commande">Annuler la commande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Article Limit */}
          <div className="space-y-2">
            <Label className="font-medium">Limite d'articles</Label>
            <Input
              value={settings.articleLimit}
              onChange={(e) => handleInputChange('articleLimit', e.target.value)}
              className="w-24"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <Label className="font-medium">Termes & Conditions</Label>
            <div className="border rounded-lg">
              {/* Rich Text Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="text-xs">🔗</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 font-bold">
                  B
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 italic">
                  I
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 underline">
                  U
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  A
                </Button>
                <Select defaultValue="arial">
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="text-yellow-500">▲</span>
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">≡</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">⌐</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">≡</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">⌐</Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">📝</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">📊</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">🔗</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">📎</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">📷</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">📹</Button>
                </div>
              </div>
              <Textarea
                placeholder="Saisissez vos termes et conditions..."
                value={settings.termsConditions}
                onChange={(e) => handleInputChange('termsConditions', e.target.value)}
                className="min-h-[150px] border-0 resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2"
        >
          💾 Sauvegarder la Mise à jour
        </Button>
      </div>
    </div>
  );
}