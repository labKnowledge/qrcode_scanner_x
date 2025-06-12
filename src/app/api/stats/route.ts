import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import { ProcessingLogs } from '@/models/ProcessingLog';

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
    startOfWeek.setHours(0, 0, 0, 0);

    // Aggregate all statistics in parallel
    const [totalCount, todayCount, weekCount] = await Promise.all([
      // Grand total - all successful scans
      ProcessingLogs.countDocuments({ success: true }),
      
      // Today's successful scans
      ProcessingLogs.countDocuments({
        success: true,
        timestamp: { $gte: startOfToday }
      }),
      
      // This week's successful scans
      ProcessingLogs.countDocuments({
        success: true,
        timestamp: { $gte: startOfWeek }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total: totalCount,
        today: todayCount,
        thisWeek: weekCount
      }
    });

  } catch (error) {
    console.error('Error fetching scan statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        data: { total: 0, today: 0, thisWeek: 0 }
      },
      { status: 500 }
    );
  }
} 