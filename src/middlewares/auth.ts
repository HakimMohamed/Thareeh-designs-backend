import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const user = (await jwt.verify(token, process.env.JWT_SECRET!)) as { userId: string };
    req.user = user.userId;
    next();
  } catch (err) {
    res.sendStatus(403);
    return;
  }
};
