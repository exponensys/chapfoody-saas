import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  User,
  Calendar,
  Clock,
  Trash2,
  Calculator,
  Scan,
  Package,
  Coffee,
  Utensils,
  Sandwich,
  Wine,
  ShoppingBag,
  Check,
  MapPin,
  Home,
  Truck,
  Users,
  ChefHat,
  Timer
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
  vatRate: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  vatRate: number;
  image?: string;
  stock?: number;
  barcode?: string;
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  zone: string;
  currentServer?: string;
}

interface Server {
  id: string;
  name: string;
  isActive: boolean;
}

type ServiceType = 'dine-in' | 'takeaway' | 'delivery';

interface DeliveryInfo {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliveryTime: string;
  deliveryFee: number;
}

const categories = [
  { id: "all", name: "Tous", icon: Package, color: "bg-gray-100" },
  { id: "drinks", name: "Boissons", icon: Wine, color: "bg-blue-100" },
  { id: "lunch", name: "Plats", icon: Utensils, color: "bg-green-100" },
  { id: "breakfast", name: "Petit-déj", icon: Coffee, color: "bg-orange-100" },
  { id: "snacks", name: "Snacks", icon: Sandwich, color: "bg-yellow-100" },
  { id: "desserts", name: "Desserts", icon: ShoppingBag, color: "bg-pink-100" }
];

const products: Product[] = [
  // Boissons
  { id: "1", name: "Coca-Cola 33cl", category: "drinks", price: 3.50, vatRate: 20, stock: 45, barcode: "5449000000996" },
  { id: "2", name: "Eau minérale 50cl", category: "drinks", price: 2.80, vatRate: 20, stock: 32, barcode: "3274080005003" },
  { id: "3", name: "Café Espresso", category: "drinks", price: 2.20, vatRate: 10, stock: 0, barcode: "8711000536544" },
  { id: "4", name: "Jus d'orange frais", category: "drinks", price: 4.90, vatRate: 10, stock: 18, barcode: "3057640117008" },
  
  // Plats
  { id: "5", name: "Menu Burger Complet", category: "lunch", price: 15.90, vatRate: 10, stock: 12, barcode: "2000000000001" },
  { id: "6", name: "Pizza Margherita", category: "lunch", price: 12.50, vatRate: 10, stock: 8, barcode: "2000000000002" },
  { id: "7", name: "Salade César", category: "lunch", price: 13.90, vatRate: 10, stock: 15, barcode: "2000000000003" },
  { id: "8", name: "Sandwich Jambon Beurre", category: "lunch", price: 6.50, vatRate: 10, stock: 22, barcode: "2000000000004" },
  
  // Petit-déjeuner
  { id: "9", name: "Croissant au Beurre", category: "breakfast", price: 1.80, vatRate: 10, stock: 25, barcode: "2000000000005" },
  { id: "10", name: "Pain au Chocolat", category: "breakfast", price: 1.90, vatRate: 10, stock: 18, barcode: "2000000000006" },
  { id: "11", name: "Muffin Myrtilles", category: "breakfast", price: 3.20, vatRate: 10, stock: 14, barcode: "2000000000007" },
  
  // Snacks
  { id: "12", name: "Chips Sel de Mer", category: "snacks", price: 2.50, vatRate: 20, stock: 35, barcode: "8712566188970" },
  { id: "13", name: "Barre Chocolatée", category: "snacks", price: 1.90, vatRate: 20, stock: 28, barcode: "4008400172026" },
  { id: "14", name: "Fruits Secs Mélangés", category: "snacks", price: 4.20, vatRate: 5.5, stock: 16, barcode: "3564700013519" },
  
  // Desserts
  { id: "15", name: "Tiramisu Maison", category: "desserts", price: 6.90, vatRate: 10, stock: 7, barcode: "2000000000008" },
  { id: "16", name: "Glace Vanille", category: "desserts", price: 4.50, vatRate: 5.5, stock: 11, barcode: "3033710095421" },
  { id: "17", name: "Tarte aux Pommes", category: "desserts", price: 5.80, vatRate: 10, stock: 9, barcode: "2000000000009" }
];

