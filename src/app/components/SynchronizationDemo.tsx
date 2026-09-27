import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useLiveOrders } from "../contexts/LiveOrdersContext";
import {
  ArrowRight,
  Play,
  RotateCcw,
  Eye,
  Utensils,
} from "lucide-react";

export function SynchronizationDemo() {
  const {
    orders,
    pendingOrders,
    activeOrders,
    addMockOrder,
    acceptOrder,
    updateOrderStatus,
  } = useLiveOrders();

  const [demoStep, setDemoStep] = useState(0);
  const [demoOrderId, setDemoOrderId] = useState<string | null>(
    null,
  );

  const runSynchronizationDemo = async () => {
    setDemoStep(1);

    // Étape 1: Créer une nouvelle commande
    addMockOrder();
    const newOrder = orders[0]; // La plus récente
    setDemoOrderId(newOrder?.id || null);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDemoStep(2);

    // Étape 2: Accepter la commande
    if (newOrder) {
      acceptOrder(newOrder.id, 25);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
    setDemoStep(3);

    // Étape 3: Passer en préparation
    if (newOrder) {
      updateOrderStatus(newOrder.id, "preparing");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDemoStep(4);

    // Étape 4: Marquer comme prête
    if (newOrder) {
      updateOrderStatus(newOrder.id, "ready");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDemoStep(5);

    // Étape 5: Marquer comme servie
    if (newOrder) {
      updateOrderStatus(newOrder.id, "delivered");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDemoStep(0);
    setDemoOrderId(null);
  };

  const resetDemo = () => {
    setDemoStep(0);
    setDemoOrderId(null);
  };

  const demoSteps = [
    {
      title: "Prêt",
      description: "Cliquez pour démarrer la démonstration",
      color: "bg-gray-500",
    },
    {
      title: "Nouvelle commande",
      description: 'Une commande arrive dans "Commandes Live"',
      color: "bg-yellow-500",
    },
    {
      title: "Acceptation",
      description: "Commande acceptée → Synchronisée avec KDS",
      color: "bg-blue-500",
    },
    {
      title: "Préparation",
      description: "Statut mis à jour depuis le KDS",
      color: "bg-orange-500",
    },
    {
      title: "Prête",
      description: "Commande marquée comme terminée dans KDS",
      color: "bg-green-500",
    },
    {
      title: "Servie",
      description: "Processus de synchronisation complet",
      color: "bg-gray-500",
    },
  ];

  return (
    <Card className="mb-6 border-2 border-dashed border-[#f4b71b]/30 bg-gradient-to-r from-[#f4b71b]/5 to-[#b70f23]/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#b70f23]">
          <Eye className="w-5 h-5" />
          Démonstration de synchronisation KDS ↔ Live
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Indicateur d'étape actuelle */}
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${demoSteps[demoStep].color}`}
            ></div>
            <div>
              <div className="font-medium">
                {demoSteps[demoStep].title}
              </div>
              <div className="text-sm text-gray-600">
                {demoSteps[demoStep].description}
              </div>
            </div>
          </div>
          {demoStep > 0 && (
            <Badge className="bg-[#f4b71b] text-white">
              Étape {demoStep}/5
            </Badge>
          )}
        </div>

        {/* Workflow visuel */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {[
            "Nouvelle",
            "Acceptée",
            "Préparation",
            "Prête",
            "Servie",
          ].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  index < demoStep
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : index === demoStep - 1
                      ? "bg-[#f4b71b] text-white border border-[#f4b71b] animate-pulse"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {step}
              </div>
              {index < 4 && (
                <ArrowRight
                  className={`w-4 h-4 ${
                    index < demoStep - 1
                      ? "text-green-500"
                      : "text-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Statistiques temps réel */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-lg font-bold text-[#f4b71b]">
              {pendingOrders.length}
            </div>
            <div className="text-sm text-gray-600">
              En attente
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-lg font-bold text-[#17a2b8]">
              {activeOrders.length}
            </div>
            <div className="text-sm text-gray-600">
              En cuisine
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-lg font-bold text-[#b70f23]">
              {orders.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={runSynchronizationDemo}
            disabled={demoStep > 0}
            className="bg-[#b70f23] hover:bg-[#d41e39] text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {demoStep === 0
              ? "Démarrer la démo"
              : "Démo en cours..."}
          </Button>

          <Button
            onClick={resetDemo}
            variant="outline"
            disabled={demoStep === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>

          <Button onClick={addMockOrder} variant="outline">
            <Utensils className="w-4 h-4 mr-2" />
            Test commande
          </Button>
        </div>

        {/* Explications */}
        <div className="text-xs text-gray-600 bg-white rounded-lg p-3 border">
          <strong>Comment ça marche :</strong>
          <br />
          1. Une commande arrive dans "Commandes Live" (statut:
          En attente)
          <br />
          2. Le restaurateur l'accepte → Elle apparaît
          automatiquement dans le KDS
          <br />
          3. Le cuisinier met à jour le statut via le KDS → Ça
          se synchronise avec "Commandes Live"
          <br />
          4. Toutes les mises à jour sont synchronisées en temps
          réel entre les deux vues
        </div>
      </CardContent>
    </Card>
  );
}