"use client";

import { useState } from "react";

// Example queries specific to your e-commerce database
const EXAMPLE_QUERIES = [
  "What is the total revenue from paid orders?",
  "Show me the top 5 best-selling products",
  "How many pending orders do we have?",
  "Who are the top 10 customers by total spending?",
  "Show all active products in each category",
  "What are the hot/featured products currently available?",
  "How many items are currently in shopping carts?",
  "Show daily revenue for the last 7 days",
  "List orders with failed payments",
  "Which products have no sales yet?",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: query }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto bg-gray-50">
      {/* Header with Schema Upload Link */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          E-commerce NLQ Reporting
        </h1>
        <a
          href="/schema-upload"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          📁 Upload Schema
        </a>
      </div>

      {/* Query Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white rounded-lg shadow p-6"
      >
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your e-commerce data..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {loading ? "🔄 Generating..." : "🚀 Ask"}
          </button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <p className="font-semibold mb-3 text-gray-700">💡 Example Queries:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EXAMPLE_QUERIES.map((exampleQuery, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(exampleQuery)}
              className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline p-2 rounded hover:bg-blue-50 transition"
            >
              • {exampleQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Generated SQL */}
          <div className="bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-bold text-green-400">🤖 Generated SQL</h2>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              {result.generatedSQL}
            </pre>
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow overflow-hidden">
              <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
                <h2 className="font-bold text-blue-900">💡 Explanation</h2>
              </div>
              <p className="p-4 text-sm text-gray-700">{result.explanation}</p>
            </div>
          )}

          {/* Data Results - Table View */}
          {result.data && result.data.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <div className="bg-green-100 px-4 py-2 border-b border-green-200">
                <h2 className="font-bold text-green-900">
                  📊 Results ({result.rowCount} rows)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50 border-b border-green-200">
                    <tr>
                      {result.fields.map((field: string) => (
                        <th
                          key={field}
                          className="px-4 py-3 text-left font-semibold text-gray-700"
                        >
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.data.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-green-50 transition">
                        {result.fields.map((field: string) => (
                          <td key={field} className="px-4 py-3 text-gray-800">
                            {formatCellValue(row[field])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : result.data && result.data.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                ⚠️ Query executed successfully but returned no results.
              </p>
            </div>
          ) : null}

          {/* Raw LLM Response (Collapsible Debug) */}
          {result.rawLLMResponse && (
            <details className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
              <summary className="cursor-pointer font-semibold px-4 py-3 hover:bg-gray-200 transition">
                🔍 Raw LLM Response (Debug)
              </summary>
              <pre className="p-4 text-xs overflow-x-auto bg-white border-t border-gray-300">
                {result.rawLLMResponse}
              </pre>
            </details>
          )}

          {/* Error Display */}
          {result.error && (
            <div className="bg-red-50 border border-red-300 rounded-lg shadow overflow-hidden">
              <div className="bg-red-100 px-4 py-2 border-b border-red-300">
                <h2 className="font-bold text-red-900">❌ Error</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-red-700 mb-2">{result.error}</p>
                {result.details && (
                  <p className="text-xs text-red-600 bg-red-100 p-2 rounded">
                    {result.details}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>💡 Tip: Upload your database schema first for better results</p>
        <p className="mt-1">
          Database:{" "}
          <code className="bg-gray-200 px-2 py-1 rounded text-xs">
            dashboarddb
          </code>
        </p>
      </div>
    </main>
  );
}

// Helper function to format cell values
function formatCellValue(value: any): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "✓" : "✗";
  }
  if (typeof value === "number") {
    // Format numbers with commas for readability
    return value.toLocaleString();
  }
  if (
    value instanceof Date ||
    (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/))
  ) {
    // Format dates
    try {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(value);
    }
  }
  return String(value);
}
