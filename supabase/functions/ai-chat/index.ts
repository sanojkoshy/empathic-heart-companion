import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, emotion, conversationHistory } = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create empathetic system prompt based on emotion
    const getSystemPrompt = (emotion: string) => {
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

    // Prepare conversation context
    const messages = [
      {
        role: "system",
        content: getSystemPrompt(emotion)
      }
    ];

    // Add conversation history (last 6 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach((msg: any) => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response generated from AI');
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        emotion: emotion,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    
    // Fallback empathetic response
    const fallbackResponse = "I'm here with you, though I'm having trouble connecting right now. Your feelings are valid and important. Would you like to try sharing again in a moment?";
    
    return new Response(
      JSON.stringify({
        response: fallbackResponse,
        error: true,
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to avoid breaking the UI
      }
    );
  }
});