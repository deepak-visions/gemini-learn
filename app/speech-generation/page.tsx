'use client';

import { useState } from 'react';

interface Speaker {
  name: string;
  voice: string;
}

interface AudioGenerationResponse {
  success: boolean;
  fileName?: string;
  audioUrl?: string;
  error?: string;
}

function SpeechGeneration() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AudioGenerationResponse | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { name: 'Joe', voice: 'Kore' },
    { name: 'Jane', voice: 'Puck' }
  ]);

  const generateAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          speakers: text.includes('Joe') && text.includes('Jane') ? speakers : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio');
      }

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Speech Generation</h1>

      <form onSubmit={generateAudio} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Enter conversation text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Example: Joe: How's it going today Jane? Jane: Not too bad, how about you?"
            required
          />
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>Available voices:</p>
          <ul className="list-disc list-inside">
            <li>Joe: Kore</li>
            <li>Jane: Puck</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate Audio'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          {result.success ? (
            <div>
              <p className="text-green-700">Audio generated successfully!</p>
              <p className="text-sm mt-2">File saved as: {result.fileName}</p>
              {result.audioUrl && (
                <div className="mt-4">
                  <audio controls className="w-full">
                    <source src={result.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-700">Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SpeechGeneration;