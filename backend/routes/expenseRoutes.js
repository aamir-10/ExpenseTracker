const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const { optimizeBudget } = require('../utils/budgetOptimizer');

// Helper function to parse and validate date
const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

// Get monthly expenses with proper date handling
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const query = { userId: req.userId };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    
    const expenses = await Expense.find(query)
      .select('amount category description utility date month year')
      .sort({ date: -1 }); // Newest first
      
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching monthly expenses:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all expenses with date handling
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .select('amount category description utility date month year')
      .sort({ date: -1 }); // Newest first
      
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add expense with proper date handling
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, description, utility, date } = req.body;
    
    // Parse and validate date
    const expenseDate = parseDate(date);
    
    const expense = new Expense({
      userId: req.userId,
      amount,
      category,
      description,
      utility: utility || 1,
      date: expenseDate
      // month/year will be auto-set by pre-save hook
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update expense with proper date handling
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, category, date, description, utility } = req.body;
    
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields including proper date handling
    expense.amount = amount;
    expense.category = category;
    expense.description = description;
    expense.utility = utility || expense.utility;
    
    // Only update date if provided and valid
    if (date) {
      const newDate = parseDate(date);
      if (newDate.toString() !== 'Invalid Date') {
        expense.date = newDate;
      }
    }

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Add this route to your expenseRoutes.js
router.get('/optimize', auth, async (req, res) => {
  try {
    const { month, year, budget, method } = req.query;
    
    // Validate inputs
    if (!month || !year || !budget) {
      return res.status(400).json({ 
        success: false,
        message: 'Month, year and budget are required parameters'
      });
    }

    const optimized = await optimizeBudget(
      req.userId,
      parseInt(month),
      parseInt(year),
      parseFloat(budget),
      method || "utility"
    );

    res.json({
      success: true,
      data: optimized,
      month,
      year,
      totalBudget: parseFloat(budget),
      optimizationMethod: method || "utility"
    });
  } catch (err) {
    console.error('Error optimizing budget:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to optimize budget',
      error: err.message
    });
  }
});
module.exports = router;