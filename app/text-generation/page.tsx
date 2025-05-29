"use client"; // Required for useState and event handlers

import { useState } from "react";

// React functional component for Text Generation page
export default function TextGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateText = async () => {
    setIsLoading(true);
    setGeneratedText(""); // Clear previous text

    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
    } catch (error) {
      console.error("Failed to generate text:", error);
      setGeneratedText("Failed to generate text. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Text Generation</h1>
      <div className="max-w-xl mx-auto">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
          rows={5}
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        ></textarea>
        <button
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4 disabled:bg-gray-400"
          onClick={handleGenerateText}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Text"}
        </button>
        <div
          className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 min-h-[100px]"
          aria-live="polite"
        >
          {isLoading ? "Loading..." : generatedText || "Generated text will appear here."}
        </div>
      </div>
    </div>
  );
}
