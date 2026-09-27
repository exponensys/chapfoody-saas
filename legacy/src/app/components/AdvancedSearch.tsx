import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import {
  Search,
  Filter,
  X,
  Calendar,
  Tag,
  User,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

interface SearchFilters {
  query: string;
  category: string;
  contentType: string;
  dateRange: string;
  author: string;
  readTimeRange: [number];
  tags: string[];
  sortBy: string;
  engagement: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export function AdvancedSearch({ onSearch, isExpanded = false, onToggleExpanded }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    contentType: "all",
    dateRange: "all",
    author: "all",
    readTimeRange: [10],
    tags: [],
    sortBy: "relevance",
    engagement: "all"
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = [
    { value: "innovation", label: "Innovation" },
    { value: "tendances", label: "Tendances" },
    { value: "entreprise", label: "CHAPFOODY" },
    { value: "reglementation", label: "Réglementation" },
    { value: "etudes", label: "Études de marché" },
    { value: "restaurant", label: "Restaurants" },
    { value: "livraison", label: "Livraison" }
  ];

  const contentTypes = [
    { value: "all", label: "Tous les types" },
    { value: "news", label: "Actualités" },
    { value: "case-studies", label: "Cas d'études" },
    { value: "guides", label: "Guides pratiques" },
    { value: "interviews", label: "Interviews" }
  ];

  const dateRanges = [
    { value: "all", label: "Toutes les dates" },
    { value: "last-week", label: "7 derniers jours" },
    { value: "last-month", label: "30 derniers jours" },
    { value: "last-3months", label: "3 derniers mois" },
    { value: "last-year", label: "Cette année" }
  ];

  const authors = [
    { value: "all", label: "Tous les auteurs" },
    { value: "sophie-moreau", label: "Dr. Sophie Moreau" },
    { value: "pierre-dubois", label: "Pierre Dubois" },
    { value: "marie-laurent", label: "Marie Laurent" },
    { value: "chapfoody-team", label: "Équipe CHAPFOODY" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "date-desc", label: "Plus récent" },
    { value: "date-asc", label: "Plus ancien" },
    { value: "views-desc", label: "Plus vus" },
    { value: "engagement-desc", label: "Plus engageants" }
  ];

  const popularTags = [
    "IA", "Innovation", "Livraison", "FoodTech", "Blockchain", 
    "Environnement", "Startup", "Tendances", "Réglementation", "ROI",
    "Digitalisation", "Optimisation", "Analytics", "UX", "Mobile"
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mise à jour des filtres actifs
    const newActiveFilters: string[] = [];
    if (newFilters.query) newActiveFilters.push("search");
    if (newFilters.category && newFilters.category !== "all") newActiveFilters.push("category");
    if (newFilters.contentType && newFilters.contentType !== "all") newActiveFilters.push("type");
    if (newFilters.dateRange && newFilters.dateRange !== "all") newActiveFilters.push("date");
    if (newFilters.author && newFilters.author !== "all") newActiveFilters.push("author");
    if (newFilters.tags.length > 0) newActiveFilters.push("tags");
    if (newFilters.engagement && newFilters.engagement !== "all") newActiveFilters.push("engagement");
    
    setActiveFilters(newActiveFilters);
    onSearch(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag) 
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange("tags", newTags);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      category: "all",
      contentType: "all",
      dateRange: "all",
      author: "all",
      readTimeRange: [10],
      tags: [],
      sortBy: "relevance",
      engagement: "all"
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    onSearch(clearedFilters);
  };

  const clearFilter = (filterKey: string) => {
    switch (filterKey) {
      case "search":
        handleFilterChange("query", "");
        break;
      case "category":
        handleFilterChange("category", "all");
        break;
      case "type":
        handleFilterChange("contentType", "all");
        break;
      case "date":
        handleFilterChange("dateRange", "all");
        break;
      case "author":
        handleFilterChange("author", "all");
        break;
      case "tags":
        handleFilterChange("tags", []);
        break;
      case "engagement":
        handleFilterChange("engagement", "all");
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher dans les contenus, cas d'études, actualités..."
          value={filters.query}
          onChange={(e) => handleFilterChange("query", e.target.value)}
          className="pl-10 pr-12 h-12"
        />
        {isExpanded !== undefined && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-gray-600">Filtres actifs:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer hover:bg-red-100 hover:text-red-800"
              onClick={() => clearFilter(filter)}
            >
              {filter}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-800"
          >
            Effacer tout
          </Button>
        </motion.div>
      )}

      {/* Advanced Filters */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-[#b70f23]/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1 text-[#b70f23]" />
                    Catégorie
                  </label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Type Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Filter className="w-4 h-4 mr-1 text-[#b70f23]" />
                    Type de contenu
                  </label>
                  <Select value={filters.contentType} onValueChange={(value) => handleFilterChange("contentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-[#b70f23]" />
                    Période
                  </label>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les dates" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-1 text-[#b70f23]" />
                    Auteur
                  </label>
                  <Select value={filters.author} onValueChange={(value) => handleFilterChange("author", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les auteurs" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.value} value={author.value}>
                          {author.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-[#b70f23]" />
                    Trier par
                  </label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Read Time Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Temps de lecture max: {filters.readTimeRange[0]} min
                  </label>
                  <Slider
                    value={filters.readTimeRange}
                    onValueChange={(value) => handleFilterChange("readTimeRange", value)}
                    max={30}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Tags populaires
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        filters.tags.includes(tag)
                          ? "bg-[#b70f23] hover:bg-[#70070e] text-white"
                          : "hover:bg-[#b70f23] hover:text-white"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Search Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {activeFilters.length > 0 && (
                    <span>{activeFilters.length} filtre{activeFilters.length > 1 ? 's' : ''} actif{activeFilters.length > 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={clearAllFilters}>
                    Réinitialiser
                  </Button>
                  <Button
                    className="bg-[#b70f23] hover:bg-[#70070e] text-white"
                    onClick={() => onSearch(filters)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}