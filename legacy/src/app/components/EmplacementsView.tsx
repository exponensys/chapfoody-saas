import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MapPin, Save, Trash2, Plus, Navigation } from "lucide-react";

interface Emplacement {
  id: number;
  adresse: string;
  latitude: string;
  longitude: string;
  active: boolean;
}

interface EmplacementsViewProps {
  onBack: () => void;
}

export function EmplacementsView({ onBack }: EmplacementsViewProps) {
  const [emplacements, setEmplacements] = useState<Emplacement[]>([
    {
      id: 1,
      adresse: "123 Rue de la Paix, 75001 Paris",
      latitude: "48.8566",
      longitude: "2.3522",
      active: true
    },
    {
      id: 2,
      adresse: "456 Avenue des Champs-Élysées, 75008 Paris",
      latitude: "48.8738",
      longitude: "2.2950",
      active: true
    },
    {
      id: 3,
      adresse: "789 Boulevard Saint-Germain, 75007 Paris",
      latitude: "48.8559",
      longitude: "2.3264",
      active: false
    }
  ]);

  const [newEmplacement, setNewEmplacement] = useState({
    adresse: "",
    latitude: "",
    longitude: ""
  });

  const addEmplacement = () => {
    if (newEmplacement.adresse.trim()) {
      const emplacement: Emplacement = {
        id: Math.max(...emplacements.map(e => e.id), 0) + 1,
        adresse: newEmplacement.adresse,
        latitude: newEmplacement.latitude,
        longitude: newEmplacement.longitude,
        active: true
      };
      setEmplacements(prev => [...prev, emplacement]);
      setNewEmplacement({ adresse: "", latitude: "", longitude: "" });
    }
  };

  const removeEmplacement = (id: number) => {
    setEmplacements(prev => prev.filter(emp => emp.id !== id));
  };

  const toggleEmplacement = (id: number) => {
    setEmplacements(prev => prev.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  const handleSave = () => {
    console.log("Emplacements sauvegardés:", emplacements);
    // Ici vous pourriez ajouter la logique de sauvegarde
  };

  const openInGoogleMaps = (latitude: string, longitude: string) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  // Fonction pour obtenir l'adresse à partir des coordonnées (simulation)
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewEmplacement(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          alert("Impossible d'obtenir votre position actuelle.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
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
        <h1 className="text-2xl font-semibold">Gestion des emplacements</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Formulaire d'ajout */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#b70f23]" />
                Ajouter un nouvel emplacement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adresse">Adresse *</Label>
                <Input
                  id="adresse"
                  value={newEmplacement.adresse}
                  onChange={(e) => setNewEmplacement(prev => ({ 
                    ...prev, 
                    adresse: e.target.value 
                  }))}
                  placeholder="Adresse complète"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={newEmplacement.latitude}
                  onChange={(e) => setNewEmplacement(prev => ({ 
                    ...prev, 
                    latitude: e.target.value 
                  }))}
                  placeholder="Ex: 48.8566"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={newEmplacement.longitude}
                  onChange={(e) => setNewEmplacement(prev => ({ 
                    ...prev, 
                    longitude: e.target.value 
                  }))}
                  placeholder="Ex: 2.3522"
                  className="mt-1"
                />
              </div>

              <Button
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full text-[#b70f23] border-[#b70f23] hover:bg-[#b70f23] hover:text-white"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Utiliser ma position
              </Button>

              <Button 
                onClick={addEmplacement}
                className="w-full bg-[#b70f23] hover:bg-[#70070e] text-white"
                disabled={!newEmplacement.adresse.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'emplacement
              </Button>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Conseils</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Saisissez une adresse précise</li>
                  <li>• Les coordonnées GPS sont optionnelles</li>
                  <li>• Utilisez "Ma position" pour la localisation automatique</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des emplacements */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#b70f23]" />
                Emplacements configurés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emplacements.map((emplacement) => (
                    <TableRow key={emplacement.id}>
                      <TableCell className="font-medium">
                        {emplacement.id}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate" title={emplacement.adresse}>
                            {emplacement.adresse}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {emplacement.latitude || "—"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {emplacement.longitude || "—"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            emplacement.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {emplacement.active ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {emplacement.latitude && emplacement.longitude && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInGoogleMaps(
                                emplacement.latitude, 
                                emplacement.longitude
                              )}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleEmplacement(emplacement.id)}
                            className={emplacement.active 
                              ? "text-orange-600 hover:text-orange-700" 
                              : "text-green-600 hover:text-green-700"
                            }
                          >
                            {emplacement.active ? 'Désactiver' : 'Activer'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeEmplacement(emplacement.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {emplacements.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun emplacement configuré</p>
                  <p className="text-sm">Ajoutez votre premier emplacement pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carte d'exemple */}
          {emplacements.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Aperçu cartographique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Carte Google Maps</p>
                    <p className="text-sm">Intégration carte à venir</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  La carte affichera tous vos emplacements actifs avec leurs coordonnées GPS.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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