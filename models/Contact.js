const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
      maxlength: [254, 'Email must not exceed 254 characters'],
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
