import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ArrowLeft } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  status: 'active' | 'inactive' | 'not-configured';
  config: {
    [key: string]: string;
  };
}

interface PaymentGatewayViewProps {
  onBack: () => void;
}

export function PaymentGatewayView({ onBack }: PaymentGatewayViewProps) {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'paypal',
      name: 'PayPal',
      enabled: true,
      status: 'active',
      config: {
        mode: 'sandbox',
        clientId: '',
        clientSecret: ''
      }
    },
    {
      id: 'stripe',
      name: 'Stripe',
      enabled: true,
      status: 'active',
      config: {
        mode: 'test',
        publishableKey: '',
        secretKey: '',
        webhookSecret: ''
      }
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      enabled: true,
      status: 'active',
      config: {
        mode: 'test',
        keyId: '',
        keySecret: ''
      }
    }
  ]);

  const handleConfigChange = (gatewayId: string, field: string, value: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, config: { ...gateway.config, [field]: value } }
        : gateway
    ));
  };

  const handleToggleGateway = (gatewayId: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, enabled: !gateway.enabled }
        : gateway
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">active</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">inactive</span>;
      case 'not-configured':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">not configured</span>;
      default:
        return null;
    }
  };

  const handleSave = () => {
    console.log('Saving payment gateways configuration:', gateways);
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
          <h2 className="text-xl font-medium text-[#b70f23]">Passerelles de paiement</h2>
          <p className="text-sm text-muted-foreground">Configuration des méthodes de paiement</p>
        </div>
      </div>

      {/* Payment Gateways Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium">Name</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                  <th className="text-left py-2 px-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {gateways.map((gateway) => (
                  <tr key={gateway.id} className="border-b">
                    <td className="py-2 px-2">{gateway.name}</td>
                    <td className="py-2 px-2">{getStatusBadge(gateway.status)}</td>
                    <td className="py-2 px-2">
                      <Button variant="destructive" size="sm">
                        Désactiver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PayPal Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
            PayPal
          </div>
          <div>
            <CardTitle>PayPal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Environment/Mode</Label>
            <Select 
              value={gateways[0]?.config.mode} 
              onValueChange={(value) => handleConfigChange('paypal', 'mode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Client Paypal</Label>
            <Input 
              placeholder="Client Paypal"
              value={gateways[0]?.config.clientId || ''}
              onChange={(e) => handleConfigChange('paypal', 'clientId', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Client Secret</Label>
            <Input 
              placeholder="Client Secret"
              type="password"
              value={gateways[0]?.config.clientSecret || ''}
              onChange={(e) => handleConfigChange('paypal', 'clientSecret', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
            stripe
          </div>
          <div>
            <CardTitle>Stripe</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Environment/Mode</Label>
            <Select 
              value={gateways[1]?.config.mode} 
              onValueChange={(value) => handleConfigChange('stripe', 'mode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Clé publique de Stripe</Label>
            <Input 
              placeholder="Clé publique de Stripe"
              value={gateways[1]?.config.publishableKey || ''}
              onChange={(e) => handleConfigChange('stripe', 'publishableKey', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Clé secrète de Stripe</Label>
            <Input 
              placeholder="Clé secrète de Stripe"
              type="password"
              value={gateways[1]?.config.secretKey || ''}
              onChange={(e) => handleConfigChange('stripe', 'secretKey', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Clé secrète Webhook</Label>
            <Input 
              placeholder="Clé secrète Webhook"
              type="password"
              value={gateways[1]?.config.webhookSecret || ''}
              onChange={(e) => handleConfigChange('stripe', 'webhookSecret', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Razorpay Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
            Razorpay
          </div>
          <div>
            <CardTitle>Razorpay</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Environment/Mode</Label>
            <Select 
              value={gateways[2]?.config.mode} 
              onValueChange={(value) => handleConfigChange('razorpay', 'mode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>identifiant clé de Razorpay</Label>
            <Input 
              placeholder="identifiant clé de Razorpay"
              value={gateways[2]?.config.keyId || ''}
              onChange={(e) => handleConfigChange('razorpay', 'keyId', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Clé secrète</Label>
            <Input 
              placeholder="Clé secrète"
              type="password"
              value={gateways[2]?.config.keySecret || ''}
              onChange={(e) => handleConfigChange('razorpay', 'keySecret', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
        >
          💳 Sauvegarder le clés API
        </Button>
      </div>
    </div>
  );
}