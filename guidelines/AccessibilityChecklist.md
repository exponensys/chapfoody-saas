# Checklist d'Accessibilité - CHAPFOODY

## 🔧 Composants Corrigés

### ✅ Sheet Components
- `SheetOverlay` : Converti en `forwardRef` pour gérer les refs
- `SheetContent` : Converti en `forwardRef` pour gérer les refs
- `ResponsiveViewLayout` : Ajout de `SheetTitle` et `SheetDescription` cachés

### ✅ Dialog Components
- `DialogContent` : Vérification automatique de la présence de `DialogDescription`
- Fallback automatique pour `aria-describedby` si aucune description n'est fournie

### ✅ Composants Utilitaires Créés
- `VisuallyHidden` : Pour masquer du contenu visuellement mais le garder accessible
- `AccessibleDialog` : Wrapper pour s'assurer que tous les dialogs ont titre/description

---

## 📋 Règles d'Accessibilité à Suivre

### Pour les Dialogs
```tsx
// ✅ CORRECT
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre du dialogue</DialogTitle>
      <DialogDescription>Description du dialogue</DialogDescription>
    </DialogHeader>
    {/* Contenu */}
  </DialogContent>
</Dialog>

// ✅ CORRECT (avec titre/description cachés)
<Dialog>
  <DialogContent>
    <DialogHeader>
      <VisuallyHidden>
        <DialogTitle>Titre accessible</DialogTitle>
        <DialogDescription>Description accessible</DialogDescription>
      </VisuallyHidden>
    </DialogHeader>
    {/* Contenu */}
  </DialogContent>
</Dialog>

// ❌ INCORRECT
<Dialog>
  <DialogContent>
    {/* Pas de titre ni description */}
  </DialogContent>
</Dialog>
```

### Pour les Sheets
```tsx
// ✅ CORRECT
<Sheet>
  <SheetContent>
    <VisuallyHidden>
      <SheetTitle>Titre du sheet</SheetTitle>
      <SheetDescription>Description du sheet</SheetDescription>
    </VisuallyHidden>
    {/* Contenu */}
  </SheetContent>
</Sheet>

// ❌ INCORRECT
<Sheet>
  <SheetContent>
    {/* Pas de titre ni description */}
  </SheetContent>
</Sheet>
```

### Pour les forwardRef
```tsx
// ✅ CORRECT
const MonComposant = React.forwardRef<
  React.ElementRef<typeof ComposantPrimitif>,
  React.ComponentPropsWithoutRef<typeof ComposantPrimitif>
>(({ className, ...props }, ref) => (
  <ComposantPrimitif
    ref={ref}
    className={cn("classes", className)}
    {...props}
  />
));
MonComposant.displayName = ComposantPrimitif.displayName;

// ❌ INCORRECT (composant fonctionnel sans forwardRef qui reçoit des refs)
function MonComposant({ className, ...props }) {
  return <ComposantPrimitif className={cn("classes", className)} {...props} />;
}
```

---

## 🎯 Points de Contrôle

### Avant de Créer un Nouveau Dialog/Sheet
- [ ] Le composant a-t-il un titre accessible ?
- [ ] Le composant a-t-il une description accessible ?
- [ ] Si titre/description doivent être cachés, utilise-t-on `VisuallyHidden` ?

### Avant de Créer un Nouveau Composant
- [ ] Le composant reçoit-il des refs de Radix UI ?
- [ ] Si oui, utilise-t-on `React.forwardRef` ?
- [ ] Le `displayName` est-il défini ?

### Tests d'Accessibilité
- [ ] Navigation au clavier fonctionnelle
- [ ] Lecteurs d'écran peuvent identifier le contenu
- [ ] Aucun warning d'accessibilité en console
- [ ] Focus management correct

---

## 🛠️ Outils de Débogage

### Console Warnings à Surveiller
- `Function components cannot be given refs`
- `DialogContent requires a DialogTitle`
- `Missing Description or aria-describedby`

### Extensions Utiles
- React Developer Tools
- axe DevTools
- WAVE Web Accessibility Evaluator

---

## 📚 Ressources

- [Radix UI Accessibility](https://radix-ui.com/primitives/docs/overview/accessibility)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## ✅ Status Actuel

**Toutes les erreurs d'accessibilité identifiées ont été corrigées :**
- ✅ Refs warnings résolus dans Sheet components
- ✅ Dialog accessibility warnings résolus
- ✅ Components utilitaires créés pour futures implementations
- ✅ Guidelines établies pour maintenir l'accessibilité