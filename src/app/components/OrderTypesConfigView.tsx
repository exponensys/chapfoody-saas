import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface OrderType {
  id: string;
  name: string;
  description: string;
  active: boolean;
  paymentEnabled: boolean;
  paymentRequired: boolean;
}

interface OrderTypesConfigViewProps {
  onBack: () => void;
}

export function OrderTypesConfigView({ onBack }: OrderTypesConfigViewProps) {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([
    {
      id: 'cash-on-delivery',
      name: 'Cash on delivery',
      description: 'Activer pour autoriser dans votre système.',
      active: true,
      paymentEnabled: true,
      paymentRequired: true
    },
    {
      id: 'booking',
      name: 'Booking',
      description: 'Activer pour autoriser dans votre système.',
      active: false,
      paymentEnabled: true,
      paymentRequired: true
    },
    {
      id: 'pickup',
      name: 'Pickup',
      description: 'Activer pour autoriser dans votre système.',
      active: true,
      paymentEnabled: true,
      paymentRequired: true
    },
    {
      id: 'dine-in',
      name: 'Dine-in',
      description: 'Activer pour autoriser dans votre système.',
      active: false,
      paymentEnabled: true,
      paymentRequired: true
    },
    {
      id: 'room-service',
      name: 'Room Service',
      description: 'Activer pour autoriser dans votre système.',
      active: true,
      paymentEnabled: true,
      paymentRequired: true
    },
    {
      id: 'pay-cash',
      name: 'Pay cash',
      description: 'Activer pour autoriser dans votre système.',
      active: false,
      paymentEnabled: false,
      paymentRequired: false
    }
  ]);

  const handleToggleActive = (id: string) => {
    setOrderTypes(prev => prev.map(type => 
      type.id === id ? { ...type, active: !type.active } : type
    ));
  };

  const handleTogglePayment = (id: string) => {
    setOrderTypes(prev => prev.map(type => 
      type.id === id ? { ...type, paymentEnabled: !type.paymentEnabled } : type
    ));
  };

  const handleSave = () => {
    console.log('Saving order types configuration:', orderTypes);
    // Logique de sauvegarde
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-medium text-[#b70f23]">Configuration de la commande</h2>
          <p className="text-sm text-muted-foreground">Configurez les types de commandes disponibles</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {orderTypes.map((orderType, index) => (
              <div 
                key={orderType.id} 
                className={`p-4 flex items-center justify-between ${
                  index !== orderTypes.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Type info et toggle principal */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={orderType.active}
                      onCheckedChange={() => handleToggleActive(orderType.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <div className="flex items-center gap-2">
                      {orderType.active ? (
                        <span className="text-green-600 text-sm font-medium">✓ actif</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">⊗ désactivé</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{orderType.name}</div>
                    <div className="text-sm text-gray-600">{orderType.description}</div>
                  </div>
                </div>

                {/* Colonnes de paiement */}
                <div className="flex items-center gap-8">
                  <div className="text-center min-w-[100px]">
                    <div className="text-sm font-medium text-gray-600 mb-1">Activer le paiement</div>
                    {orderType.id === 'pay-cash' ? (
                      <span className="text-red-600 text-sm">paiement non disponible</span>
                    ) : (
                      <Switch
                        checked={orderType.paymentEnabled}
                        onCheckedChange={() => handleTogglePayment(orderType.id)}
                        disabled={!orderType.active}
                        className="data-[state=checked]:bg-green-500"
                      />
                    )}
                  </div>
                  
                  <div className="text-center min-w-[100px]">
                    <div className="text-sm font-medium text-gray-600 mb-1">Paiement requis</div>
                    {orderType.id === 'pay-cash' ? (
                      <span className="text-red-600 text-sm">paiement non disponible</span>
                    ) : (
                      <div className="text-sm text-gray-700">
                        {orderType.paymentRequired && orderType.active ? 'Paiement requis' : 'Paiement requis'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}