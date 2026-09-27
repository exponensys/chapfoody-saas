import { Crown } from "lucide-react";
import { Badge } from "./ui/badge";

interface PremiumBadgeProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
}

export function PremiumBadge({ variant = "default", className = "" }: PremiumBadgeProps) {
  if (variant === "icon-only") {
    return (
      <Crown 
        className={`w-3 h-3 text-yellow-500 ${className}`} 
        fill="currentColor"
      />
    );
  }

  if (variant === "small") {
    return (
      <Badge 
        variant="outline" 
        className={`text-xs border-yellow-500 text-yellow-600 bg-yellow-50 ${className}`}
      >
        <Crown className="w-2.5 h-2.5 mr-1" fill="currentColor" />
        Premium
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`border-yellow-500 text-yellow-600 bg-yellow-50 ${className}`}
    >
      <Crown className="w-3 h-3 mr-1" fill="currentColor" />
      Premium
    </Badge>
  );
}