import { GoogleGenAI, Type } from "@google/genai";
import type { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully, 
  // but for this context, throwing an error is clear.
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    
    throw new Error("No image was generated. The response was empty.");

  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const getPromptSuggestions = async (currentPrompt: string): Promise<string[]> => {
  if (currentPrompt.trim().length < 3) {
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following partial prompt, generate 3 creative and diverse prompt suggestions for an AI image generator. The suggestions should be complete sentences and build upon the user's idea. The suggestions should be concise, under 20 words each. User's input: "${currentPrompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A creative prompt suggestion."
              },
              description: "A list of 3 prompt suggestions."
            }
          },
          propertyOrdering: ["suggestions"],
        },
        temperature: 0.3,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.slice(0, 3); // Ensure only 3 are returned
    }
    return [];

  } catch (error) {
    console.error("Error getting prompt suggestions:", error);
    // Silently fail as suggestions are not a critical feature
    return [];
  }
};

const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

export const animateImageToVideo = async (
  prompt: string,
  imageDataUrl: string,
): Promise<string> => {
  try {
    const imageBase64 = dataUrlToBase64(imageDataUrl);

    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
      },
    });

    // Poll for the result
    while (!operation.done) {
      // Wait for 10 seconds before checking the status again
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was found.");
    }

    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download the video. Status: ${response.status}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    return videoUrl;

  } catch (error) {
    console.error("Error animating image to video:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to animate image. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while animating the image.");
  }
};
