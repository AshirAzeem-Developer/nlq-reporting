"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SchemaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("schema", file);

      const response = await fetch("/api/schema/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      setResult({ error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upload Database Schema</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h2 className="font-bold mb-2">Supported Formats:</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>
            <strong>.html/.htm</strong> - MySQL exported HTML schema
          </li>
          <li>
            <strong>.sql</strong> - SQL CREATE TABLE statements
          </li>
          <li>
            <strong>.json</strong> - Pre-parsed schema JSON
          </li>
        </ul>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">
            Select Schema File:
          </label>
          <input
            type="file"
            accept=".html,.htm,.sql,.json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload & Process Schema"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-8 p-4 rounded-lg ${
            result.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.success ? (
            <>
              <h2 className="font-bold text-green-900 mb-2">✅ Success!</h2>
              <p className="text-sm mb-2">Found {result.tablesFound} tables:</p>
              <ul className="list-disc ml-5 text-sm">
                {result.tables.map((table: string) => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-green-700">
                Redirecting to main page...
              </p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-red-900 mb-2">❌ Error</h2>
              <p className="text-sm">{result.error}</p>
              {result.details && (
                <p className="text-xs mt-2 text-red-600">{result.details}</p>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-bold mb-2">How it works:</h2>
        <ol className="list-decimal ml-5 text-sm space-y-1">
          <li>Upload your database schema file (HTML/SQL/JSON)</li>
          <li>System automatically parses tables and columns</li>
          <li>Generates schema context for LLM prompts</li>
          <li>
            Schema is saved to{" "}
            <code className="bg-gray-200 px-1">lib/schema-context.ts</code>
          </li>
          <li>You can now query your database using natural language!</li>
        </ol>
      </div>
    </main>
  );
}
