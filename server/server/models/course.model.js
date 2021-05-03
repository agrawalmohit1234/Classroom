const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: 'Category is required',
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  published: {
    type: Boolean,
    default: false,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
