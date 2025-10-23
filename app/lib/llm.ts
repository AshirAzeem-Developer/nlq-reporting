import { GoogleGenerativeAI } from "@google/generative-ai";
import { SCHEMA_CONTEXT } from "./schema-context";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSQL(
  userQuery: string
): Promise<{ sql: string; explanation: string; rawResponse: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a PostgreSQL expert. Generate a SELECT query based on the user's question.

${SCHEMA_CONTEXT}

USER QUESTION: "${userQuery}"

INSTRUCTIONS:
1. Generate ONLY a valid PostgreSQL SELECT query
2. Use proper JOINs based on the schema relationships above
3. Return your response in this EXACT format:

SQL:
[your SQL query here]

EXPLANATION:
[brief explanation of what the query does]

Generate the query now:`;

  try {
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    // Parse the response
    const sqlMatch = rawResponse.match(/SQL:\s*([\s\S]*?)(?=EXPLANATION:|$)/i);
    const explanationMatch = rawResponse.match(/EXPLANATION:\s*([\s\S]*?)$/i);

    const sql = sqlMatch
      ? sqlMatch[1]
          .trim()
          .replace(/```sql|```/g, "")
          .trim()
      : rawResponse.trim();

    const explanation = explanationMatch
      ? explanationMatch[1].trim()
      : "No explanation provided";

    return { sql, explanation, rawResponse };
  } catch (error) {
    console.error("LLM Error:", error);
    throw new Error("Failed to generate SQL");
  }
}
