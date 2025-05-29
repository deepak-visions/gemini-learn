'use client';

import { GoogleGenAI, Modality } from "@google/genai";
import { useState } from "react";

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY });

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImageUrl("");

    try {

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("No response from the API");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData?.data) {
          const imageData = part.inlineData.data;
          const imageBlob = new Blob([Buffer.from(imageData, "base64")], { type: "image/png" });
          const url = URL.createObjectURL(imageBlob);
          setImageUrl(url);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">AI Image Generation</h1>

      <form onSubmit={generateImage} className="mb-4">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter your image description:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Describe the image you want to generate..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Image:</h2>
          <img
            src={imageUrl}
            alt="Generated image"
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}