import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, TextField, Button, MenuItem, List, ListItem, ListItemText, Slider, Box, Grid, Divider, CircularProgress } from '@mui/material';

// Define default utilities for each category
const categoryUtilityMap = {
  'Food': 1,
  'Transport': 5,
  'Shopping': 7,
  'Housing': 2,
  'Entertainment': 6,
  'Education': 3,
  'Healthcare': 4,
  'Others': 8
};

const AddExpense = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    utility: 5,
  });
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch expenses with error handling
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.get('https://expensetracker-backend-kfz1.onrender.com/api/expenses', {
        headers: { 'x-auth-token': token },
      });

      setExpenses(res.data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      // Handle specific error cases
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []); // Removed 'expenses' from dependency array to prevent infinite loop


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If category is changing, update utility based on category
    if (name === 'category') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        utility: categoryUtilityMap[value] || 5 // Fallback to 5 if category not found
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUtilityChange = (e, newValue) => {
    setFormData(prev => ({ ...prev, utility: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare the data with proper date formatting
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        utility: parseInt(formData.utility),
        // Date is already in YYYY-MM-DD format from the date input
      };

      if (editingExpense) {
        const res = await axios.put(
          `https://expensetracker-backend-kfz1.onrender.com/api/expenses/${editingExpense._id}`,
          payload,
          { headers: { 'x-auth-token': token } }
        );

        setExpenses(prev => 
          prev.map(expense => expense._id === editingExpense._id ? res.data : expense)
        );
        setEditingExpense(null);
      } else {
        const res = await axios.post(
          'https://expensetracker-backend-kfz1.onrender.com/api/expenses',
          payload,
          { headers: { 'x-auth-token': token } }
        );

        setExpenses(prev => [...prev, res.data]);
      }

      // Reset form
      setFormData({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        utility: 5,
      });
    } catch (err) {
      console.error('Error saving expense:', err);
      // Handle specific error cases
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`https://expensetracker-backend-kfz1.onrender.com/api/expenses/${id}`, {
        headers: { 'x-auth-token': token },
      });

      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description,
      utility: expense.utility || 5,
    });
    
    // Scroll to form after a small delay
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1E1E2F 30%, #252544 100%)",
      color: "#ffffff",
      py: 5
    }}>
      <Container maxWidth="md">
        {/* Add/Edit Expense Form */}
        <Paper 
        ref={formRef}
        sx={{
          p: 4,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: 3,
        }}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            {editingExpense ? 'Edit Expense' : 'Add Expense'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Amount Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: 1 }}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>

              {/* Category Field - Now will update utility when changed */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: 1 }}
                >
                  {Object.keys(categoryUtilityMap).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category} 
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

               {/* Date Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: 1 }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0] // Prevent future dates
                  }}
                />
              </Grid>

              {/* Description Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: 1 }}
                />
              </Grid>

              {/* Priority Slider */}
              <Grid item xs={12}>
                <Typography sx={{ color: '#fff', mb: 1 }}>Priority (1-10): {formData.utility}</Typography>
                <Slider
                  value={formData.utility}
                  onChange={handleUtilityChange}
                  step={1}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ color: '#FFC107' }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#1976D2',
                    '&:hover': { bgcolor: '#1565C0' },
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: 2,
                  }}
                  disabled={isLoading}
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Expenses List */}
        <Typography variant="h5" sx={{ color: '#fff', mt: 6, mb: 3, fontWeight: 'bold' }}>
          Expenses
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{
            p: 3,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            boxShadow: 3,
          }}>
            <List>
              {expenses.length === 0 ? (
                <Typography textAlign="center" sx={{ color: '#fff' }}>
                  No expenses found
                </Typography>
              ) : (
                expenses.map((expense) => (
                  <ListItem key={expense._id} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                    <ListItemText
                      primary={`${expense.category}: $${expense.amount.toFixed(2)}`}
                      primaryTypographyProps={{ sx: { color: '#fff', fontWeight: 'bold' } }}
                      secondary={`${formatDisplayDate(expense.date)} - ${expense.description} (Priority: ${expense.utility || 'N/A'})`}
                      secondaryTypographyProps={{ sx: { color: '#ddd' } }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleEditExpense(expense)}
                      sx={{ mr: 2, bgcolor: '#F57C00', '&:hover': { bgcolor: '#E65100' } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteExpense(expense._id)}
                      sx={{ bgcolor: '#D32F2F', '&:hover': { bgcolor: '#B71C1C' } }}
                    >
                      Delete
                    </Button>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default AddExpense;
