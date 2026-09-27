import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ArrowLeft } from 'lucide-react';

interface DeliveryRadiusSettings {
  enabled: boolean;
  latitude: string;
  longitude: string;
  radius: string;
  notFoundMessage: string;
}

interface DeliveryRadiusSettingsViewProps {
  onBack: () => void;
}

export function DeliveryRadiusSettingsView({ onBack }: DeliveryRadiusSettingsViewProps) {
  const [settings, setSettings] = useState<DeliveryRadiusSettings>({
    enabled: false,
    latitude: '',
    longitude: '',
    radius: '',
    notFoundMessage: ''
  });

  const handleInputChange = (field: keyof DeliveryRadiusSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving delivery radius settings:', settings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Paramètres de livraison basés sur le rayon</h2>
          <p className="text-sm text-muted-foreground">Configuration de la zone de livraison par rayon</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <div className="font-medium">Activer la livraison basée sur le rayon</div>
                <div className="text-sm text-muted-foreground">Activer pour autoriser dans votre système.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleInputChange('enabled', checked)}
              />
              {!settings.enabled && (
                <span className="text-red-600 text-sm font-medium">⊗ désactivé</span>
              )}
            </div>
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <Label className="font-medium">
              Latitude <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Latitude"
              value={settings.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label className="font-medium">
              Longitude <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Longitude"
              value={settings.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Rayon */}
          <div className="space-y-2">
            <Label className="font-medium">Rayon</Label>
            <div className="relative">
              <Input
                placeholder="Rayon"
                value={settings.radius}
                onChange={(e) => handleInputChange('radius', e.target.value)}
                className="w-full pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Km
              </span>
            </div>
          </div>

          {/* Message introuvable */}
          <div className="space-y-2">
            <Label className="font-medium">Message introuvable</Label>
            <Textarea
              placeholder="Message à afficher quand l'adresse n'est pas dans la zone de livraison"
              value={settings.notFoundMessage}
              onChange={(e) => handleInputChange('notFoundMessage', e.target.value)}
              className="w-full min-h-[120px] resize-none"
            />
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