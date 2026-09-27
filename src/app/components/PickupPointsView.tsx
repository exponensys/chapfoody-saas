import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Save, Plus, Trash2, Map, Clock } from "lucide-react";

interface PickupPoint {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  active: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  active: boolean;
}

interface PickupPointsViewProps {
  onBack: () => void;
}

export function PickupPointsView({ onBack }: PickupPointsViewProps) {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([
    {
      id: "1",
      name: "Point principal",
      latitude: "48.8566",
      longitude: "2.3522",
      address: "123 Rue de la Paix, 75001 Paris",
      active: true
    }
  ]);

  const [newPoint, setNewPoint] = useState<Omit<PickupPoint, 'id' | 'active'>>({
    name: "",
    latitude: "",
    longitude: "",
    address: ""
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", time: "09:00-09:15", active: true },
    { id: "2", time: "09:15-09:30", active: true },
    { id: "3", time: "09:30-09:45", active: true },
    { id: "4", time: "09:45-10:00", active: true },
    { id: "5", time: "10:00-10:15", active: true },
    { id: "6", time: "10:15-10:30", active: true },
    { id: "7", time: "10:30-10:45", active: true },
    { id: "8", time: "10:45-11:00", active: true },
    { id: "9", time: "11:00-11:15", active: true },
    { id: "10", time: "11:15-11:30", active: true },
    { id: "11", time: "11:30-11:45", active: true },
    { id: "12", time: "11:45-12:00", active: true },
    { id: "13", time: "12:00-12:15", active: true },
    { id: "14", time: "12:15-12:30", active: true },
    { id: "15", time: "12:30-12:45", active: true },
    { id: "16", time: "12:45-13:00", active: true },
    { id: "17", time: "13:00-13:15", active: true },
    { id: "18", time: "13:15-13:30", active: true },
    { id: "19", time: "13:30-13:45", active: true },
    { id: "20", time: "13:45-14:00", active: true },
    { id: "21", time: "14:00-14:15", active: true },
    { id: "22", time: "14:15-14:30", active: true },
    { id: "23", time: "14:30-14:45", active: true },
    { id: "24", time: "14:45-15:00", active: true },
    { id: "25", time: "15:00-15:15", active: true },
    { id: "26", time: "15:15-15:30", active: true },
    { id: "27", time: "15:30-15:45", active: true },
    { id: "28", time: "15:45-16:00", active: true },
    { id: "29", time: "16:00-16:15", active: true },
    { id: "30", time: "16:15-16:30", active: true },
    { id: "31", time: "16:30-16:45", active: true },
    { id: "32", time: "16:45-17:00", active: true },
    { id: "33", time: "17:00-17:15", active: true },
    { id: "34", time: "17:15-17:30", active: true },
    { id: "35", time: "17:30-17:45", active: true },
    { id: "36", time: "17:45-18:00", active: true },
    { id: "37", time: "18:00-18:15", active: true },
    { id: "38", time: "18:15-18:30", active: true },
    { id: "39", time: "18:30-18:45", active: true },
    { id: "40", time: "18:45-19:00", active: true }
  ]);

  const addPickupPoint = () => {
    if (newPoint.name && newPoint.address) {
      const point: PickupPoint = {
        id: Date.now().toString(),
        ...newPoint,
        active: true
      };
      setPickupPoints(prev => [...prev, point]);
      setNewPoint({ name: "", latitude: "", longitude: "", address: "" });
    }
  };

  const removePickupPoint = (id: string) => {
    setPickupPoints(prev => prev.filter(point => point.id !== id));
  };

  const togglePickupPoint = (id: string) => {
    setPickupPoints(prev => prev.map(point =>
      point.id === id ? { ...point, active: !point.active } : point
    ));
  };

  const toggleTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.map(slot =>
      slot.id === id ? { ...slot, active: !slot.active } : slot
    ));
  };

  const handleSave = () => {
    console.log("Points de retrait sauvegardés:", pickupPoints);
    console.log("Créneaux horaires sauvegardés:", timeSlots);
  };

  // URL Google Maps factice pour la démo
  const getMapUrl = (lat: string, lng: string) => {
    if (!lat || !lng) return "https://via.placeholder.com/400x200?text=Carte+Google+Maps";
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x200&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          ← Retour
        </Button>
        <h1 className="text-2xl font-semibold">Points de retrait</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Formulaire et liste des points */}
        <div className="xl:col-span-2 space-y-6">
          {/* Ajouter un nouveau point */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#b70f23]" />
                Ajouter un point de retrait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newName">Nom du point *</Label>
                  <Input
                    id="newName"
                    value={newPoint.name}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Point principal"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="newAddress">Adresse *</Label>
                  <Input
                    id="newAddress"
                    value={newPoint.address}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Adresse complète"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newLatitude">Latitude</Label>
                  <Input
                    id="newLatitude"
                    value={newPoint.latitude}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="48.8566"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="newLongitude">Longitude</Label>
                  <Input
                    id="newLongitude"
                    value={newPoint.longitude}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="2.3522"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button 
                onClick={addPickupPoint}
                className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                disabled={!newPoint.name || !newPoint.address}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter ce point
              </Button>
            </CardContent>
          </Card>

          {/* Liste des points existants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#b70f23]" />
                Points de retrait configurés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pickupPoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{point.name}</h4>
                        <Badge variant={point.active ? "default" : "secondary"}>
                          {point.active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                      {point.latitude && point.longitude && (
                        <p className="text-xs text-gray-500 mt-1">
                          Coordonnées: {point.latitude}, {point.longitude}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePickupPoint(point.id)}
                        className={point.active ? "text-orange-600" : "text-green-600"}
                      >
                        {point.active ? "Désactiver" : "Activer"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePickupPoint(point.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {pickupPoints.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun point de retrait configuré</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte et aperçu */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-[#b70f23]" />
                Aperçu Google Maps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={pickupPoints.length > 0 && pickupPoints[0].latitude 
                    ? getMapUrl(pickupPoints[0].latitude, pickupPoints[0].longitude)
                    : "https://via.placeholder.com/400x200?text=Carte+Google+Maps"
                  }
                  alt="Carte Google Maps"
                  className="w-full h-48 object-cover"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                La carte s'affiche automatiquement avec le premier point de retrait configuré.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Créneaux horaires */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#b70f23]" />
            Heures de prise en charge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={slot.active ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTimeSlot(slot.id)}
                className={slot.active 
                  ? "bg-green-600 hover:bg-green-700 text-white text-xs" 
                  : "text-xs hover:bg-gray-100"
                }
              >
                {slot.time}
              </Button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Créneaux disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-gray-300 rounded"></div>
              <span>Créneaux désactivés</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-[#b70f23] hover:bg-[#70070e] text-white px-8 py-3 text-lg flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Sauvegarder la mise à jour
        </Button>
      </div>
    </div>
  );
}