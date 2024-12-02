import mongoose, { Schema, model, Document, NumberExpression, ObjectId } from 'mongoose';

export interface ICountry extends Document {
  _id: ObjectId;
  name: string;
  code: string;
  phoneCode: string;
  regions: [
    {
      name: string;
      deliveryFee: number;
    },
  ];
  regionType: string;
}

const countrySchema = new Schema(
  {
    name: { type: String, required: true, unqiue: true },
    code: { type: String, required: true, unqiue: true },
    phoneCode: { type: String, required: true, unqiue: true },
    regions: [
      {
        name: { type: String, required: true },
        deliveryFee: { type: Number, required: true },
      },
    ],
    regionType: { type: String, required: true, enum: ['state', 'city', 'province'] },
  },
  { timestamps: true }
);

const CountrySchema = model<ICountry>('Country', countrySchema, 'Countries');

export default CountrySchema;
