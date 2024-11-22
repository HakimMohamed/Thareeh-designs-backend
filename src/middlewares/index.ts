import express, { Express } from 'express';
import loggerMiddleware from './logger';
import errorHandler from './errorHandler';
import jwtMiddleware from './auth';
import apiRoutes from '../routes/index';
import cors from 'cors';

export const setupMiddlewares = (app: Express) => {
  app.use(cors());
  app.use(express.json());

  app.use(loggerMiddleware);

  app.use(jwtMiddleware);

  app.use('/api', apiRoutes);

  app.use(errorHandler);
};
