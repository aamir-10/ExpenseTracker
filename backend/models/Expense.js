const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  utility: { type: Number, required: true, default: 1 },
  date: { type: Date, default: Date.now },
  description: { type: String },
  month: { type: Number }, // Will store 1-12
  year: { type: Number }   // Full year (e.g., 2023)
});

// Add pre-save hook to automatically set month/year
expenseSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('date')) {
    const date = this.date || new Date();
    this.month = date.getMonth() + 1; // 1-12
    this.year = date.getFullYear();
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);

