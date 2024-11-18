import { Request, Response, NextFunction } from 'express';
import LoggingService from '../services/logs';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const logginService = LoggingService.getInstance();

  logginService.logError(err, req);

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(500).json({
    data: null,
    message: 'Internal Server Error',
    success: false,
  });
};

export default errorHandler;
