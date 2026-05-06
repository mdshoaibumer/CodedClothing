import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Badge = forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'border-transparent bg-obsidian-900 text-white',
    secondary: 'border-transparent bg-obsidian-100 text-obsidian-900',
    destructive: 'border-transparent bg-red-500 text-white',
    outline: 'text-obsidian-900 border-obsidian-200',
    gold: 'border-gold-200 bg-gold-50 text-gold-800',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };