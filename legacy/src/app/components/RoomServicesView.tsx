import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Trash2, Plus, Edit, Hotel, Building2 } from "lucide-react";

interface Room {
  id: string;
  numero: string;
  numeroLit?: string; // Pour les hôpitaux
}

interface Establishment {
  id: number;
  nom: string;
  type: "hotel" | "hopital";
  rooms: Room[];
  statut: "live" | "inactive";
}

interface RoomServicesViewProps {
  onBack: () => void;
}

export function RoomServicesView({ onBack }: RoomServicesViewProps) {
  const [establishments, setEstablishments] = useState<Establishment[]>([
    {
      id: 1,
      nom: "la meridiana",
      type: "hotel",
      statut: "live",
      rooms: [
        { id: "1", numero: "A01" },
        { id: "2", numero: "A02" },
        { id: "3", numero: "A5" },
        { id: "4", numero: "B101" },
        { id: "5", numero: "B102" },
        { id: "6", numero: "B103" }
      ]
    },
    {
      id: 2,
      nom: "Hotel westin",
      type: "hotel", 
      statut: "live",
      rooms: [
        { id: "7", numero: "101" },
        { id: "8", numero: "102" },
        { id: "9", numero: "103" },
        { id: "10", numero: "104" },
        { id: "11", numero: "105" }
      ]
    }
  ]);

  const [newEstablishment, setNewEstablishment] = useState({
    nom: "",
    type: "hotel" as "hotel" | "hopital",
    rooms: [] as Room[]
  });

  const [newRoom, setNewRoom] = useState({
    numero: "",
    numeroLit: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addRoom = () => {
    if (newRoom.numero.trim()) {
      const room: Room = {
        id: Date.now().toString(),
        numero: newRoom.numero,
        ...(newEstablishment.type === "hopital" && newRoom.numeroLit ? { numeroLit: newRoom.numeroLit } : {})
      };
      
      setNewEstablishment(prev => ({
        ...prev,
        rooms: [...prev.rooms, room]
      }));
      
      setNewRoom({ numero: "", numeroLit: "" });
    }
  };

  const removeRoom = (roomId: string) => {
    setNewEstablishment(prev => ({
      ...prev,
      rooms: prev.rooms.filter(room => room.id !== roomId)
    }));
  };

  const addEstablishment = () => {
    if (newEstablishment.nom.trim() && newEstablishment.rooms.length > 0) {
      const establishment: Establishment = {
        id: Math.max(...establishments.map(e => e.id), 0) + 1,
        nom: newEstablishment.nom,
        type: newEstablishment.type,
        statut: "live",
        rooms: newEstablishment.rooms
      };
      
      setEstablishments(prev => [...prev, establishment]);
      setNewEstablishment({ nom: "", type: "hotel", rooms: [] });
      setIsDialogOpen(false);
    }
  };

  const removeEstablishment = (id: number) => {
    setEstablishments(prev => prev.filter(est => est.id !== id));
  };

  const toggleEstablishmentStatus = (id: number) => {
    setEstablishments(prev => prev.map(est => 
      est.id === id 
        ? { ...est, statut: est.statut === "live" ? "inactive" : "live" }
        : est
    ));
  };

  const removeRoomFromEstablishment = (establishmentId: number, roomId: string) => {
    setEstablishments(prev => prev.map(est => 
      est.id === establishmentId 
        ? { ...est, rooms: est.rooms.filter(room => room.id !== roomId) }
        : est
    ));
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
        <h1 className="text-2xl font-semibold">Room services</h1>
      </div>

      <div className="space-y-6">
        {/* Bouton Ajouter */}
        <div className="flex justify-start">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Informations de l'établissement */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="establishmentName">Nom de l'établissement</Label>
                    <Input
                      id="establishmentName"
                      value={newEstablishment.nom}
                      onChange={(e) => setNewEstablishment(prev => ({ ...prev, nom: e.target.value }))}
                      placeholder="Nom de l'établissement"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="establishmentType">Type d'établissement</Label>
                    <Select 
                      value={newEstablishment.type} 
                      onValueChange={(value: "hotel" | "hopital") => setNewEstablishment(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel">Hôtel</SelectItem>
                        <SelectItem value="hopital">Hôpital/Clinique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Section Chambres */}
                <div>
                  <h3 className="font-medium mb-3">Room Numbers</h3>
                  
                  {/* Formulaire d'ajout de chambre */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <Input
                        value={newRoom.numero}
                        onChange={(e) => setNewRoom(prev => ({ ...prev, numero: e.target.value }))}
                        placeholder="Numéro de chambre"
                      />
                    </div>
                    
                    {newEstablishment.type === "hopital" && (
                      <div className="flex-1">
                        <Input
                          value={newRoom.numeroLit}
                          onChange={(e) => setNewRoom(prev => ({ ...prev, numeroLit: e.target.value }))}
                          placeholder="Numéro de lit"
                        />
                      </div>
                    )}
                    
                    <Button 
                      onClick={addRoom}
                      disabled={!newRoom.numero.trim()}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </div>

                  {/* Liste des chambres ajoutées */}
                  <div className="grid grid-cols-6 gap-2">
                    {newEstablishment.rooms.map((room) => (
                      <div key={room.id} className="relative">
                        <div className="bg-gray-200 border border-gray-300 rounded p-3 text-center text-sm min-h-[60px] flex items-center justify-center">
                          <div>
                            <div className="font-medium">{room.numero}</div>
                            {room.numeroLit && (
                              <div className="text-xs text-gray-600">Lit {room.numeroLit}</div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeRoom(room.id)}
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton de sauvegarde */}
                <Button 
                  onClick={addEstablishment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!newEstablishment.nom.trim() || newEstablishment.rooms.length === 0}
                >
                  Save Change
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tableau des établissements */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium">Sl</th>
                    <th className="text-left p-4 font-medium">Nom de l'établissement</th>
                    <th className="text-left p-4 font-medium">Room Numbers</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {establishments.map((establishment, index) => (
                    <tr key={establishment.id} className="border-b">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {establishment.type === "hotel" ? (
                            <Hotel className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Building2 className="h-4 w-4 text-green-600" />
                          )}
                          <span>{establishment.nom}</span>
                          <Badge variant="outline" className="text-xs">
                            {establishment.type === "hotel" ? "Hôtel" : "Hôpital"}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2 max-w-md">
                          {establishment.rooms.map((room) => (
                            <div key={room.id} className="relative group">
                              <div className="bg-gray-200 border border-gray-300 rounded px-3 py-1 text-sm flex items-center">
                                <span>{room.numero}</span>
                                {room.numeroLit && (
                                  <span className="text-xs text-gray-600 ml-1">
                                    (Lit {room.numeroLit})
                                  </span>
                                )}
                              </div>
                              <Button
                                onClick={() => removeRoomFromEstablishment(establishment.id, room.id)}
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={establishment.statut === "live" ? "default" : "secondary"}
                          className={establishment.statut === "live" ? "bg-green-600" : ""}
                        >
                          ✓ {establishment.statut === "live" ? "Live" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeEstablishment(establishment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {establishments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun établissement configuré</p>
                <p className="text-sm">Cliquez sur "Add New" pour ajouter votre premier établissement</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}