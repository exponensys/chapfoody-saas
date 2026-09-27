import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Heart,
  ShoppingCart,
  Euro,
  Filter,
  Download,
  UserPlus,
  Eye,
  TrendingUp,
  Clock,
  Gift
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationDate: string;
  lastVisit: string;
  totalSpent: number;
  orderCount: number;
  averageOrder: number;
  loyaltyPoints: number;
  status: 'active' | 'inactive' | 'vip';
  birthDate?: string;
  notes?: string;
  tags: string[];
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix',
    city: 'Paris',
    registrationDate: '2023-03-15',
    lastVisit: '2024-01-14',
    totalSpent: 1250.50,
    orderCount: 28,
    averageOrder: 44.66,
    loyaltyPoints: 450,
    status: 'vip',
    birthDate: '1985-03-15',
    notes: 'Cliente très fidèle, préfère les plats végétariens',
    tags: ['Végétarien', 'VIP', 'Newsletter']
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 98 76 54 32',
    address: '456 Avenue des Champs',
    city: 'Lyon',
    registrationDate: '2023-06-10',
    lastVisit: '2024-01-12',
    totalSpent: 890.30,
    orderCount: 19,
    averageOrder: 46.86,
    loyaltyPoints: 180,
    status: 'active',
    tags: ['Régulier', 'SMS']
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 55 44 33 22',
    address: '789 Boulevard Saint-Michel',
    city: 'Marseille',
    registrationDate: '2023-08-22',
    lastVisit: '2024-01-10',
    totalSpent: 567.80,
    orderCount: 12,
    averageOrder: 47.32,
    loyaltyPoints: 95,
    status: 'active',
    birthDate: '1992-08-12',
    tags: ['Anniversaire', 'Mobile']
  },
  {
    id: '4',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 6 77 88 99 00',
    address: '321 Rue Victor Hugo',
    city: 'Toulouse',
    registrationDate: '2022-11-05',
    lastVisit: '2023-12-15',
    totalSpent: 234.50,
    orderCount: 5,
    averageOrder: 46.90,
    loyaltyPoints: 25,
    status: 'inactive',
    tags: ['À réactiver']
  }
];

interface ClientListViewProps {
  onBack?: () => void;
}

export function ClientListView({ onBack }: ClientListViewProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip':
        return <Star className="w-4 h-4" />;
      case 'active':
        return <Heart className="w-4 h-4" />;
      case 'inactive':
        return <Clock className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'vip') return matchesSearch && customer.status === 'vip';
    if (activeTab === 'active') return matchesSearch && customer.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && customer.status === 'inactive';
    
    return matchesSearch;
  });

  const totalCustomers = mockCustomers.length;
  const totalSpent = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageSpent = totalSpent / totalCustomers;
  const vipCustomers = mockCustomers.filter(c => c.status === 'vip').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">Base de données complète de votre clientèle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="text-sm text-gray-600">Total clients</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
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
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">CA total</p>
                  <p className="text-2xl font-bold">€{totalSpent.toLocaleString()}</p>
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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients VIP</p>
                  <p className="text-2xl font-bold">{vipCustomers}</p>
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
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Panier moyen</p>
                  <p className="text-2xl font-bold">€{averageSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Tous ({totalCustomers})</TabsTrigger>
                <TabsTrigger value="vip">VIP ({vipCustomers})</TabsTrigger>
                <TabsTrigger value="active">Actifs ({mockCustomers.filter(c => c.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactifs ({mockCustomers.filter(c => c.status === 'inactive').length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          {/* Customer List */}
          <div className="grid gap-4">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{customer.name}</h4>
                        {customer.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {customer.city}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Dernière visite: {new Date(customer.lastVisit).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">€{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{customer.orderCount} commandes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">{customer.loyaltyPoints}</p>
                      <p className="text-sm text-gray-600">points fidélité</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusIcon(customer.status)}
                        <span className="ml-1 capitalize">{customer.status}</span>
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun client trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Commencez par ajouter vos premiers clients'}
              </p>
              <Button className="gap-2 bg-[#b70f23] hover:bg-[#70070e]">
                <UserPlus className="w-4 h-4" />
                Ajouter un client
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Modal/Panel */}
      {selectedCustomer && (
        <Card className="fixed inset-0 z-50 bg-white m-4 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#b70f23] rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <Badge className={getStatusColor(selectedCustomer.status)}>
                    {getStatusIcon(selectedCustomer.status)}
                    <span className="ml-1 capitalize">{selectedCustomer.status}</span>
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.address}, {selectedCustomer.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Inscrit le {new Date(selectedCustomer.registrationDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {selectedCustomer.birthDate && (
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-gray-400" />
                      <span>Né(e) le {new Date(selectedCustomer.birthDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistiques d'achat */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques d'achat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total dépensé:</span>
                    <span className="font-bold text-green-600">€{selectedCustomer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nombre de commandes:</span>
                    <span className="font-bold">{selectedCustomer.orderCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Panier moyen:</span>
                    <span className="font-bold">€{selectedCustomer.averageOrder.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points fidélité:</span>
                    <span className="font-bold text-purple-600">{selectedCustomer.loyaltyPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière visite:</span>
                    <span>{new Date(selectedCustomer.lastVisit).toLocaleDateString('fr-FR')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions et notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions et notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full gap-2" variant="outline">
                      <Mail className="w-4 h-4" />
                      Envoyer un email
                    </Button>
                    <Button className="w-full gap-2" variant="outline">
                      <Phone className="w-4 h-4" />
                      Appeler
                    </Button>
                    <Button className="w-full gap-2" variant="outline">
                      <Gift className="w-4 h-4" />
                      Offrir des points
                    </Button>
                  </div>
                  
                  {selectedCustomer.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {selectedCustomer.notes}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}