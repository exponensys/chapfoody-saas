import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ResponsiveGrid } from './ResponsiveGrid';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'custom';
  value?: string;
  placeholder?: string;
  required?: boolean;
  span?: number; // How many columns to span in grid
  customComponent?: ReactNode;
}

interface ResponsiveFormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onFieldChange?: (fieldId: string, value: string) => void;
  onSubmit?: () => void;
  submitLabel?: string;
  className?: string;
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
  };
}

export function ResponsiveForm({
  title,
  description,
  fields,
  onFieldChange,
  onSubmit,
  submitLabel = 'Sauvegarder',
  className = '',
  columns = { base: 1, md: 2 }
}: ResponsiveFormProps) {
  const renderField = (field: FormField) => {
    const colSpan = field.span ? 
      `col-span-${field.span} md:col-span-${field.span}` : 
      'col-span-1';

    const fieldContent = (
      <div className="space-y-2">
        <Label className="font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {field.type === 'custom' ? (
          field.customComponent
        ) : field.type === 'textarea' ? (
          <Textarea
            id={field.id}
            value={field.value || ''}
            placeholder={field.placeholder}
            onChange={(e) => onFieldChange?.(field.id, e.target.value)}
            className="w-full min-h-[80px]"
            required={field.required}
          />
        ) : (
          <Input
            id={field.id}
            type={field.type}
            value={field.value || ''}
            placeholder={field.placeholder}
            onChange={(e) => onFieldChange?.(field.id, e.target.value)}
            className="w-full"
            required={field.required}
          />
        )}
      </div>
    );

    return (
      <div key={field.id} className={colSpan}>
        {fieldContent}
      </div>
    );
  };

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-[#b70f23]">{title}</CardTitle>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <ResponsiveGrid 
          cols={columns}
          gap={6}
          className="items-start"
        >
          {fields.map(renderField)}
        </ResponsiveGrid>
        
        {onSubmit && (
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onSubmit}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-2 w-full sm:w-auto"
            >
              💾 {submitLabel}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  stackOnMobile?: boolean;
}

export function TwoColumnLayout({
  left,
  right,
  leftTitle,
  rightTitle,
  stackOnMobile = true
}: TwoColumnLayoutProps) {
  const gridClass = stackOnMobile ? 
    'grid grid-cols-1 lg:grid-cols-2 gap-6' : 
    'grid grid-cols-2 gap-6';

  return (
    <div className={gridClass}>
      <div className="space-y-4">
        {leftTitle && <h3 className="text-lg font-medium">{leftTitle}</h3>}
        {left}
      </div>
      <div className="space-y-4">
        {rightTitle && <h3 className="text-lg font-medium">{rightTitle}</h3>}
        {right}
      </div>
    </div>
  );
}