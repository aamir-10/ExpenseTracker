const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/user/set-expense-limit
// @desc    Set user's expense limit
// @access  Private
router.post('/set-expense-limit', auth, async (req, res) => {
  try {
    // Validate request body
    const { limit } = req.body;
    if (typeof limit !== 'number' || limit < 0) {
      return res.status(400).json({ msg: 'Please provide a valid positive number' });
    }

    // Update user's expense limit
    const user = await User.findByIdAndUpdate(
      req.userId,  // Using req.userId from auth middleware
      { expenseLimit: limit },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ 
      success: true, 
      limit: user.expenseLimit,
      message: 'Expense limit updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/user/get-expense-limit
// @desc    Get user's expense limit
// @access  Private
router.get('/get-expense-limit', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('expenseLimit');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ 
      limit: user.expenseLimit || 0,
      message: 'Expense limit retrieved successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;