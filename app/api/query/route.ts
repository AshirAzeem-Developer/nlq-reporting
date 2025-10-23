import { NextRequest, NextResponse } from "next/server";
import { generateSQL } from "@/app/lib/llm";
import { query } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userQuery } = await request.json();

    if (!userQuery) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Generate SQL using LLM
    console.log("📝 User Query:", userQuery);
    const { sql, explanation, rawResponse } = await generateSQL(userQuery);
    console.log("🤖 Generated SQL:", sql);
    console.log("💡 Explanation:", explanation);

    // Step 2: Basic validation (only allow SELECT)
    if (!sql.trim().toUpperCase().startsWith("SELECT")) {
      return NextResponse.json(
        {
          error: "Only SELECT queries are allowed",
          generatedSQL: sql,
          explanation,
        },
        { status: 400 }
      );
    }

    // Step 3: Execute the query
    const result = await query(sql);

    console.log("✅ Query executed successfully");
    console.log("📊 Rows returned:", result.rowCount);

    // Return everything for debugging
    return NextResponse.json({
      success: true,
      userQuery,
      generatedSQL: sql,
      explanation,
      rawLLMResponse: rawResponse,
      data: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map((f) => f.name),
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        error: "Query execution failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
