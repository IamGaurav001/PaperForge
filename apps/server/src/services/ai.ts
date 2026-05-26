import { GoogleGenAI } from '@google/genai';
import { AssignmentDocument } from '@paperforge/types';
import * as fs from 'fs';

export const generateAssessment = async (assignment: AssignmentDocument) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `You are an expert academic assessment creator and educator. Your task is to generate a highly structured, rigorous, and professional exam paper tailored precisely to the constraints below.

### Assignment Constraints:
- Title: ${assignment.title}
- Subject: ${assignment.subject}
- Target Class/Grade Level: ${assignment.studentClass || 'Not specified'}
- Total Number of Questions: ${assignment.numberOfQuestions}
- Question Types Required: ${assignment.questionTypes.join(', ')}
- Marks Distribution: ${assignment.marksDistribution}
- Document Attached: ${assignment.filePath ? 'YES' : 'NO'}
- Additional Instructions: ${assignment.instructions || 'None'}

### Critical Guidelines:
1. **Age & Class Appropriateness**: You MUST strictly adapt the vocabulary, conceptual complexity, and context of every question to suit a student in the specified "Target Class".
2. **Source Material Integration**: If "Document Attached" is YES, you MUST rigorously scan the provided document/image. Extract key concepts, facts, or raw questions from it and base your generated questions directly on that material. Do NOT invent unrelated topics.
3. **Structural Integrity**: Group the questions into logical sections (e.g., Section A: Objective, Section B: Subjective). Ensure the total number of questions across all sections sums exactly to ${assignment.numberOfQuestions}.
4. **Rigorous Quality**: Questions should be clear, unambiguous, and grammatically perfect. Ensure a realistic distribution of difficulty (easy, medium, hard).
5. **Answer Key & Options**: For every question, you MUST generate the correct/detailed answer in the \`answer\` field. If a question is multiple-choice (e.g., MCQ), you MUST also provide an array of at least 4 options in the \`options\` field, and place the correct option's exact text in the \`answer\` field.

### Output Format (STRICT JSON ONLY):
You must output valid, raw JSON only. Do NOT wrap the response in markdown blocks (e.g., \`\`\`json). Do NOT add any conversational text.

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
          "marks": Number,
          "options": ["String"],
          "answer": "String"
        }
      ]
    }
  ]
}`;

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
                        marks: { type: "NUMBER" },
                        options: {
                          type: "ARRAY",
                          items: { type: "STRING" }
                        },
                        answer: { type: "STRING" }
                      },
                      required: ["question", "difficulty", "marks", "answer"]
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
