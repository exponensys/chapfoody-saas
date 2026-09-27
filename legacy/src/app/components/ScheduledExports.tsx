import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Calendar,
  Clock,
  Mail,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Download,
  AlertTriangle,
  CheckCircle,
  Send,
  Users,
  FileText,
  Zap,
  Bell,
  Target,
  Archive
} from "lucide-react";

interface ScheduledExport {
  id: string;
  name: string;
  description: string;
  template: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM
  sections: string[];
  format: "pdf" | "excel" | "csv";
  recipients: string[];
  isActive: boolean;
  lastRun?: Date;
  nextRun: Date;
  status: "active" | "paused" | "failed" | "completed";
  createdAt: Date;
  totalRuns: number;
  successRate: number;
}

interface ScheduledExportsProps {
  userType: string;
  onCreateSchedule: (schedule: Partial<ScheduledExport>) => void;
  onUpdateSchedule: (id: string, updates: Partial<ScheduledExport>) => void;
  onDeleteSchedule: (id: string) => void;
  onToggleSchedule: (id: string, active: boolean) => void;
  onRunNow: (id: string) => void;
}

export function ScheduledExports({
  userType,
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onToggleSchedule,
  onRunNow
}: ScheduledExportsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledExport | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template: "complete",
    frequency: "weekly" as const,
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: "09:00",
    sections: [] as string[],
    format: "pdf" as const,
    recipients: [] as string[],
    recipientInput: ""
  });

  // Mock data - en production, ceci viendrait d'une API
  const [scheduledExports] = useState<ScheduledExport[]>([
    {
      id: "1",
      name: "Rapport Hebdomadaire Direction",
      description: "Rapport exécutif envoyé chaque lundi à la direction",
      template: "executive",
      frequency: "weekly",
      dayOfWeek: 1,
      time: "08:00",
      sections: ["overview", "revenue", "satisfaction"],
      format: "pdf",
      recipients: ["direction@restaurant.com", "manager@restaurant.com"],
      isActive: true,
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      totalRuns: 4,
      successRate: 100
    },
    {
      id: "2",
      name: "Rapport Mensuel Comptabilité",
      description: "Rapport financier détaillé pour la comptabilité",
      template: "complete",
      frequency: "monthly",
      dayOfMonth: 1,
      time: "10:00",
      sections: ["overview", "revenue", "orders", "customers", "performance"],
      format: "excel",
      recipients: ["compta@restaurant.com"],
      isActive: true,
      lastRun: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: "active",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      totalRuns: 2,
      successRate: 100
    },
    {
      id: "3",
      name: "Rapport Quotidien Operations",
      description: "Rapport opérationnel pour l'équipe de production",
      template: "operational",
      frequency: "daily",
      time: "18:00",
      sections: ["orders", "performance"],
      format: "pdf",
      recipients: ["production@restaurant.com", "chef@restaurant.com"],
      isActive: false,
      lastRun: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: "paused",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      totalRuns: 12,
      successRate: 91.7
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "paused": return Pause;
      case "failed": return AlertTriangle;
      case "completed": return Archive;
      default: return Clock;
    }
  };

  const getFrequencyLabel = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    
    switch (frequency) {
      case "daily": return "Quotidien";
      case "weekly": return `Hebdomadaire (${days[dayOfWeek || 1]})`;
      case "monthly": return `Mensuel (${dayOfMonth || 1} de chaque mois)`;
      case "quarterly": return "Trimestriel";
      default: return frequency;
    }
  };

  const handleCreateSchedule = () => {
    const newSchedule = {
      name: formData.name,
      description: formData.description,
      template: formData.template,
      frequency: formData.frequency,
      dayOfWeek: formData.dayOfWeek,
      dayOfMonth: formData.dayOfMonth,
      time: formData.time,
      sections: formData.sections,
      format: formData.format,
      recipients: formData.recipients,
      isActive: true
    };

    onCreateSchedule(newSchedule);
    setShowCreateDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      template: "complete",
      frequency: "weekly",
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: "09:00",
      sections: [],
      format: "pdf",
      recipients: [],
      recipientInput: ""
    });
  };

  const addRecipient = () => {
    if (formData.recipientInput && !formData.recipients.includes(formData.recipientInput)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, prev.recipientInput],
        recipientInput: ""
      }));
    }
  };

  const removeRecipient = (email: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Exports programmés</h3>
          <p className="text-gray-600 mt-1">
            Automatisez vos rapports et recevez-les par email
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau planning
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un export programmé</DialogTitle>
              <DialogDescription>
                Configurez un nouveau planning d'export automatique pour recevoir vos rapports par email.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Informations générales */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informations générales</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom du planning</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ex: Rapport Hebdomadaire Direction"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template">Template</Label>
                    <Select value={formData.template} onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">Rapport Exécutif</SelectItem>
                        <SelectItem value="complete">Analyse Complète</SelectItem>
                        <SelectItem value="operational">Rapport Opérationnel</SelectItem>
                        <SelectItem value="marketing">Rapport Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de ce rapport automatique"
                    rows={2}
                  />
                </div>
              </div>

              <Separator />

              {/* Planification */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Planification</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="frequency">Fréquence</Label>
                    <Select value={formData.frequency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="quarterly">Trimestriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.frequency === "weekly" && (
                    <div>
                      <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
                      <Select value={formData.dayOfWeek.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Lundi</SelectItem>
                          <SelectItem value="2">Mardi</SelectItem>
                          <SelectItem value="3">Mercredi</SelectItem>
                          <SelectItem value="4">Jeudi</SelectItem>
                          <SelectItem value="5">Vendredi</SelectItem>
                          <SelectItem value="6">Samedi</SelectItem>
                          <SelectItem value="0">Dimanche</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.frequency === "monthly" && (
                    <div>
                      <Label htmlFor="dayOfMonth">Jour du mois</Label>
                      <Input
                        id="dayOfMonth"
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dayOfMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="time">Heure d'envoi</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Format et destinataires */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Format et destinataires</h4>
                <div>
                  <Label htmlFor="format">Format du fichier</Label>
                  <Select value={formData.format} onValueChange={(value: any) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF (Recommandé)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="recipients">Destinataires</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="recipients"
                      type="email"
                      value={formData.recipientInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipientInput: e.target.value }))}
                      placeholder="email@exemple.com"
                      onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    />
                    <Button type="button" variant="outline" onClick={addRecipient}>
                      Ajouter
                    </Button>
                  </div>
                  {formData.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.recipients.map((email, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          {email}
                          <button
                            type="button"
                            onClick={() => removeRecipient(email)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateSchedule}
                  disabled={!formData.name || formData.recipients.length === 0}
                  className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                >
                  Créer le planning
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plannings actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledExports.filter(s => s.isActive).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rapports envoyés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledExports.reduce((sum, s) => sum + s.totalRuns, 0)}
                </p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de succès</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(scheduledExports.reduce((sum, s) => sum + s.successRate, 0) / scheduledExports.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochaine exécution</p>
                <p className="text-sm font-bold text-gray-900">
                  {scheduledExports
                    .filter(s => s.isActive)
                    .sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime())[0]
                    ?.nextRun.toLocaleDateString('fr-FR') || 'Aucune'
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Exports List */}
      <div className="space-y-4">
        {scheduledExports.map((schedule) => {
          const StatusIcon = getStatusIcon(schedule.status);
          
          return (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={schedule.isActive}
                          onCheckedChange={(checked) => onToggleSchedule(schedule.id, checked)}
                        />
                        <div>
                          <CardTitle className="text-lg">{schedule.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {schedule.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(schedule.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {schedule.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRunNow(schedule.id)}
                          disabled={!schedule.isActive}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Fréquence</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium">
                          {getFrequencyLabel(schedule.frequency, schedule.dayOfWeek, schedule.dayOfMonth)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Heure</p>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium">{schedule.time}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Format</p>
                      <div className="flex items-center mt-1">
                        <FileText className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium uppercase">{schedule.format}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Destinataires</p>
                      <div className="flex items-center mt-1">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium">{schedule.recipients.length}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex space-x-4">
                      <span>
                        Dernière exécution: {schedule.lastRun?.toLocaleString('fr-FR') || 'Jamais'}
                      </span>
                      <span>
                        Prochaine exécution: {schedule.nextRun.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <span>Total: {schedule.totalRuns} rapports</span>
                      <span>Succès: {schedule.successRate}%</span>
                    </div>
                  </div>

                  {schedule.recipients.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Destinataires:</p>
                      <div className="flex flex-wrap gap-1">
                        {schedule.recipients.slice(0, 3).map((email, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {email}
                          </Badge>
                        ))}
                        {schedule.recipients.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{schedule.recipients.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {scheduledExports.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun export programmé
            </h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier planning d'export automatique pour recevoir des rapports réguliers.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#b70f23] hover:bg-[#70070e] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un planning
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}