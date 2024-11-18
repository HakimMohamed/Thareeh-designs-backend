import { NextFunction, Request, Response } from 'express';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const duration = Date.now() - startTime;
    console.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  res.on('error', (error: any) => {
    console.error('asdasdasd');
  });

  next();
};

export default loggerMiddleware;
