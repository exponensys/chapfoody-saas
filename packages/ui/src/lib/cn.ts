import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional class-name composition with Tailwind conflict resolution.
 *
 * `clsx` handles the conditional/array/object syntax, `twMerge` makes the last
 * conflicting utility win — so a component's default padding can be overridden
 * by a caller (`cn('p-2', className)`) instead of producing `p-2 p-4` and
 * leaving the outcome to CSS source order.
 *
 * This is the canonical helper of the shadcn/ui component set that the prototype
 * already used in `src/app/components/ui/utils.ts`; it lives in the shared
 * package so every dashboard consumes the exact same implementation.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
