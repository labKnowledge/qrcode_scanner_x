import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import { ProcessingLogs } from '@/models/ProcessingLog';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileSize, fileType, processingTime, success, errorMessage, qrCodeContent } = body;

    try {
      await connectToDatabase();

      const log = new ProcessingLogs({
        fileName,
        fileSize,
        fileType,
        processingTime,
        success,
        errorMessage,
        qrCodeContent,
        timestamp: new Date()
      });

      await log.save();
      return NextResponse.json({ success: true, message: 'Log created successfully' });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return success even if logging fails to not interrupt the QR code processing
      return NextResponse.json({ 
        success: true, 
        message: 'QR code processed successfully, but logging failed',
        logError: 'Failed to save processing log'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 