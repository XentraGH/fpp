import { NextRequest, NextResponse } from 'next/server';
import { compileFPP } from '@/lib/fpp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    const result = compileFPP(code);

    return NextResponse.json({
      success: result.success,
      html: result.html,
      css: result.css,
      errors: result.errors,
      warnings: result.warnings,
      googleFonts: result.googleFonts,
    });
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
