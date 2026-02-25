import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

export const geminiModel = "gemini-3.1-pro-preview";

export async function generateSocialCaption(videoTitle: string, videoDescription: string, platform: string) {
  const response = await genAI.models.generateContent({
    model: geminiModel,
    contents: `Generate a short, engaging caption for ${platform} based on this YouTube video:
    Title: ${videoTitle}
    Description: ${videoDescription}
    
    Make it optimized for ${platform} (hashtags, tone, length).`,
  });
  return response.text;
}
