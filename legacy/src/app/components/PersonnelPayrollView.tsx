import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  Edit, 
  UserCheck,
  CalendarDays,
  TimerIcon,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Mail,
  X,
  UserX,
  Trash2,
  CheckSquare,
  XSquare,
  CalendarX,
  FileDown,
  Send,
  Euro
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  contractType: string;
  salary: number;
  status: 'actif' | 'conge' | 'absent';
  startDate: string;
}

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  status: 'planifie' | 'confirme' | 'complete';
}

interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  breakTime: number;
  overtime: number;
  status: 'present' | 'absent' | 'retard';
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary: number;
  netSalary: number;
  deductions: number;
  overtime: number;
  bonus: number;
  status: 'genere' | 'envoye' | 'valide';
  generatedDate: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'conge_paye' | 'conge_maladie' | 'conge_sans_solde' | 'rtt';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'en_attente' | 'approuve' | 'refuse';
  requestDate: string;
  approvedBy?: string;
}

interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  startDate: string;
  endDate?: string;
  salary: number;
  workingHours: number;
  status: 'actif' | 'termine' | 'suspendu';
  position: string;
  department: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    position: 'Chef de cuisine',
    email: 'marie.dubois@restaurant.com',
    phone: '+33 6 12 34 56 78',
    contractType: 'CDI',
    salary: 3200,
    status: 'actif',
    startDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Jean Martin',
    position: 'Serveur',
    email: 'jean.martin@restaurant.com',
    phone: '+33 6 98 76 54 32',
    contractType: 'CDI',
    salary: 2100,
    status: 'actif',
    startDate: '2023-03-10'
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    position: 'Commis de cuisine',
    email: 'sophie.laurent@restaurant.com',
    phone: '+33 6 55 44 33 22',
    contractType: 'CDD',
    salary: 1800,
    status: 'conge',
    startDate: '2023-06-01'
  }
];

const mockSchedules: Schedule[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    date: '2024-01-15',
    startTime: '08:00',
    endTime: '16:00',
    hours: 8,
    status: 'confirme'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jean Martin',
    date: '2024-01-15',
    startTime: '11:00',
    endTime: '20:00',
    hours: 8,
    status: 'planifie'
  }
];

const mockTimesheets: Timesheet[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    date: '2024-01-14',
    checkIn: '08:05',
    checkOut: '16:10',
    totalHours: 8.0,
    breakTime: 1.0,
    overtime: 0.2,
    status: 'present'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jean Martin',
    date: '2024-01-14',
    checkIn: '11:15',
    checkOut: '20:05',
    totalHours: 7.8,
    breakTime: 1.0,
    overtime: 0,
    status: 'retard'
  }
];

const mockPayslips: Payslip[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    month: 'Décembre',
    year: 2023,
    grossSalary: 3200,
    netSalary: 2456,
    deductions: 744,
    overtime: 150,
    bonus: 200,
    status: 'valide',
    generatedDate: '2024-01-05'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jean Martin',
    month: 'Décembre',
    year: 2023,
    grossSalary: 2100,
    netSalary: 1650,
    deductions: 450,
    overtime: 0,
    bonus: 0,
    status: 'envoye',
    generatedDate: '2024-01-05'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Sophie Laurent',
    month: 'Décembre',
    year: 2023,
    grossSalary: 1800,
    netSalary: 1420,
    deductions: 380,
    overtime: 80,
    bonus: 0,
    status: 'genere',
    generatedDate: '2024-01-05'
  }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'Jean Martin',
    type: 'conge_paye',
    startDate: '2024-02-15',
    endDate: '2024-02-22',
    days: 6,
    reason: 'Vacances d\'hiver',
    status: 'en_attente',
    requestDate: '2024-01-10'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Sophie Laurent',
    type: 'conge_maladie',
    startDate: '2024-01-12',
    endDate: '2024-01-14',
    days: 3,
    reason: 'Arrêt maladie',
    status: 'approuve',
    requestDate: '2024-01-11',
    approvedBy: 'Direction RH'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    type: 'rtt',
    startDate: '2024-02-01',
    endDate: '2024-02-01',
    days: 1,
    reason: 'RTT',
    status: 'approuve',
    requestDate: '2024-01-08',
    approvedBy: 'Direction RH'
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    type: 'CDI',
    startDate: '2023-01-15',
    salary: 3200,
    workingHours: 35,
    status: 'actif',
    position: 'Chef de cuisine',
    department: 'Cuisine'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jean Martin',
    type: 'CDI',
    startDate: '2023-03-10',
    salary: 2100,
    workingHours: 35,
    status: 'actif',
    position: 'Serveur',
    department: 'Service'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Sophie Laurent',
    type: 'CDD',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    salary: 1800,
    workingHours: 35,
    status: 'actif',
    position: 'Commis de cuisine',
    department: 'Cuisine'
  }
];

