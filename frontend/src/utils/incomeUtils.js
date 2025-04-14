// utils/incomeUtils.js
export const calculateMonthlyTotals = (incomes) => {
    const monthlyData = {};
    
    incomes.forEach(income => {
      const key = `${income.year}-${income.month}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          year: income.year,
          month: income.month,
          total: 0,
          sources: {}
        };
      }
      
      monthlyData[key].total += income.amount;
      
      if (!monthlyData[key].sources[income.source]) {
        monthlyData[key].sources[income.source] = 0;
      }
      monthlyData[key].sources[income.source] += income.amount;
    });
    
    return Object.values(monthlyData);
  };
  
  export const calculateIncomeBySource = (incomes) => {
    const sourceData = {};
    
    incomes.forEach(income => {
      if (!sourceData[income.source]) {
        sourceData[income.source] = 0;
      }
      sourceData[income.source] += income.amount;
    });
    
    return sourceData;
  };