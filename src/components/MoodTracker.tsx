import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Smile, Frown, Zap, Moon, Sun } from 'lucide-react';

interface MoodEntry {
  emotion: string;
  count: number;
  lastUpdated: Date;
}

interface MoodTrackerProps {
  currentEmotion?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ currentEmotion }) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    { emotion: 'happy', count: 0, lastUpdated: new Date() },
    { emotion: 'sad', count: 0, lastUpdated: new Date() },
    { emotion: 'anxious', count: 0, lastUpdated: new Date() },
    { emotion: 'grateful', count: 0, lastUpdated: new Date() },
    { emotion: 'angry', count: 0, lastUpdated: new Date() },
    { emotion: 'tired', count: 0, lastUpdated: new Date() },
  ]);

  const emotionIcons = {
    happy: { icon: Smile, color: 'text-healing', bg: 'bg-gradient-healing' },
    sad: { icon: Frown, color: 'text-accent', bg: 'bg-gradient-ocean' },
    anxious: { icon: Zap, color: 'text-comfort', bg: 'bg-gradient-sunset' },
    grateful: { icon: Heart, color: 'text-primary', bg: 'bg-gradient-aurora' },
    angry: { icon: Sun, color: 'text-destructive', bg: 'bg-destructive' },
    tired: { icon: Moon, color: 'text-muted-foreground', bg: 'bg-muted' },
  };

  useEffect(() => {
    if (currentEmotion && currentEmotion !== 'neutral') {
      setMoodHistory(prev => 
        prev.map(entry => 
          entry.emotion === currentEmotion 
            ? { ...entry, count: entry.count + 1, lastUpdated: new Date() }
            : entry
        )
      );
    }
  }, [currentEmotion]);

  const totalEmotions = moodHistory.reduce((sum, entry) => sum + entry.count, 0);

  const getDominantEmotion = () => {
    if (totalEmotions === 0) return null;
    return moodHistory.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  };

  const dominantEmotion = getDominantEmotion();

  return (
    <Card className="p-6 bg-gradient-sunset shadow-embrace border-0">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-secondary-foreground mb-2">
            Your Emotional Journey
          </h3>
          <p className="text-sm text-secondary-foreground/70">
            {totalEmotions === 0 
              ? "Start sharing to see your emotional patterns"
              : `${totalEmotions} emotions shared today`
            }
          </p>
        </div>

        {dominantEmotion && dominantEmotion.count > 0 && (
          <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              {React.createElement(emotionIcons[dominantEmotion.emotion as keyof typeof emotionIcons].icon, {
                className: `w-6 h-6 ${emotionIcons[dominantEmotion.emotion as keyof typeof emotionIcons].color}`
              })}
              <span className="font-medium text-card-foreground capitalize">
                {dominantEmotion.emotion}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your most expressed emotion today
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {moodHistory.map((entry) => {
            const emotionConfig = emotionIcons[entry.emotion as keyof typeof emotionIcons];
            const percentage = totalEmotions > 0 ? (entry.count / totalEmotions) * 100 : 0;
            
            return (
              <div
                key={entry.emotion}
                className="text-center p-3 rounded-lg bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${emotionConfig.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(emotionConfig.icon, {
                    className: `w-5 h-5 ${emotionConfig.color.replace('text-', 'text-white')}`
                  })}
                </div>
                <p className="text-xs font-medium text-card-foreground capitalize mb-1">
                  {entry.emotion}
                </p>
                <div className="text-lg font-bold text-card-foreground mb-1">
                  {entry.count}
                </div>
                <div className="w-full bg-card-foreground/20 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${emotionConfig.bg} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalEmotions > 0 && (
          <div className="text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm">
            <p className="text-sm text-card-foreground/80">
              "Every emotion you share helps me understand you better. 
              You're building a beautiful tapestry of feelings."
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MoodTracker;