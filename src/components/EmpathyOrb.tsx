import React from 'react';
import { Heart } from 'lucide-react';

interface EmpathyOrbProps {
  isActive?: boolean;
  emotion?: string;
}

const EmpathyOrb: React.FC<EmpathyOrbProps> = ({ isActive = false, emotion = 'neutral' }) => {
  const getOrbStyles = (emotion: string) => {
    const styles = {
      happy: 'bg-gradient-healing shadow-glow',
      sad: 'bg-gradient-ocean shadow-soft',
      anxious: 'bg-gradient-sunset shadow-embrace',
      grateful: 'bg-gradient-aurora shadow-glow',
      angry: 'bg-destructive shadow-embrace',
      tired: 'bg-muted shadow-soft',
      neutral: 'bg-gradient-aurora shadow-soft',
    };
    return styles[emotion as keyof typeof styles] || styles.neutral;
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          ${getOrbStyles(emotion)}
          ${isActive ? 'breathe pulse-glow' : 'float'}
          transition-all duration-1000 cursor-pointer
          hover:scale-110 hover:rotate-12
        `}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />
        
        {/* Heart icon */}
        <Heart 
          className={`
            w-8 h-8 text-white relative z-10
            ${isActive ? 'animate-pulse' : ''}
          `} 
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                top: `${20 + Math.sin(i * 60) * 30}%`,
                left: `${50 + Math.cos(i * 60) * 30}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpathyOrb;