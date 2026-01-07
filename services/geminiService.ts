/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

// Standard initialization
// Standard initialization
const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.error("Gemini API Key is missing! Please set VITE_GEMINI_API_KEY in your .env file.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, catchy, and professional product description for a ${category} item named "${productName}". Keep it under 150 characters suitable for a WhatsApp store.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Beautifully crafted product perfect for your needs.";
  }
};

export const optimizeProductCopy = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Improve this product description to be more high-converting and professional for a WhatsApp store. Name: ${name}. Current Description: ${currentDesc}. Focus on benefits and quality.`,
    });
    return response.text || currentDesc;
  } catch (error) {
    return currentDesc;
  }
};

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const data = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: `Edit this product image based on this prompt: ${prompt}. Maintain the original product's features but modify the requested parts/style.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

export const generateStoreBio = async (storeName: string, category: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short 1-sentence tagline for a WhatsApp store named "${storeName}" in the ${category} niche.`,
    });
    return response.text || "The best products delivered via WhatsApp.";
  } catch (error) {
    return "Quality products delivered to your doorstep via WhatsApp.";
  }
};
