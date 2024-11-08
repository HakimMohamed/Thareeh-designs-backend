import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { setupMiddlewares } from './middlewares/index';
import dotenv from 'dotenv';
import loadConfig from './config/configLoader';
import connectDB from './config/database';

dotenv.config();

loadConfig();

const app = express();

const PORT = process.env.PORT || 3000;

setupMiddlewares(app);

app.get('/ping', (req: Request, res: Response, next: NextFunction) => {
  res.send('pong');
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