interface PersonnelPayrollViewProps {
  onBack?: () => void;
}

export function PersonnelPayrollView({ onBack }: PersonnelPayrollViewProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
      case 'present':
      case 'confirme':
      case 'complete':
      case 'valide':
      case 'approuve':
        return 'bg-green-100 text-green-800';
      case 'conge':
      case 'planifie':
      case 'genere':
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
      case 'retard':
      case 'refuse':
      case 'termine':
      case 'suspendu':
        return 'bg-red-100 text-red-800';
      case 'envoye':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'actif':
      case 'present':
      case 'confirme':
      case 'complete':
      case 'valide':
      case 'approuve':
        return <CheckCircle className="w-4 h-4" />;
      case 'conge':
      case 'planifie':
      case 'genere':
      case 'en_attente':
        return <Clock className="w-4 h-4" />;
      case 'absent':
      case 'retard':
      case 'refuse':
      case 'termine':
      case 'suspendu':
        return <AlertCircle className="w-4 h-4" />;
      case 'envoye':
        return <Send className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'conge_paye': return 'Congé payé';
      case 'conge_maladie': return 'Arrêt maladie';
      case 'conge_sans_solde': return 'Congé sans solde';
      case 'rtt': return 'RTT';
      default: return type;
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'CDI': return 'bg-green-100 text-green-800';
      case 'CDD': return 'bg-blue-100 text-blue-800';
      case 'Stage': return 'bg-purple-100 text-purple-800';
      case 'Freelance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGeneratePayslip = () => {
    setShowPayslipModal(true);
  };

  const handleSendPayslip = (payslipId: string) => {
    console.log('Envoi de la fiche de paie:', payslipId);
    // Logic to send payslip
  };

  const handleDownloadPayslip = (payslipId: string) => {
    console.log('Téléchargement de la fiche de paie:', payslipId);
    // Logic to download payslip
  };

  const handleApproveLeave = (leaveId: string) => {
    console.log('Approbation du congé:', leaveId);
    // Logic to approve leave
  };

  const handleRejectLeave = (leaveId: string) => {
    console.log('Refus du congé:', leaveId);
    // Logic to reject leave
  };

  const handleCreateContract = () => {
    console.log('Création d\'un nouveau contrat');
    setShowCreateModal(true);
  };

  const handleEditContract = (contractId: string) => {
    console.log('Modification du contrat:', contractId);
    // Logic to edit contract
  };

  const handleTerminateContract = (contractId: string) => {
    console.log('Résiliation du contrat:', contractId);
    // Logic to terminate contract
  };

  const handleAddEmployee = () => {
    console.log('Ajout d\'un nouvel employé');
    setShowCreateModal(true);
  };

  const handleEditEmployee = (employeeId: string) => {
    console.log('Modification de l\'employé:', employeeId);
    // Logic to edit employee
  };

  const handleCreateSchedule = () => {
    console.log('Création d\'un nouveau planning');
    // Logic to create schedule
  };

  const handleViewAllTimesheets = () => {
    console.log('Affichage de tous les pointages');
    // Logic to view all timesheets
  };

  const handleExport = () => {
    console.log('Export des données RH');
    // Logic to export data
  };

  return (
    <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel & Paie</h1>
          <p className="text-gray-600">Gestion complète de vos employés et de la paie</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e] flex-1 sm:flex-none" onClick={handleAddEmployee}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel employé</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employés actifs</p>
                  <p className="text-2xl font-bold">{mockEmployees.filter(e => e.status === 'actif').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Masse salariale</p>
                  <p className="text-2xl font-bold">€{mockEmployees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Heures planifiées</p>
                  <p className="text-2xl font-bold">{mockSchedules.reduce((sum, sch) => sum + sch.hours, 0)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TimerIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Heures supplémentaires</p>
                  <p className="text-2xl font-bold">{mockTimesheets.reduce((sum, ts) => sum + ts.overtime, 0).toFixed(1)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveGrid>

      {/* Main Content with Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="employees" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 min-w-fit">
                <TabsTrigger value="employees" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Employés</span>
                  <span className="sm:hidden">👥</span>
                </TabsTrigger>
                <TabsTrigger value="schedules" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Planning</span>
                  <span className="sm:hidden">📅</span>
                </TabsTrigger>
                <TabsTrigger value="timesheets" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Pointages</span>
                  <span className="sm:hidden">⏰</span>
                </TabsTrigger>
                <TabsTrigger value="payroll" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Fiches paie</span>
                  <span className="sm:hidden">💰</span>
                </TabsTrigger>
                <TabsTrigger value="leave" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Congés</span>
                  <span className="sm:hidden">🏖️</span>
                </TabsTrigger>
                <TabsTrigger value="contracts" className="whitespace-nowrap">
                  <span className="hidden sm:inline">Contrats</span>
                  <span className="sm:hidden">📄</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Employés Tab */}
            <TabsContent value="employees" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Liste des employés</h3>
                <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e] w-full sm:w-auto" onClick={handleAddEmployee}>
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>

              <div className="grid gap-4">
                {mockEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                          <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold">€{employee.salary.toLocaleString()}/mois</p>
                          <p className="text-sm text-gray-600">{employee.contractType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(employee.status)}>
                            {getStatusIcon(employee.status)}
                            <span className="ml-1 capitalize">{employee.status}</span>
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Planning Tab */}
            <TabsContent value="schedules" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Planning de la semaine</h3>
                <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e] w-full sm:w-auto" onClick={handleCreateSchedule}>
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">Créer planning</span>
                  <span className="sm:hidden">Créer</span>
                </Button>
              </div>

              <div className="grid gap-3">
                {mockSchedules.map((schedule) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-16 bg-[#b70f23] rounded-full"></div>
                        <div>
                          <h4 className="font-semibold">{schedule.employeeName}</h4>
                          <p className="text-sm text-gray-600">{schedule.date}</p>
                          <p className="text-sm text-gray-500">
                            {schedule.startTime} - {schedule.endTime} ({schedule.hours}h)
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(schedule.status)}>
                        {getStatusIcon(schedule.status)}
                        <span className="ml-1 capitalize">{schedule.status}</span>
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Pointages Tab */}
            <TabsContent value="timesheets" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Pointages récents</h3>
                <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e] w-full sm:w-auto" onClick={handleViewAllTimesheets}>
                  <Clock className="w-4 h-4" />
                  Voir tous
                </Button>
              </div>

              <div className="grid gap-3">
                {mockTimesheets.map((timesheet) => (
                  <motion.div
                    key={timesheet.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{timesheet.employeeName}</h4>
                        <p className="text-sm text-gray-600">{timesheet.date}</p>
                        <p className="text-sm text-gray-500">
                          Arrivée: {timesheet.checkIn} | Départ: {timesheet.checkOut}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold">{timesheet.totalHours}h travaillées</p>
                        {timesheet.overtime > 0 && (
                          <p className="text-sm text-orange-600">+{timesheet.overtime}h sup.</p>
                        )}
                        <Badge className={getStatusColor(timesheet.status)}>
                          {getStatusIcon(timesheet.status)}
                          <span className="ml-1 capitalize">{timesheet.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Fiches de paie Tab */}
            <TabsContent value="payroll" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Fiches de paie</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Exporter tout</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                  <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e] flex-1 sm:flex-none" onClick={handleGeneratePayslip}>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Générer fiche</span>
                    <span className="sm:hidden">Générer</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {mockPayslips.map((payslip) => (
                  <motion.div
                    key={payslip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Euro className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold">{payslip.employeeName}</h4>
                          <p className="text-sm text-gray-600">{payslip.month} {payslip.year}</p>
                          <p className="text-sm text-gray-500">Généré le {payslip.generatedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-green-600">€{payslip.netSalary.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Net à payer</p>
                          <p className="text-xs text-gray-500">Brut: €{payslip.grossSalary.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(payslip.status)}>
                            {getStatusIcon(payslip.status)}
                            <span className="ml-1 capitalize">{payslip.status}</span>
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadPayslip(payslip.id)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            {payslip.status === 'genere' && (
                              <Button variant="ghost" size="sm" onClick={() => handleSendPayslip(payslip.id)}>
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(payslip.overtime > 0 || payslip.bonus > 0) && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex gap-4 text-sm">
                          {payslip.overtime > 0 && (
                            <span className="text-orange-600">Heures sup.: €{payslip.overtime}</span>
                          )}
                          {payslip.bonus > 0 && (
                            <span className="text-green-600">Prime: €{payslip.bonus}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Congés Tab */}
            <TabsContent value="leave" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Demandes de congés</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Calendrier des congés
                  </Button>
                  <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
                    <Plus className="w-4 h-4" />
                    Nouvelle demande
                  </Button>
                </div>
              </div>

              {/* Résumé des congés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">En attente</p>
                      <p className="text-xl font-bold">{mockLeaveRequests.filter(l => l.status === 'en_attente').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Approuvés</p>
                      <p className="text-xl font-bold">{mockLeaveRequests.filter(l => l.status === 'approuve').length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <XSquare className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Refusés</p>
                      <p className="text-xl font-bold">{mockLeaveRequests.filter(l => l.status === 'refuse').length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Liste des demandes */}
              <div className="grid gap-4">
                {mockLeaveRequests.map((leave) => (
                  <motion.div
                    key={leave.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#b70f23] rounded-lg flex items-center justify-center">
                          <CalendarX className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{leave.employeeName}</h4>
                          <p className="text-sm text-gray-600">{getLeaveTypeLabel(leave.type)}</p>
                          <p className="text-sm text-gray-500">
                            Du {leave.startDate} au {leave.endDate} ({leave.days} jours)
                          </p>
                          <p className="text-xs text-gray-400">Motif: {leave.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(leave.status)}>
                          {getStatusIcon(leave.status)}
                          <span className="ml-1 capitalize">{leave.status.replace('_', ' ')}</span>
                        </Badge>
                        {leave.status === 'en_attente' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleApproveLeave(leave.id)}>
                              <CheckSquare className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRejectLeave(leave.id)}>
                              <XSquare className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    {leave.approvedBy && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">Approuvé par: {leave.approvedBy}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Contrats Tab */}
            <TabsContent value="contracts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Contrats de travail</h3>
                <Button size="sm" className="gap-2 bg-[#b70f23] hover:bg-[#70070e]" onClick={handleCreateContract}>
                  <Plus className="w-4 h-4" />
                  Nouveau contrat
                </Button>
              </div>

              <div className="grid gap-4">
                {mockContracts.map((contract) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f4b71b] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{contract.employeeName}</h4>
                          <p className="text-sm text-gray-600">{contract.position} - {contract.department}</p>
                          <p className="text-sm text-gray-500">
                            Début: {contract.startDate} {contract.endDate && `- Fin: ${contract.endDate}`}
                          </p>
                          <p className="text-xs text-gray-400">{contract.workingHours}h/semaine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold">€{contract.salary.toLocaleString()}/mois</p>
                          <Badge className={getContractTypeColor(contract.type)}>
                            {contract.type}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusIcon(contract.status)}
                          <span className="ml-1 capitalize">{contract.status}</span>
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditContract(contract.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {contract.status === 'actif' && (
                            <Button variant="ghost" size="sm" onClick={() => handleTerminateContract(contract.id)}>
                              <UserX className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal pour ajouter un employé */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau profil employé.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Prénom" />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Nom" />
              </div>
            </div>
            <div>
              <Label htmlFor="position">Poste</Label>
              <Input id="position" placeholder="Ex: Chef de cuisine" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+33 6 12 34 56 78" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary">Salaire mensuel (€)</Label>
                <Input id="salary" type="number" placeholder="2500" />
              </div>
            </div>
            <div>
              <Label htmlFor="startDate">Date d'embauche</Label>
              <Input id="startDate" type="date" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                Créer l'employé
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal pour génération de fiche de paie */}
      <Dialog open={showPayslipModal} onOpenChange={setShowPayslipModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une fiche de paie</DialogTitle>
            <DialogDescription>
              Sélectionnez l'employé et la période pour générer une nouvelle fiche de paie.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">Employé</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Mois</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">Janvier</SelectItem>
                    <SelectItem value="02">Février</SelectItem>
                    <SelectItem value="03">Mars</SelectItem>
                    <SelectItem value="04">Avril</SelectItem>
                    <SelectItem value="05">Mai</SelectItem>
                    <SelectItem value="06">Juin</SelectItem>
                    <SelectItem value="07">Juillet</SelectItem>
                    <SelectItem value="08">Août</SelectItem>
                    <SelectItem value="09">Septembre</SelectItem>
                    <SelectItem value="10">Octobre</SelectItem>
                    <SelectItem value="11">Novembre</SelectItem>
                    <SelectItem value="12">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Année</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPayslipModal(false)}>
                Annuler
              </Button>
              <Button className="bg-[#b70f23] hover:bg-[#70070e]">
                Générer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}