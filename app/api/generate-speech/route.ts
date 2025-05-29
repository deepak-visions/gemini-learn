import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { join } from 'path';
import wav from 'wav';

async function saveWaveFile(
    filename: string,
    pcmData: Buffer,
    channels: number = 1,
    rate: number = 24000,
    sampleWidth: number = 2,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

export async function POST(request: Request) {
    try {
        const { text, speakers } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY });

        // Default to single speaker if no speakers provided
        const config = speakers ? {
            responseModalities: ['AUDIO'],
            speechConfig: {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: speakers.map((speaker: { name: string, voice: string }) => ({
                        speaker: speaker.name,
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: speaker.voice }
                        }
                    }))
                }
            }
        } : {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config
        });

        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!data) {
            throw new Error('No audio data received');
        }

        const audioBuffer = Buffer.from(data, 'base64');
        const timestamp = Date.now();
        const fileName = `speech-${timestamp}.wav`;
        const filePath = join(process.cwd(), 'public', 'audio', fileName);

        await saveWaveFile(filePath, audioBuffer);

        return NextResponse.json({
            success: true,
            fileName,
            audioUrl: `/audio/${fileName}`
        });
    } catch (error) {
        console.error('Speech generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred'
            },
            { status: 500 }
        );
    }
} 