const tables: Table[] = [
  { id: "1", number: "T1", capacity: 2, status: 'available', zone: "Terrasse" },
  { id: "2", number: "T2", capacity: 4, status: 'occupied', zone: "Salle principale", currentServer: "Marie" },
  { id: "3", number: "T3", capacity: 2, status: 'available', zone: "Salle principale" },
  { id: "4", number: "T4", capacity: 6, status: 'reserved', zone: "Salon privé" },
  { id: "5", number: "T5", capacity: 4, status: 'available', zone: "Terrasse" },
  { id: "6", number: "T6", capacity: 2, status: 'available', zone: "Bar" },
  { id: "7", number: "T7", capacity: 8, status: 'available', zone: "Salon privé" },
  { id: "8", number: "T8", capacity: 4, status: 'occupied', zone: "Salle principale", currentServer: "Pierre" },
  { id: "9", number: "T9", capacity: 2, status: 'available', zone: "Terrasse" },
  { id: "10", number: "T10", capacity: 4, status: 'available', zone: "Salle principale" }
];

const servers: Server[] = [
  { id: "1", name: "Marie Dubois", isActive: true },
  { id: "2", name: "Pierre Martin", isActive: true },
  { id: "3", name: "Sophie Laurent", isActive: true },
  { id: "4", name: "Thomas Petit", isActive: false },
  { id: "5", name: "Emma Garcia", isActive: true },
  { id: "6", name: "Lucas Moreau", isActive: true }
];

