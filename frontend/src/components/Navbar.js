import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import image from '../components/logo3.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        background: isHomePage
          ? 'white'
          : 'linear-gradient(135deg, #1E1E2F 30%, #252544 100%)',
        boxShadow: 'none',
        transition: 'background 0.3s ease-in-out',
      }}
    >
      <Toolbar>
        {/* Logo Image Instead of Title */}
        <Box
          component="img"
          src={image}
          alt="Expense Tracker Logo"
          sx={{ height: 40 }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {token ? (
          <>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isDashboardPage ? '#1E90FF' : '#2E8B57' },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isDashboardPage ? '#1E90FF' : '#2E8B57' },
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/add-expense')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isDashboardPage ? '#1E90FF' : '#2E8B57' },
              }}
            >
              Expenses
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/add-income')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isDashboardPage ? '#1E90FF' : '#2E8B57' },
              }}
            >
              Incomes
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isDashboardPage ? '#1E90FF' : '#2E8B57' },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => scrollToSection('home')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('features')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              Services
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('faq')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              FAQ
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('about')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('contact')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              Contact
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                color: isHomePage ? '#000' : '#fff',
                '&:hover': { color: isHomePage ? '#2E8B57' : '#1E90FF' },
              }}
            >
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
