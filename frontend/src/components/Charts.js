import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Housing', 'Entertainment', 'Education', 'Healthcare', 'Others'
];

const EXPENSE_COLORS = ['#4CAF50',  // Professional Green (Stable Income)
  '#F0E68C',  // Energetic Amber (Independent Work)
  '#9C27B0',  // Royal Purple (Growth/Sophistication)
  '#DC143C',
  '#2196F3',  // Trustworthy Blue (Catch-All)
  '#E91E63',  // Bold Pink (Personal Spending)
  '#D3D3D3',  // Cool Grey (Savings/Emergency)
  '#20B2AA'   // Deep Blue (Investments)
  ];
const INCOME_COLORS=[
  '#00BCD4',  // Cyan (Fresh & Modern)
  '#FF5722',  // Deep Orange (Energetic Contrast)
  '#8BC34A',  // Lime Green (Balance & Growth)
  '#F08080',
  '#BDBDBD'   // Light Grey (Neutral Accent)
]
const INCOME_COLOR = '#4CAF50';
const EXPENSE_COLOR = '#FF5252';
const SAVINGS_COLOR = '#FFC107';

const Charts = ({ type, expenses, incomes, month, year }) => {
  const processExpenseData = () => {
    const categoryMap = {};
    EXPENSE_CATEGORIES.forEach(category => categoryMap[category] = 0);
    
    expenses.forEach(expense => {
      if (categoryMap.hasOwnProperty(expense.category)) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap['Others'] += expense.amount;
      }
    });
    
    return Object.keys(categoryMap).map(category => ({
      name: category,
      value: parseFloat(categoryMap[category].toFixed(2))
    }));
  };

  const processIncomeData = () => {
    const sourceMap = {};
    
    incomes.forEach(income => {
      if (!sourceMap[income.source]) {
        sourceMap[income.source] = 0;
      }
      sourceMap[income.source] += income.amount;
    });
    
    return Object.keys(sourceMap).map(source => ({
      name: source,
      value: parseFloat(sourceMap[source].toFixed(2))
    }));
  };

  const processDailyComparisonData = () => {
    const allTransactions = [...expenses, ...incomes].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    const uniqueDates = [...new Set(allTransactions.map(t => t.date))];
    
    return uniqueDates.map(date => {
      const dayExpenses = expenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const dayIncomes = incomes
        .filter(i => i.date === date)
        .reduce((sum, i) => sum + i.amount, 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        expenses: parseFloat(dayExpenses.toFixed(2)),
        incomes: parseFloat(dayIncomes.toFixed(2)),
        net: parseFloat((dayIncomes - dayExpenses).toFixed(2))
      };
    });
  };

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={processExpenseData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
              {processExpenseData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatCurrency} />
            <Legend />
          </PieChart>
        ) : type === 'income-pie' ? (
          <PieChart>
            <Pie
              data={processIncomeData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
              {processIncomeData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatCurrency} />
            <Legend />
          </PieChart>
        ) : type === 'daily-line' ? (
          <LineChart
            data={processDailyComparisonData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              formatter={formatCurrency}
              contentStyle={{ backgroundColor: '#333', borderColor: '#555', borderRadius: 4 }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="incomes" 
              name="Income" 
              stroke={INCOME_COLOR} 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses" 
              stroke={EXPENSE_COLOR} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              name="Net Savings" 
              stroke={SAVINGS_COLOR} 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        ) : (
          <LineChart
            data={processDailyComparisonData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={formatCurrency} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="incomes" 
              name="Income" 
              stroke={INCOME_COLOR} 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses" 
              stroke={EXPENSE_COLOR} 
              strokeWidth={2}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;









/*const INCOME_COLORS = [
  '#4CAF50',     // Professional green (stable income)
 '#FFC107',  // Energetic amber (independent work)
 '#9C27B0', // Royal purple (growth/sophistication)
 '#FF9800',      // Vibrant orange (special/extra)
  '#2196F3'      // Trustworthy blue (catch-all)
];*/