// --- Text Generation (Pollinations.ai - Free, No Key) ---

const generateText = async (prompt: string): Promise<string> => {
  try {
    // We append a strict system-level instruction to the prompt to force plain text.
    const strictPrompt = `${prompt}\n\n[SYSTEM INSTRUCTION: Your goal is to write sales copy. Output ONLY the final sales copy in plain text. Do NOT output a JSON object. Do NOT output reasoning or thoughts. Do NOT begin with 'Here is'. Just the text.]`;

    const seed = Math.floor(Math.random() * 1000000);

    // Using 'openai' model often gives better followed instructions
    const url = `https://text.pollinations.ai/${encodeURIComponent(strictPrompt)}?seed=${seed}&model=openai`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    let text = await response.text();
    text = text.trim();

    // Check if output is accidentally wrapped in JSON (common with some models despite instructions)
    try {
      if (text.startsWith('{') || text.startsWith('```json')) {
        // Attempt to parse if it's JSON
        const cleanJson = text.replace(/```json|```/g, '');
        const parsed = JSON.parse(cleanJson);
        // If it has a 'description' or 'content' field, use that. Otherwise, try to extract string values.
        if (parsed.description) return parsed.description;
        if (parsed.content) return parsed.content;
      }
    } catch (e) {
      // Not JSON, just continue
    }

    // Cleanup known artifacts
    text = text.replace(/^Here is (the|a) [a-zA-Z ]+[:,\.]/i, '').trim();
    // Remove reasoning block if it appears in text (e.g. {"role":"assistant" ... })
    text = text.replace(/{"role":"assistant".*?}/s, '').trim();

    return text;

  } catch (error: any) {
    console.error("AI Text Gen Error:", error);
    throw error;
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const prompt = `Write a professional, compelling, and sales-oriented product description for a ${category} item named "${productName}".
    Requirements:
    - Write about 100 words.
    - Highlight potential benefits and features.
    - Use a simple, catchy business tone.
    - Make it ready for a WhatsApp store listing.
    - IMPORTANT: Output ONLY the raw description text. Do NOT output JSON. Do NOT output reasoning or thoughts. Do NOT include intro/outro.`;

    const text = await generateText(prompt);
    return text || "Error generating description. Please try again.";
  } catch (error: any) {
    console.error("Gen Desc Error:", error);
    return "Could not generate description at this time. Please try again later.";
  }
};

export const optimizeProductCopy = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const prompt = `Rewrite this product description to be highly persuasive and sales-focused for a WhatsApp store.
    Product: ${name}
    Current Description: ${currentDesc}
    
    Requirements:
    - Target 150 words.
    - Use bullet points for features.
    - Highlight benefits clearly.
    - Use attractive emojis.
    - Add a Call to Action "Order now on WhatsApp".
    - IMPORTANT: Output ONLY the raw description text. Do NOT output JSON. Do NOT output "Here is the description". Do NOT output reasoning.`;

    const text = await generateText(prompt);
    return text || currentDesc;
  } catch (error: any) {
    console.error("Optimize Error:", error);
    alert("AI Optimization failed. Keeping original text.");
    return currentDesc;
  }
};

export const generateStoreBio = async (storeName: string, category: string): Promise<string> => {
  try {
    const prompt = `Write a comprehensive 'About Us' / Store Bio for a WhatsApp store named "${storeName}" in the ${category} niche.
    Requirements:
    - Length: ~200 words.
    - Tone: Professional, warm, trustworthy.
    - Content: Introduce store mission, emphasize quality, explain WhatsApp ordering convenience.
    - Output ONLY the bio text.`;

    const text = await generateText(prompt);
    return text || "Welcome to our store! We offer the best quality products directly on WhatsApp.";
  } catch (error: any) {
    console.error("Bio Gen Error:", error);
    alert("AI Bio generation failed.");
    return "Welcome to our store! We offer the best quality products directly on WhatsApp.";
  }
};

// --- Image Editing & Video (Pollinations.ai) ---

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    // Pollinations for Image Gen
    const encodedPrompt = encodeURIComponent(prompt + " product photography, high quality, 4k");
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&private=true&enhance=true`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Pollinations API Error");

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error: any) {
    console.error("Pollinations Image Error:", error);
    alert(error.message || "Failed to generate image.");
    return null;
  }
};

export const generateProductVideo = async (): Promise<string | null> => {
  // Video is currently unstable on free tiers.
  alert("🚧 Service Update: Video Generation is currently under maintenance. Image & Text AI are fully operational! 📸");
  return null;
};
