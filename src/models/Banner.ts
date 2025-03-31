import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IBanner extends Document {
  _id: ObjectId;
  text: string;
  color: string;
  textColor: string;
}

export const BannerSchema = new Schema<IBanner>({
  text: { type: String, required: true },
  color: { type: String, required: true },
  textColor: { type: String, required: true },
});

const Item = model<IBanner>('BannerSetting', BannerSchema, 'BannerSettings');

export default Item;
