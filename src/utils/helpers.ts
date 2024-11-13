import { Types } from 'mongoose';

function formatEgyptianTime(date: Date): Date {
  const utcOffset = 2 * 60 * 60 * 1000;
  const utcDate = new Date(date.getTime() - utcOffset);

  return utcDate;
}

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

export function delay(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const helpers = {
  formatEgyptianTime,
};

export default helpers;
