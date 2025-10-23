"use client";

import { useState } from "react";

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
      console.log("API Response:", data);
    } catch (error) {
      setResult({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">NLQ Reporting System - POC</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Ask"}
          </button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <p className="font-semibold mb-2">Try these example queries:</p>
        <div className="space-y-1 text-sm">
          <button
            onClick={() =>
              setQuery("Show me all manuscripts submitted in 2017")
            }
            className="block text-blue-600 hover:underline"
          >
            • Show me all manuscripts submitted in 2017
          </button>
          <button
            onClick={() =>
              setQuery(
                "How many manuscripts were rejected vs published in 2017?"
              )
            }
            className="block text-blue-600 hover:underline"
          >
            • How many manuscripts were rejected vs published in 2017?
          </button>
          <button
            onClick={() => setQuery("List all authors and their manuscripts")}
            className="block text-blue-600 hover:underline"
          >
            • List all authors and their manuscripts
          </button>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Generated SQL */}
          <div className="p-4 bg-gray-900 text-gray-100 rounded-lg">
            <h2 className="font-bold mb-2 text-green-400">🤖 Generated SQL:</h2>
            <pre className="text-sm overflow-x-auto">{result.generatedSQL}</pre>
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-bold mb-2 text-blue-900">💡 Explanation:</h2>
              <p className="text-sm">{result.explanation}</p>
            </div>
          )}

          {/* Data Results */}
          {result.data && result.data.length > 0 ? (
            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="font-bold mb-2 text-green-900">
                📊 Results ({result.rowCount} rows):
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-green-200">
                      {result.fields.map((field: string) => (
                        <th key={field} className="border p-2 text-left">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row: any, i: number) => (
                      <tr key={i} className="border-b hover:bg-green-100">
                        {result.fields.map((field: string) => (
                          <td key={field} className="border p-2">
                            {JSON.stringify(row[field])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Raw LLM Response (for debugging) */}
          <details className="p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-semibold">
              🔍 Raw LLM Response (Debug)
            </summary>
            <pre className="mt-2 text-xs overflow-x-auto">
              {result.rawLLMResponse}
            </pre>
          </details>

          {/* Error Display */}
          {result.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="font-bold mb-2 text-red-900">❌ Error:</h2>
              <p className="text-sm text-red-700">{result.error}</p>
              {result.details && (
                <p className="text-xs text-red-600 mt-2">{result.details}</p>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
