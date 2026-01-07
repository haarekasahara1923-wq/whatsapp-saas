/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

// Standard initialization
// Standard initialization
const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing! Please set VITE_GEMINI_API_KEY in your .env file.");
    alert("API Key missing. AI features will not work.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: any = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate a short, catchy, and professional product description for a ${category} item named "${productName}". Keep it under 150 characters suitable for a WhatsApp store.` }]
        }
      ],
    });

    // Using explicit any cast to handle the response safely across SDK versions
    if (typeof response.text === 'function') {
      return response.text();
    }
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautifully crafted product perfect for your needs.";
  }
};

export const optimizeProductCopy = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: any = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{
            text: `You are a professional e-commerce copywriter. Rewrite this product description to be persuasive, detailed, and sales-focused for a social media store. 
          
          Product Name: ${name}
          Current Description: ${currentDesc}
          
          Requirements:
          - Use bullet points for key features
          - Highlight benefits clearly
          - Use emojis where appropriate
          - Keep it under 200 words
          - Output ONLY the description text, no meta commentary.` }]
        }
      ],
    });

    if (typeof response.text === 'function') {
      return response.text();
    }
    return response.text || currentDesc;
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return currentDesc;
  }
};

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    // Note: Image editing might require a specific model or API capability not fully standard in basic 1.5 flash yet broadly. 
    // Ensuring we try a multimodal capable model.
    const ai = getAI();

    console.warn("Gemini API (standard) does not support direct image editing generation via this SDK method usually. Returning null.");
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

export const generateStoreBio = async (storeName: string, category: string): Promise<string> => {
  try {
    const ai = getAI();
    const response: any = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{
            text: `Create a professional and welcoming store bio for a WhatsApp store named "${storeName}" in the ${category} niche. 
          
          Requirements:
          - 2-3 sentences long (approx 40-50 words)
          - Mention quality, service, and easy ordering via WhatsApp
          - Use a friendly, trustworthy tone
          - Include 1-2 relevant emojis` }]
        }
      ],
    });
    if (typeof response.text === 'function') {
      return response.text();
    }
    return response.text || "The best products delivered via WhatsApp.";
  } catch (error) {
    console.error("Gemini Bio Error:", error);
    return "Quality products delivered to your doorstep via WhatsApp.";
  }
};
