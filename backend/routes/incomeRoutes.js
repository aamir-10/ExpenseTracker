const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');

// Helper function to parse dates
const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

// Add Income
router.post('/', auth, async (req, res) => {
  try {
    const { amount, source, description, date } = req.body;
    
    const income = new Income({
      userId: req.userId,
      amount,
      source,
      description,
      date: parseDate(date)
      // month/year will be auto-set by pre-save hook
    });

    await income.save();
    res.status(201).json(income);
  } catch (err) {
    console.error('Error adding income:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Monthly Incomes
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const query = { userId: req.userId };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    
    const incomes = await Income.find(query)
      .select('amount source description date month year')
      .sort({ date: -1 });
      
    res.json(incomes);
  } catch (err) {
    console.error('Error fetching monthly incomes:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All Incomes
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId })
      .select('amount source description date month year')
      .sort({ date: -1 });
      
    res.json(incomes);
  } catch (err) {
    console.error('Error fetching incomes:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Income
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, source, date, description } = req.body;
    
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ msg: 'Income not found' });
    }

    if (income.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    income.amount = amount;
    income.source = source;
    income.description = description;
    
    if (date) {
      const newDate = parseDate(date);
      if (newDate.toString() !== 'Invalid Date') {
        income.date = newDate;
      }
    }

    await income.save();
    res.json(income);
  } catch (err) {
    console.error('Error updating income:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Income
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ msg: 'Income not found' });
    }

    if (income.userId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Income deleted successfully' });
  } catch (err) {
    console.error('Error deleting income:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;