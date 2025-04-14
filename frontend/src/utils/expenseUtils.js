// utils/expenseUtils.js
export const calculateMonthlyTotals = (expenses) => {
    const monthlyData = {};
    
    expenses.forEach(expense => {
      const key = `${expense.year}-${expense.month}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          year: expense.year,
          month: expense.month,
          total: 0,
          categories: {}
        };
      }
      
      monthlyData[key].total += expense.amount;
      
      if (!monthlyData[key].categories[expense.category]) {
        monthlyData[key].categories[expense.category] = 0;
      }
      monthlyData[key].categories[expense.category] += expense.amount;
    });
    
    return Object.values(monthlyData);
  };