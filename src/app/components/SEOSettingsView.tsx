import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface SEOSettings {
  googleAnalyticsId: string;
  facebookPixelId: string;
  title: string;
  keywords: string;
  description: string;
}

interface SEOSettingsViewProps {
  onBack: () => void;
}

export function SEOSettingsView({ onBack }: SEOSettingsViewProps) {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    googleAnalyticsId: '',
    facebookPixelId: '',
    title: 'Yatt Food',
    keywords: 'Yatt Food,Restaurant à Abidjan, meilleurs restaurants à',
    description: `Yatt Food est restaurant dont le QG est situé à Abidjan, Koumassi Remblais.
Les mets y sont cuisinés avec le plus grand soin dans une hygiène parfaite pour satisfaire ses clients.`
  });

  const handleInputChange = (field: keyof SEOSettings, value: string) => {
    setSeoSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving SEO settings:', seoSettings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Paramètres de référencement</h2>
          <p className="text-sm text-muted-foreground">Configuration SEO et tracking</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Google Analytics */}
          <div className="space-y-2">
            <Label className="font-medium">Google Analytics</Label>
            <Input
              placeholder="Identifiant Google Analytics"
              value={seoSettings.googleAnalyticsId}
              onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Facebook Pixel */}
          <div className="space-y-2">
            <Label className="font-medium">Pixel Facebook</Label>
            <Input
              placeholder="Identifiant de pixel Facebook"
              value={seoSettings.facebookPixelId}
              onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="font-medium">Title</Label>
            <Input
              placeholder="Titre de votre site"
              value={seoSettings.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label className="font-medium">mots-clés</Label>
            <Input
              placeholder="Mots-clés séparés par des virgules"
              value={seoSettings.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-medium">description</Label>
            <Textarea
              placeholder="Description de votre entreprise"
              value={seoSettings.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full min-h-[120px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          💾 Sauvegarder la Mise à jour
        </Button>
      </div>
    </div>
  );
}