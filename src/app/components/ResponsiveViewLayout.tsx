import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { VisuallyHidden } from './ui/visually-hidden';
import { 
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

interface SectionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ResponsiveViewLayoutProps {
  title: string;
  subtitle?: string;
  sections: SectionItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onBack: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function ResponsiveViewLayout({
  title,
  subtitle,
  sections,
  activeSection,
  onSectionChange,
  onBack,
  children,
  headerActions
}: ResponsiveViewLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSection_obj = sections.find(s => s.id === activeSection);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-medium text-[#b70f23] truncate">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setIsSidebarOpen(false); // Close mobile sidebar on selection
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-[#b70f23] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 lg:hidden">
          <VisuallyHidden>
            <SheetTitle>Menu de navigation</SheetTitle>
            <SheetDescription>
              Navigation principale pour accéder aux différentes sections
            </SheetDescription>
          </VisuallyHidden>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-medium text-[#b70f23] truncate">
                {activeSection_obj?.label || title}
              </h1>
            </div>
            
            {headerActions && (
              <div className="flex-shrink-0">
                {headerActions}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 lg:p-6">
              <Card className="h-full">
                <CardHeader className="hidden lg:block">
                  <CardTitle className="text-[#b70f23] flex items-center gap-2">
                    {activeSection_obj?.icon && (
                      <activeSection_obj.icon className="w-5 h-5" />
                    )}
                    <span className="truncate">{activeSection_obj?.label}</span>
                    {headerActions && (
                      <div className="ml-auto flex-shrink-0">
                        {headerActions}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="lg:pt-6 p-4 lg:p-6">
                  {children}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}