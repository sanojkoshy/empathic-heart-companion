import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmpathyOrb from './EmpathyOrb';
import heroImage from '@/assets/hero-empathy.jpg';
import { Heart, MessageCircle, BarChart3, Sparkles } from 'lucide-react';

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onGetStarted }) => {
  const [isOrbActive, setIsOrbActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-sunset relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div 
              className="mb-8"
              onMouseEnter={() => setIsOrbActive(true)}
              onMouseLeave={() => setIsOrbActive(false)}
            >
              <EmpathyOrb isActive={isOrbActive} emotion="grateful" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-aurora bg-clip-text text-transparent leading-tight">
              SoulSync
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-foreground/80 mb-4 max-w-2xl mx-auto leading-relaxed">
              Your empathetic AI companion that truly understands your feelings
            </p>
            
            <p className="text-lg text-secondary-foreground/70 max-w-xl mx-auto">
              Share your thoughts, explore your emotions, and discover the healing power of being truly heard.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-card/40 backdrop-blur-sm border-0 shadow-embrace hover:shadow-glow transition-all duration-500 group">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-healing flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-healing-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Empathetic Conversations
                </h3>
                <p className="text-sm text-card-foreground/70">
                  Share your thoughts and receive responses that truly understand your emotional state.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur-sm border-0 shadow-embrace hover:shadow-glow transition-all duration-500 group">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-aurora flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Emotion Tracking
                </h3>
                <p className="text-sm text-card-foreground/70">
                  Visualize your emotional journey and discover patterns in your feelings.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/40 backdrop-blur-sm border-0 shadow-embrace hover:shadow-glow transition-all duration-500 group">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-ocean flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Gentle Insights
                </h3>
                <p className="text-sm text-card-foreground/70">
                  Receive thoughtful reflections and gentle guidance for your emotional wellbeing.
                </p>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <Button 
              onClick={onGetStarted}
              variant="aurora"
              size="lg"
              className="text-lg px-8 py-6 h-auto hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            
            <p className="text-sm text-secondary-foreground/60">
              No judgment, just understanding. Your feelings are safe here.
            </p>
          </div>

          {/* Quote */}
          <div className="mt-16 max-w-2xl mx-auto">
            <Card className="p-8 bg-card/30 backdrop-blur-sm border-0 shadow-soft">
              <blockquote className="text-lg italic text-card-foreground/80 leading-relaxed">
                "The greatest gift you can give someone is your presence, your attention, 
                and your understanding. Here, you have mine, always."
              </blockquote>
              <div className="text-sm text-card-foreground/60 mt-4">
                — Your AI Companion
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;