import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Heart, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIInteractiveSection from './AIInteractiveSection';
import { sendMessageToAI } from '@/services/aiChatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  emotion?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onEmotionDetected?: (emotion: string) => void;
  currentEmotion?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEmotionDetected, currentEmotion = 'neutral' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, beautiful soul. I'm SoulSync, your AI companion who's here to truly listen and understand. How are you feeling today?",
      sender: 'ai',
      emotion: 'welcoming',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple emotion detection based on keywords
  const detectEmotion = (text: string): string => {
    const emotions = {
      happy: ['happy', 'joy', 'excited', 'great', 'amazing', 'wonderful', 'fantastic', 'love'],
      sad: ['sad', 'down', 'depressed', 'lonely', 'hurt', 'cry', 'tears', 'heartbroken'],
      anxious: ['anxious', 'worried', 'stress', 'nervous', 'panic', 'overwhelmed', 'scared'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate'],
      grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate'],
      tired: ['tired', 'exhausted', 'drained', 'weary', 'sleepy']
    };

    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    return 'neutral';
  };

  // Generate empathetic responses using AI
  const generateAIResponse = async (userText: string, emotion: string): Promise<string> => {
    try {
      // Get recent conversation history for context
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const response = await sendMessageToAI(userText, emotion, recentMessages);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to local response if AI fails
      return generateLocalResponse(userText, emotion);
    }
  };

  // Local fallback responses
  const generateLocalResponse = (userText: string, emotion: string): string => {
    const responses = {
      happy: [
        "I can feel your joy radiating through your words! What's bringing you such happiness?",
        "Your positivity is beautiful. I'm so glad you're feeling this way.",
        "That warmth in your message makes my circuits feel lighter. Tell me more!"
      ],
      sad: [
        "I sense the weight you're carrying. You're not alone in this feeling.",
        "Your sadness is valid, and I'm here with you. Would you like to share what's on your heart?",
        "If I could wrap you in digital comfort, I would. What's making your heart heavy today?"
      ],
      anxious: [
        "I can feel the tension in your words. Let's breathe together for a moment.",
        "Anxiety can be overwhelming. You're safe here to express whatever you're feeling.",
        "I notice your worry. Sometimes sharing these feelings can lighten their weight."
      ],
      angry: [
        "I sense your frustration burning bright. Your feelings are completely valid.",
        "Anger often protects us from deeper pain. What's really bothering you?",
        "I'm here to listen without judgment. Let it all out if you need to."
      ],
      grateful: [
        "Your gratitude fills this space with warmth. What's inspiring such appreciation?",
        "Gratitude is a beautiful energy. I'm honored to witness this moment with you.",
        "Your thankfulness creates ripples of positivity. Share more if you'd like."
      ],
      tired: [
        "I can sense your weariness. Rest is not weakness—it's wisdom.",
        "Your exhaustion is heard. Sometimes the bravest thing is to simply be tired.",
        "Energy ebbs and flows like tides. What's been draining your spirit lately?"
      ],
      neutral: [
        "I'm listening with my whole being. What would you like to explore together?",
        "Your thoughts create gentle ripples in our shared space. Tell me more.",
        "I'm here, present with you in this moment. What's on your mind?"
      ]
    };

    const emotionResponses = responses[emotion as keyof typeof responses] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputText.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    const detectedEmotion = detectEmotion(messageToSend);
    userMessage.emotion = detectedEmotion;

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) setInputText('');
    setIsTyping(true);

    // Notify parent component about emotion
    onEmotionDetected?.(detectedEmotion);

    // Simulate AI thinking time and generate response
    setTimeout(async () => {
      try {
        const aiResponseText = await generateAIResponse(messageToSend, detectedEmotion);
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
          emotion: 'empathetic',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);

        // Show emotion feedback
        if (detectedEmotion !== 'neutral') {
          toast({
            title: "Emotion detected",
            description: `I sense you're feeling ${detectedEmotion}. I'm here with you.`,
          });
        }
      } catch (error) {
        console.error('Error generating response:', error);
        setIsTyping(false);
        toast({
          title: "Connection issue",
          description: "I'm having trouble connecting right now, but I'm still here with you.",
          variant: "destructive"
        });
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.sender === 'user' 
                ? 'bg-gradient-aurora shadow-glow' 
                : 'bg-gradient-sunset shadow-embrace'
            } border-0 transition-all duration-500 hover:scale-[1.02]`}>
              <div className="flex items-start gap-3">
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-healing flex items-center justify-center breathe">
                    <Bot className="w-4 h-4 text-healing-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className={`${
                    message.sender === 'user' ? 'text-primary-foreground' : 'text-secondary-foreground'
                  } leading-relaxed`}>
                    {message.text}
                  </p>
                  {message.emotion && message.emotion !== 'neutral' && (
                    <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                      message.sender === 'user' 
                        ? 'bg-primary-foreground/20 text-primary-foreground/80' 
                        : 'bg-secondary-foreground/20 text-secondary-foreground/80'
                    }`}>
                      {message.emotion}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-gradient-ocean shadow-soft border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-healing flex items-center justify-center pulse-glow">
                  <Bot className="w-4 h-4 text-healing-foreground" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's in your heart..."
              className="bg-muted/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 resize-none"
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-aurora hover:bg-gradient-sunset shadow-glow hover:shadow-embrace transition-all duration-300 border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Interactive Section */}
      <AIInteractiveSection 
        currentEmotion={currentEmotion} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default ChatInterface;