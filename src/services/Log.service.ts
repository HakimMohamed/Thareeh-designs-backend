// services/logging.service.ts
import Log from '../models/Log';

class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public async logError(err: any, req?: any) {
    try {
      const requestData = req
        ? {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query,
          }
        : {};

      await new Log({
        message: err.message || 'Internal Server Error',
        stackTrace: err.stack,
        level: 'critical',
        request: requestData,
      }).save();
    } catch (logError) {
      console.error('Error while logging the error:', logError);
    }
  }
}

export default LoggingService;
