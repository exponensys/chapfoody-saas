import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileText, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface BalanceSheetsViewProps {
  onBack?: () => void;
}

export function BalanceSheetsView({ onBack }: BalanceSheetsViewProps) {
  const balanceSheetData = {
    assets: {
      fixed: [
        { account: "211000", label: "Terrains", amount: 85000, previousAmount: 85000 },
        { account: "213000", label: "Constructions", amount: 125000, previousAmount: 125000 },
        { account: "218100", label: "Matériel de cuisine", amount: 45000, previousAmount: 42000 },
        { account: "218200", label: "Mobilier restaurant", amount: 25000, previousAmount: 28000 },
        { account: "218300", label: "Matériel informatique", amount: 8500, previousAmount: 12000 }
      ],
      current: [
        { account: "371000", label: "Stock matières premières", amount: 8500, previousAmount: 7200 },
        { account: "411000", label: "Clients", amount: 15600, previousAmount: 18900 },
        { account: "512000", label: "Banque", amount: 32000, previousAmount: 28500 },
        { account: "530000", label: "Caisse", amount: 2500, previousAmount: 1800 }
      ]
    },
    liabilities: {
      equity: [
        { account: "101000", label: "Capital social", amount: 50000, previousAmount: 50000 },
        { account: "110000", label: "Report à nouveau", amount: 25000, previousAmount: 15000 },
        { account: "120000", label: "Résultat de l'exercice", amount: 18500, previousAmount: 22000 }
      ],
      debts: [
        { account: "164000", label: "Emprunts établissements crédit", amount: 85000, previousAmount: 95000 },
        { account: "401000", label: "Fournisseurs", amount: 12500, previousAmount: 9800 },
        { account: "431000", label: "Sécurité sociale", amount: 4200, previousAmount: 3900 },
        { account: "445200", label: "TVA à décaisser", amount: 3800, previousAmount: 4100 }
      ]
    }
  };

  const currentYear = "2025";
  const previousYear = "2024";

  const calculateTotal = (items: any[]) => items.reduce((sum, item) => sum + item.amount, 0);
  const calculatePreviousTotal = (items: any[]) => items.reduce((sum, item) => sum + item.previousAmount, 0);

  const totalAssets = calculateTotal([...balanceSheetData.assets.fixed, ...balanceSheetData.assets.current]);
  const totalLiabilities = calculateTotal([...balanceSheetData.liabilities.equity, ...balanceSheetData.liabilities.debts]);
  const totalAssetsLastYear = calculatePreviousTotal([...balanceSheetData.assets.fixed, ...balanceSheetData.assets.current]);

  const getVariationIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getVariationClass = (current: number, previous: number) => {
    if (current > previous) return "text-green-600";
    if (current < previous) return "text-red-600";
    return "text-gray-400";
  };

  const formatVariation = (current: number, previous: number) => {
    const diff = current - previous;
    const percentage = previous !== 0 ? ((diff / previous) * 100) : 0;
    return {
      amount: Math.abs(diff),
      percentage: Math.abs(percentage),
      sign: diff >= 0 ? "+" : "-"
    };
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
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Bilans</h2>
          <p className="text-gray-600">Situation financière et patrimoine de l'entreprise</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue={currentYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Exercice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Actif</p>
                <p className="text-2xl font-bold">{totalAssets.toLocaleString()} €</p>
                <div className="flex items-center gap-1 mt-1">
                  {getVariationIcon(totalAssets, totalAssetsLastYear)}
                  <span className="text-xs text-white/70">
                    vs {previousYear}
                  </span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#f4b71b] to-[#e09900] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Capitaux Propres</p>
                <p className="text-2xl font-bold">
                  {calculateTotal(balanceSheetData.liabilities.equity).toLocaleString()} €
                </p>
                <span className="text-xs text-white/70">Fonds propres</span>
              </div>
              <TrendingUp className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#70070e] to-[#b70f23] text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Ratio d'endettement</p>
                <p className="text-2xl font-bold">
                  {((calculateTotal(balanceSheetData.liabilities.debts) / totalAssets) * 100).toFixed(1)}%
                </p>
                <span className="text-xs text-white/70">Dettes / Actif</span>
              </div>
              <FileText className="w-8 h-8 text-white/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Sheet Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Bilan au 31/12/{currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detailed" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detailed">Vue détaillée</TabsTrigger>
              <TabsTrigger value="summary">Vue synthétique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detailed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ACTIF */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-[#b70f23]">ACTIF</h3>
                  
                  {/* Actif immobilisé */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3 bg-gray-50 p-2 rounded">
                      Actif immobilisé
                    </h4>
                    <div className="space-y-2">
                      {balanceSheetData.assets.fixed.map((item) => {
                        const variation = formatVariation(item.amount, item.previousAmount);
                        return (
                          <div key={item.account} className="flex justify-between items-center py-1 border-b border-gray-100">
                            <div>
                              <span className="text-sm text-gray-600">{item.account}</span>
                              <span className="ml-2">{item.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.amount.toLocaleString()} €</div>
                              <div className={`text-xs flex items-center gap-1 ${getVariationClass(item.amount, item.previousAmount)}`}>
                                {getVariationIcon(item.amount, item.previousAmount)}
                                {variation.sign}{variation.amount.toLocaleString()} €
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between font-bold pt-2 border-t-2">
                        <span>Total Actif immobilisé</span>
                        <span>{calculateTotal(balanceSheetData.assets.fixed).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Actif circulant */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 bg-gray-50 p-2 rounded">
                      Actif circulant
                    </h4>
                    <div className="space-y-2">
                      {balanceSheetData.assets.current.map((item) => {
                        const variation = formatVariation(item.amount, item.previousAmount);
                        return (
                          <div key={item.account} className="flex justify-between items-center py-1 border-b border-gray-100">
                            <div>
                              <span className="text-sm text-gray-600">{item.account}</span>
                              <span className="ml-2">{item.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.amount.toLocaleString()} €</div>
                              <div className={`text-xs flex items-center gap-1 ${getVariationClass(item.amount, item.previousAmount)}`}>
                                {getVariationIcon(item.amount, item.previousAmount)}
                                {variation.sign}{variation.amount.toLocaleString()} €
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between font-bold pt-2 border-t-2">
                        <span>Total Actif circulant</span>
                        <span>{calculateTotal(balanceSheetData.assets.current).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-4 border-t-4 border-[#b70f23]">
                    <span>TOTAL ACTIF</span>
                    <span className="text-[#b70f23]">{totalAssets.toLocaleString()} €</span>
                  </div>
                </div>

                {/* PASSIF */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-[#b70f23]">PASSIF</h3>
                  
                  {/* Capitaux propres */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3 bg-gray-50 p-2 rounded">
                      Capitaux propres
                    </h4>
                    <div className="space-y-2">
                      {balanceSheetData.liabilities.equity.map((item) => {
                        const variation = formatVariation(item.amount, item.previousAmount);
                        return (
                          <div key={item.account} className="flex justify-between items-center py-1 border-b border-gray-100">
                            <div>
                              <span className="text-sm text-gray-600">{item.account}</span>
                              <span className="ml-2">{item.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.amount.toLocaleString()} €</div>
                              <div className={`text-xs flex items-center gap-1 ${getVariationClass(item.amount, item.previousAmount)}`}>
                                {getVariationIcon(item.amount, item.previousAmount)}
                                {variation.sign}{variation.amount.toLocaleString()} €
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between font-bold pt-2 border-t-2">
                        <span>Total Capitaux propres</span>
                        <span>{calculateTotal(balanceSheetData.liabilities.equity).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>

                  {/* Dettes */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 bg-gray-50 p-2 rounded">
                      Dettes
                    </h4>
                    <div className="space-y-2">
                      {balanceSheetData.liabilities.debts.map((item) => {
                        const variation = formatVariation(item.amount, item.previousAmount);
                        return (
                          <div key={item.account} className="flex justify-between items-center py-1 border-b border-gray-100">
                            <div>
                              <span className="text-sm text-gray-600">{item.account}</span>
                              <span className="ml-2">{item.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.amount.toLocaleString()} €</div>
                              <div className={`text-xs flex items-center gap-1 ${getVariationClass(item.amount, item.previousAmount)}`}>
                                {getVariationIcon(item.amount, item.previousAmount)}
                                {variation.sign}{variation.amount.toLocaleString()} €
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-between font-bold pt-2 border-t-2">
                        <span>Total Dettes</span>
                        <span>{calculateTotal(balanceSheetData.liabilities.debts).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-4 border-t-4 border-[#b70f23]">
                    <span>TOTAL PASSIF</span>
                    <span className="text-[#b70f23]">{totalLiabilities.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ratios financiers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Ratio d'autonomie financière</span>
                      <span className="font-bold">
                        {((calculateTotal(balanceSheetData.liabilities.equity) / totalAssets) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ratio d'endettement</span>
                      <span className="font-bold">
                        {((calculateTotal(balanceSheetData.liabilities.debts) / totalAssets) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liquidité générale</span>
                      <span className="font-bold">
                        {(calculateTotal(balanceSheetData.assets.current) / calculateTotal(balanceSheetData.liabilities.debts)).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Croissance du total actif</span>
                      <span className={`font-bold ${getVariationClass(totalAssets, totalAssetsLastYear)}`}>
                        {formatVariation(totalAssets, totalAssetsLastYear).sign}
                        {formatVariation(totalAssets, totalAssetsLastYear).percentage.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}