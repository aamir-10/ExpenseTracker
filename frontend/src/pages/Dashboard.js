import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box, MenuItem, Select, TextField, Divider, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import Charts from '../components/Charts';
import MonthYearSelector from '../components/MonthYearSelector';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardHover = {
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalContent = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  }
};
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState([]);
  const [optimizedExpenses, setOptimizedExpenses] = useState([]);
  const [method, setMethod] = useState("utility");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [prevMonthIncome, setPrevMonthIncome] = useState(0);
  
  // Expense limit states
  const [expenseLimit, setExpenseLimit] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);

  // Fetch expense limit
  const fetchExpenseLimit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://expensetracker-backend-kfz1.onrender.com/api/user/get-expense-limit',
        { headers: { 'x-auth-token': token } }
      );
      setExpenseLimit(response.data.limit);
    } catch (err) {
      console.error("Error fetching expense limit:", err);
    }
  };

  // Save expense limit
  const saveExpenseLimit = async (newLimit) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://expensetracker-backend-kfz1.onrender.com/api/user/set-expense-limit',
        { limit: newLimit },
        { headers: { 'x-auth-token': token } }
      );
      setExpenseLimit(newLimit);
      setShowLimitModal(false);
    } catch (err) {
      console.error("Error saving expense limit:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
  
        // Fetch current month's expenses
        const expensesRes = await axios.get(
          `https://expensetracker-backend-kfz1.onrender.com/api/expenses/monthly?month=${selectedMonth}&year=${selectedYear}`, 
          { headers: { 'x-auth-token': token } }
        );
        setExpenses(expensesRes.data);
  
        // Fetch current month's incomes
        const incomesRes = await axios.get(
          `https://expensetracker-backend-kfz1.onrender.com/api/incomes/monthly?month=${selectedMonth}&year=${selectedYear}`,
          { headers: { 'x-auth-token': token } }
        );
        setIncomes(incomesRes.data);
  
        // Calculate previous month and year
        let prevMonth = selectedMonth - 1;
        let prevYear = selectedYear;
        if (prevMonth === 0) { // Handle January case
          prevMonth = 12;
          prevYear -= 1;
        }
  
        // Fetch previous month's incomes
        const prevIncomesRes = await axios.get(
          `https://expensetracker-backend-kfz1.onrender.com/api/incomes/monthly?month=${prevMonth}&year=${prevYear}`,
          { headers: { 'x-auth-token': token } }
        );
  
        // Calculate total previous month income
        const prevIncomeTotal = prevIncomesRes.data.reduce((sum, income) => sum + income.amount, 0);
        setPrevMonthIncome(prevIncomeTotal);

        // Fetch expense limit
        await fetchExpenseLimit();
  
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
  const netSavings = totalIncomes - totalExpenses;
  // Check if limit is exceeded
  useEffect(() => {
    if (expenseLimit > 0 && totalExpenses > expenseLimit) {
      setLimitExceeded(true);
    } else {
      setLimitExceeded(false);
    }
  }, [totalExpenses, expenseLimit]);

  

  const optimizeBudget = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `https://expensetracker-backend-kfz1.onrender.com/api/expenses/optimize?month=${selectedMonth}&year=${selectedYear}&budget=${budget}&method=${method}`,
        { headers: { 'x-auth-token': token } }
      );
      
      if (response.data.success) {
        setOptimizedExpenses(response.data.data);
      }
    } catch (err) {
      console.error("Optimization Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setOptimizedExpenses([]); // Clear previous optimizations when month changes
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: "100vh",
        background: limitExceeded 
          ? "linear-gradient(135deg, #1E1E2F 30%, #450909 100%)" 
          : "linear-gradient(135deg, #1E1E2F 30%, #252544 100%)",
        color: "#ffffff",
        padding: "96px 0 0"
      }}
    >
      <Container maxWidth="lg">
        {/* Dashboard Title */}
        <motion.div variants={itemVariants}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: '#fff', mb: 4 }}>
            Dashboard
          </Typography>
        </motion.div>

        {/* Month/Year Selector */}
        <motion.div variants={itemVariants}>
          <MonthYearSelector 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onChange={handleMonthYearChange}
          />
        </motion.div>

        {/* Limit Exceeded Alert */}
        <AnimatePresence>
          {limitExceeded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Box sx={{
                mt: 3,
                p: 2,
                bgcolor: 'error.main',
                color: 'white',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography>
                  ⚠️ You've exceeded your monthly expense limit of ${expenseLimit.toFixed(2)}
                </Typography>
                <Button 
                  color="inherit"
                  onClick={() => setShowLimitModal(true)}
                >
                  Adjust Limit
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Cards */}
        <Grid container spacing={3} mt={3} justifyContent="center">
          {[
            { 
              title: "Total Expenses", 
              value: totalExpenses.toFixed(2), 
              color: "#FF5252",
              extra: expenseLimit > 0 ? (
                <>
                  <Typography variant="body2">
                    {Math.min(100, (totalExpenses / expenseLimit * 100)).toFixed(0)}% of limit
                  </Typography>
                  <Box sx={{ 
                    width: '100%', 
                    height: 4, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    mt: 1,
                    borderRadius: 2
                  }}>
                    <Box sx={{ 
                      width: `${Math.min(100, (totalExpenses / expenseLimit * 100))}%`, 
                      height: '100%', 
                      bgcolor: totalExpenses > expenseLimit ? 'error.main' : 'success.main',
                      borderRadius: 2
                    }} />
                  </Box>
                </>
              ) : totalIncomes > 0 ? `Expense Ratio: ${(totalExpenses / totalIncomes * 100).toFixed(2)}%` : "No limit set"
            },
            { 
              title: "Total Income", 
              value: totalIncomes.toFixed(2), 
              color: "#4CAF50",
              extra: prevMonthIncome > 0 ? `Growth Rate: ${((totalIncomes - prevMonthIncome) / prevMonthIncome * 100).toFixed(2)}%` : "No previous data"
            },
            { 
              title: "Net Savings", 
              value: netSavings.toFixed(2), 
              color: netSavings >= 0 ? "#FFC107" : "#FF5252",
              extra: totalIncomes > 0 ? `Savings Rate: ${(netSavings / totalIncomes * 100).toFixed(2)}%` : "No income recorded"
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                variants={cardHover}
              >
                <Card sx={{
                  background: `rgba(255, 255, 255, 0.1)`,
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  textAlign: "center",
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: item.color, mb: 2 }}>{item.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">${item.value}</Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                      {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                    </Typography>
                    {item.extra && (
                      <Box>
                        {typeof item.extra === 'string' ? (
                          <Typography variant="body2" mt={1} sx={{ opacity: 0.8 }}>
                            {item.extra}
                          </Typography>
                        ) : (
                          item.extra
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <motion.div variants={itemVariants}>
          <Box mt={6} textAlign="center">
            <Button 
              variant="contained" 
              sx={{ mx: 2, bgcolor: "#1976D2", '&:hover': { bgcolor: "#1565C0" }, px: 4, py: 1.5 }} 
              onClick={() => navigate('/add-expense')}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Expense
            </Button>
            <Button 
              variant="contained" 
              sx={{ mx: 2, bgcolor: "#1976D2", '&:hover': { bgcolor: "#1565C0" }, px: 4, py: 1.5 }} 
              onClick={() => navigate('/add-income')}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Income
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                mx: 2, 
                color: "#fff", 
                borderColor: "#fff", 
                '&:hover': { borderColor: "#ddd" },
                px: 4, 
                py: 1.5 
              }} 
              onClick={() => setShowLimitModal(true)}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Set Expense Limit
            </Button>
          </Box>
        </motion.div>

        {/* Expense Limit Modal */}
        <AnimatePresence>
          {showLimitModal && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalBackdrop}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setShowLimitModal(false)}
            >
              <motion.div
                variants={modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <Paper sx={{
                  width: 400,
                  p: 4,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="h6" gutterBottom>
                    Set Monthly Expense Limit
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    label="Limit Amount"
                    value={expenseLimit}
                    onChange={(e) => setExpenseLimit(parseFloat(e.target.value))}
                    sx={{ my: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      onClick={() => setShowLimitModal(false)} 
                      sx={{ mr: 2 }}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => saveExpenseLimit(expenseLimit)}
                      disabled={isNaN(expenseLimit) || expenseLimit <= 0}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Limit
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Financial Insights */}
        <motion.div variants={itemVariants}>
          <Paper sx={{ 
            mt: 6, 
            p: 4, 
            bgcolor: "rgba(255, 255, 255, 0.1)", 
            backdropFilter: "blur(10px)", 
            borderRadius: 3 
          }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              📈 Financial Insights
            </Typography>
            <Divider sx={{ bgcolor: "#ffffff", mb: 4 }} />

            <Grid container spacing={4}>
              {/* First Row - Pie Charts */}
              <Grid container item spacing={4} xs={12}>
                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Typography variant="h6" textAlign="center" sx={{ color: '#fff', mb: 2 }}>
                      Expense Breakdown
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: "rgba(0,0,0,0.2)",
                      borderRadius: 3
                    }}>
                      {expenses.length > 0 ? (
                        <Charts type="pie" expenses={expenses} incomes={incomes} />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#aaa' }}>
                          No expense data available
                        </Typography>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Typography variant="h6" textAlign="center" sx={{ color: '#fff', mb: 2 }}>
                      Income Sources
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: "rgba(0,0,0,0.2)",
                      borderRadius: 3
                    }}>
                      {incomes.length > 0 ? (
                        <Charts type="income-pie" expenses={expenses} incomes={incomes} />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#aaa' }}>
                          No income data available
                        </Typography>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Second Row - Daily Trends */}
              <Grid item xs={12}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Typography variant="h5" textAlign="center" sx={{ color: '#fff', mb: 2 }}>
                    Daily Transactions
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    height: 400, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: "rgba(0,0,0,0.2)",
                    borderRadius: 3
                  }}>
                    {(expenses.length > 0 || incomes.length > 0) ? (
                      <Charts 
                        type="daily-line" 
                        expenses={expenses} 
                        incomes={incomes} 
                        month={selectedMonth} 
                        year={selectedYear} 
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#aaa' }}>
                        No transaction data available
                      </Typography>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Budget Optimization Section */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              height: "100%",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: "#fff", fontWeight: "bold", mb: 3 }}>
              🏦 Budget Optimization
            </Typography>
            <Divider sx={{ bgcolor: "#ffffff", opacity: 0.2, mb: 4 }} />

            {/* Budget Input Section */}
            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              flexWrap="wrap"
            >
              <motion.div whileHover={{ scale: 1.03 }}>
                <TextField
                  type="number"
                  label="Enter Budget"
                  variant="outlined"
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    width: 200,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  }}
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }}>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    width: 200,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <MenuItem value="utility">Max Utility Selection</MenuItem>
                  <MenuItem value="proportional">Proportional Reduction</MenuItem>
                </Select>
              </motion.div>
              
              <Button
                variant="contained"
                onClick={optimizeBudget}
                disabled={loading || budget <= 0}
                sx={{
                  bgcolor: "#F57C00",
                  '&:hover': { bgcolor: "#E65100" },
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Optimizing..." : "Optimize"}
              </Button>
            </Box>

            {optimizedExpenses.length > 0 && (
              <Box mt={5}sx={{ width: "100%",maxHeight:"1600px", maxWidth: "1700px", mx: "auto", py: 4 }}>
                <Typography variant="h5" textAlign="center" sx={{ color: "#fff", fontWeight: "bold", mb: 3 }}>
                  Optimized Expenses for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                </Typography>

                {/* Optimization Summary */}
                <Paper
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: 3,
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                  }}
                >
                 <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Typography variant="h6" sx={{ color: "#FFC107", fontWeight: "bold" }}>
                        Total Budget:
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        ${budget.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Typography variant="h6" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
                        Allocated:
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        ${optimizedExpenses.reduce((sum, exp) => sum + exp.allocatedAmount, 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                </Paper>

                {/* Optimized Expenses Grid */}
                <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", p: 2, justifyContent: "center" }}>
                  <Grid container spacing={3} rowSpacing={10} justifyContent="center" alignItems="stretch">
                    {optimizedExpenses.map((exp) => (
                      <Grid item xs={12} sm={6} md={4} key={exp.category}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: "rgba(6, 6, 6, 0.25)",
                              backdropFilter: "blur(8px)",
                              color: "#fff",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                              {exp.category}
                            </Typography>

                            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="subtitle2">Allocated:</Typography>
                              <Typography variant="h5" fontWeight="bold" sx={{ color: "#4CAF50" }}>
                                ${exp.allocatedAmount ? exp.allocatedAmount.toFixed(2) : "0.00"}
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="subtitle2">Last Month:</Typography>
                              <Typography variant="body1">
                                ${exp.previousMonthAmount ? exp.previousMonthAmount.toFixed(2) : "N/A"}
                              </Typography>
                            </Box>

                            <Typography variant="caption" sx={{ color: "#aaa", fontStyle: "italic" }}>
                              {exp.recommendationNote || "No recommendation available"}
                            </Typography>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
