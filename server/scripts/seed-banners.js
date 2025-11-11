const mongoose = require('mongoose');
const Feature = require('../models/Feature');

// Connect to MongoDB
mongoose.connect('mongodb+srv://my1042423:11112006%40My@cluster0.24cyuxm.mongodb.net/')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

async function seedBanners() {
  try {
    // Clear existing banners
    await Feature.deleteMany({});
    console.log('Cleared existing banners');

    // Create sample banners
    const sampleBanners = [
      {
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        device: "desktop"
      },
      {
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        device: "desktop"
      },
      {
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d1f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        device: "desktop"
      },
      {
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        device: "mobile"
      },
      {
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        device: "mobile"
      }
    ];

    // Insert sample banners
    const banners = await Feature.insertMany(sampleBanners);
    console.log(`Successfully seeded ${banners.length} banners`);

    // Display created banners
    banners.forEach(banner => {
      console.log(`- Banner for ${banner.device} device`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding banners:', error);
    process.exit(1);
  }
}

seedBanners();
