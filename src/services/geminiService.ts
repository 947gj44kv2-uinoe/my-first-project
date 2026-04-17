import { GoogleGenAI, Type } from "@google/genai";
import { Recommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getElectronicRecommendations(mood: string): Promise<Recommendation[]> {
  const prompt = `As an expert electronic music curator, recommend 3 real or fictional electronic music artists/projects that fit a "${mood}" mood. Provide a brief evocative description and 2-3 style tags for each. Respond in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              artist: { type: Type.STRING },
              description: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["artist", "description", "tags"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      {
        artist: "Digital Echo",
        description: "A blend of ethereal pads and rhythmic pulses, perfect for late night focus.",
        tags: ["Atmospheric", "Deep House"]
      },
      {
        artist: "Kinetic Soul",
        description: "Energetic basslines combined with classic analog synthesis.",
        tags: ["Techno", "Acid"]
      }
    ];
  }
}
