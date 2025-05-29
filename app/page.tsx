import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Gemini API Showcase
      </h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        Explore the power of Google's Gemini models. This website demonstrates
        various capabilities, from text and image generation to advanced video
        and audio understanding.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Available Features:</h2>
      <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8">
        <li className="p-1">Text Generation</li>
        <li className="p-1">Image Generation</li>
        <li className="p-1">Video Generation</li>
        <li className="p-1">Speech Generation</li>
        <li className="p-1">Music Generation</li>
        <li className="p-1">Long Context</li>
        <li className="p-1">Structured Output</li>
        <li className="p-1">Thinking</li>
        <li className="p-1">Function Calling</li>
        <li className="p-1">Document Understanding</li>
        <li className="p-1">Image Understanding</li>
        <li className="p-1">Video Understanding</li>
        <li className="p-1">Audio Understanding</li>
        <li className="p-1">Code Execution</li>
        <li className="p-1">URL Context</li>
      </ul>
    </main>
  );
}
