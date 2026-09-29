/**
 * Cloudflare Worker for Speak2Cart Kitchen Buddy
 * Proxies requests to Gemini API securely.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, restrict to GitHub Pages domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();
      
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      // Format payload for Gemini API
      // We expect the client to send { message, conversationHistory, pantry, language }
      // This is a minimal proxy, so we'll just format a prompt and send it to Gemini
      
      const pantryStr = data.pantry.length > 0 
        ? data.pantry.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(', ') 
        : "Empty";

      const prompt = `You are Kitchen Buddy, a friendly Indian kitchen/food assistant for a smart grocery app called Speak2Cart.
User Language: ${data.language || 'en-US'}
Current Pantry: ${pantryStr}

You are capable of providing recipes, ingredient substitutions, cooking methods, meal ideas, pantry-based suggestions, and answering general food/kitchen questions with a focus on Indian cuisine.

If the user's question is entirely unrelated to food, cooking, or the kitchen, briefly and politely mention that you only help with kitchen queries.

User Question: ${data.message}`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        return new Response(JSON.stringify({ error: `Gemini API Error: ${errorText}` }), { 
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const geminiData = await geminiResponse.json();
      const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

      return new Response(JSON.stringify({
        answer: answer,
        scope: "food",
        normalizedQuestion: data.message,
        usedPantryContext: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};
