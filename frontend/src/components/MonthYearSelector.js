import React from 'react';
import { Select, MenuItem, Grid, Typography, Box, Paper } from '@mui/material';

const MonthYearSelector = ({ selectedMonth, selectedYear, onChange }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Shows 5 years (2 past, current, 2 future)

  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="subtitle1" sx={{ color: '#fff', mr: 1 }}>
              Select Month:
            </Typography>
          </Grid>
          <Grid item>
            <Select
              value={selectedMonth}
              onChange={(e) => onChange(e.target.value, selectedYear)}
              sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 120 }}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" sx={{ color: '#fff', mr: 1 }}>
              Select Year:
            </Typography>
          </Grid>
          <Grid item>
            <Select
              value={selectedYear}
              onChange={(e) => onChange(selectedMonth, e.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 120 }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MonthYearSelector;