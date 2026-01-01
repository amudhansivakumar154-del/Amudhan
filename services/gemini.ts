
import { GoogleGenAI, Type } from "@google/genai";
import { TestResult, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIImprovementPlan = async (result: TestResult, questions: Question[]) => {
  try {
    const prompt = `
      Analyze this student's test performance:
      - Score: ${result.score}/${result.maxScore}
      - Subject Breakdown: ${JSON.stringify(result.subjectBreakdown)}
      
      The student answered the following subjects: ${Object.keys(result.subjectBreakdown).join(', ')}.
      
      Provide a personalized improvement plan in JSON format with:
      1. Overall assessment
      2. Specific topics to focus on
      3. A 7-day study schedule
      4. Recommendations for resources.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            focusTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            studySchedule: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: {
                  day: { type: Type.STRING },
                  task: { type: Type.STRING }
                },
                required: ["day", "task"]
              } 
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallAssessment", "focusTopics", "studySchedule", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