export function POSView() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeSearch, setBarcodeSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Service type and related states
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [takeawayTime, setTakeawayTime] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    deliveryTime: "",
    deliveryFee: 2.50
  });

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  // Recherche par code-barres
  const handleBarcodeSearch = () => {
    if (!barcodeSearch.trim()) return;
    
    const product = products.find(p => p.barcode === barcodeSearch.trim());
    if (product) {
      addToCart(product);
      setBarcodeSearch("");
      toast.success(`${product.name} ajouté au panier`);
    } else {
      toast.error("Produit introuvable avec ce code-barres");
    }
  };

  // Ajouter au panier
  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error("Produit en rupture de stock");
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        total: product.price,
        vatRate: product.vatRate
      };
      setCart(prev => [...prev, newItem]);
    }
  };

  // Mettre à jour la quantité
  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > (product.stock || 0)) {
      toast.error("Quantité demandée supérieure au stock disponible");
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  // Supprimer du panier
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer les totaux
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = cart.reduce((sum, item) => {
      const itemVat = (item.total * item.vatRate) / (100 + item.vatRate);
      return sum + itemVat;
    }, 0);
    const totalHT = subtotal - vatAmount;
    const deliveryFee = serviceType === 'delivery' ? deliveryInfo.deliveryFee : 0;
    const finalTotal = subtotal + deliveryFee;
    return { subtotal, vatAmount, totalHT, deliveryFee, finalTotal };
  };

  // Gérer le changement de type de service
  const handleServiceTypeChange = (newServiceType: ServiceType) => {
    setServiceType(newServiceType);
    // Réinitialiser les données spécifiques
    setSelectedTable(null);
    setSelectedServer(null);
    setTakeawayTime("");
    setDeliveryInfo({
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      deliveryTime: "",
      deliveryFee: 2.50
    });
  };

  // Générer les créneaux de récupération pour à emporter
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let hour = currentHour; hour < 22; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        if (hour === currentHour && minute <= currentMinute + 15) continue;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Valider la commande selon le type de service
  const validateOrder = () => {
    if (cart.length === 0) {
      toast.error("Le panier est vide");
      return false;
    }

    if (!customer.name.trim()) {
      toast.error("Veuillez saisir le nom du client");
      return false;
    }

    switch (serviceType) {
      case 'dine-in':
        if (!selectedTable) {
          toast.error("Veuillez sélectionner une table");
          return false;
        }
        if (!selectedServer) {
          toast.error("Veuillez attribuer un serveur");
          return false;
        }
        break;
      case 'takeaway':
        if (!takeawayTime) {
          toast.error("Veuillez sélectionner un créneau de récupération");
          return false;
        }
        break;
      case 'delivery':
        if (!deliveryInfo.address.trim() || !deliveryInfo.city.trim() || !deliveryInfo.postalCode.trim()) {
          toast.error("Veuillez compléter l'adresse de livraison");
          return false;
        }
        if (!deliveryInfo.deliveryTime) {
          toast.error("Veuillez sélectionner un créneau de livraison");
          return false;
        }
        break;
    }

    return true;
  };

  // Traitement du paiement
  const processPayment = async (paymentMethod: string) => {
    if (!validateOrder()) {
      return;
    }

    setIsProcessingPayment(true);
    
    // Simulation du traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const totals = calculateTotals();
    const transactionNumber = `T${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    let successMessage = `Paiement validé ! Transaction ${transactionNumber}`;
    
    switch (serviceType) {
      case 'dine-in':
        successMessage += ` - Table ${selectedTable?.number} (${selectedServer?.name})`;
        break;
      case 'takeaway':
        successMessage += ` - À récupérer à ${takeawayTime}`;
        break;
      case 'delivery':
        successMessage += ` - Livraison prévue à ${deliveryInfo.deliveryTime}`;
        break;
    }
    
    toast.success(successMessage);
    
    // Réinitialiser
    setCart([]);
    setCustomer({ name: "", email: "", phone: "" });
    setSelectedTable(null);
    setSelectedServer(null);
    setTakeawayTime("");
    setDeliveryInfo({
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      deliveryTime: "",
      deliveryFee: 2.50
    });
    setIsProcessingPayment(false);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Point de Vente</h2>
          <p className="text-gray-600">Interface de caisse pour ventes directes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Service</div>
            <div className="font-medium flex items-center gap-1">
              {serviceType === 'dine-in' && <><Utensils className="w-4 h-4" /> Sur place</>}
              {serviceType === 'takeaway' && <><ShoppingBag className="w-4 h-4" /> À emporter</>}
              {serviceType === 'delivery' && <><Truck className="w-4 h-4" /> Livraison</>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Client actuel</div>
            <div className="font-medium">{customer.name || "Aucun client"}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Articles</div>
            <div className="font-bold text-[#b70f23]">{cart.length}</div>
          </div>
        </div>
      </div>

      {/* Service Type Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Type de service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={serviceType === 'dine-in' ? "default" : "outline"}
              className={`p-4 h-auto flex-col gap-2 ${
                serviceType === 'dine-in' 
                  ? "bg-[#b70f23] hover:bg-[#70070e]" 
                  : "hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
              }`}
              onClick={() => handleServiceTypeChange('dine-in')}
            >
              <Utensils className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Sur place</div>
                <div className="text-xs opacity-75">Service à table</div>
              </div>
            </Button>
            <Button
              variant={serviceType === 'takeaway' ? "default" : "outline"}
              className={`p-4 h-auto flex-col gap-2 ${
                serviceType === 'takeaway' 
                  ? "bg-[#b70f23] hover:bg-[#70070e]" 
                  : "hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
              }`}
              onClick={() => handleServiceTypeChange('takeaway')}
            >
              <ShoppingBag className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">À emporter</div>
                <div className="text-xs opacity-75">Collecte sur place</div>
              </div>
            </Button>
            <Button
              variant={serviceType === 'delivery' ? "default" : "outline"}
              className={`p-4 h-auto flex-col gap-2 ${
                serviceType === 'delivery' 
                  ? "bg-[#b70f23] hover:bg-[#70070e]" 
                  : "hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
              }`}
              onClick={() => handleServiceTypeChange('delivery')}
            >
              <Truck className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Livraison</div>
                <div className="text-xs opacity-75">Livraison à domicile</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panier compact mobile - Visible uniquement sur mobile */}
      <div className="lg:hidden mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Panier ({cart.length})
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <span className="text-sm font-bold text-[#b70f23]">
                    {totals.finalTotal.toFixed(2)}€
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Scroll vers le panier desktop en bas
                    document.querySelector('[data-panier-desktop]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#b70f23] border-[#b70f23] hover:bg-[#b70f23] hover:text-white h-8 px-2"
                >
                  Voir détails
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {cart.length > 0 && (
            <CardContent className="pt-0">
              <div className="text-xs text-gray-600 mb-3">
                {cart.map(item => `${item.name} (${item.quantity})`).join(', ')}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => processPayment("cash")}
                  disabled={isProcessingPayment}
                  className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                >
                  <Banknote className="w-3 h-3 mr-1" />
                  Espèces
                </Button>
                <Button
                  onClick={() => processPayment("card")}
                  disabled={isProcessingPayment}
                  className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Carte
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone de sélection produits */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barre de recherche et code-barres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Scanner code-barres..."
                  value={barcodeSearch}
                  onChange={(e) => setBarcodeSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleBarcodeSearch}
                className="bg-[#b70f23] hover:bg-[#70070e]"
              >
                <Scan className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`gap-2 ${
                    selectedCategory === category.id 
                      ? "bg-[#b70f23] hover:bg-[#70070e]" 
                      : "hover:bg-[#b70f23] hover:text-white border-[#b70f23] text-[#b70f23]"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Table status overview for dine-in */}
          {serviceType === 'dine-in' && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  État des tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className={`p-2 text-center rounded-lg border text-xs ${
                        table.status === 'available' 
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : table.status === 'occupied'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      }`}
                    >
                      <div className="font-medium">{table.number}</div>
                      <div>{table.capacity}p</div>
                      {table.currentServer && (
                        <div className="text-xs mt-1">{table.currentServer}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>Disponible ({tables.filter(t => t.status === 'available').length})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Occupée ({tables.filter(t => t.status === 'occupied').length})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span>Réservée ({tables.filter(t => t.status === 'reserved').length})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grille de produits */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  product.stock === 0 ? 'opacity-50' : ''
                }`}
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-2">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#b70f23]">
                      {product.price.toFixed(2)}€
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      product.stock === 0 ? 'bg-red-500' : 'bg-green-500'
                    }`} title={product.stock === 0 ? 'Rupture' : `Stock: ${product.stock}`}></div>
                  </div>
                  <div className="text-xs text-gray-400">
                    TVA {product.vatRate}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500">Essayez de modifier votre recherche ou sélectionner une autre catégorie</p>
            </div>
          )}
        </div>

        {/* Panier et informations */}
        <div className="space-y-4">
          {/* Panier - Priorité 1 - Caché sur mobile */}
          <Card data-panier-desktop className="hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Panier ({cart.length})
                </div>
                {cart.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-4">
                  <ShoppingCart className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Panier vide</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.price.toFixed(2)}€ × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {cart.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total HT :</span>
                      <span>{totals.totalHT.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>TVA :</span>
                      <span>{totals.vatAmount.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total articles :</span>
                      <span>{totals.subtotal.toFixed(2)}€</span>
                    </div>
                    {serviceType === 'delivery' && (
                      <div className="flex justify-between text-sm text-orange-600">
                        <span>Frais de livraison :</span>
                        <span>+{totals.deliveryFee.toFixed(2)}€</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total final :</span>
                      <span className="text-[#b70f23]">{totals.finalTotal.toFixed(2)}€</span>
                    </div>
                    
                    {/* Service info summary */}
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-600">
                        {serviceType === 'dine-in' && selectedTable && selectedServer && (
                          <div>📍 Table {selectedTable.number} - {selectedServer.name}</div>
                        )}
                        {serviceType === 'takeaway' && takeawayTime && (
                          <div>🛍️ À récupérer à {takeawayTime}</div>
                        )}
                        {serviceType === 'delivery' && deliveryInfo.deliveryTime && (
                          <div>🚚 Livraison à {deliveryInfo.deliveryTime}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium text-sm">Mode de paiement</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => processPayment("cash")}
                        disabled={isProcessingPayment}
                        className="bg-green-600 hover:bg-green-700 gap-2 text-xs h-8"
                      >
                        <Banknote className="w-3 h-3" />
                        Espèces
                      </Button>
                      <Button
                        onClick={() => processPayment("card")}
                        disabled={isProcessingPayment}
                        className="bg-blue-600 hover:bg-blue-700 gap-2 text-xs h-8"
                      >
                        <CreditCard className="w-3 h-3" />
                        Carte
                      </Button>
                      <Button
                        onClick={() => processPayment("mobile")}
                        disabled={isProcessingPayment}
                        className="bg-purple-600 hover:bg-purple-700 gap-2 text-xs h-8"
                      >
                        <Smartphone className="w-3 h-3" />
                        Mobile
                      </Button>
                      <Button
                        onClick={() => processPayment("check")}
                        disabled={isProcessingPayment}
                        className="bg-gray-600 hover:bg-gray-700 gap-2 text-xs h-8"
                      >
                        <Receipt className="w-3 h-3" />
                        Chèque
                      </Button>
                    </div>
                    {isProcessingPayment && (
                      <div className="text-center py-2">
                        <div className="text-sm text-gray-600">Traitement en cours...</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="customerName">Nom *</Label>
                <Input
                  id="customerName"
                  placeholder="Nom du client"
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="customerEmail">Email (optionnel)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="email@exemple.fr"
                    value={customer.email}
                    onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone (optionnel)</Label>
                  <Input
                    id="customerPhone"
                    placeholder="06 12 34 56 78"
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service-specific information */}
          {serviceType === 'dine-in' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Service sur place
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Table Selection */}
                <div>
                  <Label>Sélection de table *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {tables.filter(table => table.status === 'available').map((table) => (
                      <Button
                        key={table.id}
                        variant={selectedTable?.id === table.id ? "default" : "outline"}
                        className={`p-3 h-auto flex-col gap-1 ${
                          selectedTable?.id === table.id
                            ? "bg-[#b70f23] hover:bg-[#70070e]"
                            : "hover:bg-[#b70f23] hover:text-white"
                        }`}
                        onClick={() => setSelectedTable(table)}
                      >
                        <div className="font-medium">{table.number}</div>
                        <div className="text-xs opacity-75">{table.zone}</div>
                        <div className="text-xs opacity-75">{table.capacity} pers.</div>
                      </Button>
                    ))}
                  </div>
                  {tables.filter(table => table.status === 'available').length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">Aucune table disponible</p>
                  )}
                </div>

                {/* Server Assignment */}
                {selectedTable && (
                  <div>
                    <Label>Attribution serveur *</Label>
                    <select
                      value={selectedServer?.id || ""}
                      onChange={(e) => {
                        const server = servers.find(s => s.id === e.target.value);
                        setSelectedServer(server || null);
                      }}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="">Sélectionner un serveur</option>
                      {servers.filter(server => server.isActive).map((server) => (
                        <option key={server.id} value={server.id}>
                          {server.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedTable && selectedServer && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Table attribuée</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      {selectedTable.number} ({selectedTable.zone}) - Serveur: {selectedServer.name}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {serviceType === 'takeaway' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  À emporter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="takeawayTime">Créneau de récupération *</Label>
                  <select
                    id="takeawayTime"
                    value={takeawayTime}
                    onChange={(e) => setTakeawayTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Sélectionner un créneau</option>
                    {generateTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {takeawayTime && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Timer className="w-4 h-4" />
                      <span className="font-medium">Récupération prévue</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Aujourd'hui à {takeawayTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {serviceType === 'delivery' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="deliveryAddress">Adresse *</Label>
                    <Input
                      id="deliveryAddress"
                      placeholder="Numéro et rue"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="deliveryCity">Ville *</Label>
                      <Input
                        id="deliveryCity"
                        placeholder="Ville"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryPostalCode">Code postal *</Label>
                      <Input
                        id="deliveryPostalCode"
                        placeholder="75000"
                        value={deliveryInfo.postalCode}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryPhone">Téléphone livraison</Label>
                    <Input
                      id="deliveryPhone"
                      placeholder="06 12 34 56 78"
                      value={deliveryInfo.phone}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime">Créneau de livraison *</Label>
                    <select
                      id="deliveryTime"
                      value={deliveryInfo.deliveryTime}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryTime: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    >
                      <option value="">Sélectionner un créneau</option>
                      {generateTimeSlots().map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} (+ 30 min de livraison)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {deliveryInfo.address && deliveryInfo.city && deliveryInfo.deliveryTime && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Livraison confirmée</span>
                    </div>
                    <div className="text-sm text-purple-600 mt-1">
                      {deliveryInfo.address}, {deliveryInfo.city} {deliveryInfo.postalCode}
                    </div>
                    <div className="text-sm text-purple-600">
                      Livraison prévue à {deliveryInfo.deliveryTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}