import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Edit, Trash2, Users, MapPin } from "lucide-react";

interface TableItem {
  id: number;
  nom: string;
  codra: string;
  zone: string;
  statut: "libre" | "occupée" | "réservée" | "hors service";
  capacite: number;
}

interface Zone {
  id: string;
  nom: string;
  description: string;
}

interface TablesViewProps {
  onBack: () => void;
}

export function TablesView({ onBack }: TablesViewProps) {
  const [tables, setTables] = useState<TableItem[]>([
    { id: 1, nom: "Table 1", codra: "T001", zone: "Terrasse", statut: "libre", capacite: 4 },
    { id: 2, nom: "Table 2", codra: "T002", zone: "Salle principale", statut: "occupée", capacite: 2 },
    { id: 3, nom: "Table 3", codra: "T003", zone: "Terrasse", statut: "réservée", capacite: 6 },
    { id: 4, nom: "Table 4", codra: "T004", zone: "Bar", statut: "libre", capacite: 2 },
    { id: 5, nom: "Table 5", codra: "T005", zone: "Salle principale", statut: "hors service", capacite: 8 }
  ]);

  const [zones, setZones] = useState<Zone[]>([
    { id: "1", nom: "Salle principale", description: "Zone principale du restaurant" },
    { id: "2", nom: "Terrasse", description: "Zone extérieure" },
    { id: "3", nom: "Bar", description: "Zone du bar" },
    { id: "4", nom: "Salon privé", description: "Espace privatisable" }
  ]);

  const [newZone, setNewZone] = useState({ nom: "", description: "" });
  const [newTable, setNewTable] = useState({ 
    nom: "", 
    codra: "", 
    zone: "", 
    capacite: 4 
  });

  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "libre": return "bg-green-500";
      case "occupée": return "bg-red-500";
      case "réservée": return "bg-yellow-500";
      case "hors service": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusVariant = (statut: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (statut) {
      case "libre": return "default";
      case "occupée": return "destructive";
      case "réservée": return "secondary";
      case "hors service": return "outline";
      default: return "outline";
    }
  };

  const addZone = () => {
    if (newZone.nom.trim()) {
      const zone: Zone = {
        id: Date.now().toString(),
        nom: newZone.nom,
        description: newZone.description
      };
      setZones(prev => [...prev, zone]);
      setNewZone({ nom: "", description: "" });
      setIsZoneDialogOpen(false);
    }
  };

  const addTable = () => {
    if (newTable.nom && newTable.codra && newTable.zone) {
      const table: TableItem = {
        id: Math.max(...tables.map(t => t.id)) + 1,
        nom: newTable.nom,
        codra: newTable.codra,
        zone: newTable.zone,
        statut: "libre",
        capacite: newTable.capacite
      };
      setTables(prev => [...prev, table]);
      setNewTable({ nom: "", codra: "", zone: "", capacite: 4 });
      setIsTableDialogOpen(false);
    }
  };

  const removeTable = (id: number) => {
    setTables(prev => prev.filter(table => table.id !== id));
  };

  const removeZone = (id: string) => {
    const zoneName = zones.find(z => z.id === id)?.nom;
    // Vérifier s'il y a des tables dans cette zone
    const tablesInZone = tables.filter(table => table.zone === zoneName);
    if (tablesInZone.length > 0) {
      alert(`Impossible de supprimer la zone "${zoneName}" car elle contient ${tablesInZone.length} table(s).`);
      return;
    }
    setZones(prev => prev.filter(zone => zone.id !== id));
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
        <h1 className="text-2xl font-semibold">Gestion des tables</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Liste des tables */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#b70f23]" />
                  Liste des tables
                </CardTitle>
                <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une table
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tableName">Nom de la table</Label>
                        <Input
                          id="tableName"
                          value={newTable.nom}
                          onChange={(e) => setNewTable(prev => ({ ...prev, nom: e.target.value }))}
                          placeholder="Ex: Table 6"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tableCode">Code QR</Label>
                        <Input
                          id="tableCode"
                          value={newTable.codra}
                          onChange={(e) => setNewTable(prev => ({ ...prev, codra: e.target.value }))}
                          placeholder="Ex: T006"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tableZone">Zone</Label>
                        <Select value={newTable.zone} onValueChange={(value) => setNewTable(prev => ({ ...prev, zone: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {zones.map(zone => (
                              <SelectItem key={zone.id} value={zone.nom}>
                                {zone.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tableCapacity">Capacité (nombre de places)</Label>
                        <Input
                          id="tableCapacity"
                          type="number"
                          min="1"
                          max="20"
                          value={newTable.capacite}
                          onChange={(e) => setNewTable(prev => ({ ...prev, capacite: parseInt(e.target.value) || 4 }))}
                        />
                      </div>
                      <Button 
                        onClick={addTable}
                        className="w-full bg-[#b70f23] hover:bg-[#70070e]"
                        disabled={!newTable.nom || !newTable.codra || !newTable.zone}
                      >
                        Ajouter la table
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code QR</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>{table.id}</TableCell>
                      <TableCell className="font-medium">{table.nom}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {table.codra}
                        </code>
                      </TableCell>
                      <TableCell>{table.zone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          {table.capacite}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(table.statut)} className="capitalize">
                          {table.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeTable(table.id)}
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
            </CardContent>
          </Card>
        </div>

        {/* Gestion des zones */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#b70f23]" />
                Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ajouter une nouvelle zone */}
              <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full text-[#b70f23] border-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une zone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle zone</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="zoneName">Nom de la zone</Label>
                      <Input
                        id="zoneName"
                        value={newZone.nom}
                        onChange={(e) => setNewZone(prev => ({ ...prev, nom: e.target.value }))}
                        placeholder="Ex: VIP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zoneDescription">Description</Label>
                      <Input
                        id="zoneDescription"
                        value={newZone.description}
                        onChange={(e) => setNewZone(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description de la zone"
                      />
                    </div>
                    <Button 
                      onClick={addZone}
                      className="w-full bg-[#b70f23] hover:bg-[#70070e]"
                      disabled={!newZone.nom.trim()}
                    >
                      Ajouter la zone
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Liste des zones */}
              <div className="space-y-2">
                {zones.map((zone) => {
                  const tablesCount = tables.filter(table => table.zone === zone.nom).length;
                  return (
                    <div key={zone.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{zone.nom}</h4>
                          <p className="text-xs text-gray-600">{tablesCount} table(s)</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeZone(zone.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={tablesCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {zone.description && (
                        <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}