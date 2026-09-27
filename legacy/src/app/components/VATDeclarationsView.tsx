import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileText, Calculator, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface VATDeclarationsViewProps {
  onBack?: () => void;
}

export function VATDeclarationsView({ onBack }: VATDeclarationsViewProps) {
  const vatDeclarations = [
    {
      id: "TVA-2025-09",
      period: "Septembre 2025",
      dueDate: "20/10/2025",
      vatCollected: 1250.45,
      vatDeductible: 320.15,
      vatToPay: 930.30,
      status: "En cours",
      submitted: false
    },
    {
      id: "TVA-2025-08", 
      period: "Août 2025",
      dueDate: "20/09/2025",
      vatCollected: 1456.80,
      vatDeductible: 415.20,
      vatToPay: 1041.60,
      status: "Soumise",
      submitted: true,
      submissionDate: "18/09/2025"
    },
    {
      id: "TVA-2025-07",
      period: "Juillet 2025", 
      dueDate: "20/08/2025",
      vatCollected: 1345.25,
      vatDeductible: 380.50,
      vatToPay: 964.75,
      status: "Payée",
      submitted: true,
      submissionDate: "15/08/2025",
      paymentDate: "19/08/2025"
    },
    {
      id: "TVA-2025-06",
      period: "Juin 2025",
      dueDate: "20/07/2025", 
      vatCollected: 1620.90,
      vatDeductible: 445.30,
      vatToPay: 1175.60,
      status: "Payée",
      submitted: true,
      submissionDate: "12/07/2025",
      paymentDate: "16/07/2025"
    }
  ];

  const currentDeclaration = vatDeclarations[0];
  const totalVatToPay = vatDeclarations
    .filter(d => d.status !== "Payée")
    .reduce((sum, d) => sum + d.vatToPay, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-yellow-100 text-yellow-800";
      case "Soumise": return "bg-blue-100 text-blue-800";
      case "Payée": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours": return <Clock className="w-4 h-4" />;
      case "Soumise": return <CheckCircle className="w-4 h-4" />;
      case "Payée": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Déclarations TVA</h2>
          <p className="text-gray-600">Gestion de vos déclarations de TVA périodiques</p>
        </div>
      </div>

      {/* Current Declaration Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-800">Déclaration en cours</h3>
              <p className="text-sm text-orange-700 mt-1">
                La déclaration TVA pour {currentDeclaration.period} doit être soumise avant le {currentDeclaration.dueDate}.
                Montant à payer : <span className="font-bold">{currentDeclaration.vatToPay.toFixed(2)} €</span>
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-[#b70f23] hover:bg-[#70070e]">
                  Finaliser la déclaration
                </Button>
                <Button variant="outline" size="sm">
                  Voir les détails
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">TVA à payer</p>
                <p className="text-2xl font-bold">{totalVatToPay.toFixed(2)} €</p>
                <p className="text-xs text-white/70">En attente</p>
              </div>
              <Calculator className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#f4b71b] to-[#e09900] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">TVA collectée (Sept.)</p>
                <p className="text-2xl font-bold">{currentDeclaration.vatCollected.toFixed(2)} €</p>
                <p className="text-xs text-white/70">Ce mois</p>
              </div>
              <FileText className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#70070e] to-[#b70f23] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">TVA déductible (Sept.)</p>
                <p className="text-2xl font-bold">{currentDeclaration.vatDeductible.toFixed(2)} €</p>
                <p className="text-xs text-white/70">Ce mois</p>
              </div>
              <Download className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="font-medium">Période à consulter :</label>
            <Select defaultValue="2025">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter tout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Declarations History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historique des déclarations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Période</th>
                  <th className="text-left p-3">Date limite</th>
                  <th className="text-right p-3">TVA collectée</th>
                  <th className="text-right p-3">TVA déductible</th>
                  <th className="text-right p-3">Solde à payer</th>
                  <th className="text-center p-3">Statut</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vatDeclarations.map((declaration) => (
                  <tr key={declaration.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{declaration.period}</td>
                    <td className="p-3">{declaration.dueDate}</td>
                    <td className="p-3 text-right font-medium text-green-600">
                      +{declaration.vatCollected.toFixed(2)} €
                    </td>
                    <td className="p-3 text-right font-medium text-blue-600">
                      -{declaration.vatDeductible.toFixed(2)} €
                    </td>
                    <td className="p-3 text-right font-bold text-[#b70f23]">
                      {declaration.vatToPay.toFixed(2)} €
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        className={`${getStatusColor(declaration.status)} flex items-center gap-1 justify-center w-fit mx-auto`}
                      >
                        {getStatusIcon(declaration.status)}
                        {declaration.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                        {declaration.status === "En cours" && (
                          <Button size="sm" className="bg-[#b70f23] hover:bg-[#70070e]">
                            Finaliser
                          </Button>
                        )}
                        {declaration.submitted && (
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="w-3 h-3" />
                            PDF
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Calculator className="w-8 h-8 mx-auto mb-2 text-[#b70f23]" />
            <h3 className="font-medium mb-1">Calculateur TVA</h3>
            <p className="text-sm text-gray-600">Outil de calcul automatique</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#f4b71b]" />
            <h3 className="font-medium mb-1">Modèles de déclaration</h3>
            <p className="text-sm text-gray-600">Templates prêts à l'emploi</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-[#70070e]" />
            <h3 className="font-medium mb-1">Rappels automatiques</h3>
            <p className="text-sm text-gray-600">Ne manquez plus une échéance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}