import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { ResponsiveTable } from './ResponsiveTable';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  table?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  notes?: string;
  createdAt: string;
  lastUpdated: string;
}

interface ReservationFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: string;
  table: string;
  notes: string;
}

interface ReservationViewProps {
  onBack: () => void;
}

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const tables = [
  'Table 1 (2 pers.)', 'Table 2 (2 pers.)', 'Table 3 (4 pers.)', 'Table 4 (4 pers.)',
  'Table 5 (6 pers.)', 'Table 6 (6 pers.)', 'VIP-1 (8 pers.)', 'VIP-2 (8 pers.)',
  'Terrasse-A (4 pers.)', 'Terrasse-B (4 pers.)', 'Salon privé (12 pers.)'
];

const reservationStatuses = [
  { value: 'Pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Confirmed', label: 'Confirmée', color: 'bg-green-100 text-green-800' },
  { value: 'Completed', label: 'Terminée', color: 'bg-blue-100 text-blue-800' },
  { value: 'Cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' }
];

const mockReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'Jean Kouame',
    customerPhone: '+225 01 23 45 67',
    customerEmail: 'jean.kouame@email.com',
    date: '2024-01-22',
    time: '19:30',
    guests: 4,
    table: 'Table 3 (4 pers.)',
    status: 'Confirmed',
    notes: 'Anniversaire - prévoir dessert spécial',
    createdAt: '2024-01-20',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    customerName: 'Marie Adjoua',
    customerPhone: '+225 07 89 12 34',
    date: '2024-01-22',
    time: '20:00',
    guests: 2,
    table: 'VIP-1 (8 pers.)',
    status: 'Pending',
    notes: 'Demande spéciale menu végétarien',
    createdAt: '2024-01-21',
    lastUpdated: '2024-01-21'
  },
  {
    id: '3',
    customerName: 'Koffi Ibrahim',
    customerPhone: '+225 05 67 89 01',
    customerEmail: 'k.ibrahim@company.ci',
    date: '2024-01-23',
    time: '12:30',
    guests: 8,
    table: 'Salon privé (12 pers.)',
    status: 'Confirmed',
    notes: 'Déjeuner d\'affaires - facture entreprise',
    createdAt: '2024-01-19',
    lastUpdated: '2024-01-20'
  },
  {
    id: '4',
    customerName: 'Aya Traore',
    customerPhone: '+225 09 87 65 43',
    date: '2024-01-21',
    time: '19:00',
    guests: 6,
    status: 'Completed',
    notes: 'Client régulier - service excellent',
    createdAt: '2024-01-18',
    lastUpdated: '2024-01-21'
  }
];

