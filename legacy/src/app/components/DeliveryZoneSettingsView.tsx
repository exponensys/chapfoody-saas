import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
}

interface DeliveryZoneSettingsViewProps {
  onBack: () => void;
}

export function DeliveryZoneSettingsView({ onBack }: DeliveryZoneSettingsViewProps) {
  const [zoneBasedDelivery, setZoneBasedDelivery] = useState(true);
  const [newZone, setNewZone] = useState({
    name: '',
    fee: ''
  });
  const [zones, setZones] = useState<DeliveryZone[]>([
    { id: '1', name: 'Centre-ville', fee: 2500 },
    { id: '2', name: 'Banlieue proche', fee: 5000 },
    { id: '3', name: 'Banlieue éloignée', fee: 7500 }
  ]);

  const handleAddZone = () => {
    if (newZone.name && newZone.fee) {
      const zone: DeliveryZone = {
        id: Date.now().toString(),
        name: newZone.name,
        fee: parseFloat(newZone.fee)
      };
      setZones(prev => [...prev, zone]);
      setNewZone({ name: '', fee: '' });
    }
  };

  const handleDeleteZone = (id: string) => {
    setZones(prev => prev.filter(zone => zone.id !== id));
  };

  const handleSubmit = () => {
    console.log('Saving zone-based delivery settings:', { zoneBasedDelivery, zones });
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
          <h2 className="text-xl font-medium text-[#b70f23]">Zone de livraison</h2>
          <p className="text-sm text-muted-foreground">Configuration des zones et frais de livraison</p>
        </div>
      </div>

      {/* Zone-based delivery toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <div className="font-medium">Frais de livraison en fonction de la zone</div>
                <div className="text-sm text-muted-foreground">activer pour permettre</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={zoneBasedDelivery}
                onCheckedChange={setZoneBasedDelivery}
              />
              {zoneBasedDelivery && (
                <Badge className="bg-green-500 text-white text-xs">✓ actif</Badge>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add new zone */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une zone de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">
              Nom de la zone <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Nom de la zone"
              value={newZone.name}
              onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">frais de livraison</Label>
            <Input
              placeholder="0"
              type="number"
              value={newZone.fee}
              onChange={(e) => setNewZone(prev => ({ ...prev, fee: e.target.value }))}
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleAddZone}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newZone.name || !newZone.fee}
          >
            💾 Sauvegarder la Mise à jour
          </Button>
        </CardContent>
      </Card>

      {/* Zones table */}
      <Card>
        <CardHeader>
          <CardTitle>Zone de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Sl</th>
                  <th className="text-left py-3 px-2 font-medium">Nom de la zone</th>
                  <th className="text-left py-3 px-2 font-medium">Frais</th>
                  <th className="text-left py-3 px-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, index) => (
                  <tr key={zone.id} className="border-b">
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2">{zone.name}</td>
                    <td className="py-3 px-2">{zone.fee.toLocaleString()} F CFA</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log('Edit zone:', zone.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteZone(zone.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {zones.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      Aucune zone de livraison configurée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}