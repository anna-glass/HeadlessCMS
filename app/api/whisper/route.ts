import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // OpenAPI expects a Node.js Buffer, but Next.js gives us a browser File.
    // We need to convert it to a Buffer.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await openai.audio.transcriptions.create({
      file: new File([buffer], file.name, { type: file.type }),
      model: 'whisper-1',
    });

    return NextResponse.json({ text: response.text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
