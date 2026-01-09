import { getHuggingFaceKey } from '../services/aiConfig.js';

export default async function handler(req, res) {
    // Allow simple CORS for this demo
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { model, inputs } = req.body;
    if (!model || !inputs) {
        return res.status(400).json({ error: 'Missing model or inputs' });
    }

    // Use environment variable for the key
    const HF_KEY = process.env.HF_API_KEY;

    try {
        console.log(`Proxying request to HF model: ${model}`);
        const response = await fetch(
            `https://router.huggingface.co/models/${model}`,
            {
                headers: {
                    Authorization: `Bearer ${HF_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(inputs),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HF Error ${response.status}: ${errorText}`);
            return res.status(response.status).json({ error: errorText });
        }

        // Proxy the binary content back
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
        res.send(buffer);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: error.message });
    }
}
