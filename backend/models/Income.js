const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  month: { type: Number }, // 1-12
  year: { type: Number }
});

// Add pre-save hook for automatic month/year calculation
incomeSchema.pre('save', function(next) {
  const date = this.date || new Date();
  this.month = date.getUTCMonth() + 1; // 1-12
  this.year = date.getUTCFullYear();
  next();
});

module.exports = mongoose.model('Income', incomeSchema);