import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, TextField, Button, useScrollTrigger, Fab, Zoom } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import image from '../pages/10191042.jpg';

// Scroll to top component
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#home');
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (using token in localStorage)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const features = [
    { title: 'Expense Tracking', description: 'Track your daily expenses with ease.', icon: <TrendingUpIcon fontSize="large" /> },
    { title: 'Income Management', description: 'Log your income and stay on top of your finances.', icon: <AccountBalanceWalletIcon fontSize="large" /> },
    { title: 'Budget Optimization', description: 'Optimize your budget with smart suggestions.', icon: <BarChartIcon fontSize="large" /> },
    { title: 'Visual Reports', description: 'Get insights with beautiful charts and graphs.', icon: <InsightsIcon fontSize="large" /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handlePrimaryAction = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center" justifyContent="center" mt={5} id="home">
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              {isAuthenticated ? 'Welcome Back!' : 'Welcome to Expense Tracker'}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {isAuthenticated 
                ? 'Ready to track your expenses?' 
                : 'Track your expenses and incomes effortlessly.'}
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ mt: 3, borderRadius: 5, px: 4, py: 1.5 }}
                onClick={handlePrimaryAction}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </motion.div>
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                
              </motion.div>
            )}
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Box 
              component="img" 
              src={image} 
              alt="Expense Tracking" 
              sx={{ 
                width: '100%', 
                maxHeight: 650, 
                borderRadius: 2,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }} 
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Box mt={15} id="features">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
                margin: '16px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            {isAuthenticated ? 'Your Financial Tools' : 'Transform Your Financial Journey'}
          </Typography>
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveFeature(index)}
                onHoverEnd={() => setActiveFeature(null)}
              >
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    borderRadius: 3, 
                    boxShadow: 3,
                    minHeight: 250,
                    background: activeFeature === index ? 
                      'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(76, 175, 80, 0.1))' : 
                      'white',
                    border: activeFeature === index ? '1px solid #1976D2' : '1px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent>
                    <motion.div
                      animate={{
                        scale: activeFeature === index ? 1.2 : 1,
                        rotate: activeFeature === index ? 360 : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2, 
                        color: activeFeature === index ? '#4CAF50' : '#1976D2'
                      }}>
                        {feature.icon}
                      </Box>
                    </motion.div>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About Us Section */}
      <Box mt={15} id="about">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
                margin: '16px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            About Us
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Welcome to Expense Tracker, a smarter way to manage your finances. Our goal is to empower individuals by providing them with an intuitive platform that simplifies expense tracking, income management, and financial planning.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Our platform offers a seamless user experience, built with advanced features to help you make informed decisions. From easy tracking of daily expenses to detailed visual reports, we provide everything you need to stay on top of your finances.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            At Expense Tracker, we are committed to privacy and security. Your data is encrypted and protected with the latest security protocols, ensuring that your financial information remains safe.
          </Typography>
        </motion.div>

        <Box mt={6} textAlign="center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            
          </motion.div>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box mt={15} id="faq">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
                margin: '16px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            Frequently Asked Questions
          </Typography>
        </motion.div>
        
        {[
          { question: 'How do I track my expenses?', answer: 'You can log in to your account, add expenses, and view reports under the dashboard section.' },
          { question: 'Is my data secure?', answer: 'Yes, we use encryption and secure authentication to protect your financial data.' },
          { question: 'Can I access my data on multiple devices?', answer: 'Yes, your data is synced securely and can be accessed from any device.' },
          { question: 'Is there a mobile app?', answer: 'We are working on a mobile app, but you can use the web app on your phone seamlessly.' }
        ].map((faq, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            sx={{ mb: 2 }}
          >
            <Accordion
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                '&:before': {
                  display: 'none'
                },
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <AccordionSummary 
                expandIcon={
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExpandMoreIcon />
                  </motion.div>
                }
                sx={{
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#e9ecef'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>

      {/* Contact Section */}
      {/* Contact Section */}
<Box mt={15} mb={10} id="contact">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Typography 
      variant="h3" 
      align="center" 
      gutterBottom
      sx={{
        fontWeight: 'bold',
        mb: 6,
        position: 'relative',
        '&:after': {
          content: '""',
          display: 'block',
          width: '80px',
          height: '4px',
          background: 'linear-gradient(45deg, #1976D2, #4CAF50)',
          margin: '16px auto 0',
          borderRadius: '2px'
        }
      }}
    >
      Contact Us
    </Typography>
  </motion.div>
  
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
      Have any questions, feedback, or need support? We're here to assist you.
    </Typography>
  </motion.div>
  
  <Grid container justifyContent="center">
    <Grid item xs={12} sm={8} md={6}>
      <AnimatePresence>
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Thank You!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your message has been sent successfully. We'll get back to you soon.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch("https://formspree.io/f/mblgkvkq", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      },
                      body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        message: formData.message
                      })
                    });
                    
                    if (response.ok) {
                      setSubmitted(true);
                      setFormData({ name: '', email: '', message: '' }); // Reset form
                    } else {
                      console.error('Submission failed');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}
              >
                <motion.div whileHover={{ scale: 1.01 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    margin="normal"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={4}
                    margin="normal"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <Box mt={4} textAlign="center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      sx={{ px: 5, py: 1.5, borderRadius: 5 }}
                    >
                      Send Message
                    </Button>
                  </motion.div>
                </Box>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Grid>
  </Grid>
  
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    viewport={{ once: true }}
  >
    <Typography variant="body2" align="center" color="textSecondary" mt={4}>
      Or reach us directly at: <strong>expensetracker.helpdesk@gmail.com</strong>
    </Typography>
  </motion.div>
</Box>
      <ScrollTop>
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Container>
  );
};

export default Home;