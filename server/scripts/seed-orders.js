const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect('mongodb+srv://my1042423:11112006%40My@cluster0.24cyuxm.mongodb.net/')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

async function seedOrders() {
  try {
    // Get a user and some products
    const user = await User.findOne();
    const products = await Product.find().limit(3);

    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    if (products.length === 0) {
      console.log('No products found. Please create products first.');
      return;
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Create sample orders
    const sampleOrders = [
      {
        user: user._id,
        orderStatus: 'confirmed',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        cartItems: [
          {
            product: products[0]._id,
            quantity: 2,
            price: products[0].price
          }
        ],
        totalAmount: products[0].price * 2,
        shippingAddress: {
          address: 'شارع الملك فهد، الرياض',
          city: 'الرياض',
          pincode: '12345',
          phone: '0501234567',
          notes: 'اتصل قبل التوصيل'
        },
        paymentMethod: 'paypal',
        paymentStatus: 'completed'
      },
      {
        user: user._id,
        orderStatus: 'pending',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        cartItems: [
          {
            product: products[1] ? products[1]._id : products[0]._id,
            quantity: 1,
            price: products[1] ? products[1].price : products[0].price
          }
        ],
        totalAmount: products[1] ? products[1].price : products[0].price,
        shippingAddress: {
          address: 'شارع العليا، جدة',
          city: 'جدة',
          pincode: '21432',
          phone: '0507654321',
          notes: ''
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'pending'
      },
      {
        user: user._id,
        orderStatus: 'confirmed',
        orderDate: new Date(), // today
        cartItems: [
          {
            product: products[2] ? products[2]._id : products[0]._id,
            quantity: 3,
            price: products[2] ? products[2].price : products[0].price
          },
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price
          }
        ],
        totalAmount: (products[2] ? products[2].price * 3 : products[0].price * 3) + products[0].price,
        shippingAddress: {
          address: 'شارع التحلية، الدمام',
          city: 'الدمام',
          pincode: '31421',
          phone: '0509876543',
          notes: 'توصيل سريع'
        },
        paymentMethod: 'paypal',
        paymentStatus: 'completed'
      },
      {
        user: user._id,
        orderStatus: 'rejected',
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        cartItems: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price
          }
        ],
        totalAmount: products[0].price,
        shippingAddress: {
          address: 'شارع الملك عبدالعزيز، مكة',
          city: 'مكة المكرمة',
          pincode: '24231',
          phone: '0505555555',
          notes: ''
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'failed'
      }
    ];

    // Insert sample orders
    const orders = await Order.insertMany(sampleOrders);
    console.log(`Successfully seeded ${orders.length} orders`);

    // Display created orders
    orders.forEach(order => {
      console.log(`- Order ${order._id.toString().slice(-8)}: ${order.orderStatus} - $${order.totalAmount}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
