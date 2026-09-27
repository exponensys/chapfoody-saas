import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileText, Search, Filter, Calendar, Euro, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SalesJournalViewProps {
  onBack?: () => void;
}

export function SalesJournalView({ onBack }: SalesJournalViewProps) {
  const salesEntries = [
    {
      id: "V001",
      date: "13/09/2025",
      client: "Restaurant Le Gourmet",
      description: "Vente menu complet - Table 12",
      amount: 85.50,
      paymentMethod: "Carte bancaire",
      vatRate: 20,
      vatAmount: 14.25,
      status: "Validée"
    },
    {
      id: "V002", 
      date: "13/09/2025",
      client: "Client anonyme",
      description: "Commande à emporter - Burger Menu",
      amount: 32.00,
      paymentMethod: "Espèces",
      vatRate: 20,
      vatAmount: 5.33,
      status: "Validée"
    },
    {
      id: "V003",
      date: "12/09/2025", 
      client: "Société ABC",
      description: "Livraison entreprise - Plateaux repas",
      amount: 245.00,
      paymentMethod: "Virement",
      vatRate: 20,
      vatAmount: 40.83,
      status: "En attente"
    },
    {
      id: "V004",
      date: "12/09/2025",
      client: "Martin Dupont", 
      description: "Dîner familial - Menu enfant x2",
      amount: 48.00,
      paymentMethod: "Carte bancaire",
      vatRate: 20,
      vatAmount: 8.00,
      status: "Validée"
    },
    {
      id: "V005",
      date: "11/09/2025",
      client: "Client anonyme",
      description: "Café et pâtisserie",
      amount: 12.50,
      paymentMethod: "Espèces",
      vatRate: 20,
      vatAmount: 2.08,
      status: "Validée"
    }
  ];

  const totalSales = salesEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalVAT = salesEntries.reduce((sum, entry) => sum + entry.vatAmount, 0);

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
          <h2 className="text-2xl font-bold text-gray-900">Journal des ventes</h2>
          <p className="text-gray-600">Suivi chronologique de toutes vos ventes</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total des ventes</p>
                <p className="text-2xl font-bold">{totalSales.toFixed(2)} €</p>
              </div>
              <Euro className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#f4b71b] to-[#e09900] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total TVA</p>
                <p className="text-2xl font-bold">{totalVAT.toFixed(2)} €</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#70070e] to-[#b70f23] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Nb. transactions</p>
                <p className="text-2xl font-bold">{salesEntries.length}</p>
              </div>
              <FileText className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Rechercher dans le journal..."
                className="w-full"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Journal Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Entrées du journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">N° Vente</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-right p-3">Montant HT</th>
                  <th className="text-right p-3">TVA</th>
                  <th className="text-right p-3">Montant TTC</th>
                  <th className="text-left p-3">Mode de paiement</th>
                  <th className="text-center p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {salesEntries.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-[#b70f23]">{entry.id}</td>
                    <td className="p-3">{entry.date}</td>
                    <td className="p-3">{entry.client}</td>
                    <td className="p-3">{entry.description}</td>
                    <td className="p-3 text-right font-medium">
                      {(entry.amount - entry.vatAmount).toFixed(2)} €
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      {entry.vatAmount.toFixed(2)} €
                    </td>
                    <td className="p-3 text-right font-bold">
                      {entry.amount.toFixed(2)} €
                    </td>
                    <td className="p-3">{entry.paymentMethod}</td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={entry.status === "Validée" ? "default" : "secondary"}
                        className={entry.status === "Validée" ? "bg-green-100 text-green-800" : ""}
                      >
                        {entry.status}
                      </Badge>
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
            <FileText className="w-8 h-8 mx-auto mb-2 text-[#b70f23]" />
            <h3 className="font-medium mb-1">Exporter en PDF</h3>
            <p className="text-sm text-gray-600">Générer un rapport PDF du journal</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-[#f4b71b]" />
            <h3 className="font-medium mb-1">Exporter en Excel</h3>
            <p className="text-sm text-gray-600">Données détaillées pour analyse</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#70070e]" />
            <h3 className="font-medium mb-1">Analyse des tendances</h3>
            <p className="text-sm text-gray-600">Voir l'évolution des ventes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}