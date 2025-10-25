const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export async function generateAIText(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file or environment.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
  });

  if (!response.ok) {
    throw new Error(`AI generation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function generateAIImage(prompt: string, options?: { model?: string; quality?: string }): Promise<HTMLImageElement> {
  // Check if puter is available on the window object
  if (!window.puter?.ai) {
    throw new Error("Puter.js is not available. Make sure the Puter.js script is loaded.");
  }

  // Use Puter.js for image generation
  return new Promise((resolve, reject) => {
    try {
      // If options are provided, use them; otherwise use default settings
      const imageOptions = options ? { model: options.model, quality: options.quality } : {};
      
      // Generate image using Puter.js
      window.puter.ai.txt2img(prompt, imageOptions)
        .then((imageElement: HTMLImageElement) => {
          resolve(imageElement);
        })
        .catch((error: Error) => {
          reject(new Error(`Image generation failed: ${error.message}`));
        });
    } catch (error) {
      reject(new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

// Helper function to convert image URL to ArrayBuffer for hashing
export async function getImageDataFromUrl(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return response.arrayBuffer();
}