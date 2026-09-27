import { cn } from "./ui/utils";
import chapfoodyLogo from "figma:asset/fd29a84cd22d3e2fb69bfcf81e93b1d68449dc45.png";
import chapfoodyLogoWhite from "figma:asset/92e0f93cea9e63f24a50aa060195c1909a6af035.png";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({
  className,
  variant = "default",
  showText = true,
  onClick,
}: LogoProps) {
  const logoSrc =
    variant === "white" ? chapfoodyLogoWhite : chapfoodyLogo;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 cursor-pointer transition-transform hover:scale-105", 
        className
      )}
      onClick={onClick}
    >
      <img
        src={logoSrc}
        alt="CHAPFOODY"
        className="w-16 h-20 object-contain"
      />
      {showText && (
        <div>
          {/* <h1 className="font-bold text-lg">CHAPFOODY</h1>
          <p className="text-sm opacity-80">Food Delivery Platform</p> */}
        </div>
      )}
    </div>
  );
}