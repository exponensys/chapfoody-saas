import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  ArrowLeft,
  Info,
  Image,
  Layout,
  Menu,
  Puzzle,
  Share2,
  Search,
  Star,
  Ticket,
  Mail,
  Settings,
  Globe,
  MessageSquare,
  Users,
  Gift,
  Check
} from 'lucide-react';

import { ResponsiveViewLayout } from './ResponsiveViewLayout';
import bannerImage1 from 'figma:asset/f0b806a19be8d80e68ad5ffd4cca81f9c2975b8b.png';
import bannerImage2 from 'figma:asset/dded7023b4b6c188e41b335a0237c026fcdd829b.png';
import bannerImage3 from 'figma:asset/a4c7b45c24c7f007c8cd10103202c721b53fbd9a.png';
import menuStyleImage from 'figma:asset/447ba3f070c04e9a4cdb2696df3e8fc64d3a5a76.png';

interface FonctionnalitesViewProps {
  onBack: () => void;
}

type FonctionnalitesSection = 
  | 'site-infos'
  | 'banner-settings'
  | 'header-footer-settings'
  | 'menu-settings'
  | 'email-settings'
  | 'widget-settings'
  | 'social-settings'
  | 'seo-settings'
  | 'customer-ratings'
  | 'coupon-list'
  | 'subscribe-list';

const fonctionnalitesSections = [
  { 
    id: 'site-infos' as FonctionnalitesSection, 
    label: 'Site infos', 
    icon: Info 
  },
  { 
    id: 'banner-settings' as FonctionnalitesSection, 
    label: 'Banner settings', 
    icon: Image 
  },
  { 
    id: 'header-footer-settings' as FonctionnalitesSection, 
    label: 'Header/Footer settings', 
    icon: Layout 
  },
  { 
    id: 'menu-settings' as FonctionnalitesSection, 
    label: 'Menu settings', 
    icon: Menu 
  },
  { 
    id: 'email-settings' as FonctionnalitesSection, 
    label: 'Email settings', 
    icon: Mail 
  },
  { 
    id: 'widget-settings' as FonctionnalitesSection, 
    label: 'Widget settings', 
    icon: Puzzle 
  },
  { 
    id: 'social-settings' as FonctionnalitesSection, 
    label: 'Social settings', 
    icon: Share2 
  },
  { 
    id: 'seo-settings' as FonctionnalitesSection, 
    label: 'SEO settings', 
    icon: Search 
  },
  { 
    id: 'customer-ratings' as FonctionnalitesSection, 
    label: 'Customer ratings', 
    icon: Star 
  },
  { 
    id: 'coupon-list' as FonctionnalitesSection, 
    label: 'Coupon list', 
    icon: Ticket 
  },
  { 
    id: 'subscribe-list' as FonctionnalitesSection, 
    label: 'Subscribe list', 
    icon: Mail 
  }
];

