import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Logo } from "../components/Logo";
import { DemoAccountSection } from "../components/DemoAccountSection";
import { getDemoAccount } from "../utils/demoAccounts";
import { Eye, EyeOff, ArrowLeft, Store, Truck, Building2, TrendingUp, Mail, Lock } from "lucide-react";

interface LoginPageProps {
  userType: string;
  onLogin: (credentials: { email: string; password: string }) => void;
  onGoToSignup?: (userType?: string) => void;
  onBack: () => void;
}

export function LoginPage({ userType, onLogin, onGoToSignup, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userTypeConfig = {
    restaurant: {
      icon: Store,
      title: "Restaurateurs",
      description: "Accédez à votre dashboard restaurant",
      color: "from-[#b70f23] to-[#70070e]",
      bgColor: "bg-[#b70f23]",
      demoEmail: "demo@restaurant.com"
    },
    delivery: {
      icon: Truck,
      title: "Livreurs",
      description: "Accédez à votre dashboard livreur",
      color: "from-[#f4b71b] to-[#b70f23]",
      bgColor: "bg-[#f4b71b]",
      demoEmail: "demo@livreur.com"
    },
    company: {
      icon: Building2,
      title: "Entreprises de livraison",
      description: "Accédez à votre dashboard entreprise",
      color: "from-[#70070e] to-[#b70f23]",
      bgColor: "bg-[#70070e]",
      demoEmail: "demo@entreprise.com"
    },
    affiliate: {
      icon: TrendingUp,
      title: "Affiliés marketing",
      description: "Accédez à votre dashboard affilié",
      color: "from-[#b70f23] to-[#f4b71b]",
      bgColor: "bg-[#b70f23]",
      demoEmail: "demo@affilie.com"
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig];
  const IconComponent = config?.icon || Store;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    // Simulation d'une authentification
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
    }, 1500);
  };

  // Fonction pour utiliser le compte de démonstration
  const handleUseDemoAccount = () => {
    const demoAccount = getDemoAccount(userType);
    
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    
    // Auto-connexion avec le compte démo
    setTimeout(() => {
      onLogin({ email: demoAccount.email, password: demoAccount.password });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo />
            <div>
              <h1 className="text-2xl font-bold text-[#b70f23]">CHAPFOODY</h1>
              <p className="text-sm text-gray-600">Connexion</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-6 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Changer de profil
          </Button>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 ${config?.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Se connecter</CardTitle>
              <CardDescription>{config?.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Se souvenir de moi
                  </label>
                  <a href="#" className="text-[#b70f23] hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full h-12 ${config?.bgColor} hover:opacity-90 text-white text-base`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{" "}
                  <button 
                    type="button"
                    onClick={() => onGoToSignup?.(userType)}
                    className="text-[#b70f23] font-medium hover:underline"
                  >
                    Créer un compte
                  </button>
                </p>
              </div>

              {/* Compte de démonstration */}
              {/* <DemoAccountSection
                userType={userType}
                onUseDemoAccount={handleUseDemoAccount}
                variant="login"
              /> */}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-[#b70f23] hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-[#b70f23] hover:underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}