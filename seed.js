/**
 * SEED SCRIPT - Adds sample products to the Product Service
 * Run: node seed.js
 * Make sure Product Service is running first!
 */

const axios = require('axios');

const GATEWAY = 'http://localhost:5000';

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    price: 129.99,
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    category: "Electronics",
    stock: 45,
    imageUrl: "https://picsum.photos/seed/headphones/300/180"
  },
  {
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "Tactile mechanical keyboard with RGB backlight. Cherry MX Brown switches.",
    category: "Electronics",
    stock: 30,
    imageUrl: "https://picsum.photos/seed/keyboard/300/180"
  },
  {
    name: "Running Shoes - Pro Series",
    price: 74.99,
    description: "Lightweight breathable running shoes with cushioned sole. Available in multiple colors.",
    category: "Footwear",
    stock: 60,
    imageUrl: "https://picsum.photos/seed/shoes/300/180"
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "500ml vacuum insulated bottle. Keeps drinks cold 24h, hot 12h.",
    category: "Sports",
    stock: 100,
    imageUrl: "https://picsum.photos/seed/bottle/300/180"
  },
  {
    name: "Desk Lamp with USB Charging",
    price: 39.99,
    description: "LED desk lamp with adjustable brightness, color temperature, and built-in USB port.",
    category: "Home & Office",
    stock: 25,
    imageUrl: "https://picsum.photos/seed/lamp/300/180"
  },
  {
    name: "Yoga Mat Premium",
    price: 34.99,
    description: "Non-slip 6mm thick yoga mat with carry strap. Eco-friendly TPE material.",
    category: "Sports",
    stock: 50,
    imageUrl: "https://picsum.photos/seed/yogamat/300/180"
  },
  {
    name: "Smart Watch Series 5",
    price: 199.99,
    description: "Fitness tracking, heart rate monitor, sleep analysis, and 7-day battery.",
    category: "Electronics",
    stock: 20,
    imageUrl: "https://picsum.photos/seed/smartwatch/300/180"
  },
  {
    name: "Backpack - Travel Pro",
    price: 59.99,
    description: "35L waterproof backpack with laptop compartment and USB charging port.",
    category: "Bags",
    stock: 40,
    imageUrl: "https://picsum.photos/seed/backpack/300/180"
  }
];

async function seed() {
  console.log('Seeding products via API Gateway...\n');
  let success = 0;
  for (const product of sampleProducts) {
    try {
      const res = await axios.post(`${GATEWAY}/gateway/products`, product);
      console.log(`✓ Created: ${res.data.name}`);
      success++;
    } catch (err) {
      console.error(`✗ Failed: ${product.name} — ${err.message}`);
    }
  }
  console.log(`\nDone! ${success}/${sampleProducts.length} products seeded.`);
}

seed();
