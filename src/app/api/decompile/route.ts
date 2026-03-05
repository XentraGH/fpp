import { NextRequest, NextResponse } from 'next/server';
import { decompileHTML } from '@/lib/fpp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json(
        { error: 'HTML is required' },
        { status: 400 }
      );
    }

    const fppCode = decompileHTML(html);

    return NextResponse.json({
      success: true,
      code: fppCode,
    });
  } catch (error) {
    console.error('Decompilation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
