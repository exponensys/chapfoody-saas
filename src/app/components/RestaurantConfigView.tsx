import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { QrCode, Save, MapPin, Phone, Mail, Globe, Instagram, Facebook, Twitter } from "lucide-react";

interface RestaurantConfigViewProps {
  onBack: () => void;
}

export function RestaurantConfigView({ onBack }: RestaurantConfigViewProps) {
  const [config, setConfig] = useState({
    name: "Chez Francis Bistro Gourmet",
    address: "123 Rue de la Paix",
    postalCode: "75001",
    city: "Paris",
    country: "France",
    phone: "+33 1 42 60 38 30",
    email: "contact@chezfrancis.com",
    website: "www.chezfrancis.com",
    vatNumber: "FR12345678901",
    siret: "12345678901234",
    facebook: "chezfrancisbistro",
    instagram: "chezfrancis_paris", 
    twitter: "chezfrancisbistro",
    description: "",
    openingHours: "",
    capacity: "",
    specialties: ""
  });

  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Configuration sauvegardée:", config);
    // Ici vous pourriez ajouter la logique de sauvegarde
  };

  // Génération du QR code (URL factice pour la démo)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(config.website || 'www.chapfoody.com')}`;

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
        <h1 className="text-2xl font-semibold">Configuration du restaurant</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#b70f23]" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom et adresse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du restaurant *</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => handleConfigChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={config.address}
                    onChange={(e) => handleConfigChange("address", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={config.postalCode}
                    onChange={(e) => handleConfigChange("postalCode", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={config.city}
                    onChange={(e) => handleConfigChange("city", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select value={config.country} onValueChange={(value) => handleConfigChange("country", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgique">Belgique</SelectItem>
                      <SelectItem value="Suisse">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={config.phone}
                    onChange={(e) => handleConfigChange("phone", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email}
                    onChange={(e) => handleConfigChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site web
                </Label>
                <Input
                  id="website"
                  value={config.website}
                  onChange={(e) => handleConfigChange("website", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Informations légales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vatNumber">Numéro de TVA</Label>
                  <Input
                    id="vatNumber"
                    value={config.vatNumber}
                    onChange={(e) => handleConfigChange("vatNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={config.siret}
                    onChange={(e) => handleConfigChange("siret", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={config.facebook}
                    onChange={(e) => handleConfigChange("facebook", e.target.value)}
                    placeholder="nom-de-page"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={config.instagram}
                    onChange={(e) => handleConfigChange("instagram", e.target.value)}
                    placeholder="@nom-utilisateur"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={config.twitter}
                    onChange={(e) => handleConfigChange("twitter", e.target.value)}
                    placeholder="@nom-utilisateur"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informations supplémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => handleConfigChange("description", e.target.value)}
                  placeholder="Décrivez votre restaurant, son ambiance, sa cuisine..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacité (nombre de places)</Label>
                  <Input
                    id="capacity"
                    value={config.capacity}
                    onChange={(e) => handleConfigChange("capacity", e.target.value)}
                    placeholder="Ex: 50"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specialties">Spécialités</Label>
                  <Input
                    id="specialties"
                    value={config.specialties}
                    onChange={(e) => handleConfigChange("specialties", e.target.value)}
                    placeholder="Ex: Cuisine française, Bio"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#b70f23]" />
                Code QR de votre restaurant
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img 
                  src={qrCodeUrl}
                  alt="QR Code du restaurant"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Ce QR code dirige vers votre site web et peut être utilisé sur vos supports de communication.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrCodeUrl;
                  link.download = 'qr-code-restaurant.png';
                  link.click();
                }}
              >
                Télécharger le QR Code
              </Button>
            </CardContent>
          </Card>
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