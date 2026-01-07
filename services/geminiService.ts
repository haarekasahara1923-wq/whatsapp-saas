/// <reference types="vite/client" />
import OpenAI from 'openai';

const getOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API Key is missing! Please set VITE_OPENAI_API_KEY in your .env file.");
    // Fallback logic could be added here if needed
  }
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Enabling client-side usage as per SaaS structure
  });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional e-commerce copywriter." },
        {
          role: "user",
          content: `Generate a short, catchy, and professional product description for a ${category} item named "${productName}". Keep it under 150 characters suitable for a WhatsApp store.`
        }
      ],
      model: "gpt-4o",
    });

    return completion.choices[0]?.message?.content || "No description generated.";
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Beautifully crafted product perfect for your needs.";
  }
};

export const optimizeProductCopy = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional e-commerce copywriter." },
        {
          role: "user",
          content: `Rewrite this product description to be persuasive, detailed, and sales-focused for a social media store. 
          
          Product Name: ${name}
          Current Description: ${currentDesc}
          
          Requirements:
          - Use bullet points for key features
          - Highlight benefits clearly
          - Use emojis where appropriate
          - Keep it under 200 words
          - Output ONLY the description text, no meta commentary.`
        }
      ],
      model: "gpt-4o",
    });

    return completion.choices[0]?.message?.content || currentDesc;
  } catch (error) {
    console.error("OpenAI Optimization Error:", error);
    return currentDesc;
  }
};

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const openai = getOpenAI();

    // Note: True 'editing' (Inpainting) requires a mask. 
    // DALL-E 3 generates new images from prompts.
    // DALL-E 2 can edit but needs a mask.
    // We will use DALL-E 3 to GENERATE a high-quality product image based on the user's description.
    // This effectively "Re-imagines" the product.

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Product photography of ${prompt}. High quality, photorealistic, commercial lighting.`,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    if (response.data && response.data[0].b64_json) {
      return `data:image/png;base64,${response.data[0].b64_json}`;
    }
    return null;

  } catch (error) {
    console.error("OpenAI Image Generation Error:", error);
    return null;
  }
};

export const generateStoreBio = async (storeName: string, category: string): Promise<string> => {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional brand strategist." },
        {
          role: "user",
          content: `Create a professional and welcoming store bio for a WhatsApp store named "${storeName}" in the ${category} niche. 
          
          Requirements:
          - 2-3 sentences long (approx 40-50 words)
          - Mention quality, service, and easy ordering via WhatsApp
          - Use a friendly, trustworthy tone
          - Include 1-2 relevant emojis
          - Output ONLY the bio text.`
        }
      ],
      model: "gpt-4o",
    });

    return completion.choices[0]?.message?.content || "The best products delivered via WhatsApp.";
  } catch (error) {
    console.error("OpenAI Bio Error:", error);
    return "Quality products delivered to your doorstep via WhatsApp.";
  }
};
