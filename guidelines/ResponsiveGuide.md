# Guide des Composants Responsifs - CHAPFOODY

## Vue d'ensemble

Ce guide présente les composants responsifs créés pour assurer une expérience utilisateur optimale sur tous les appareils dans l'écosystème CHAPFOODY.

## Composants Principaux

### 1. ResponsiveViewLayout

Le composant principal pour créer des vues avec sidebar responsive.

```tsx
import { ResponsiveViewLayout } from './ResponsiveViewLayout';

<ResponsiveViewLayout
  title="Titre de la vue"
  subtitle="Description optionnelle"
  sections={sections}
  activeSection={activeSection}
  onSectionChange={setActiveSection}
  onBack={onBack}
  headerActions={<Button>Action</Button>}
>
  {content}
</ResponsiveViewLayout>
```

**Fonctionnalités :**
- Sidebar fixe sur desktop (lg+)
- Sidebar mobile avec Sheet component
- Header mobile adaptatif
- Navigation automatique responsive

### 2. ResponsiveGrid

Système de grille adaptatif avec breakpoints configurables.

```tsx
import { ResponsiveGrid } from './ResponsiveGrid';

<ResponsiveGrid 
  cols={{ base: 1, md: 2, lg: 3, xl: 4 }}
  gap={6}
>
  {children}
</ResponsiveGrid>
```

**Options :**
- `cols`: Nombre de colonnes par breakpoint
- `gap`: Espacement entre éléments
- `className`: Classes CSS additionnelles

### 3. ResponsiveTable

Tableaux qui s'adaptent sur mobile avec vue en cartes.

```tsx
import { ResponsiveTable } from './ResponsiveTable';

<ResponsiveTable
  columns={[
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email', hideOnMobile: true },
    { key: 'status', label: 'Statut' }
  ]}
  data={data}
  renderCell={(key, value, row) => {
    if (key === 'status') {
      return <Badge>{value}</Badge>;
    }
    return value;
  }}
  onRowClick={(row) => console.log(row)}
  mobileCardView={true}
/>
```

**Fonctionnalités :**
- Table normale sur desktop
- Vue en cartes sur mobile
- Colonnes cachables sur mobile
- Rendu de cellules personnalisable

### 4. ResponsiveForm

Formulaires adaptatifs avec grille flexible.

```tsx
import { ResponsiveForm } from './ResponsiveForm';

<ResponsiveForm
  title="Titre du formulaire"
  fields={[
    {
      id: 'name',
      label: 'Nom',
      type: 'text',
      value: '',
      required: true
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      span: 2
    }
  ]}
  onFieldChange={(fieldId, value) => handleChange(fieldId, value)}
  onSubmit={handleSubmit}
  columns={{ base: 1, md: 2 }}
/>
```

## Breakpoints Standard

Les composants utilisent les breakpoints Tailwind standard :

- `base`: 0px+ (mobile)
- `sm`: 640px+ 
- `md`: 768px+ (tablette)
- `lg`: 1024px+ (desktop)
- `xl`: 1280px+ (large desktop)

## Patterns Responsifs Courants

### 1. Layout Sidebar + Contenu

```tsx
// Avant (non-responsif)
<div className="flex h-screen">
  <div className="w-80 bg-white">Sidebar</div>
  <div className="flex-1">Contenu</div>
</div>

// Après (responsif)
<ResponsiveViewLayout
  title="Titre"
  sections={sections}
  activeSection={activeSection}
  onSectionChange={setActiveSection}
  onBack={onBack}
>
  {contenu}
</ResponsiveViewLayout>
```

### 2. Grilles Adaptatives

```tsx
// Avant (fixe)
<div className="grid grid-cols-3 gap-6">
  {items}
</div>

// Après (adaptative)
<ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }}>
  {items}
</ResponsiveGrid>
```

### 3. Formulaires Flexibles

```tsx
// Avant (rigide)
<div className="grid grid-cols-2 gap-4">
  <input />
  <input />
</div>

// Après (flexible)
<ResponsiveGrid cols={{ base: 1, md: 2 }}>
  <Input />
  <Input />
</ResponsiveGrid>
```

## Migration des Vues Existantes

### Étapes de migration :

1. **Identifier le type de vue**
   - Vue avec sidebar → `ResponsiveViewLayout`
   - Formulaire → `ResponsiveForm`
   - Liste/tableau → `ResponsiveTable`
   - Grille d'éléments → `ResponsiveGrid`

2. **Remplacer la structure**
   ```tsx
   // Remplacer
   <div className="flex h-screen">
     <div className="w-80">...</div>
     <div className="flex-1">...</div>
   </div>
   
   // Par
   <ResponsiveViewLayout>...</ResponsiveViewLayout>
   ```

3. **Adapter les grilles**
   ```tsx
   // Remplacer
   <div className="grid grid-cols-2">
   
   // Par
   <ResponsiveGrid cols={{ base: 1, md: 2 }}>
   ```

4. **Optimiser pour mobile**
   - Espacements réduits
   - Boutons pleine largeur sur mobile
   - Textes tronqués avec ellipsis

## Exemples Complets

### Vue Settings Responsive

```tsx
export function SettingsView({ onBack }) {
  return (
    <ResponsiveViewLayout
      title="Paramètres"
      subtitle="Configuration du système"
      sections={settingsSections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onBack={onBack}
    >
      <div className="space-y-6">
        <ResponsiveGrid cols={{ base: 1, md: 2 }}>
          <Input label="Option 1" />
          <Input label="Option 2" />
        </ResponsiveGrid>
        
        <Button className="w-full sm:w-auto">
          Sauvegarder
        </Button>
      </div>
    </ResponsiveViewLayout>
  );
}
```

## Bonnes Pratiques

### Classes CSS Responsives

```tsx
// Espacement adaptatif
<div className="p-4 lg:p-6">

// Taille de bouton adaptative  
<Button className="w-full sm:w-auto">

// Flex responsive
<div className="flex flex-col sm:flex-row">

// Texte tronqué
<span className="truncate">
```

### Gestion des Images

```tsx
// Taille adaptative
<img className="w-16 h-16 sm:w-20 sm:h-20" />

// Ratio responsive
<div className="aspect-square lg:aspect-video">
```

### Navigation Mobile

```tsx
// Menu burger uniquement sur mobile
<div className="lg:hidden">
  <MenuButton />
</div>

// Breadcrumb masqué sur mobile
<div className="hidden sm:block">
  <Breadcrumb />
</div>
```

## Checklist de Validation

- [ ] Vue fonctionnelle sur mobile (320px+)
- [ ] Sidebar accessible via menu mobile
- [ ] Formulaires utilisables au doigt
- [ ] Tableaux lisibles en vue mobile
- [ ] Navigation intuitive
- [ ] Performance maintenue
- [ ] Accessibilité préservée

## Support des Navigateurs

- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 90+
- Samsung Internet 14+
- Desktop moderne (Chrome, Firefox, Safari, Edge)

## Points d'Attention

1. **Performance** : Les composants responsifs sont optimisés mais testez sur appareils réels
2. **Accessibilité** : Navigation clavier maintenue
3. **Touch** : Zones tactiles ≥ 44px
4. **Contenu** : Éviter le débordement horizontal
5. **Images** : Utiliser des tailles adaptatives