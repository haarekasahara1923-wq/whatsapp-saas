export const getGeminiKey = (): string => {
    return localStorage.getItem('gemini_api_key') ||
        import.meta.env.VITE_GEMINI_API_KEY ||
        (process.env as any).GEMINI_API_KEY ||
        "";
};

export const getHuggingFaceKey = (): string => {
    return localStorage.getItem('huggingface_api_key') ||
        import.meta.env.VITE_HF_API_KEY ||
        (process.env as any).HF_API_KEY ||
        "";
};

export const setGeminiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
};

export const setHuggingFaceKey = (key: string) => {
    localStorage.setItem('huggingface_api_key', key);
};

export const isAIConfigured = () => {
    // Always true now since we have default keys
    return true;
}
