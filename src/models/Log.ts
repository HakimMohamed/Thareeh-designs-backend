import { Schema, model, Document } from 'mongoose';

const errorLogSchema = new Schema<ErrorLogDocument>(
  {
    message: { type: String, required: true }, // Error message
    stackTrace: { type: String, required: true }, // Full stack trace
    level: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'error' }, // Error level
    request: {
      method: { type: String }, // HTTP method (GET, POST, etc.)
      url: { type: String }, // Request URL
      headers: { type: Schema.Types.Mixed, default: {} }, // Request headers
      body: { type: Schema.Types.Mixed, default: {} }, // Request body
      params: { type: Schema.Types.Mixed, default: {} }, // Request parameters (e.g., route params)
      query: { type: Schema.Types.Mixed, default: {} }, // Query parameters
    },
  },
  { timestamps: true }
);

const ErrorLog = model<ErrorLogDocument>('Log', errorLogSchema, 'Logs');

interface ErrorLogDocument extends Document {
  message: string;
  stackTrace: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  request: {
    method: string;
    url: string;
    headers: Record<string, any>;
    body: Record<string, any>;
    params: Record<string, any>;
    query: Record<string, any>;
  };
}

export default ErrorLog;
