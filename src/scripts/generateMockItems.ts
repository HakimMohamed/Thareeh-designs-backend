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

function generateRandomName(): string {
  const adjectives = [
    'Small',
    'Large',
    'Fancy',
    'Elegant',
    'Rustic',
    'Modern',
    'Vintage',
    'Charming',
    'Unique',
    'Colorful',
  ];
  const materials = [
    'Wooden',
    'Metal',
    'Plastic',
    'Cotton',
    'Silk',
    'Leather',
    'Glass',
    'Ceramic',
    'Stone',
    'Fabric',
  ];
  const items = [
    'Chair',
    'Table',
    'Lamp',
    'Sofa',
    'Desk',
    'Shelf',
    'Couch',
    'Wardrobe',
    'Mirror',
    'Rack',
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  const randomItem = items[Math.floor(Math.random() * items.length)];

  return `${randomAdjective} ${randomMaterial} ${randomItem}`;
}

async function generateItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const imagesPath = path.join(__dirname, '../../designs/images');
    const files = await fs.promises.readdir(imagesPath);

    const items = files.map((file: any) => {
      const filename = generateRandomName(); // Use custom random name generator
      const isActive = Math.random() < 0.3;
      return new Item({
        name: filename, // Use generated name
        price: Math.floor(Math.random() * 100) + 1,
        image: `/images/${file}`,
        category: ['anime', 'nature', 'inspirational-quotes', 'animals'][
          Math.floor(Math.random() * 4)
        ],
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
