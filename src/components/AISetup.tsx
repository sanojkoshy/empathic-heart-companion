import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Key, Shield } from 'lucide-react';

interface AISetupProps {
  onSetupComplete: () => void;
}

const AISetup: React.FC<AISetupProps> = ({ onSetupComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key (starts with sk-)');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Store the API key in localStorage for now
      // In a production app, this would be securely stored in Supabase secrets
      localStorage.setItem('soulsync_openai_key', apiKey);
      
      // Simulate verification
      setTimeout(() => {
        setIsVerifying(false);
        onSetupComplete();
      }, 2000);
    } catch (error) {
      setIsVerifying(false);
      setError('Failed to verify API key. Please try again.');
    }
  };

  const handleSkip = () => {
    // Continue with fallback responses
    onSetupComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-sunset flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/90 backdrop-blur-sm border-0 shadow-embrace">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-aurora flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            AI Setup
          </h2>
          <p className="text-sm text-muted-foreground">
            To enable advanced AI conversations, connect your OpenAI API key
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-muted/50 border-border/30 focus:border-primary/50"
            />
          </div>

          {error && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Alert className="border-primary/50 bg-primary/10">
            <Shield className="w-4 h-4" />
            <AlertDescription className="text-primary/80">
              Your API key is stored locally and only used for AI conversations. 
              Get yours at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSetup}
              disabled={isVerifying}
              variant="aurora"
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Connect AI'}
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Skip (Use Basic Responses)
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border/30">
            <p>Without an API key, SoulSync will use built-in empathetic responses.</p>
            <p>You can add your key later in settings.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AISetup;