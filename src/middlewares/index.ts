import { Express } from 'express';
import loggerMiddleware from './logger';
import errorHandler from './errorHandler';
import express from 'express';
import apiRoutes from '../routes/index';

export const setupMiddlewares = (app: Express) => {
  app.use(express.json());

  app.use(loggerMiddleware);

  app.use('/api', apiRoutes);

  app.use(errorHandler);
};
