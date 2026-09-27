import { motion } from "motion/react";
import { cn } from "./ui/utils";
import { LucideIcon, ArrowLeft } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useState } from "react";

interface TileData {
  id: string;
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  progress?: number;
  badge?: string;
  color?: string;
  size?: "small" | "medium" | "large" | "wide";
  onClick?: () => void;
  gradient?: string;
  children?: React.ReactNode;
  detailContent?: React.ReactNode;
  hasDetail?: boolean;
}

interface WindowsPhoneTilesProps {
  tiles: TileData[];
  className?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

const getTileSize = (size: string) => {
  switch (size) {
    case "small": 
      return "col-span-1 row-span-1 h-24";
    case "medium": 
      return "col-span-1 row-span-2 h-48";
    case "large": 
      return "col-span-2 row-span-2 h-48";
    case "wide": 
      return "col-span-2 row-span-1 h-24";
    default: 
      return "col-span-1 row-span-1 h-24";
  }
};

const getDefaultGradient = (color?: string) => {
  switch (color) {
    case "red": 
      return "from-[#b70f23] to-[#70070e]";
    case "yellow": 
      return "from-[#f4b71b] to-[#b70f23]";
    case "blue": 
      return "from-blue-500 to-blue-600";
    case "green": 
      return "from-green-500 to-green-600";
    case "purple": 
      return "from-purple-500 to-purple-600";
    case "orange": 
      return "from-orange-500 to-orange-600";
    case "cyan": 
      return "from-cyan-500 to-cyan-600";
    default: 
      return "from-gray-500 to-gray-600";
  }
};

export function WindowsPhoneTiles({ 
  tiles, 
  className, 
  showBackButton = false, 
  onBack, 
  title 
}: WindowsPhoneTilesProps) {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  const handleTileClick = (tile: TileData) => {
    if (tile.hasDetail && tile.detailContent) {
      setSelectedTile(tile);
    } else if (tile.onClick) {
      tile.onClick();
    }
  };

  const handleBackToTiles = () => {
    setSelectedTile(null);
  };

  // Si une tuile avec contenu détaillé est sélectionnée, afficher le contenu
  if (selectedTile && selectedTile.detailContent) {
    return (
      <div className="space-y-4">
        {/* Bouton retour avec animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handleBackToTiles}
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux tuiles
          </Button>
        </motion.div>

        {/* Titre de la section */}
        {selectedTile.title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              {selectedTile.icon && <selectedTile.icon className="w-6 h-6 text-[#b70f23]" />}
              {selectedTile.title}
            </h2>
          </motion.div>
        )}

        {/* Contenu détaillé avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {selectedTile.detailContent}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bouton retour principal et titre (si fournis) */}
      {(showBackButton || title) && (
        <div className="flex items-center justify-between">
          {showBackButton && onBack && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </motion.div>
          )}
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-bold text-gray-800"
            >
              {title}
            </motion.h2>
          )}
        </div>
      )}

      {/* Grille de tuiles */}
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4",
        "auto-rows-max",
        className
      )}>
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          const gradient = tile.gradient || getDefaultGradient(tile.color);
          const tileSize = getTileSize(tile.size || "small");
          
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                bounce: 0.3
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              className={cn(
                tileSize,
                "relative overflow-hidden rounded-2xl shadow-lg",
                `bg-gradient-to-br ${gradient}`,
                "cursor-pointer group",
                "transform-gpu"
              )}
              onClick={() => handleTileClick(tile)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                {/* Header */}
                <div className="flex items-start justify-between">
                  {Icon && (
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                  {tile.badge && (
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {tile.badge}
                    </Badge>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center">
                  {tile.children ? (
                    tile.children
                  ) : (
                    <>
                      {tile.value && (
                        <div className="text-lg md:text-2xl lg:text-3xl font-bold mb-1">
                          {tile.value}
                        </div>
                      )}
                      <div className="text-xs md:text-sm opacity-90 font-medium">
                        {tile.title}
                      </div>
                      {tile.subtitle && (
                        <div className="text-xs opacity-70 mt-1">
                          {tile.subtitle}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {tile.progress !== undefined && (
                  <div className="mt-2">
                    <Progress 
                      value={tile.progress} 
                      className="h-1.5 bg-white/20"
                    />
                  </div>
                )}

                {/* Indicator for detailed content */}
                {tile.hasDetail && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  </div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour une grille responsive de métriques
interface MetricsTilesProps {
  metrics: Array<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    color: string;
    change?: {
      value: string;
      trend: "up" | "down" | "neutral";
    };
  }>;
}

export function MetricsTiles({ metrics }: MetricsTilesProps) {
  const tiles: TileData[] = metrics.map((metric, index) => ({
    id: `metric-${index}`,
    title: metric.title,
    value: metric.value,
    subtitle: metric.subtitle,
    icon: metric.icon,
    color: metric.color,
    size: "small" as const,
    children: (
      <div className="flex flex-col justify-center h-full">
        <div className="text-base md:text-lg lg:text-xl font-bold">
          {metric.value}
        </div>
        <div className="text-xs opacity-90 font-medium">
          {metric.title}
        </div>
        {metric.change && (
          <div className={cn(
            "text-xs mt-1 flex items-center gap-1",
            metric.change.trend === "up" ? "text-green-200" : 
            metric.change.trend === "down" ? "text-red-200" : "text-white/70"
          )}>
            {metric.change.trend === "up" ? "↗" : metric.change.trend === "down" ? "↘" : "→"}
            {metric.change.value}
          </div>
        )}
        {metric.subtitle && (
          <div className="text-xs opacity-70 mt-1">
            {metric.subtitle}
          </div>
        )}
      </div>
    )
  }));

  return <WindowsPhoneTiles tiles={tiles} />;
}

// Composant pour des actions rapides
interface QuickActionsTilesProps {
  actions: Array<{
    title: string;
    icon: LucideIcon;
    color: string;
    onClick: () => void;
    badge?: string;
  }>;
}

export function QuickActionsTiles({ actions }: QuickActionsTilesProps) {
  const tiles: TileData[] = actions.map((action, index) => ({
    id: `action-${index}`,
    title: action.title,
    icon: action.icon,
    color: action.color,
    size: "small" as const,
    onClick: action.onClick,
    badge: action.badge,
    children: (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <action.icon className="w-6 h-6 md:w-8 md:h-8 mb-2" />
        <div className="text-xs md:text-sm font-medium leading-tight">
          {action.title}
        </div>
      </div>
    )
  }));

  return <WindowsPhoneTiles tiles={tiles} />;
}

// Nouveau composant pour des tuiles avec du contenu détaillé
interface DetailedTilesProps {
  tiles: Array<{
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;
    size?: "small" | "medium" | "large" | "wide";
    value?: string | number;
    subtitle?: string;
    badge?: string;
    detailContent: React.ReactNode;
  }>;
  className?: string;
  title?: string;
}

export function DetailedTiles({ tiles, className, title }: DetailedTilesProps) {
  const tilesData: TileData[] = tiles.map((tile) => ({
    id: tile.id,
    title: tile.title,
    icon: tile.icon,
    color: tile.color,
    size: tile.size || "small",
    value: tile.value,
    subtitle: tile.subtitle,
    badge: tile.badge,
    hasDetail: true,
    detailContent: tile.detailContent
  }));

  return <WindowsPhoneTiles tiles={tilesData} className={className} title={title} />;
}