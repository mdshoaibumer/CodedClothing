/**
 * Utility: className merger (clsx + tailwind-merge)
 * Combines conditional class names and resolves Tailwind conflicts.
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}