import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Premium Cotton T-Shirt',
    description: 'High-quality 100% organic cotton t-shirt with premium finish',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    stock: 150,
    overallRating: 4.8,
    totalReviews: 127,
    aiTrustScore: 9.1
  },
  {
    name: 'Wireless Bluetooth Earbuds',
    description: 'Premium wireless earbuds with noise cancellation and 24-hour battery life',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
    stock: 75,
    overallRating: 4.6,
    totalReviews: 203,
    aiTrustScore: 8.9
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
    stock: 80,
    overallRating: 4.7,
    totalReviews: 94,
    aiTrustScore: 9.2
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products to database`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();