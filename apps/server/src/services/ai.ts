import { GoogleGenAI } from '@google/genai';
import { AssignmentDocument } from '@paperforge/types';
import * as fs from 'fs';

export const generateAssessment = async (assignment: AssignmentDocument) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `You are an expert academic assessment creator. Create a highly structured, rigorous, and professional exam paper based on the following assignment constraints:
Title: ${assignment.title}
Subject: ${assignment.subject}
Number of Questions: ${assignment.numberOfQuestions}
Question Types: ${assignment.questionTypes.join(', ')}
Marks Distribution: ${assignment.marksDistribution}
Additional Instructions: ${assignment.instructions || 'None'}

You must output valid JSON ONLY, strictly conforming to this exact structure (no markdown formatting, no code blocks):
{
  "title": "String",
  "sections": [
    {
      "title": "String",
      "instruction": "String",
      "questions": [
        {
          "question": "String",
          "difficulty": "String (easy/medium/hard)",
          "marks": Number
        }
      ]
    }
  ]
}

Ensure the total number of questions exactly matches ${assignment.numberOfQuestions} and the sections distribute the questions logically based on the instructions. The response must be parsable by JSON.parse().`;

  try {
    let contents: any[] = [{ text: prompt }];

    if (assignment.filePath && assignment.fileMimeType) {
      if (fs.existsSync(assignment.filePath)) {
        const fileBytes = fs.readFileSync(assignment.filePath);
        const base64Data = fileBytes.toString('base64');
        
        contents.push({
          inlineData: {
            data: base64Data,
            mimeType: assignment.fileMimeType
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            sections: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  instruction: { type: "STRING" },
                  questions: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        question: { type: "STRING" },
                        difficulty: { type: "STRING" },
                        marks: { type: "NUMBER" }
                      },
                      required: ["question", "difficulty", "marks"]
                    }
                  }
                },
                required: ["title", "instruction", "questions"]
              }
            }
          },
          required: ["title", "sections"]
        },
        systemInstruction: "You are a precise JSON-generating assistant for educational content.",
        temperature: 0.7,
      }
    });

    let resultString = response.text;
    if (!resultString) throw new Error('Empty response from Gemini');
    
    // Clean up potential markdown formatting that Gemini sometimes adds
    resultString = resultString.replace(/```json/gi, '').replace(/```/g, '').trim();

    return JSON.parse(resultString);
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    throw new Error('Failed to generate assessment');
  }
};
