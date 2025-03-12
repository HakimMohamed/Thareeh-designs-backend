import jwt from 'jsonwebtoken';
import mongoose, { ObjectId } from 'mongoose';

export function formatEgyptianTime(date: Date): Date {
  const utcOffset = 2 * 60 * 60 * 1000;
  const utcDate = new Date(date.getTime() - utcOffset);

  return utcDate;
}

export function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

export function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function authenticateUser(req: Request): string | null {
  const token = (req.headers as any)['authorization']?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export function decodeUserData(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
