import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileText, Settings, CheckCircle, Calendar, Database, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "./ui/date-picker";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AccountingExportViewProps {
  onBack?: () => void;
}

export function AccountingExportView({ onBack }: AccountingExportViewProps) {
  const exportHistory = [
    {
      id: "EXP-001",
      date: "12/09/2025",
      type: "FEC",
      period: "01/01/2025 - 31/08/2025",
      format: "CSV",
      size: "2.4 MB",
      status: "Terminé",
      downloadUrl: "#"
    },
    {
      id: "EXP-002", 
      date: "01/09/2025",
      type: "Grand Livre",
      period: "01/08/2025 - 31/08/2025",
      format: "PDF",
      size: "156 KB",
      status: "Terminé",
      downloadUrl: "#"
    },
    {
      id: "EXP-003",
      date: "28/08/2025",
      type: "Balance générale",
      period: "01/01/2025 - 31/07/2025", 
      format: "Excel",
      size: "89 KB",
      status: "Terminé",
      downloadUrl: "#"
    },
    {
      id: "EXP-004",
      date: "25/08/2025",
      type: "Journal des ventes",
      period: "01/07/2025 - 31/07/2025",
      format: "CSV",
      size: "445 KB",
      status: "Terminé",
      downloadUrl: "#"
    }
  ];

  const softwareIntegrations = [
    { name: "Sage", logo: "📊", compatible: true, format: "CSV/XML" },
    { name: "QuickBooks", logo: "📈", compatible: true, format: "QBO/CSV" },
    { name: "Cegid", logo: "🏢", compatible: true, format: "TXT/CSV" },
    { name: "EBP", logo: "💼", compatible: true, format: "XML/CSV" },
    { name: "Ciel", logo: "☁️", compatible: true, format: "CSV/TXT" },
    { name: "FEC Standard", logo: "📋", compatible: true, format: "FEC" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
          >
            ← Retour
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export comptable</h2>
          <p className="text-gray-600">Exportez vos données comptables vers vos logiciels</p>
        </div>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#b70f23]/20 hover:border-[#b70f23]">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#b70f23]" />
            <h3 className="font-medium mb-1">FEC (Fichier des Écritures Comptables)</h3>
            <p className="text-sm text-gray-600 mb-3">Export conforme DGFiP</p>
            <Button size="sm" className="bg-[#b70f23] hover:bg-[#70070e]">
              Générer FEC
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#f4b71b]/20 hover:border-[#f4b71b]">
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-[#f4b71b]" />
            <h3 className="font-medium mb-1">Grand Livre</h3>
            <p className="text-sm text-gray-600 mb-3">Détail par compte</p>
            <Button size="sm" variant="outline" className="border-[#f4b71b] text-[#f4b71b] hover:bg-[#f4b71b] hover:text-white">
              Exporter
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#70070e]/20 hover:border-[#70070e]">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-[#70070e]" />
            <h3 className="font-medium mb-1">Balance générale</h3>
            <p className="text-sm text-gray-600 mb-3">Synthèse des comptes</p>
            <Button size="sm" variant="outline" className="border-[#70070e] text-[#70070e] hover:bg-[#70070e] hover:text-white">
              Exporter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Configuration */}
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">Export standard</TabsTrigger>
          <TabsTrigger value="custom">Export personnalisé</TabsTrigger>
          <TabsTrigger value="integration">Intégrations</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration d'export standard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-type">Type d'export</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fec">FEC - Fichier des Écritures Comptables</SelectItem>
                        <SelectItem value="grand-livre">Grand Livre</SelectItem>
                        <SelectItem value="balance">Balance générale</SelectItem>
                        <SelectItem value="journal-ventes">Journal des ventes</SelectItem>
                        <SelectItem value="journal-achats">Journal des achats</SelectItem>
                        <SelectItem value="journal-tresorerie">Journal de trésorerie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Format de fichier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV (Excel)</SelectItem>
                        <SelectItem value="txt">TXT (Texte délimité)</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date-start">Date de début</Label>
                    <DatePicker />
                  </div>

                  <div>
                    <Label htmlFor="date-end">Date de fin</Label>
                    <DatePicker />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Options d'export</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-zero" />
                    <Label htmlFor="include-zero">Inclure les comptes à solde nul</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-lettrage" />
                    <Label htmlFor="include-lettrage">Inclure les informations de lettrage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-pieces" />
                    <Label htmlFor="include-pieces">Inclure les références de pièces justificatives</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="anonymize" />
                    <Label htmlFor="anonymize">Anonymiser les données clients</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Download className="w-4 h-4 mr-2" />
                  Générer l'export
                </Button>
                <Button variant="outline">
                  Aperçu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Export personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Comptes à inclure</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-1" defaultChecked />
                        <Label htmlFor="classe-1">Classe 1 - Comptes de capitaux</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-2" defaultChecked />
                        <Label htmlFor="classe-2">Classe 2 - Comptes d'immobilisations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-3" defaultChecked />
                        <Label htmlFor="classe-3">Classe 3 - Comptes de stocks</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-4" defaultChecked />
                        <Label htmlFor="classe-4">Classe 4 - Comptes de tiers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-5" defaultChecked />
                        <Label htmlFor="classe-5">Classe 5 - Comptes financiers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-6" defaultChecked />
                        <Label htmlFor="classe-6">Classe 6 - Comptes de charges</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="classe-7" defaultChecked />
                        <Label htmlFor="classe-7">Classe 7 - Comptes de produits</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Colonnes à exporter</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-compte" defaultChecked />
                        <Label htmlFor="col-compte">Numéro de compte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-libelle" defaultChecked />
                        <Label htmlFor="col-libelle">Libellé du compte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-date" defaultChecked />
                        <Label htmlFor="col-date">Date d'écriture</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-piece" defaultChecked />
                        <Label htmlFor="col-piece">Numéro de pièce</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-debit" defaultChecked />
                        <Label htmlFor="col-debit">Montant débit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-credit" defaultChecked />
                        <Label htmlFor="col-credit">Montant crédit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="col-solde" />
                        <Label htmlFor="col-solde">Solde progressif</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                  <Download className="w-4 h-4 mr-2" />
                  Générer l'export personnalisé
                </Button>
                <Button variant="outline">
                  Sauvegarder le modèle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Intégrations logiciels comptables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {softwareIntegrations.map((software) => (
                  <Card key={software.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{software.logo}</div>
                      <h3 className="font-medium mb-1">{software.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Format: {software.format}</p>
                      <Badge 
                        variant={software.compatible ? "default" : "secondary"}
                        className={software.compatible ? "bg-green-100 text-green-800" : ""}
                      >
                        {software.compatible ? "Compatible" : "Non supporté"}
                      </Badge>
                      {software.compatible && (
                        <Button size="sm" className="mt-2 w-full" variant="outline">
                          Configurer
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historique des exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID Export</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Période</th>
                  <th className="text-left p-3">Format</th>
                  <th className="text-left p-3">Taille</th>
                  <th className="text-center p-3">Statut</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exportHistory.map((export_) => (
                  <tr key={export_.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-[#b70f23]">{export_.id}</td>
                    <td className="p-3">{export_.date}</td>
                    <td className="p-3">{export_.type}</td>
                    <td className="p-3 text-sm">{export_.period}</td>
                    <td className="p-3">
                      <Badge variant="outline">{export_.format}</Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{export_.size}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1 justify-center w-fit mx-auto">
                        <CheckCircle className="w-3 h-3" />
                        {export_.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm">
                          Recréer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}