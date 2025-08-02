import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Sparkles, 
  Wind, 
  BookOpen, 
  Lightbulb, 
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

interface AIInteractiveSectionProps {
  currentEmotion?: string;
  onSendMessage?: (message: string) => void;
}

const AIInteractiveSection: React.FC<AIInteractiveSectionProps> = ({ 
  currentEmotion = 'neutral', 
  onSendMessage 
}) => {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Quick response suggestions based on emotion
  const getQuickResponses = (emotion: string) => {
    const responses = {
      happy: [
        "I want to celebrate this moment!",
        "Tell me what's making you so joyful",
        "I'm feeling grateful for this happiness"
      ],
      sad: [
        "I need someone to listen",
        "I'm feeling overwhelmed right now",
        "Can you help me process this?"
      ],
      anxious: [
        "I'm worried about the future",
        "My mind is racing with thoughts",
        "I need help calming down"
      ],
      angry: [
        "I'm feeling frustrated and need to vent",
        "Something is really bothering me",
        "I need help managing my anger"
      ],
      grateful: [
        "I want to share something I'm thankful for",
        "I'm feeling blessed today",
        "Gratitude is filling my heart"
      ],
      tired: [
        "I'm feeling exhausted and drained",
        "I need support to recharge",
        "Everything feels overwhelming"
      ],
      neutral: [
        "How should I start this conversation?",
        "I'm not sure how I'm feeling",
        "What should I reflect on today?"
      ]
    };
    return responses[emotion as keyof typeof responses] || responses.neutral;
  };

  // Guided activities based on emotion
  const getGuidedActivities = (emotion: string) => {
    const activities = {
      anxious: [
        { id: 'breathing', title: '4-7-8 Breathing', icon: Wind, description: 'Calm your nervous system' },
        { id: 'grounding', title: '5-4-3-2-1 Grounding', icon: Heart, description: 'Connect with the present' }
      ],
      sad: [
        { id: 'journaling', title: 'Emotional Journaling', icon: BookOpen, description: 'Express your feelings' },
        { id: 'comfort', title: 'Self-Compassion', icon: Heart, description: 'Be gentle with yourself' }
      ],
      angry: [
        { id: 'release', title: 'Anger Release', icon: RefreshCw, description: 'Channel your energy' },
        { id: 'perspective', title: 'Perspective Shift', icon: Lightbulb, description: 'Find new viewpoints' }
      ],
      happy: [
        { id: 'gratitude', title: 'Gratitude Practice', icon: Sparkles, description: 'Amplify the joy' },
        { id: 'sharing', title: 'Share the Joy', icon: Heart, description: 'Spread the happiness' }
      ],
      tired: [
        { id: 'energy', title: 'Energy Check', icon: RefreshCw, description: 'Assess your needs' },
        { id: 'rest', title: 'Mindful Rest', icon: Heart, description: 'Quality restoration' }
      ],
      neutral: [
        { id: 'checkin', title: 'Daily Check-in', icon: Heart, description: 'How are you really?' },
        { id: 'explore', title: 'Explore Feelings', icon: Lightbulb, description: 'Discover your state' }
      ]
    };
    return activities[emotion as keyof typeof activities] || activities.neutral;
  };

  // Breathing exercise
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
        setBreathingCount(prev => prev + 1);
      }, 4000); // 4 seconds inhale, 4 seconds exhale
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const startActivity = (activityId: string) => {
    setActiveActivity(activityId);
    
    const activityMessages = {
      breathing: "I'd like to try the 4-7-8 breathing exercise to calm my mind.",
      grounding: "Can you guide me through the 5-4-3-2-1 grounding technique?",
      journaling: "I want to explore my feelings through writing. Can you help?",
      comfort: "I need some self-compassion practices right now.",
      release: "I need healthy ways to release this anger I'm feeling.",
      perspective: "Can you help me see this situation differently?",
      gratitude: "I want to practice gratitude and amplify this good feeling.",
      sharing: "I'd like to share this joy I'm experiencing.",
      energy: "I'm feeling drained. Can you help me assess what I need?",
      rest: "I need guidance on how to truly rest and restore.",
      checkin: "Let's do a deeper check-in about how I'm really feeling.",
      explore: "I want to explore and understand my current emotional state."
    };

    onSendMessage?.(activityMessages[activityId as keyof typeof activityMessages] || "I'd like to try this activity.");
  };

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathingCount(0);
      setBreathingPhase('inhale');
    }
  };

  const quickResponses = getQuickResponses(currentEmotion);
  const guidedActivities = getGuidedActivities(currentEmotion);

  return (
    <div className="space-y-4 p-4 border-t border-border/30 bg-gradient-to-b from-transparent to-muted/20">
      {/* Current Emotion Indicator */}
      {currentEmotion !== 'neutral' && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            Current mood: {currentEmotion}
          </Badge>
        </div>
      )}

      {/* Quick Breathing Exercise */}
      {currentEmotion === 'anxious' && (
        <Card className="p-4 bg-gradient-healing/10 border-healing/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Quick Calm</h4>
            <Button
              onClick={toggleBreathing}
              variant="healing"
              size="sm"
              className="h-8"
            >
              {isBreathing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isBreathing ? 'Pause' : 'Breathe'}
            </Button>
          </div>
          
          {isBreathing && (
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-healing flex items-center justify-center transition-all duration-4000 ${
                breathingPhase === 'inhale' ? 'scale-110' : 'scale-90'
              }`}>
                <Wind className="w-6 h-6 text-healing-foreground" />
              </div>
              <p className="text-sm text-foreground capitalize font-medium">
                {breathingPhase}
              </p>
              <p className="text-xs text-muted-foreground">
                Breath {Math.floor(breathingCount / 2) + 1}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Quick Response Buttons */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Quick Responses</h4>
        <div className="grid gap-2">
          {quickResponses.map((response, index) => (
            <Button
              key={index}
              onClick={() => onSendMessage?.(response)}
              variant="outline"
              size="sm"
              className="text-left justify-start h-auto py-2 px-3 bg-card/50 hover:bg-primary/10 border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-xs text-foreground/80 leading-relaxed">
                "{response}"
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Guided Activities */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Guided Activities</h4>
        <div className="grid gap-2">
          {guidedActivities.map((activity) => (
            <Button
              key={activity.id}
              onClick={() => startActivity(activity.id)}
              variant="ghost"
              size="sm"
              className="text-left justify-start h-auto p-3 bg-card/30 hover:bg-accent/50 border border-border/30 hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-aurora flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <activity.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <Card className="p-3 bg-gradient-aurora/10 border-primary/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-medium">AI Insight:</span> I notice you're feeling {currentEmotion}. 
            {currentEmotion === 'anxious' && " Taking slow, deep breaths can help activate your calm response."}
            {currentEmotion === 'sad' && " It's okay to sit with these feelings. You're not alone."}
            {currentEmotion === 'happy' && " Savoring this moment can help amplify your joy."}
            {currentEmotion === 'angry' && " Your feelings are valid. Let's find healthy ways to express them."}
            {currentEmotion === 'grateful' && " Gratitude is a powerful emotion that can lift your spirits even more."}
            {currentEmotion === 'tired' && " Rest isn't just about sleep - it's about honoring your needs."}
            {currentEmotion === 'neutral' && " Sometimes neutral moments are perfect for gentle self-exploration."}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIInteractiveSection;