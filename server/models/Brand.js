const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم العلامة التجارية مطلوب'],
    unique: true,
    trim: true
  },
  nameEn: {
    type: String,
    required: [true, 'اسم العلامة التجارية بالإنجليزية مطلوب'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance (name and nameEn already have unique indexes)
brandSchema.index({ isActive: 1 });

module.exports = mongoose.model('Brand', brandSchema);
