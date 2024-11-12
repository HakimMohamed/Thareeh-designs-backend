require('dotenv').config();
import configLoader from '../config/configLoader';
configLoader();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  discount: {
    active: Boolean,
    value: Number,
  },
});

const Item = mongoose.model('Item', itemSchema, 'Items');

async function generateItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const imagesPath = path.join(__dirname, '../../designs/images');
    const files = await fs.promises.readdir(imagesPath);

    const items = files.map((file: any) => {
      const filename = path.parse(file).name;
      const isActive = Math.random() < 0.3;
      return new Item({
        name: filename,
        price: Math.floor(Math.random() * 100) + 1,
        image: `/images/${file}`,
        category: `category-${Math.floor(Math.random() * 10)}`,
        description: `Description for ${filename}`,
        discount: {
          active: isActive,
          value: isActive ? Math.floor(Math.random() * 10) : 0,
        },
      });
    });

    await Item.insertMany(items);
    console.log('Items inserted successfully');
  } catch (error) {
    console.error('Error inserting items:', error);
  } finally {
    await mongoose.connection.close();
  }
}

generateItems();
