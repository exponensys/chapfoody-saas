import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Logo } from "../components/Logo";
import { DemoAccountSection } from "../components/DemoAccountSection";
import { ArrowLeft, Store, Truck, Building2, TrendingUp } from "lucide-react";

interface SignupPageProps {
  selectedUserType?: string;
  onBack: () => void;
  onSignup: (userData: SignupFormData) => void;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
  phone: string;
  company?: string;
  acceptTerms: boolean;
}

const userTypeOptions = [
  { id: "restaurant", label: "Restaurateur / Métier de bouche", icon: Store },
  { id: "delivery", label: "Livreur indépendant", icon: Truck },
  { id: "company", label: "Entreprise de livraison", icon: Building2 },
  { id: "affiliate", label: "Affilié marketing", icon: TrendingUp }
];

export function SignupPage({ selectedUserType = "", onBack, onSignup }: SignupPageProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: selectedUserType,
    phone: "",
    company: "",
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmez votre mot de passe";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.userType) newErrors.userType = "Sélectionnez votre type d'utilisateur";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if ((formData.userType === "company" || formData.userType === "restaurant") && !formData.company?.trim()) {
      newErrors.company = "Le nom de l'entreprise est requis";
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulation d'un délai d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSignup(formData);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour rediriger vers la page de connexion avec le compte démo
  const handleUseDemoAccount = () => {
    onBack(); // Retourne à la page de connexion où le compte démo sera disponible
  };

  const selectedUserTypeInfo = userTypeOptions.find(opt => opt.id === formData.userType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-[#b70f23]">CHAPFOODY</h1>
                <p className="text-sm text-gray-600">Créer votre compte</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Créer votre compte{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b70f23] to-[#f4b71b]">
                    CHAPFOODY
                  </span>
                </CardTitle>
                <CardDescription className="text-base">
                  Rejoignez l'écosystème de la restauration et de l'alimentation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type d'utilisateur */}
                  <div className="space-y-2">
                    <Label htmlFor="userType">Type d'utilisateur *</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange("userType", value)}
                    >
                      <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionnez votre profil" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypeOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.id} value={option.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.userType && <p className="text-sm text-red-500">{errors.userType}</p>}
                  </div>

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email et téléphone */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                      placeholder="06 12 34 56 78"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Nom de l'entreprise (conditionnel) */}
                  {(formData.userType === "company" || formData.userType === "restaurant") && (
                    <div className="space-y-2">
                      <Label htmlFor="company">
                        {formData.userType === "restaurant" ? "Nom du restaurant *" : "Nom de l'entreprise *"}
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company || ""}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className={errors.company ? "border-red-500" : ""}
                        placeholder={formData.userType === "restaurant" ? "Le nom de votre restaurant" : "Le nom de votre entreprise"}
                      />
                      {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                    </div>
                  )}

                  {/* Mots de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                      placeholder="Minimum 8 caractères"
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                      placeholder="Confirmer votre mot de passe"
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  {/* Conditions d'utilisation */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked === true)}
                      className={errors.acceptTerms ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        J'accepte les{" "}
                        <a href="#" className="text-[#b70f23] underline hover:text-[#70070e]">
                          conditions d'utilisation
                        </a>{" "}
                        et la{" "}
                        <a href="#" className="text-[#b70f23] underline hover:text-[#70070e]">
                          politique de confidentialité
                        </a>{" "}
                        de CHAPFOODY *
                      </Label>
                      {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#b70f23] to-[#70070e] hover:from-[#70070e] hover:to-[#b70f23] text-white py-3"
                  >
                    {isLoading ? "Création du compte..." : "Créer mon compte"}
                  </Button>

                  {/* Lien vers la connexion */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Vous avez déjà un compte ?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={onBack}
                        className="text-[#b70f23] hover:text-[#70070e] p-0 h-auto"
                      >
                        Se connecter
                      </Button>
                    </p>
                  </div>

                  {/* Compte de démonstration pour tester */}
                  <DemoAccountSection
                    userType={formData.userType || "restaurant"}
                    onUseDemoAccount={handleUseDemoAccount}
                    variant="signup"
                  />
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}