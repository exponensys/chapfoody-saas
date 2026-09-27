import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface RejectionReason {
  id: string;
  title: string;
  reason: string;
  status: 'active' | 'inactive';
  addedBy: string;
  message: string;
}

interface NewRejectionReason {
  title: string;
  reason: string;
  status: string;
  addedBy: string;
  message: string;
}

interface RejectionReasonsViewProps {
  onBack: () => void;
}

export function RejectionReasonsView({ onBack }: RejectionReasonsViewProps) {
  const [newReason, setNewReason] = useState<NewRejectionReason>({
    title: '',
    reason: '',
    status: '',
    addedBy: '',
    message: ''
  });

  // Mock data for existing reasons
  const [existingReasons, setExistingReasons] = useState<RejectionReason[]>([
    {
      id: '1',
      title: 'Produit indisponible',
      reason: 'Le produit demandé n\'est plus en stock',
      status: 'active',
      addedBy: 'Admin',
      message: 'Message d\'information'
    },
    {
      id: '2',
      title: 'Heure de livraison invalide',
      reason: 'L\'heure de livraison demandée n\'est pas dans nos créneaux',
      status: 'active',
      addedBy: 'Manager',
      message: 'Préfécision'
    }
  ]);

  const handleInputChange = (field: keyof NewRejectionReason, value: string) => {
    setNewReason(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (newReason.title && newReason.reason) {
      const newReasonEntry: RejectionReason = {
        id: Date.now().toString(),
        title: newReason.title,
        reason: newReason.reason,
        status: newReason.status as 'active' | 'inactive',
        addedBy: newReason.addedBy,
        message: newReason.message
      };
      
      setExistingReasons(prev => [...prev, newReasonEntry]);
      
      // Reset form
      setNewReason({
        title: '',
        reason: '',
        status: '',
        addedBy: '',
        message: ''
      });
      
      console.log('Saving rejection reason:', newReasonEntry);
    }
  };

  const handleDelete = (id: string) => {
    setExistingReasons(prev => prev.filter(reason => reason.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-medium text-[#b70f23]">Raisons de rejet des commandes</h2>
          <p className="text-sm text-muted-foreground">Gestion des motifs de rejet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Add New Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ajouter une raison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="font-medium">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Titre"
                value={newReason.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label className="font-medium">
                Raison <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={newReason.reason}
                onValueChange={(value) => handleInputChange('reason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une raison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produit-indisponible">Produit indisponible</SelectItem>
                  <SelectItem value="heure-invalide">Heure de livraison invalide</SelectItem>
                  <SelectItem value="zone-non-couverte">Zone non couverte</SelectItem>
                  <SelectItem value="paiement-refuse">Paiement refusé</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="font-medium">Statut</Label>
              <Select 
                value={newReason.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Added By */}
            <div className="space-y-2">
              <Label className="font-medium">Ajouter par</Label>
              <Select 
                value={newReason.addedBy}
                onValueChange={(value) => handleInputChange('addedBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label className="font-medium">Message</Label>
              <Select 
                value={newReason.message}
                onValueChange={(value) => handleInputChange('message', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un message" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information">Message d'information</SelectItem>
                  <SelectItem value="precision">Précision</SelectItem>
                  <SelectItem value="excuse">Excuses</SelectItem>
                  <SelectItem value="solution">Proposition de solution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSave}
                disabled={!newReason.title || !newReason.reason}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              >
                💾 Sauvegarder la Mise à jour
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - List of Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des Raisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 pb-2 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-4">Motif</div>
                <div className="col-span-3">Ajouter par</div>
                <div className="col-span-2">Action</div>
                <div className="col-span-3">Statut</div>
              </div>

              {/* Reasons List */}
              {existingReasons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune raison de rejet ajoutée
                </div>
              ) : (
                existingReasons.map((reason) => (
                  <div key={reason.id} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100 text-sm">
                    <div className="col-span-4">
                      <div className="font-medium">{reason.title}</div>
                      <div className="text-xs text-muted-foreground">{reason.message}</div>
                    </div>
                    <div className="col-span-3 text-muted-foreground">
                      {reason.addedBy}
                    </div>
                    <div className="col-span-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(reason.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <Badge 
                        variant={reason.status === 'active' ? 'default' : 'secondary'}
                        className={reason.status === 'active' ? 'bg-green-500 text-white' : ''}
                      >
                        {reason.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}