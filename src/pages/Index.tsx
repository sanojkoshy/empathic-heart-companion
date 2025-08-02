import React, { useState } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'chat'>('welcome');
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
  };

  if (currentView === 'welcome') {
    return <WelcomeSection onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-sunset">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleBackToWelcome}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Welcome
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-aurora bg-clip-text text-transparent">
                SoulSync
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Chat Interface - Takes up more space */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-card/50 backdrop-blur-sm border-0 shadow-embrace overflow-hidden">
              <ChatInterface 
                onEmotionDetected={handleEmotionDetected} 
                currentEmotion={currentEmotion} 
              />
            </Card>
          </div>

          {/* Sidebar - Mood Tracker */}
          <div className="space-y-6">
            <MoodTracker currentEmotion={currentEmotion} />
            
            {/* Daily Affirmation */}
            <Card className="p-6 bg-gradient-healing shadow-glow border-0">
              <h3 className="text-lg font-semibold text-healing-foreground mb-3 text-center">
                Today's Affirmation
              </h3>
              <p className="text-sm text-healing-foreground/90 text-center italic leading-relaxed">
                "Your feelings are valid, your thoughts matter, and you are worthy of love and understanding."
              </p>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 bg-card/30 backdrop-blur-sm border-0 shadow-soft">
              <h4 className="text-sm font-semibold text-card-foreground mb-3">
                How are you feeling?
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['grateful', 'happy', 'sad', 'anxious'].map((mood) => (
                  <Button
                    key={mood}
                    variant="outline"
                    size="sm"
                    className="text-xs capitalize bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => handleEmotionDetected(mood)}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
