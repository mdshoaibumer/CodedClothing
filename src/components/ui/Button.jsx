import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25',
    outline: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    link: 'text-blue-600 underline-offset-4 hover:underline',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    xl: 'h-14 rounded-lg px-10 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transform hover:scale-[1.02] hover:shadow-lg',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };