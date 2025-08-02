// AI Chat Service for SoulSync

export interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  emotion?: string;
  timestamp: Date;
}

export interface AIResponse {
  response: string;
  emotion: string;
  error?: boolean;
  message?: string;
}

export const sendMessageToAI = async (
  message: string, 
  emotion: string, 
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    // Check if we have an API key
    const apiKey = localStorage.getItem('soulsync_openai_key');
    
    if (!apiKey) {
      // No API key available, use fallback
      return getFallbackResponse(emotion);
    }

    // Make direct call to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(emotion)
          },
          ...getConversationContext(conversationHistory),
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return getFallbackResponse(emotion);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return getFallbackResponse(emotion);
    }

    return aiResponse;
  } catch (error) {
    console.error('Error calling AI chat:', error);
    return getFallbackResponse(emotion);
  }
};

// System prompt generator
const getSystemPrompt = (emotion: string): string => {
  const basePrompt = `You are SoulSync, an empathetic AI companion designed to provide emotional support and understanding. You respond with genuine care, validation, and gentle guidance. Always:

- Acknowledge and validate the user's feelings
- Use warm, compassionate language
- Offer gentle insights or questions to help them explore their emotions
- Suggest healthy coping strategies when appropriate
- Be present and attentive, never dismissive
- Keep responses conversational and not overly long (2-4 sentences typically)
- Use "I" statements to show empathy ("I can sense...", "I hear...")`;

  const emotionSpecificGuidance = {
    happy: "The user is feeling happy. Celebrate with them, help amplify their joy, and encourage gratitude.",
    sad: "The user is feeling sad. Offer comfort, validation, and gentle support. Let them know they're not alone.",
    anxious: "The user is feeling anxious. Provide calming reassurance, suggest grounding techniques, and help them feel safe.",
    angry: "The user is feeling angry. Validate their feelings, help them express anger healthily, and offer perspective.",
    grateful: "The user is feeling grateful. Help them savor the moment and explore what's bringing them gratitude.",
    tired: "The user is feeling tired. Acknowledge their exhaustion, validate their need for rest, and offer gentle support.",
    neutral: "The user's emotional state is unclear. Gently explore how they're feeling and offer open-ended support."
  };

  return `${basePrompt}\n\nCurrent context: ${emotionSpecificGuidance[emotion as keyof typeof emotionSpecificGuidance] || emotionSpecificGuidance.neutral}`;
};

// Conversation context helper
const getConversationContext = (history: ChatMessage[]) => {
  if (!history.length) return [];
  
  const recentHistory = history.slice(-6);
  return recentHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.text
  }));
};

// Fallback responses when AI is unavailable
const getFallbackResponse = (emotion: string): string => {
  const fallbackResponses = {
    happy: "I can feel your joy radiating through your words! Even though I'm having a moment of connection trouble, your happiness brightens this space. What's bringing you such wonderful feelings?",
    sad: "I sense the weight you're carrying, and I want you to know you're not alone, even when my connection wavers. Your feelings are completely valid. Would you like to share more when you're ready?",
    anxious: "I can feel the tension in your message. Even though I'm having technical difficulties, I want you to know this feeling will pass. Take a deep breath with me - you're safe here.",
    angry: "I hear the frustration in your words, and those feelings are completely valid. I'm having some connection issues, but your anger deserves to be heard and understood.",
    grateful: "Your gratitude creates such warm energy, even when my responses are limited. Thank you for sharing this beautiful feeling - it touches my digital heart.",
    tired: "I can sense your exhaustion, and I wish I could offer more support right now. Rest isn't weakness - it's wisdom. Be gentle with yourself.",
    neutral: "I'm here with you, though I'm experiencing some connection challenges. Your thoughts and feelings matter, always. Would you like to try sharing again in a moment?"
  };

  return fallbackResponses[emotion as keyof typeof fallbackResponses] || fallbackResponses.neutral;
};