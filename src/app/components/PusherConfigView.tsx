import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface PusherSettings {
  appId: string;
  authKey: string;
  secret: string;
  cluster: string;
  status: string;
  developmentMode: boolean;
}

interface PusherConfigViewProps {
  onBack: () => void;
}

export function PusherConfigView({ onBack }: PusherConfigViewProps) {
  const [settings, setSettings] = useState<PusherSettings>({
    appId: '',
    authKey: '',
    secret: '',
    cluster: '',
    status: 'activer',
    developmentMode: false
  });

  const handleInputChange = (field: keyof PusherSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof PusherSettings, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmit = () => {
    console.log('Saving Pusher settings:', settings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Pusher</h2>
          <p className="text-sm text-muted-foreground">Configuration des services Pusher</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* App ID */}
          <div className="space-y-2">
            <Label className="font-medium">
              Identifiant de l'application <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Identifiant de l'application"
              value={settings.appId}
              onChange={(e) => handleInputChange('appId', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Auth Key */}
          <div className="space-y-2">
            <Label className="font-medium">
              Clé d'authentification <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Clé d'authentification"
              value={settings.authKey}
              onChange={(e) => handleInputChange('authKey', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Secret */}
          <div className="space-y-2">
            <Label className="font-medium">
              Secret <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Secret"
              type="password"
              value={settings.secret}
              onChange={(e) => handleInputChange('secret', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Cluster */}
          <div className="space-y-2">
            <Label className="font-medium">
              Cluster <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder=""
              value={settings.cluster}
              onChange={(e) => handleInputChange('cluster', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="font-medium">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={settings.status}
              onValueChange={(value) => handleInputChange('status', value)}
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

          {/* Development Mode */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="developmentMode"
              checked={settings.developmentMode}
              onCheckedChange={(checked) => handleCheckboxChange('developmentMode', checked as boolean)}
            />
            <Label htmlFor="developmentMode" className="font-medium">
              Activer le mode développement
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