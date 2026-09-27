import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, Upload, User } from 'lucide-react';

interface PWASettings {
  logo: string | null;
  title: string;
  themeColor: string;
  backgroundColor: string;
  status: 'active' | 'inactive';
}

interface PWAConfigViewProps {
  onBack: () => void;
}

export function PWAConfigView({ onBack }: PWAConfigViewProps) {
  const [settings, setSettings] = useState<PWASettings>({
    logo: null,
    title: 'yatt_food',
    themeColor: '#ff9800',
    backgroundColor: '#ff9800',
    status: 'active'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PWASettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log('Saving PWA settings:', settings);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Configuration PWA</h2>
          <p className="text-sm text-muted-foreground">Configuration de l'application web progressive</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PWA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="font-medium">Logo</Label>
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {settings.logo ? (
                  <img 
                    src={settings.logo} 
                    alt="Logo PWA" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquer pour uploader</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={settings.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Color */}
            <div className="space-y-2">
              <Label className="font-medium">Couleur du thème:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={settings.themeColor}
                  onChange={(e) => handleInputChange('themeColor', e.target.value)}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={settings.themeColor}
                  onChange={(e) => handleInputChange('themeColor', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label className="font-medium">Couleur d'arrière-plan:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
              </div>
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
                <Label htmlFor="inactive" className="font-medium">Désactiver</Label>
              </div>
            </RadioGroup>
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