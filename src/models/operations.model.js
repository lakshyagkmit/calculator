const mongoose = require('mongoose');

// Model to store history of calculations done by user
const operationsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  operands: {
    type: [Number], 
    required: true,
  },
  operator: {
    type: String,
    required: true
  },
  result: {
    type: Number,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Operation', operationsSchema);
