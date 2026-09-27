import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon | string;
  color: string;
  features: string[];
  onClick: () => void;
}

export function UserTypeCard({ title, description, icon, color, features, onClick }: UserTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="border-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
        {/* Bande colorée dégradée CHAPFOODY */}
        <div className="h-3 md:h-4 bg-gradient-to-r from-[#b70f23] via-[#f4b71b] to-[#70070e] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        
        <CardHeader className="text-center pb-4 pt-6 px-4 md:px-6">
          {/* Icon with Windows Phone style background */}
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative z-10 text-white">
              {typeof icon === 'string' ? (
                <div className="text-2xl md:text-3xl">{icon}</div>
              ) : (
                (() => {
                  const IconComponent = icon as LucideIcon;
                  return <IconComponent className="w-8 h-8 md:w-10 md:h-10" />;
                })()
              )}
            </div>
          </motion.div>
          
          <CardTitle className="text-lg md:text-xl font-bold mb-2">{title}</CardTitle>
          <CardDescription className="text-xs md:text-sm leading-relaxed text-gray-600 px-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 px-4 md:px-6 pb-6">
          {/* Features in Windows Phone tile style */}
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs w-full justify-center py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {feature}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          {/* Windows Phone style button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onClick}
              className={`w-full bg-gradient-to-br ${color} text-white hover:opacity-90 transition-all duration-200 rounded-xl py-3 md:py-4 font-medium shadow-lg group`}
            >
              <span className="mr-2">Accéder au dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}