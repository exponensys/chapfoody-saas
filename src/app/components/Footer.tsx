import { Logo } from "./Logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Send,
  Home,
  Briefcase,
  Users2,
  Newspaper,
  Video,
  HelpCircle,
  MessageSquare,
  Globe,
  Euro,
  BookOpen,
  FileText,
  ChevronDown,
} from "lucide-react";

interface FooterProps {
  onGoToCaseStudies?: () => void;
  onGoToNews?: () => void;
  onGoToVideoLibrary?: () => void;
  onGoToUserTypeDetail?: (userType: string) => void;
}

export function Footer({
  onGoToCaseStudies,
  onGoToNews,
  onGoToVideoLibrary,
  onGoToUserTypeDetail,
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Company */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo />
              <div>
                <h3 className="text-xl font-bold text-[#b70f23]">
                  CHAPFOODY
                </h3>
                <p className="text-sm text-gray-400">
                  Écosystème alimentaire
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              CHAPFOODY connecte tous les acteurs de la
              restauration et de l'alimentation dans un
              écosystème digital innovant et performant.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-700 hover:border-[#b70f23] cursor-pointer">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  FR
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-700 hover:border-[#b70f23] cursor-pointer">
                <Euro className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  EUR
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Solutions
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() =>
                    onGoToUserTypeDetail &&
                    onGoToUserTypeDetail("restaurateur")
                  }
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Restaurateurs
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onGoToUserTypeDetail &&
                    onGoToUserTypeDetail("livreur")
                  }
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Livreurs indépendants
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onGoToUserTypeDetail &&
                    onGoToUserTypeDetail("entreprise")
                  }
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Entreprises de livraison
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onGoToUserTypeDetail &&
                    onGoToUserTypeDetail("affilie")
                  }
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Affiliés marketing
                </button>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Ressources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={onGoToCaseStudies}
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Cas d'usage
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToNews}
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Actualités
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToVideoLibrary}
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Vidéothèque
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Centre d'aide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Statut des services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#f4b71b] transition-colors"
                >
                  Communauté
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-semibold mb-2 text-white">
                Restez informé
              </h4>
              <p className="text-gray-300 text-sm">
                Recevez les dernières actualités et innovations
                de l'écosystème alimentaire.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Votre adresse email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2025 CHAPFOODY. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-[#f4b71b] transition-colors"
            >
              Politique de confidentialité
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#f4b71b] transition-colors"
            >
              Conditions d'utilisation
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#f4b71b] transition-colors"
            >
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}