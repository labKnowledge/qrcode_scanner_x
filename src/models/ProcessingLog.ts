import mongoose from 'mongoose';

const processingLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  processingTime: { type: Number, required: true },
  success: { type: Boolean, required: true },
  errorMessage: { type: String },
  qrCodeContent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Create indexes for common queries
processingLogSchema.index({ timestamp: -1 });
processingLogSchema.index({ success: 1 });
processingLogSchema.index({ fileType: 1 });

// Explicitly set the collection name to 'processingLog'
export const ProcessingLogs = mongoose.models.ProcessingLog || mongoose.model('ProcessingLogs', processingLogSchema, 'processingLogs'); 