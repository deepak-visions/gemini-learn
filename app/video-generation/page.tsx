'use client';

import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY });

export default function VideoGeneration() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVideos([]);

    try {
      let operation = await ai.models.generateVideos({
        model: "veo-2.0-generate-001",
        prompt: prompt,
        config: {
          aspectRatio: "16:9",
          numberOfVideos: 2,
        },
      });

      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
          operation: operation,
        });
      }

      const videoUrls = operation.response?.generatedVideos?.map(
        (video) => `${video.video?.uri}&key=${process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY}`
      ) || [];

      setVideos(videoUrls);
    } catch (err) {
      setError("Error generating video. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Video Generation</h1>

      <form onSubmit={generateVideo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate..."
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Video"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((videoUrl, index) => (
          <div key={index} className="aspect-video">
            <video
              controls
              className="w-full h-full rounded"
              src={videoUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}