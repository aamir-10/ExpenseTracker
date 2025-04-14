import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, TextField, Button, MenuItem, List, ListItem, ListItemText, Box, Grid, Divider, CircularProgress } from '@mui/material';

const AddIncome = () => {
  const formRef = useRef(null); // Create a ref for the form container
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [incomes, setIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.get('https://expensetracker-backend-kfz1.onrender.com/api/incomes/monthly', {
        headers: { 'x-auth-token': token },
      });

      setIncomes(res.data || []);
    } catch (err) {
      console.error('Error fetching incomes:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingIncome) {
        const res = await axios.put(
          `https://expensetracker-backend-kfz1.onrender.com/api/incomes/${editingIncome._id}`,
          payload,
          { headers: { 'x-auth-token': token } }
        );
        setIncomes(prev => 
          prev.map(income => income._id === editingIncome._id ? res.data : income)
        );
        setEditingIncome(null);
      } else {
        const res = await axios.post(
          'https://expensetracker-backend-kfz1.onrender.com/api/incomes',
          payload,
          { headers: { 'x-auth-token': token } }
        );
        setIncomes([...incomes, res.data]);
      }

      setFormData({
        amount: '',
        source: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (err) {
      console.error('Error saving income:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`https://expensetracker-backend-kfz1.onrender.com/api/incomes/${id}`, {
        headers: { 'x-auth-token': token },
      });

      setIncomes(prev => prev.filter(income => income._id !== id));
    } catch (err) {
      console.error('Error deleting income:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount.toString(),
      source: income.source,
      date: new Date(income.date).toISOString().split('T')[0],
      description: income.description,
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
        <Paper ref={formRef}
          sx={{
          p: 4,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: 3,
        }}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            {editingIncome ? 'Edit Income' : 'Add Income'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff', borderRadius: 1 }}
                >
                  <MenuItem value="Salary">Salary</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Bonus">Bonus</MenuItem>
                  <MenuItem value="Investment">Investment</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

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
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>

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
                  {editingIncome ? 'Update Income' : 'Add Income'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h5" sx={{ color: '#fff', mt: 6, mb: 3, fontWeight: 'bold' }}>
          Incomes
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
              {incomes.length === 0 ? (
                <Typography textAlign="center" sx={{ color: '#fff' }}>
                  No incomes found
                </Typography>
              ) : (
                incomes.map((income) => (
                  <ListItem key={income._id} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                    <ListItemText
                      primary={`${income.source}: $${income.amount.toFixed(2)}`}
                      primaryTypographyProps={{ sx: { color: '#fff', fontWeight: 'bold' } }}
                      secondary={`${formatDisplayDate(income.date)} - ${income.description}`}
                      secondaryTypographyProps={{ sx: { color: '#ddd' } }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleEditIncome(income)}
                      sx={{ mr: 2, bgcolor: '#F57C00', '&:hover': { bgcolor: '#E65100' } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteIncome(income._id)}
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

export default AddIncome;
