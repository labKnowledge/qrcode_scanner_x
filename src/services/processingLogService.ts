import { ProcessingLog, IProcessingLog } from '../models/ProcessingLog';
import { connectDB, getConnection } from '../utils/database';
import mongoose from 'mongoose';

export interface ProcessingLogInput {
  userId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  processingTime: number;
  success: boolean;
  errorMessage?: string;
  qrCodeContent?: string;
}

export class ProcessingLogService {
  private static async ensureConnection() {
    try {
      const connection = await connectDB();
      return connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  private static createMockLog(logData: ProcessingLogInput): IProcessingLog {
    const mockId = new mongoose.Types.ObjectId();
    const mockDoc = {
      ...logData,
      _id: mockId,
      id: mockId.toString(),
      timestamp: new Date(),
      isNew: false,
      isModified: () => false,
      isDirectModified: () => false,
      isInit: () => true,
      isSelected: () => true,
      getChanges: () => ({}),
      increment: () => mockDoc,
      modifiedPaths: () => [],
      modelName: 'ProcessingLog',
      collection: { name: 'processinglogs' },
      db: getConnection(),
      save: async () => mockDoc,
      toJSON: () => ({ ...logData, _id: mockId, timestamp: new Date() }),
      toObject: () => ({ ...logData, _id: mockId, timestamp: new Date() })
    } as unknown as IProcessingLog;

    return mockDoc;
  }

  static async createLog(logData: ProcessingLogInput): Promise<IProcessingLog> {
    try {
      await this.ensureConnection();
      const log = new ProcessingLog(logData);
      return await log.save();
    } catch (error) {
      console.error('Error creating processing log:', error);
      // Return a mock log if database operation fails
      return this.createMockLog(logData);
    }
  }

  static async getLogsByUserId(userId: string, limit: number = 10, skip: number = 0): Promise<IProcessingLog[]> {
    try {
      await this.ensureConnection();
      return await ProcessingLog.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return [];
    }
  }

  static async getRecentLogs(limit: number = 10): Promise<IProcessingLog[]> {
    try {
      await this.ensureConnection();
      return await ProcessingLog.find()
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return [];
    }
  }

  static async getStats(): Promise<{
    totalProcessed: number;
    successRate: number;
    averageProcessingTime: number;
  }> {
    try {
      await this.ensureConnection();
      const [totalProcessed, successfulProcessed, avgProcessingTime] = await Promise.all([
        ProcessingLog.countDocuments(),
        ProcessingLog.countDocuments({ success: true }),
        ProcessingLog.aggregate([
          {
            $group: {
              _id: null,
              avgTime: { $avg: '$processingTime' }
            }
          }
        ])
      ]);

      return {
        totalProcessed,
        successRate: totalProcessed > 0 ? (successfulProcessed / totalProcessed) * 100 : 0,
        averageProcessingTime: avgProcessingTime[0]?.avgTime || 0
      };
    } catch (error) {
      console.error('Error fetching processing stats:', error);
      return {
        totalProcessed: 0,
        successRate: 0,
        averageProcessingTime: 0
      };
    }
  }
} 