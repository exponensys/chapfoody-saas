import { motion } from "motion/react";
import { Button } from "./ui/button";
import { getDemoAccount } from "../utils/demoAccounts";
import { TestTube, Play } from "lucide-react";

interface DemoAccountSectionProps {
  userType?: string;
  onUseDemoAccount: () => void;
  variant?: "login" | "signup";
  className?: string;
}

export function DemoAccountSection({ 
  userType = "", 
  onUseDemoAccount, 
  variant = "login",
  className = ""
}: DemoAccountSectionProps) {
  const demoAccount = getDemoAccount(userType);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className={`mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg ${className}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TestTube className="w-4 h-4 text-blue-700" />
          <h3 className="font-medium text-blue-900">
            {variant === "login" ? "Compte de démonstration" : "Tester sans créer de compte"}
          </h3>
        </div>
        
        {variant === "signup" && (
          <p className="text-sm text-blue-700 mb-3">
            Découvrez CHAPFOODY avec notre compte de démonstration
          </p>
        )}
        
        <div className="text-sm text-blue-700 space-y-1 mb-3">
          <p><strong>Email:</strong> {demoAccount.email}</p>
          <p><strong>Mot de passe:</strong> {demoAccount.password}</p>
          {demoAccount.displayName && (
            <p className="text-xs text-blue-600">({demoAccount.displayName})</p>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={onUseDemoAccount}
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {variant === "login" ? "Utiliser le compte démo" : "Essayer maintenant"}
        </Button>
      </div>
      
      {/* Avertissement développement */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600 text-center opacity-75">
          ⚠️ Compte de développement - À supprimer en production
        </p>
      </div>
    </motion.div>
  );
}