export function FonctionnalitesView({ onBack }: FonctionnalitesViewProps) {
  const [activeSection, setActiveSection] = useState<FonctionnalitesSection>('site-infos');
  
  // Banner settings states
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [bannerType, setBannerType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    type: '',
    width: '',
    height: '',
    title: '',
    subTitle: '',
    linkUrl: '',
    status: 'Active'
  });

  // Header/Footer settings states
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [selectedMenuStyle, setSelectedMenuStyle] = useState<'bottom' | 'top'>('bottom');
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);

  // Menu settings states
  const [menuForm, setMenuForm] = useState({
    name: '',
    slug: '',
    subMenu: '',
    status: 'Active'
  });
  const [isSubMenuDropdownOpen, setIsSubMenuDropdownOpen] = useState(false);

  // Widget settings states
  const [widgetForm, setWidgetForm] = useState({
    name: '',
    title: '',
    description: '',
    status: 'Active'
  });

  // Email settings states
  const [emailForm, setEmailForm] = useState({
    protocol: 'smtp',
    mailPath: '/usr/sbin/sendmail',
    mailType: 'html',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    senderEmail: 'nishuecc@gmail.com',
    smtpPassword: '',
    authHash: '22c4c92a-e5a8-4293-b64c-befc9248521e'
  });

  const bannerTypes = [
    'Home Top Slider',
    'Home our story', 
    'Home our menu',
    'Menu Page right Banner',
    'Classic theme Home story',
    'Classic theme Home reservation'
  ];

  const existingBanners = [
    {
      id: 1,
      title: 'Welcome To',
      image: bannerImage1,
      size: 'Width:1920 X Height:1000',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Discover',
      image: bannerImage2,
      size: 'Width:263 X Height:332',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Discover',
      image: bannerImage3,
      size: 'Width:263 X Height:332',
      status: 'Active'
    },
    {
      id: 4,
      title: 'OUR AWESOME STREET',
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMG1lYWx8ZW58MXx8fHwxNzU4MjkxNjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      size: 'Width:541 X Height:516',
      status: 'Active'
    }
  ];

  const handleBannerFormChange = (field: string, value: string) => {
    setBannerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setBannerForm({
      type: '',
      width: '',
      height: '',
      title: '',
      subTitle: '',
      linkUrl: '',
      status: 'Active'
    });
    setBannerType('');
    setIsDropdownOpen(false);
  };

  const handleAddBanner = () => {
    // Logic to add banner
    console.log('Adding banner:', bannerForm);
    setIsAddBannerOpen(false);
    resetForm();
  };

  const renderSiteInfosSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Globe className="w-5 h-5" />
              Informations du site web
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nom du site</Label>
                <Input placeholder="Nom de votre restaurant" />
              </div>
              <div className="space-y-2">
                <Label>URL du site</Label>
                <Input placeholder="https://monrestaurant.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description du site</Label>
              <Textarea 
                placeholder="Description de votre restaurant pour les moteurs de recherche" 
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <Input type="email" placeholder="contact@monrestaurant.com" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+33 1 23 45 67 89" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adresse complète</Label>
              <Textarea 
                placeholder="123 Rue de la République, 75001 Paris, France" 
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBannerSettingsSection = () => {
    return (
      <div className="space-y-6">
        {/* Header with Add Banner button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-gray-800">Banner Setting</h3>
          <Button 
            onClick={() => setIsAddBannerOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
          >
            + Add Banner
          </Button>
        </div>

        {/* Banners Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">SL No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Image</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Banner Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {existingBanners.map((banner, index) => (
                    <tr key={banner.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-800">{banner.title}</td>
                      <td className="py-3 px-4">
                        <img 
                          src={banner.image} 
                          alt={banner.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-blue-600">{banner.size}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{banner.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                          >
                            ✏️
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600 text-white p-2"
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Banner Modal */}
        {isAddBannerOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-800">Add Banner</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsAddBannerOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* Banner Type */}
                <div>
                  <Label className="text-gray-700">Banner Type *</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded bg-white text-left flex items-center justify-between"
                    >
                      <span className={bannerForm.type ? 'text-gray-900' : 'text-gray-500'}>
                        {bannerForm.type || 'Select option'}
                      </span>
                      <span className="text-gray-400">▼</span>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b shadow-lg z-10 max-h-48 overflow-y-auto">
                        {bannerTypes.map((type, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              handleBannerFormChange('type', type);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                              index === 0 ? 'bg-green-600 text-white hover:bg-green-700' : ''
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Size */}
                <div>
                  <Label className="text-gray-700">Banner Size *</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      placeholder="Width"
                      value={bannerForm.width}
                      onChange={(e) => handleBannerFormChange('width', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-gray-500">X</span>
                    <Input
                      placeholder="Height"
                      value={bannerForm.height}
                      onChange={(e) => handleBannerFormChange('height', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label className="text-gray-700">Title *</Label>
                  <Input
                    placeholder="Title"
                    value={bannerForm.title}
                    onChange={(e) => handleBannerFormChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Sub Title */}
                <div>
                  <Label className="text-gray-700">Sub Title *</Label>
                  <Input
                    placeholder="Sub Title"
                    value={bannerForm.subTitle}
                    onChange={(e) => handleBannerFormChange('subTitle', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-gray-700">Image</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <span className="text-gray-500 text-sm">no file selected</span>
                  </div>
                </div>

                {/* Link URL */}
                <div>
                  <Label className="text-gray-700">Link URL *</Label>
                  <Input
                    placeholder="Link URL"
                    value={bannerForm.linkUrl}
                    onChange={(e) => handleBannerFormChange('linkUrl', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Status */}
                <div>
                  <Label className="text-gray-700">Status *</Label>
                  <div className="relative mt-1">
                    <select
                      value={bannerForm.status}
                      onChange={(e) => handleBannerFormChange('status', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      setIsAddBannerOpen(false);
                      resetForm();
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleAddBanner}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHeaderFooterSettingsSection = () => {
    const headerStyles = [
      {
        id: 'classic' as const,
        name: 'Header Classique',
        description: 'Design traditionnel avec logo à gauche et menu horizontal',
        image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwaGVhZGVyJTIwZGVzaWduJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzU4MzAwNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: 'modern' as const,
        name: 'Header Moderne',
        description: 'Design épuré avec menu centré et boutons CTA',
        image: 'https://images.unsplash.com/photo-1648134859186-a05fb609f41e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwbmF2aWdhdGlvbiUyMGhlYWRlcnxlbnwxfHx8fDE3NTgzMDA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      {
        id: 'minimal' as const,
        name: 'Header Minimal',
        description: 'Design minimaliste avec logo centré et menu simple',
        image: 'https://images.unsplash.com/photo-1588560107833-167198a53677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2Vic2l0ZSUyMGhlYWRlciUyMHRlbXBsYXRlfGVufDF8fHx8MTc1ODMwMDc3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Sélection du style de header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Layout className="w-5 h-5" />
              Style de Header
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {headerStyles.map((style) => (
                <div 
                  key={style.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedHeaderStyle === style.id 
                      ? 'border-[#b70f23] bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedHeaderStyle(style.id)}
                >
                  <div className="relative mb-3">
                    <img 
                      src={style.image} 
                      alt={style.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    {selectedHeaderStyle === style.id && (
                      <div className="absolute top-2 right-2 bg-[#b70f23] rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Style de menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#b70f23]">Style de menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Menu Bas */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMenuStyle === 'bottom' 
                    ? 'border-[#b70f23] bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedMenuStyle('bottom')}
              >
                <div className="relative">
                  <h4 className="font-medium mb-2">Menu Bas</h4>
                  <div className="bg-gray-100 rounded p-3 mb-2">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  {selectedMenuStyle === 'bottom' && (
                    <div className="absolute top-2 right-2 bg-[#b70f23] rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Haut */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMenuStyle === 'top' 
                    ? 'border-[#b70f23] bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedMenuStyle('top')}
              >
                <div className="relative">
                  <h4 className="font-medium mb-2">Menu Haut</h4>
                  <div className="bg-gray-100 rounded p-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="w-4 h-1 bg-gray-400 rounded"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="w-full h-px bg-gray-300"></div>
                      <div className="w-16 h-1 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                  {selectedMenuStyle === 'top' && (
                    <div className="absolute top-2 right-2 bg-[#b70f23] rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Layout className="w-5 h-5" />
              Configuration du Header
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Afficher le logo</Label>
                <p className="text-sm text-muted-foreground">Logo dans le header</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Menu de navigation</Label>
                <p className="text-sm text-muted-foreground">Menu principal horizontal</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Bouton de commande</Label>
                <p className="text-sm text-muted-foreground">Bouton CTA dans le header</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Footer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#b70f23]">Configuration du Footer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Texte de copyright</Label>
              <Input placeholder="© 2024 Mon Restaurant. Tous droits réservés." />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Liens rapides</Label>
                <p className="text-sm text-muted-foreground">Mentions légales, CGV, etc.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Informations de contact</Label>
                <p className="text-sm text-muted-foreground">Adresse, téléphone dans le footer</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Options de masquage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#b70f23]">Options d'affichage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hide-header"
                  checked={hideHeader}
                  onChange={(e) => setHideHeader(e.target.checked)}
                  className="w-4 h-4 text-[#b70f23] border-gray-300 rounded focus:ring-[#b70f23]"
                />
                <div>
                  <Label htmlFor="hide-header" className="cursor-pointer">Cacher bannière</Label>
                  <p className="text-sm text-muted-foreground">Masquer la bannière principale du site</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hide-footer"
                  checked={hideFooter}
                  onChange={(e) => setHideFooter(e.target.checked)}
                  className="w-4 h-4 text-[#b70f23] border-gray-300 rounded focus:ring-[#b70f23]"
                />
                <div>
                  <Label htmlFor="hide-footer" className="cursor-pointer">Cacher footer (pied de page)</Label>
                  <p className="text-sm text-muted-foreground">Masquer le pied de page du site</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMenuSettingsSection = () => {
    const existingMenus = [
      { id: 1, name: 'Home', slug: 'home', parentMenu: '', status: 'Active' },
      { id: 2, name: 'Reservation', slug: 'reservation', parentMenu: '', status: 'Active' },
      { id: 3, name: 'Menu', slug: 'menu', parentMenu: '', status: 'Active' },
      { id: 4, name: 'About Us', slug: 'about', parentMenu: '', status: 'Active' },
      { id: 5, name: 'Contact Us', slug: 'contact', parentMenu: '', status: 'Active' }
    ];

    const subMenuOptions = [
      'Home',
      'Reservation', 
      'Menu',
      'About Us',
      'Contact Us',
      'Pages'
    ];

    const handleMenuFormChange = (field: string, value: string) => {
      setMenuForm(prev => ({
        ...prev,
        [field]: value,
        // Auto-generate slug from name
        ...(field === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })
      }));
    };

    const handleAddMenu = () => {
      console.log('Adding menu:', menuForm);
      // Reset form after adding
      setMenuForm({
        name: '',
        slug: '',
        subMenu: '',
        status: 'Active'
      });
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg text-gray-800">Menu Setting</h3>
        
        {/* Menu Form */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {/* Menu Name */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Menu Name *</Label>
                <div className="md:col-span-3">
                  <Input
                    placeholder="Menu Name"
                    value={menuForm.name}
                    onChange={(e) => handleMenuFormChange('name', e.target.value)}
                  />
                </div>
              </div>

              {/* Menu Slug */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Menu Slug</Label>
                <div className="md:col-span-3">
                  <Input
                    placeholder="Menu Slug"
                    value={menuForm.slug}
                    onChange={(e) => handleMenuFormChange('slug', e.target.value)}
                    className="bg-gray-100"
                  />
                </div>
              </div>

              {/* Sub Menu */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Sub Menu</Label>
                <div className="md:col-span-3 relative">
                  <button
                    type="button"
                    onClick={() => setIsSubMenuDropdownOpen(!isSubMenuDropdownOpen)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-left flex items-center justify-between"
                  >
                    <span className={menuForm.subMenu ? 'text-gray-900' : 'text-gray-500'}>
                      {menuForm.subMenu || 'Select option'}
                    </span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  
                  {isSubMenuDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b shadow-lg z-10 max-h-48 overflow-y-auto">
                      {subMenuOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            handleMenuFormChange('subMenu', option);
                            setIsSubMenuDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                            menuForm.subMenu === option ? 'bg-green-600 text-white hover:bg-green-700' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="md:col-span-3 relative">
                  <select
                    value={menuForm.status}
                    onChange={(e) => handleMenuFormChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Add Button */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div></div>
                <div className="md:col-span-3">
                  <Button 
                    onClick={handleAddMenu}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">SL No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Menu Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Menu Slug</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Parent Menu</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {existingMenus.map((menu, index) => (
                    <tr key={menu.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-800">{menu.name}</td>
                      <td className="py-3 px-4 text-gray-800">{menu.slug}</td>
                      <td className="py-3 px-4 text-gray-800">{menu.parentMenu || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{menu.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white p-2"
                        >
                          ✏️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWidgetSettingsSection = () => {
    const existingWidgets = [
      {
        id: 1,
        name: 'Footer',
        type: 'Footer',
        description: 'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
        status: 'Active'
      },
      {
        id: 2,
        name: 'About',
        type: 'About',
        description: 'About us',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Contact',
        type: 'Contact',
        description: 'Contact information and details for reaching out to our restaurant. Includes phone number, email, address and opening hours.',
        status: 'Active'
      },
      {
        id: 4,
        name: 'Opening Hours',
        type: 'Schedule',
        description: 'Restaurant opening hours for each day of the week. Includes special holiday hours and seasonal adjustments.',
        status: 'Active'
      },
      {
        id: 5,
        name: 'Social Media',
        type: 'Social',
        description: 'Social media links and integration widgets for Facebook, Instagram, Twitter and other platforms.',
        status: 'Inactive'
      },
      {
        id: 6,
        name: 'Newsletter',
        type: 'Marketing',
        description: 'Newsletter subscription widget allowing customers to sign up for updates, promotions and special offers.',
        status: 'Active'
      },
      {
        id: 7,
        name: 'Reviews',
        type: 'Reviews',
        description: 'Customer reviews and testimonials widget displaying recent feedback and ratings from satisfied customers.',
        status: 'Active'
      },
      {
        id: 8,
        name: 'Location Map',
        type: 'Map',
        description: 'Interactive map widget showing restaurant location with directions and nearby landmarks for easy navigation.',
        status: 'Active'
      },
      {
        id: 9,
        name: 'Special Offers',
        type: 'Promotion',
        description: 'Current promotions and special offers widget highlighting deals, discounts and limited-time offers.',
        status: 'Active'
      },
      {
        id: 10,
        name: 'Gallery',
        type: 'Media',
        description: 'Photo gallery widget showcasing restaurant ambiance, dishes and special events with high-quality images.',
        status: 'Inactive'
      }
    ];

    const handleWidgetFormChange = (field: string, value: string) => {
      setWidgetForm(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleAddWidget = () => {
      console.log('Adding widget:', widgetForm);
      // Reset form after adding
      setWidgetForm({
        name: '',
        title: '',
        description: '',
        status: 'Active'
      });
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg text-gray-800">Widget Setting</h3>
        
        {/* Widget Creation Form */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {/* Widget Name */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Widget Name *</Label>
                <div className="md:col-span-3">
                  <Input
                    placeholder="Widget Name"
                    value={widgetForm.name}
                    onChange={(e) => handleWidgetFormChange('name', e.target.value)}
                  />
                </div>
              </div>

              {/* Widget Title */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Widget Title</Label>
                <div className="md:col-span-3">
                  <Input
                    placeholder="Widget Title"
                    value={widgetForm.title}
                    onChange={(e) => handleWidgetFormChange('title', e.target.value)}
                  />
                </div>
              </div>

              {/* Description with Rich Text Editor */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Description</Label>
                <div className="md:col-span-3">
                  {/* Rich Text Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t bg-gray-50">
                    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200">
                      {/* File Menu */}
                      <select className="text-xs border-none bg-transparent">
                        <option>File</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>Edit</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>Insert</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>View</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>Format</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>Table</option>
                      </select>
                      <select className="text-xs border-none bg-transparent">
                        <option>Tools</option>
                      </select>
                    </div>
                    
                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2">
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">↶</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">↷</button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <select className="text-xs border-none bg-transparent">
                        <option>Formats</option>
                      </select>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded italic">I</button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">≡</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">≡</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">≡</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">≡</button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">•</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">1.</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">📋</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">🖨️</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">👁️</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">⛶</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">A</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">A</button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">😊</button>
                      
                      <select className="text-xs border-none bg-transparent ml-2">
                        <option>12pt</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Area */}
                  <div className="border-l border-r border-b border-gray-300 rounded-b bg-white">
                    <Textarea
                      placeholder="Tapez votre description ici..."
                      value={widgetForm.description}
                      onChange={(e) => handleWidgetFormChange('description', e.target.value)}
                      className="border-none min-h-[200px] rounded-none resize-none focus:outline-none"
                    />
                    
                    {/* Footer with word count */}
                    <div className="flex justify-end items-center p-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-500">
                      <span>Words: {widgetForm.description.split(' ').filter(word => word.length > 0).length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="md:col-span-3 relative">
                  <select
                    value={widgetForm.status}
                    onChange={(e) => handleWidgetFormChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Add Button */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div></div>
                <div className="md:col-span-3">
                  <Button 
                    onClick={handleAddWidget}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Widgets Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">SL No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Widget Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Widget Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {existingWidgets.map((widget, index) => (
                    <tr key={widget.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{widget.name}</td>
                      <td className="py-3 px-4 text-gray-600">{widget.type}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-md">
                        <div className="truncate" title={widget.description}>
                          {widget.description.length > 100 
                            ? `${widget.description.substring(0, 100)}...` 
                            : widget.description
                          }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className={`font-medium ${
                            widget.status === 'Active' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}
                        >
                          {widget.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white p-2"
                            title="Edit widget"
                          >
                            ✏️
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600 text-white p-2"
                            title="Delete widget"
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Widget Configuration Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Puzzle className="w-5 h-5" />
              Options des widgets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Widgets dynamiques</Label>
                <p className="text-sm text-muted-foreground">Permettre le chargement dynamique des widgets</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cache des widgets</Label>
                <p className="text-sm text-muted-foreground">Mettre en cache le contenu des widgets</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Widgets personnalisés</Label>
                <p className="text-sm text-muted-foreground">Autoriser les widgets personnalisés</p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Délai de cache (minutes)</Label>
              <Input type="number" placeholder="60" defaultValue="60" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Lazy loading</Label>
                <p className="text-sm text-muted-foreground">Charger les widgets à la demande</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEmailSettingsSection = () => {
    const handleEmailFormChange = (field: string, value: string) => {
      setEmailForm(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleResetEmail = () => {
      setEmailForm({
        protocol: 'smtp',
        mailPath: '/usr/sbin/sendmail',
        mailType: 'html',
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        senderEmail: 'nishuecc@gmail.com',
        smtpPassword: '',
        authHash: '22c4c92a-e5a8-4293-b64c-befc9248521e'
      });
    };

    const handleSaveEmail = () => {
      console.log('Saving email settings:', emailForm);
      // Here you would typically send the data to your backend
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg text-gray-800">Email Setting</h3>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {/* Protocol */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Protocol :</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.protocol}
                    onChange={(e) => handleEmailFormChange('protocol', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Mail Path */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Mail Path :</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.mailPath}
                    onChange={(e) => handleEmailFormChange('mailPath', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Mail Type */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Mail Type :</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.mailType}
                    onChange={(e) => handleEmailFormChange('mailType', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* SMTP Host */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">SMTP Host :</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.smtpHost}
                    onChange={(e) => handleEmailFormChange('smtpHost', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* SMTP Port */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">SMTP Port :</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.smtpPort}
                    onChange={(e) => handleEmailFormChange('smtpPort', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Sender Email */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">Sender Email :</Label>
                <div className="md:col-span-3">
                  <Input
                    type="email"
                    value={emailForm.senderEmail}
                    onChange={(e) => handleEmailFormChange('senderEmail', e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* SMTP Password */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">SMTP Password :</Label>
                <div className="md:col-span-3">
                  <Input
                    type="password"
                    value={emailForm.smtpPassword}
                    onChange={(e) => handleEmailFormChange('smtpPassword', e.target.value)}
                    placeholder="••••••••••••••••"
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Auth Hash */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label className="text-right">:</Label>
                <div className="md:col-span-3">
                  <Input
                    value={emailForm.authHash}
                    onChange={(e) => handleEmailFormChange('authHash', e.target.value)}
                    className="bg-gray-50 font-mono text-sm"
                    readOnly
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div></div>
                <div className="md:col-span-3 flex justify-end gap-3">
                  <Button 
                    onClick={handleResetEmail}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleSaveEmail}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSocialSettingsSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Share2 className="w-5 h-5" />
              Réseaux sociaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input placeholder="https://facebook.com/monrestaurant" />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input placeholder="https://instagram.com/monrestaurant" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input placeholder="https://twitter.com/monrestaurant" />
              </div>
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input placeholder="https://tiktok.com/@monrestaurant" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input placeholder="https://youtube.com/monrestaurant" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Partage social</Label>
                <p className="text-sm text-muted-foreground">Boutons de partage sur les plats</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Flux Instagram</Label>
                <p className="text-sm text-muted-foreground">Afficher les dernières photos Instagram</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSEOSettingsSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Search className="w-5 h-5" />
              Optimisation SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Titre SEO (Title Tag)</Label>
              <Input placeholder="Meilleur restaurant à Paris | Nom du restaurant" />
              <p className="text-xs text-muted-foreground">Recommandé : 50-60 caractères</p>
            </div>

            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea 
                placeholder="Découvrez notre restaurant gastronomique au cœur de Paris. Cuisine française authentique, ambiance chaleureuse. Réservez votre table dès maintenant !" 
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">Recommandé : 150-160 caractères</p>
            </div>

            <div className="space-y-2">
              <Label>Mots-clés</Label>
              <Input placeholder="restaurant paris, cuisine française, gastronomie" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sitemap XML</Label>
                <p className="text-sm text-muted-foreground">Génération automatique du sitemap</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Schema.org</Label>
                <p className="text-sm text-muted-foreground">Données structurées pour les moteurs de recherche</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input placeholder="GA4-XXXXXXXXX" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCustomerRatingsSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Star className="w-5 h-5" />
              Avis clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Système d'avis</Label>
                <p className="text-sm text-muted-foreground">Permettre aux clients de laisser des avis</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Modération des avis</Label>
                <p className="text-sm text-muted-foreground">Validation manuelle avant publication</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Réponse aux avis</Label>
                <p className="text-sm text-muted-foreground">Permettre de répondre aux commentaires</p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Note minimum pour publication</Label>
              <Input type="number" min="1" max="5" placeholder="3" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Google Reviews</Label>
                <p className="text-sm text-muted-foreground">Synchronisation avec Google My Business</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email de notification</Label>
                <p className="text-sm text-muted-foreground">Recevoir un email pour chaque nouvel avis</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCouponListSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Ticket className="w-5 h-5" />
              Gestion des coupons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Système de coupons</Label>
                <p className="text-sm text-muted-foreground">Activer les codes promotionnels</p>
              </div>
              <Switch />
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <h4 className="font-medium">Coupons actifs</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium">BIENVENUE10</div>
                    <div className="text-sm text-muted-foreground">10% de réduction - Première commande</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Actif</div>
                    <div className="text-xs text-muted-foreground">Expire le 31/12/2024</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium">PIZZA15</div>
                    <div className="text-sm text-muted-foreground">15€ de réduction sur les pizzas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">Actif</div>
                    <div className="text-xs text-muted-foreground">Expire le 28/02/2024</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Gift className="w-4 h-4 mr-2" />
                Créer un nouveau coupon
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Limite d'utilisation par client</Label>
              <Input type="number" placeholder="1" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cumul avec autres offres</Label>
                <p className="text-sm text-muted-foreground">Permettre le cumul de coupons</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSubscribeListSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#b70f23]">
              <Mail className="w-5 h-5" />
              Liste d'abonnés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">Inscription à la newsletter sur le site</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">247</div>
                <div className="text-sm text-muted-foreground">Abonnés actifs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-muted-foreground">Nouveaux cette semaine</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">12.5%</div>
                <div className="text-sm text-muted-foreground">Taux d'ouverture</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texte d'invitation</Label>
              <Input placeholder="Inscrivez-vous pour recevoir nos offres spéciales !" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Double opt-in</Label>
                <p className="text-sm text-muted-foreground">Confirmation par email obligatoire</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Offre de bienvenue</Label>
                <p className="text-sm text-muted-foreground">Coupon automatique à l'inscription</p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Fréquence d'envoi</Label>
              <select className="w-full p-2 border rounded">
                <option>Hebdomadaire</option>
                <option>Bi-mensuelle</option>
                <option>Mensuelle</option>
                <option>Occasionnelle</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'site-infos':
        return renderSiteInfosSection();
      case 'banner-settings':
        return renderBannerSettingsSection();
      case 'header-footer-settings':
        return renderHeaderFooterSettingsSection();
      case 'menu-settings':
        return renderMenuSettingsSection();
      case 'email-settings':
        return renderEmailSettingsSection();
      case 'widget-settings':
        return renderWidgetSettingsSection();
      case 'social-settings':
        return renderSocialSettingsSection();
      case 'seo-settings':
        return renderSEOSettingsSection();
      case 'customer-ratings':
        return renderCustomerRatingsSection();
      case 'coupon-list':
        return renderCouponListSection();
      case 'subscribe-list':
        return renderSubscribeListSection();
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Section en cours de développement</h3>
              <p className="text-muted-foreground">Cette section sera bientôt disponible.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ResponsiveViewLayout
      title="Fonctionnalités"
      subtitle="Configuration des fonctionnalités du site web"
      sections={fonctionnalitesSections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onBack={onBack}
    >
      {renderContent()}
    </ResponsiveViewLayout>
  );
}