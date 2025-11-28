import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    objects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Object class from COCO dataset (e.g., person, bicycle, car, motorcycle, backpack, handbag, knife)." },
          confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
          box_2d: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: "Bounding box coordinates normalized [ymin, xmin, ymax, xmax]"
          }
        },
        required: ["label", "confidence"]
      }
    },
    threatLevel: {
      type: Type.STRING,
      enum: ["DÜŞÜK", "ORTA", "YÜKSEK", "KRİTİK"],
      description: "Calculated security threat level."
    },
    summary: {
      type: Type.STRING,
      description: "Tactical situation report in Turkish."
    }
  },
  required: ["objects", "threatLevel", "summary"]
};

export const analyzeFrame = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Execute YOLOv8 Object Detection and Security Analysis. Identify objects using standard COCO classes. Return bounding boxes. Assess security threat level based on visual context."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are the Project Oracle computer vision engine running a YOLOv8 detection simulation. Prioritize detecting people, weapons, bags, and vehicles. Output strict JSON. Confidence should be realistic (0.4-0.99)."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as Omit<AnalysisResult, 'timestamp'>;
    
    return {
      ...data,
      timestamp: new Date().toLocaleTimeString('tr-TR')
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo purposes
    return {
      objects: [],
      threatLevel: 'DÜŞÜK',
      summary: 'YOLOv8 motoru çevrimdışı.',
      timestamp: new Date().toLocaleTimeString('tr-TR')
    };
  }
};