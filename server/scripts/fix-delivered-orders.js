/**
 * Script to update old delivered orders
 * Run this once to fix existing delivered orders that don't have approved payment status
 * 
 * Usage: node server/scripts/fix-delivered-orders.js
 */

const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function fixDeliveredOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all delivered orders where payment status is not approved
    const deliveredOrders = await Order.find({
      orderStatus: 'delivered',
      $or: [
        { 'payment.status': { $ne: 'approved' } },
        { 'payment.status': null },
        { paymentStatus: { $ne: 'approved' } }
      ]
    });

    console.log(`Found ${deliveredOrders.length} delivered orders to fix`);

    let updated = 0;
    for (const order of deliveredOrders) {
      // Update payment status to approved for delivered orders
      if (order.payment) {
        order.payment.status = 'approved';
        order.payment.approvedAt = new Date();
        order.payment.approvedBy = 'system';
      } else {
        // Handle legacy orders without payment object
        order.payment = {
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: 'system',
          method: order.paymentMethod || 'COD'
        };
      }
      
      await order.save();
      updated++;
      console.log(`✅ Updated order ${order._id}`);
    }

    console.log(`\n✅ Successfully updated ${updated} orders`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixDeliveredOrders();

