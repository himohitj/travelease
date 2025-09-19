import mongoose, { Document, Schema } from 'mongoose';

// User Activity Analytics
export interface IUserActivity extends Document {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const UserActivitySchema = new Schema<IUserActivity>({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: String },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Search Analytics
export interface ISearchAnalytics extends Document {
  userId?: string;
  query: string;
  filters?: any;
  results: number;
  clickedResults?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
}

const SearchAnalyticsSchema = new Schema<ISearchAnalytics>({
  userId: { type: String, index: true },
  query: { type: String, required: true },
  filters: { type: Schema.Types.Mixed },
  results: { type: Number, required: true },
  clickedResults: [{ type: String }],
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  timestamp: { type: Date, default: Date.now, index: true }
});

// AI Recommendations Log
export interface IAIRecommendation extends Document {
  userId: string;
  type: 'hotel' | 'restaurant' | 'destination' | 'roadmap';
  input: any;
  recommendations: any[];
  feedback?: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

const AIRecommendationSchema = new Schema<IAIRecommendation>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true, enum: ['hotel', 'restaurant', 'destination', 'roadmap'] },
  input: { type: Schema.Types.Mixed, required: true },
  recommendations: [{ type: Schema.Types.Mixed }],
  feedback: { type: String, enum: ['positive', 'negative', 'neutral'] },
  timestamp: { type: Date, default: Date.now, index: true }
});

// System Performance Metrics
export interface ISystemMetrics extends Document {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  errorMessage?: string;
  timestamp: Date;
}

const SystemMetricsSchema = new Schema<ISystemMetrics>({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  responseTime: { type: Number, required: true },
  statusCode: { type: Number, required: true },
  errorMessage: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Export models
export const UserActivity = mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);
export const SearchAnalytics = mongoose.model<ISearchAnalytics>('SearchAnalytics', SearchAnalyticsSchema);
export const AIRecommendation = mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
export const SystemMetrics = mongoose.model<ISystemMetrics>('SystemMetrics', SystemMetricsSchema);