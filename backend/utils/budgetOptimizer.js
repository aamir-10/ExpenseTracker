const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// Helper function to get previous month's expenses
const getPreviousMonthExpenses = async (userId, prevMonth, prevYear) => {
  const results = await Expense.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        month: prevMonth,
        year: prevYear
      }
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        utility: { $first: "$utility" }
      }
    }
  ]);

  return results.map(item => ({
    category: item._id,
    previousAmount: item.totalAmount,
    utility: item.utility
  }));
};

// Main function: optimize budget based on previous month’s expenses
const optimizeBudget = async (userId, currentMonth, currentYear, budget, method = "utility") => {
  try {
    // Calculate previous month
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }

    // Get previous month's spending
    const previousExpenses = await getPreviousMonthExpenses(userId, prevMonth, prevYear);

    // Handle case where no previous month data is available
    if (previousExpenses.length === 0) {
      console.warn("No previous month data available. Using default allocations.");
      return defaultBudgetAllocation(budget);
    }

    if (method === "utility") {
      return optimizeUtility(previousExpenses, budget);
    } else if (method === "proportional") {
      return optimizeProportional(previousExpenses, budget);
    }

    throw new Error("Invalid optimization method");
  } catch (error) {
    console.error('Error in budget optimization:', error);
    throw error;
  }
};

// Default budget allocation if no previous data is available
const defaultBudgetAllocation = (budget) => {
  return [
    { category: "Essentials", allocatedAmount: budget * 0.5, recommendationNote: "50% allocated to essentials" },
    { category: "Savings", allocatedAmount: budget * 0.2, recommendationNote: "20% allocated to savings" },
    { category: "Discretionary", allocatedAmount: budget * 0.3, recommendationNote: "30% allocated to discretionary spending" }
  ];
};

// Utility-based optimization (Lower utility values get higher priority)
const optimizeUtility = (expenses, budget) => {
  // Sort by utility in ascending order (lower utility = higher priority)
  const sortedExpenses = [...expenses].sort((a, b) => a.utility - b.utility);

  let remainingBudget = budget;
  const result = [];

  for (const expense of sortedExpenses) {
    if (remainingBudget <= 0) break;

    const maxAllowed = expense.previousAmount * 1.1; // Allow max 10% increase
    const allocated = Math.min(maxAllowed, remainingBudget);

    if (allocated > 0) {
      result.push({
        category: expense.category,
        allocatedAmount: allocated,
        previousMonthAmount: expense.previousAmount,
        utility: expense.utility,
        recommendationNote: getRecommendationNote(expense.previousAmount, allocated)
      });
      remainingBudget -= allocated;
    }
  }

  return result;
};

// Proportional allocation (Lower utility values get higher priority)
const optimizeProportional = (expenses, budget) => {
  // Sort by utility in ascending order (lower utility = higher priority)
  const sortedExpenses = [...expenses].sort((a, b) => a.utility - b.utility);
  const totalPrevious = sortedExpenses.reduce((sum, exp) => sum + exp.previousAmount, 0);

  // If budget covers everything, allocate fully
  if (totalPrevious <= budget) {
    return sortedExpenses.map(exp => ({
      category: exp.category,
      allocatedAmount: exp.previousAmount,
      previousMonthAmount: exp.previousAmount,
      utility: exp.utility,
      recommendationNote: "Full amount allocated within budget"
    }));
  }

  // Scale proportionally based on priority (utility)
  let remainingBudget = budget;
  const result = [];
  
  for (const expense of sortedExpenses) {
    if (remainingBudget <= 0) break;

    const proportionalAmount = (expense.previousAmount / totalPrevious) * budget;
    const allocated = Math.min(proportionalAmount, remainingBudget);

    if (allocated > 0) {
      result.push({
        category: expense.category,
        allocatedAmount: allocated,
        previousMonthAmount: expense.previousAmount,
        utility: expense.utility,
        recommendationNote: getRecommendationNote(expense.previousAmount, allocated)
      });
      remainingBudget -= allocated;
    }
  }

  return result;
};

// Helper function for recommendation notes
const getRecommendationNote = (previous, allocated) => {
  const percentageChange = ((allocated - previous) / previous) * 100;

  if (allocated >= previous) {
    return `Allocated same or increased by ${percentageChange.toFixed(1)}%`;
  } else {
    return `Reduced by ${Math.abs(percentageChange).toFixed(1)}% from last month`;
  }
};

module.exports = {
  optimizeBudget
};
