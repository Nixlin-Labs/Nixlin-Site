const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: [true, 'Service is required'],
      enum: ['website', 'application', 'seo', 'marketing', 'not-sure'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name must not exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
      maxlength: [254, 'Email must not exceed 254 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone number must not exceed 30 characters'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [2000, 'Project description must not exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'website',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model overwrite errors in development
module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
