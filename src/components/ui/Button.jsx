/**
 * Button.jsx — Design System Button Component
 * 
 * Variants: default, outline, ghost, link, primary, success, luxury
 * Sizes: sm, default, lg, xl, icon
 * Uses Framer Motion for micro-interaction (scale on hover/tap).
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Button = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-obsidian-900 text-white hover:bg-obsidian-800 hover:shadow-luxury shadow-large',
    outline: 'border-2 border-obsidian-200 bg-white text-obsidian-900 hover:border-gold-500 hover:shadow-gold/20',
    ghost: 'text-obsidian-600 hover:text-obsidian-900 hover:bg-obsidian-50',
    link: 'text-gold-600 underline-offset-4 hover:underline',
    primary: 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 shadow-gold',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]',
    luxury: 'bg-obsidian-900 text-gold-500 border border-gold-500/20 hover:border-gold-500/50 hover:shadow-[0_0_30px_rgba(201,169,110,0.15)]',
  };

  const sizes = {
    default: 'h-11 px-5 py-2.5',
    sm: 'h-9 rounded-xl px-4',
    lg: 'h-12 rounded-2xl px-8',
    xl: 'h-16 rounded-2xl px-10 text-lg',
    icon: 'h-11 w-11',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {/* Shimmer on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };