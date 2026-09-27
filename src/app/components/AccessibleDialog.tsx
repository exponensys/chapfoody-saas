import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";

interface AccessibleDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
}

export function AccessibleDialog({
  open,
  onOpenChange,
  children,
  title = "Dialogue",
  description = "Contenu du dialogue",
  hideTitle = false,
  hideDescription = false,
}: AccessibleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

interface AccessibleDialogContentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
}

export function AccessibleDialogContent({
  children,
  className,
  title = "Dialogue",
  description = "Contenu du dialogue",
  hideTitle = false,
  hideDescription = false,
}: AccessibleDialogContentProps) {
  return (
    <DialogContent className={className}>
      <DialogHeader>
        {hideTitle ? (
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
        ) : (
          <DialogTitle>{title}</DialogTitle>
        )}
        {hideDescription ? (
          <VisuallyHidden>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
        ) : (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      {children}
    </DialogContent>
  );
}

export { DialogTrigger as AccessibleDialogTrigger };