import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface OneSignalSettings {
  appId: string;
  apiKey: string;
  status: 'active' | 'inactive';
  userId: string;
  pushForNewOrder: boolean;
}

interface OneSignalConfigViewProps {
  onBack: () => void;
}

export function OneSignalConfigView({ onBack }: OneSignalConfigViewProps) {
  const [settings, setSettings] = useState<OneSignalSettings>({
    appId: '',
    apiKey: '',
    status: 'active',
    userId: '',
    pushForNewOrder: false
  });

  const handleInputChange = (field: keyof OneSignalSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof OneSignalSettings, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmit = () => {
    console.log('Saving OneSignal settings:', settings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Configuration OneSignal</h2>
          <p className="text-sm text-muted-foreground">Configuration des notifications push</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* App ID */}
          <div className="space-y-2">
            <Label className="font-medium">ID d'application Onesignal</Label>
            <Input
              placeholder="ID d'application Onesignal"
              value={settings.appId}
              onChange={(e) => handleInputChange('appId', e.target.value)}
              className="w-full"
            />
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label className="font-medium">Clé api rest</Label>
            <Input
              placeholder="Clé api rest"
              value={settings.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="w-full"
            />
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
                <Label htmlFor="inactive" className="font-medium">Désactiver</Label>
              </div>
            </RadioGroup>
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <Label className="font-medium">id utilisateur onesignal</Label>
            <Input
              placeholder="Clé d'authentification utilisateur"
              value={settings.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Push Notification for New Order */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pushForNewOrder"
              checked={settings.pushForNewOrder}
              onCheckedChange={(checked) => handleCheckboxChange('pushForNewOrder', checked as boolean)}
            />
            <Label htmlFor="pushForNewOrder" className="font-medium">
              activer le push pour une nouvelle commande
            </Label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}