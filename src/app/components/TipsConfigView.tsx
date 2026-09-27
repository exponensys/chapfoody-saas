import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ArrowLeft } from 'lucide-react';

interface TipsSettings {
  enabled: boolean;
  percentage1: string;
  percentage2: string;
  percentage3: string;
}

interface TipsConfigViewProps {
  onBack: () => void;
}

export function TipsConfigView({ onBack }: TipsConfigViewProps) {
  const [settings, setSettings] = useState<TipsSettings>({
    enabled: true,
    percentage1: '',
    percentage2: '',
    percentage3: ''
  });

  const handleInputChange = (field: keyof TipsSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enabled: checked
    }));
  };

  const handleSave = () => {
    console.log('Saving tips settings:', settings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Pourboires</h2>
          <p className="text-sm text-muted-foreground">Configuration des pourboires</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <div className="font-medium">Pourboires</div>
                <div className="text-sm text-muted-foreground">actif pour permettre</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.enabled}
                onCheckedChange={handleSwitchChange}
              />
              {settings.enabled && (
                <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
              )}
            </div>
          </div>

          {/* Percentage Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Percentage 1 */}
            <div className="space-y-3">
              <h3 className="font-medium">Définir le pourcentage</h3>
              <div className="space-y-2">
                <Label className="text-sm">Définir le pourcentage</Label>
                <div className="relative">
                  <Input
                    placeholder="Définir le pourcentage"
                    value={settings.percentage1}
                    onChange={(e) => handleInputChange('percentage1', e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage 2 */}
            <div className="space-y-3">
              <h3 className="font-medium">Définir le pourcentage</h3>
              <div className="space-y-2">
                <Label className="text-sm">Définir le pourcentage</Label>
                <div className="relative">
                  <Input
                    placeholder="Définir le pourcentage"
                    value={settings.percentage2}
                    onChange={(e) => handleInputChange('percentage2', e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage 3 */}
            <div className="space-y-3">
              <h3 className="font-medium">Définir le pourcentage</h3>
              <div className="space-y-2">
                <Label className="text-sm">Définir le pourcentage</Label>
                <div className="relative">
                  <Input
                    placeholder="Définir le pourcentage"
                    value={settings.percentage3}
                    onChange={(e) => handleInputChange('percentage3', e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
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