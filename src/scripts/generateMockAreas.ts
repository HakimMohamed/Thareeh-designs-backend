require('dotenv').config();
import configLoader from '../config/configLoader';
configLoader();

import mongoose, { Schema, model, Document, ObjectId } from 'mongoose';
import { ICountry } from '../models/Country';

const countrySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    phoneCode: { type: String, required: true, unique: true },
    regionType: { type: String, required: true, enum: ['state', 'city', 'province'] },
    regions: [
      {
        name: { type: String, required: true },
        deliveryFee: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const CountrySchema = model<ICountry>('Country', countrySchema, 'Countries');

async function generateCountries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const countries = [
      {
        name: 'Egypt',
        code: 'EG',
        phoneCode: '+20',
        regionType: 'province',
        regions: [
          { name: 'Cairo', deliveryFee: 20 },
          { name: 'Alexandria', deliveryFee: 25 },
          { name: 'Giza', deliveryFee: 30 },
          { name: 'Qalyubia', deliveryFee: 35 },
          { name: 'Port Said', deliveryFee: 40 },
          { name: 'Suez', deliveryFee: 45 },
          { name: 'Dakahlia', deliveryFee: 50 },
          { name: 'Sharqia', deliveryFee: 55 },
          { name: 'Gharbia', deliveryFee: 60 },
          { name: 'Monufia', deliveryFee: 65 },
          { name: 'Beheira', deliveryFee: 70 },
          { name: 'Ismailia', deliveryFee: 75 },
          { name: 'Beni Suef', deliveryFee: 80 },
          { name: 'Fayoum', deliveryFee: 85 },
          { name: 'Minya', deliveryFee: 90 },
          { name: 'Assiut', deliveryFee: 95 },
          { name: 'Sohag', deliveryFee: 100 },
          { name: 'Qena', deliveryFee: 25 },
          { name: 'Aswan', deliveryFee: 30 },
          { name: 'Luxor', deliveryFee: 35 },
          { name: 'Red Sea', deliveryFee: 40 },
          { name: 'New Valley', deliveryFee: 45 },
          { name: 'Matrouh', deliveryFee: 50 },
          { name: 'North Sinai', deliveryFee: 55 },
          { name: 'South Sinai', deliveryFee: 60 },
        ],
      },
    ];

    await CountrySchema.insertMany(countries);
    console.log('Countries inserted successfully');
  } catch (error) {
    console.error('Error inserting countries:', error);
  } finally {
    await mongoose.connection.close();
  }
}

generateCountries();
