import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { QrCode, Download, Save, Link2, Car, Calendar, Users } from "lucide-react";

interface QRCodeConfig {
  type: "commande" | "reservation" | "parking" | "table";
  mode: string;
  url: string;
  customData: Record<string, string>;
}

interface TableItem {
  id: number;
  nom: string;
  codra: string;
  zone: string;
  capacite: number;
}

interface QRBuilderViewProps {
  onBack: () => void;
}

export function QRBuilderView({ onBack }: QRBuilderViewProps) {
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>({
    type: "commande",
    mode: "commande-premier-plan",
    url: "",
    customData: {}
  });

  const [selectedTable, setSelectedTable] = useState<string>("");

  // Tables simulées (normalement récupérées depuis l'état global)
  const [tables] = useState<TableItem[]>([
    { id: 1, nom: "Table 1", codra: "T001", zone: "Terrasse", capacite: 4 },
    { id: 2, nom: "Table 2", codra: "T002", zone: "Salle principale", capacite: 2 },
    { id: 3, nom: "Table 3", codra: "T003", zone: "Terrasse", capacite: 6 },
    { id: 4, nom: "Table 4", codra: "T004", zone: "Bar", capacite: 2 },
    { id: 5, nom: "Table 5", codra: "T005", zone: "Salle principale", capacite: 8 }
  ]);

  const qrTypes = [
    { 
      id: "commande", 
      label: "Commande premier plan", 
      icon: Link2,
      description: "QR code pour passer commande directement"
    },
    { 
      id: "reservation", 
      label: "Réservation en ligne", 
      icon: Calendar,
      description: "QR code pour réserver une table"
    },
    { 
      id: "parking", 
      label: "Parking", 
      icon: Car,
      description: "QR code pour le parking"
    }
  ];

  const getModes = (type: string) => {
    switch (type) {
      case "commande":
        return [
          { value: "commande-premier-plan", label: "Commande premier plan" },
          { value: "menu-digital", label: "Menu digital" },
          { value: "commande-express", label: "Commande express" }
        ];
      case "reservation":
        return [
          { value: "reservation-standard", label: "Réservation standard" },
          { value: "reservation-express", label: "Réservation express" },
          { value: "reservation-groupes", label: "Réservation groupes" }
        ];
      case "parking":
        return [
          { value: "parking-standard", label: "Parking standard" },
          { value: "parking-vip", label: "Parking VIP" },
          { value: "parking-livraison", label: "Parking livraison" }
        ];
      case "table":
        return [
          { value: "table-commande", label: "Commande de table" },
          { value: "table-menu", label: "Menu de table" },
          { value: "table-service", label: "Appel service" }
        ];
      default:
        return [];
    }
  };

  const generateQRUrl = () => {
    const baseUrl = "https://chapfoody.com";
    let qrUrl = "";
    
    switch (qrConfig.type) {
      case "commande":
        qrUrl = `${baseUrl}/commande?mode=${qrConfig.mode}`;
        break;
      case "reservation":
        qrUrl = `${baseUrl}/reservation?mode=${qrConfig.mode}`;
        break;
      case "parking":
        qrUrl = `${baseUrl}/parking?mode=${qrConfig.mode}`;
        break;
      case "table":
        const table = tables.find(t => t.id.toString() === selectedTable);
        qrUrl = `${baseUrl}/table/${selectedTable}?mode=${qrConfig.mode}&code=${table?.codra || ''}`;
        break;
    }
    
    return qrUrl || qrConfig.url || baseUrl;
  };

  const generateTableQRUrl = (table: TableItem) => {
    return `https://chapfoody.com/table/${table.id}?code=${table.codra}`;
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateQRUrl())}`;

  const handleTypeChange = (type: string) => {
    const modes = getModes(type);
    setQrConfig(prev => ({
      ...prev,
      type: type as "commande" | "reservation" | "parking" | "table",
      mode: modes[0]?.value || ""
    }));
  };

  const handleSave = () => {
    console.log("Configuration QR Code sauvegardée:", qrConfig);
    console.log("URL générée:", generateQRUrl());
  };

  const downloadQRCode = (url?: string) => {
    const qrUrl = url ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}` : qrCodeUrl;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${qrConfig.type}-${qrConfig.mode}.png`;
    link.click();
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
        <h1 className="text-2xl font-semibold">Générateur de QR Code</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">QR Code général</TabsTrigger>
          <TabsTrigger value="tables">QR Code pour tables</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Configuration générale */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-[#b70f23]" />
                    Configuration du QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sélection du type */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Créer un premier plan
                    </Label>
                    <RadioGroup 
                      value={qrConfig.type} 
                      onValueChange={handleTypeChange}
                      className="space-y-3"
                    >
                      {qrTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <div key={type.id} className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={type.id} 
                              id={type.id}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label 
                                htmlFor={type.id}
                                className="flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <IconComponent className="h-4 w-4 text-[#b70f23]" />
                                {type.label}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  {/* Sélection du mode */}
                  <div>
                    <Label htmlFor="mode" className="text-base font-medium">
                      Mode
                    </Label>
                    <Select 
                      value={qrConfig.mode} 
                      onValueChange={(value) => setQrConfig(prev => ({ ...prev, mode: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getModes(qrConfig.type).map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            {mode.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* URL personnalisée (optionnel) */}
                  <div>
                    <Label htmlFor="customUrl">URL personnalisée (optionnel)</Label>
                    <Input
                      id="customUrl"
                      value={qrConfig.url}
                      onChange={(e) => setQrConfig(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://votresite.com/page-personnalisee"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Laissez vide pour utiliser l'URL générée automatiquement
                    </p>
                  </div>

                  {/* Paramètres spécifiques selon le type */}
                  {qrConfig.type === "commande" && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Paramètres de commande</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="tableNumber">Numéro de table</Label>
                          <Input
                            id="tableNumber"
                            placeholder="Ex: Table 5"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Catégorie par défaut</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entrees">Entrées</SelectItem>
                              <SelectItem value="plats">Plats</SelectItem>
                              <SelectItem value="desserts">Desserts</SelectItem>
                              <SelectItem value="boissons">Boissons</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {qrConfig.type === "reservation" && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Paramètres de réservation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="maxGuests">Nombre max de convives</Label>
                          <Input
                            id="maxGuests"
                            type="number"
                            placeholder="Ex: 8"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="advance">Délai de réservation (heures)</Label>
                          <Input
                            id="advance"
                            type="number"
                            placeholder="Ex: 2"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {qrConfig.type === "parking" && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Paramètres de parking</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="parkingZone">Zone de parking</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zone-a">Zone A</SelectItem>
                              <SelectItem value="zone-b">Zone B</SelectItem>
                              <SelectItem value="zone-vip">Zone VIP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Durée max (heures)</Label>
                          <Input
                            id="duration"
                            type="number"
                            placeholder="Ex: 3"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* URL générée */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Label className="font-medium">URL générée:</Label>
                    <code className="block mt-2 p-2 bg-white rounded border text-sm break-all">
                      {generateQRUrl()}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Aperçu QR Code */}
            <div className="xl:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Aperçu du QR Code</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
                    <img 
                      src={qrCodeUrl}
                      alt="QR Code généré"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      Type: <span className="font-medium capitalize">{qrConfig.type}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Mode: <span className="font-medium">{qrConfig.mode}</span>
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={() => downloadQRCode()}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PNG
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(generateQRUrl());
                        alert("URL copiée dans le presse-papiers!");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Copier l'URL
                    </Button>
                  </div>

                  <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Conseil:</strong> Testez votre QR code avant de l'imprimer en le scannant avec votre téléphone.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tables">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Liste des tables */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#b70f23]" />
                    QR Codes pour tables existantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tables.map((table) => (
                      <div key={table.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{table.nom}</h4>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {table.codra}
                            </code>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Zone: {table.zone}</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {table.capacite} places
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            URL: {generateTableQRUrl(table)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQRCode(generateTableQRUrl(table))}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger QR
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tables.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune table configurée</p>
                      <p className="text-sm">Ajoutez des tables dans la section "Tables" pour générer leurs QR codes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Aperçu pour table sélectionnée */}
            <div className="xl:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Aperçu QR Code table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="tableSelect">Sélectionner une table</Label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choisir une table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((table) => (
                          <SelectItem key={table.id} value={table.id.toString()}>
                            {table.nom} ({table.codra})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTable && (
                    <div className="mt-6 text-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateTableQRUrl(tables.find(t => t.id.toString() === selectedTable)!))}`}
                          alt={`QR Code pour ${tables.find(t => t.id.toString() === selectedTable)?.nom}`}
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                          Table: <span className="font-medium">{tables.find(t => t.id.toString() === selectedTable)?.nom}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Code: <span className="font-medium">{tables.find(t => t.id.toString() === selectedTable)?.codra}</span>
                        </p>
                      </div>

                      <Button 
                        onClick={() => {
                          const table = tables.find(t => t.id.toString() === selectedTable);
                          if (table) downloadQRCode(generateTableQRUrl(table));
                        }}
                        variant="outline"
                        className="w-full mt-4"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800">
                      ℹ️ <strong>Info:</strong> Chaque table aura un QR code unique permettant aux clients de commander directement depuis leur table.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bouton de sauvegarde */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-[#b70f23] hover:bg-[#70070e] text-white px-8 py-3 text-lg flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Sauvegarder la configuration
        </Button>
      </div>
    </div>
  );
}