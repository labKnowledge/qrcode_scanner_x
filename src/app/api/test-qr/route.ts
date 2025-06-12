import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test jsQR import
    const jsQR = (await import('jsqr')).default;
    
    // Test canvas import
    const { createCanvas } = await import('canvas');
    
    // Create a simple test canvas
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext('2d');
    
    return NextResponse.json({
      success: true,
      message: 'QR processing dependencies are working',
      jsQRAvailable: typeof jsQR === 'function',
      canvasAvailable: typeof createCanvas === 'function',
      contextAvailable: !!context
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 