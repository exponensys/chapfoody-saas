import { describe, expect, it } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  it('joins plain class names', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('ignores falsy values, which is the point of the conditional syntax', () => {
    expect(cn('flex', false, null, undefined, '', 'gap-2')).toBe('flex gap-2');
  });

  it('supports the object form', () => {
    expect(cn({ 'text-brand-primary': true, hidden: false })).toBe('text-brand-primary');
  });

  it('supports the array form', () => {
    expect(cn(['flex', ['gap-2', 'p-4']])).toBe('flex gap-2 p-4');
  });

  it('lets the last conflicting utility win, so callers can override defaults', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('keeps utilities that only look alike', () => {
    // px-4 and py-4 are not in conflict: both must survive.
    expect(cn('px-4', 'py-4')).toBe('px-4 py-4');
  });

  it('is the same behaviour for every dashboard — no local cn() implementations', () => {
    expect(cn('bg-brand-primary', undefined, { 'text-white': true })).toBe(
      'bg-brand-primary text-white',
    );
  });
});
