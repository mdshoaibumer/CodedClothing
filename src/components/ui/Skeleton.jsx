/**
 * Skeleton.jsx — Loading Placeholder Component
 * 
 * Shimmer animation skeleton for content loading states.
 * Uses CSS animation for GPU-composited performance.
 */

import { cn } from '../../lib/utils';

const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-gradient-to-r from-obsidian-100 via-obsidian-50 to-obsidian-100 bg-[length:200%_100%]", className)}
      style={{ animation: 'shimmer 2s ease-in-out infinite' }}
      {...props}
    />
  );
};

export { Skeleton };