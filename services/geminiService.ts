import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiKey, getHuggingFaceKey } from './aiConfig';

// --- Text Generation (Gemini) ---

const getGeminiModel = () => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY in Vercel/Env variables.");

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using 'gemini-2.0-flash' as it is the available model for this key
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// Helper to handle Rate Limits (429) automatically
const generateWithRetry = async (model: any, prompt: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 429) {
        if (i === retries - 1) throw error; // Re-throw if last retry failed
        const waitTime = 2000 * Math.pow(2, i); // 2s, 4s, 8s
        console.warn(`Gemini Rate Limit hit. Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw error; // Throw other errors immediately
      }
    }
  }
  return "";
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const model = getGeminiModel();
    const prompt = `You are a professional e-commerce copywriter. Write a compelling, detailed, and sales-oriented product description for a ${category} item named "${productName}". 
    
    Requirements:
    - Write about 100-150 words.
    - Highlight potential benefits and features.
    - Use a professional yet persuasive tone.
    - Make it ready for a WhatsApp store listing.`;

    return await generateWithRetry(model, prompt);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes('429')) {
      alert("AI is busy (Rate Limit). Please wait 30 seconds and try again.");
    } else {
      alert(`AI Error: ${error.message || "Something went wrong"}`);
    }
    return "Error generating description. Please check your API key.";
  }
};

export const optimizeProductCopy = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const model = getGeminiModel();
    const prompt = `Rewrite this product description to be highly persuasive, detailed, and sales-focused for a WhatsApp store.
    
    Product Name: ${name}
    Current Description: ${currentDesc}
    
    Requirements:
    - Expand to at least 150-200 words.
    - Use bullet points for key features.
    - Clearly highlight benefits (Why buy this?).
    - Use attractive emojis.
    - Include a strong Call to Action (e.g., "Order now on WhatsApp").
    - Output ONLY the description text.`;

    return await generateWithRetry(model, prompt);
  } catch (error: any) {
    console.error("Gemini Optimization Error:", error);
    alert(`AI Enhancement Failed: ${error.message}`);
    return currentDesc;
  }
};

export const generateStoreBio = async (storeName: string, category: string): Promise<string> => {
  try {
    const model = getGeminiModel();
    const prompt = `Write a comprehensive and engaging 'About Us' / Store Bio for a WhatsApp store named "${storeName}" in the ${category} niche.
    
    Requirements:
    - Length: Approximately 200 words.
    - Tone: Professional, warm, and trustworthy.
    - Content:
      * Introduce the store's mission and passion for ${category}.
      * Emphasize the quality of products and customer service.
      * Explain the convenience of ordering directly via WhatsApp.
      * Build trust and encourage users to browse the catalog.
    - Formatting: Use paragraphs for readability. Use emojis sparingly but effectively.`;

    return await generateWithRetry(model, prompt);
  } catch (error: any) {
    console.error("Gemini Bio Error:", error);
    alert(`AI Bio Failed: ${error.message}`);
    return "Welcome to our store! We offer the best products and service. Order now on WhatsApp.";
  }
};

// --- Image Editing & Video (Pollinations.ai / Fallback) ---

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    // Switching to Pollinations.ai for reliable, free, key-less generation.
    // It's a "Re-imagine" workflow: We generate a new image based on the prompt.
    // Since we can't easily upload the base64 to Pollinations as a reference (it requires public URL),
    // we will rely on the text prompt to generate a high-quality "edited" version.

    // Encode prompt
    const encodedPrompt = encodeURIComponent(prompt + " product photography, high quality, 4k");

    // Pollinations URL (Direct, no proxy needed usually, supports CORS)
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&private=true&enhance=true`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Pollinations API Error");

    const blob = await response.blob();

    // Convert blob to base64 using FileReader (Browser compatible)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error: any) {
    console.error("Pollinations Error:", error);
    alert(error.message || "Failed to generate image.");
    return null;
  }
};

export const generateProductVideo = async (): Promise<string | null> => {
  // Video APIs on free tiers are currently extremely unstable (HF deprecations).
  // Reporting maintenance to user is better than crashing.
  alert("🚧 Service Update: Free Video Generation is currently under maintenance by the provider. Please try again later. Image features are fully operational! 📸");
  return null;
};
