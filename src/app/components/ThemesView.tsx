import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ResponsiveContainer } from './ResponsiveGrid';
import { ArrowLeft, Eye, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/bc1e2ef86d0f75ff513c95fc601f5cebd87b9ad8.png';

interface ThemesViewProps {
  onBack: () => void;
}

const themes = [
  {
    id: 'template1',
    name: 'Restaurant Classique',
    description: 'Parfait pour les restaurants traditionnels',
    preview: 'https://images.unsplash.com/photo-1588560107833-167198a53677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2Vic2l0ZSUyMHRlbXBsYXRlJTIwbW9kZXJufGVufDF8fHx8MTc1ODI5NzgwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fullPreview: exampleImage,
    isActive: true
  },
  {
    id: 'template2',
    name: 'Design Moderne',
    description: 'Interface épurée et contemporaine',
    preview: 'https://images.unsplash.com/photo-1588560107833-167198a53677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2Vic2l0ZSUyMGRlc2lnbiUyMGNsZWFufGVufDF8fHx8MTc1ODI5NzgwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fullPreview: 'https://images.unsplash.com/photo-1588560107833-167198a53677?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwd2Vic2l0ZSUyMGRlc2lnbiUyMGNsZWFufGVufDF8fHx8MTc1ODI5NzgwN3ww&ixlib=rb-4.1.0&q=80&w=1200&utm_source=figma&utm_medium=referral',
    isActive: false
  },
  {
    id: 'template3',
    name: 'Application Livraison',
    description: 'Optimisé pour la livraison et le take-away',
    preview: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU4MjQwMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fullPreview: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU4MjQwMDcwfDA&ixlib=rb-4.1.0&q=80&w=1200&utm_source=figma&utm_medium=referral',
    isActive: false
  }
];

export function ThemesView({ onBack }: ThemesViewProps) {
  const [activeTheme, setActiveTheme] = useState('template1');
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  const handleActivateTheme = (themeId: string) => {
    setActiveTheme(themeId);
  };

  const handlePreview = (themeId: string) => {
    setPreviewMode(themeId);
  };

  const handleClosePreview = () => {
    setPreviewMode(null);
  };

  const currentPreviewTheme = themes.find(theme => theme.id === previewMode);

  return (
    <ResponsiveContainer maxWidth="6xl" className="py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl text-gray-900">
          Mise en page
        </h1>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Template Preview Image */}
            <div className="relative group">
              <div className="aspect-[4/3] bg-gray-50">
                <ImageWithFallback
                  src={theme.preview}
                  alt={`Aperçu ${theme.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  onClick={() => handlePreview(theme.id)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base text-gray-900 truncate">
                    {theme.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {theme.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {activeTheme === theme.id ? (
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5"
                      disabled
                    >
                      Activé
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActivateTheme(theme.id)}
                      className="text-xs px-3 py-1.5 border-gray-300 hover:bg-gray-50"
                    >
                      Activer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewMode} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-5xl w-full h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg text-gray-900">
                Aperçu - {currentPreviewTheme?.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Prévisualisation du thème {currentPreviewTheme?.name}
              </DialogDescription>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePreview}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-6">
            {currentPreviewTheme && (
              <div className="relative w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
                <ImageWithFallback
                  src={currentPreviewTheme.fullPreview}
                  alt={`Aperçu complet ${currentPreviewTheme.name}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
                  <span className="text-sm text-gray-700">Aperçu Desktop</span>
                  <div className="w-px h-4 bg-gray-300" />
                  <Button
                    size="sm"
                    onClick={() => handleActivateTheme(currentPreviewTheme.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                  >
                    {activeTheme === currentPreviewTheme.id ? 'Thème activé' : 'Activer ce thème'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ResponsiveContainer>
  );
}