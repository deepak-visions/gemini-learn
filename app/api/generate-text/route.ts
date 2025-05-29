import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // TODO: Replace with actual Gemini API call.
    // Ensure API key is handled securely and not exposed client-side.
    // Access API key via process.env.GEMINI_API_KEY
    console.log(`Received prompt: ${prompt}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const generatedText = `This is a mock response for the prompt: "${prompt}"`;

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error('Error in generate-text API:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
}
