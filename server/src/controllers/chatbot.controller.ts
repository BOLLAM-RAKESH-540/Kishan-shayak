import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Graceful fallback system for missing keys
const FALLBACK_RESPONSE = `🤖 Namaste! I am the Kisan Sahayak local assistant. 
I noticed the system administrator hasn't configured the \`GEMINI_API_KEY\` yet, so I'm running in offline mode.

Here is what I know about some crops:
🌾 **Paddy (Rice):** 120–150 days. Needs standing water during tillering. MSP: ₹2,183/q.
🧶 **Cotton:** 150–180 days. Avoid waterlogging. MSP: ₹7,121/q.
🌶️ **Chilli:** Irrigate weekly avoiding wet leaves. Spray neem oil.

Please contact your admin to enable my AI capabilities!`;

export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!genAI) {
      // Simulate delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ reply: FALLBACK_RESPONSE });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a strict farming persona
    const prompt = `You are "Kisan Sahayak", an AI assistant built specifically for Indian farmers. 
    You must always respond in English (or simple Hinglish if requested).
    Always be polite, start your first message with "Namaste!".
    Limit your responses to 3-4 concise bullet points or short paragraphs. 
    Do NOT offer advice on topics outside of agriculture, farming, crops, weather, market prices, and govt schemes.
    
    Farmer asks: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const replyText = response.text();

    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ 
      error: "AI service is currently down.",
      details: error.message 
    });
  }
};
