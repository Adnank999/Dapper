import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface NeonBorderProps {
  color1?: string;
  color2?: string;
  animationType?: 'none' | 'half' | 'full' | 'static';
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
}

const NeonBorder: React.FC<NeonBorderProps> = ({
  color1 = '#0496ff',
  color2 = '#ff0a54',
  duration = 6,
  animationType = 'half',
  className,
  children,
  isActive = true,
}) => {
  const durationInSeconds = useMemo(() => `${duration}s`, [duration]);
  
  const animWidth = useMemo(() => {
    if (!isActive) return '0%';
    
    switch (animationType) {
      case 'none':
        return '0%';
      case 'static':
        return '100%';
      case 'half':
        return '50%';
      case 'full':
        return '100%';
      default:
        return '50%';
    }
  }, [animationType, isActive]);

  const shouldAnimate = animationType !== 'none' && animationType !== 'static' && isActive;

  return (
    <div
      className={cn(
        'relative inline-block h-10 w-full max-w-sm overflow-hidden rounded-lg p-px z-10',
        className
      )}
      style={{
        '--neon-border-duration': durationInSeconds,
      } as React.CSSProperties}
    >
      <div
        className={cn(
          'neon-border-one transition-opacity duration-300',
          shouldAnimate ? 'animate-neon-border' : ''
        )}
        style={{
          '--color-type-1': color1,
          '--anim-width': animWidth,
          opacity: isActive ? 1 : 0,
        } as React.CSSProperties}
      />
      <div
        className={cn(
          'neon-border-two transition-opacity duration-300',
          shouldAnimate ? 'animate-neon-border' : ''
        )}
        style={{
          '--color-type-2': color2,
          '--anim-width': animWidth,
          opacity: isActive ? 1 : 0,
        } as React.CSSProperties}
      />
      <div className="relative h-full w-full rounded-[calc(0.5rem-1px)] bg-background z-10">
        {children}
      </div>
    </div>
  );
};

export default NeonBorder;