export function ReservationView({ onBack }: ReservationViewProps) {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showReporting, setShowReporting] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    guests: '',
    table: '',
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const filteredReservations = reservations
    .filter(reservation => selectedStatus === 'all' || reservation.status === selectedStatus)
    .filter(reservation => {
      if (selectedDate === 'all') return true;
      if (selectedDate === 'today') return reservation.date === today;
      if (selectedDate === 'tomorrow') return reservation.date === tomorrow;
      return reservation.date === selectedDate;
    })
    .filter(reservation => 
      searchQuery === '' || 
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery) ||
      reservation.table?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Calculs pour le reporting
  const todayReservations = reservations.filter(r => r.date === today);
  const tomorrowReservations = reservations.filter(r => r.date === tomorrow);
  const pendingReservations = reservations.filter(r => r.status === 'Pending');
  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);
  const averagePartySize = reservations.length > 0 ? Math.round(totalGuests / reservations.length) : 0;

  const handleAddReservation = () => {
    setEditingReservation(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: '',
      time: '',
      guests: '',
      table: '',
      notes: ''
    });
    setIsAddReservationOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail || '',
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests.toString(),
      table: reservation.table || '',
      notes: reservation.notes || ''
    });
    setIsAddReservationOpen(true);
  };

  const handleSaveReservation = () => {
    const newReservation: Reservation = {
      id: editingReservation?.id || String(Date.now()),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      table: formData.table || undefined,
      status: 'Pending',
      notes: formData.notes || undefined,
      createdAt: editingReservation?.createdAt || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingReservation) {
      setReservations(prev => prev.map(reservation => 
        reservation.id === editingReservation.id ? { ...newReservation, id: editingReservation.id, status: editingReservation.status } : reservation
      ));
    } else {
      setReservations(prev => [newReservation, ...prev]);
    }

    setIsAddReservationOpen(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: '',
      time: '',
      guests: '',
      table: '',
      notes: ''
    });
  };

  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId 
        ? { 
            ...reservation, 
            status: newStatus as Reservation['status'],
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : reservation
    ));
  };

  const deleteReservation = (reservationId: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));
  };

  const getStatusColor = (status: string) => {
    const statusObj = reservationStatuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusObj = reservationStatuses.find(s => s.value === status);
    return statusObj?.label || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return CheckCircle;
      case 'Pending': return AlertCircle;
      case 'Cancelled': return XCircle;
      case 'Completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  return (
    <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-medium text-[#b70f23]">Réservations</h2>
            <p className="text-muted-foreground">
              Gérez les réservations de tables de votre restaurant
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showReporting ? "default" : "outline"}
            onClick={() => setShowReporting(!showReporting)}
            className="gap-2 flex-1 sm:flex-none"
          >
            <BarChart3 className="w-4 h-4" />
            Reporting
          </Button>
          <Button 
            onClick={handleAddReservation}
            className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2 flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle réservation</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </div>
      </div>

      {/* Reporting Section */}
      <AnimatePresence>
        {showReporting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-to-r from-[#b70f23] to-[#70070e] text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Reporting - Réservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={{ base: 2, sm: 3, md: 5 }} gap={6}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{reservations.length}</div>
                    <div className="text-sm opacity-90">Total réservations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{todayReservations.length}</div>
                    <div className="text-sm opacity-90">Aujourd'hui</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{tomorrowReservations.length}</div>
                    <div className="text-sm opacity-90">Demain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">{pendingReservations.length}</div>
                    <div className="text-sm opacity-90">En attente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{averagePartySize}</div>
                    <div className="text-sm opacity-90">Moy. convives</div>
                  </div>
                </ResponsiveGrid>
                
                <div className="mt-6 pt-4 border-t border-white/20">
                  <ResponsiveGrid cols={{ base: 1, md: 2 }} gap={6}>
                    <div>
                      <h4 className="font-medium mb-4 text-white">Par statut</h4>
                      <div className="space-y-2">
                        {reservationStatuses.map((status) => {
                          const count = reservations.filter(r => r.status === status.value).length;
                          const Icon = getStatusIcon(status.value);
                          return (
                            <div key={status.value} className="flex justify-between text-sm items-center">
                              <div className="flex items-center gap-2">
                                <Icon className="w-3 h-3 text-white/70" />
                                <span className="text-white/70">{status.label}:</span>
                              </div>
                              <span className="text-white font-medium">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4 text-white">Tables populaires</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">VIP-1:</span>
                          <span className="text-white font-medium">
                            {reservations.filter(r => r.table?.includes('VIP-1')).length} réservations
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Salon privé:</span>
                          <span className="text-white font-medium">
                            {reservations.filter(r => r.table?.includes('Salon privé')).length} réservations
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Terrasse:</span>
                          <span className="text-white font-medium">
                            {reservations.filter(r => r.table?.includes('Terrasse')).length} réservations
                          </span>
                        </div>
                      </div>
                    </div>
                  </ResponsiveGrid>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher par nom, téléphone ou table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {reservationStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="tomorrow">Demain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reservations Table - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#b70f23]">Liste des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            columns={[
              { key: 'index', label: 'Sl' },
              { key: 'customer', label: 'Client' },
              { key: 'contact', label: 'Contact', hideOnMobile: true },
              { key: 'datetime', label: 'Date & Heure' },
              { key: 'guests', label: 'Convives' },
              { key: 'table', label: 'Table', hideOnMobile: true },
              { key: 'status', label: 'Statut' },
              { key: 'notes', label: 'Notes', hideOnMobile: true },
              { key: 'actions', label: 'Action' }
            ]}
            data={filteredReservations.map((reservation, index) => ({
              id: reservation.id,
              index: index + 1,
              customer: reservation.customerName,
              contact: `${reservation.customerPhone}${reservation.customerEmail ? ` / ${reservation.customerEmail}` : ''}`,
              datetime: `${new Date(reservation.date).toLocaleDateString('fr-FR')} à ${reservation.time}`,
              guests: reservation.guests,
              table: reservation.table || 'Non assignée',
              status: reservation.status,
              notes: reservation.notes || '-',
              actions: 'edit-delete',
              originalReservation: reservation
            }))}
            renderCell={(key, value, row) => {
              const reservation = row.originalReservation as Reservation;
              
              switch (key) {
                case 'customer':
                  return (
                    <div>
                      <div className="font-medium">{reservation.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  );
                
                case 'contact':
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {reservation.customerPhone}
                      </div>
                      {reservation.customerEmail && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {reservation.customerEmail}
                        </div>
                      )}
                    </div>
                  );
                
                case 'datetime':
                  return (
                    <div>
                      <div className="font-medium">
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {reservation.time}
                      </div>
                    </div>
                  );
                
                case 'guests':
                  return (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{reservation.guests}</span>
                    </div>
                  );
                
                case 'table':
                  return reservation.table ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm">{reservation.table}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Non assignée</span>
                  );
                
                case 'status':
                  return (
                    <Select 
                      value={reservation.status} 
                      onValueChange={(value) => updateReservationStatus(reservation.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {reservationStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                
                case 'notes':
                  return reservation.notes ? (
                    <div className="max-w-[150px]">
                      <div className="text-sm truncate" title={reservation.notes}>
                        {reservation.notes}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  );
                
                case 'actions':
                  return (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditReservation(reservation)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReservation(reservation.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                
                default:
                  return value;
              }
            }}
            onRowClick={() => {}} // Pas de click sur les lignes dans ce cas
            emptyState={
              <div className="text-center py-8 text-muted-foreground">
                Aucune réservation trouvée
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Add/Edit Reservation Dialog */}
      <Dialog open={isAddReservationOpen} onOpenChange={setIsAddReservationOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#b70f23]">
              {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingReservation ? 'modifier' : 'créer'} une réservation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap={4}>
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-sm font-medium">
                  Nom du client <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customer-name"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Nom complet du client"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="+225 XX XX XX XX"
                />
              </div>
            </ResponsiveGrid>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="email@exemple.com"
              />
            </div>

            <ResponsiveGrid cols={{ base: 1, sm: 3 }} gap={4}>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Heure <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Nombre de convives <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                  placeholder="2"
                  min="1"
                  max="20"
                />
              </div>
            </ResponsiveGrid>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Table préférée</Label>
              <Select 
                value={formData.table} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, table: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une table (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes spéciales</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Allergies, demandes spéciales, occasion..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAddReservationOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveReservation}
              className="bg-[#b70f23] hover:bg-[#70070e] text-white w-full sm:w-auto"
              disabled={!formData.customerName || !formData.customerPhone || !formData.date || !formData.time || !formData.guests}
            >
              {editingReservation ? 'Modifier' : 'Créer'} la réservation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}