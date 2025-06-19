import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, we'll simulate a successful submission
      setSuccess('Message sent successfully! We will get back to you within 24 hours.');
      setError('');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setError('Error sending message. Please try again later.');
      setSuccess('');
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 30, color: '#1976d2' }} />,
      title: 'Email Support',
      description: 'support@evidyasaathi.com',
      subtitle: 'For technical support and general inquiries',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 30, color: '#2e7d32' }} />,
      title: 'Phone Support',
      description: '+91-7032076051',
      subtitle: 'Available during business hours',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 30, color: '#ed6c02' }} />,
      title: 'Office Address',
      description: 'E-Vidya Saathi Campus, Tech Hub, Bangalore, Karnataka, India',
      subtitle: 'Main administrative office',
    },
  ];

  const supportCategories = [
    {
      title: 'Technical Support',
      description: 'Help with platform usage, login issues, and technical problems',
      icon: <SupportIcon />,
      color: '#1976d2',
    },
    {
      title: 'Academic Support',
      description: 'Course-related questions, enrollment, and academic guidance',
      icon: <SchoolIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Business Inquiries',
      description: 'Partnership opportunities, institutional collaborations',
      icon: <BusinessIcon />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
            mb: 4,
            mt: 2
          }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Get in Touch
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
              We're here to help and answer any questions you might have
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 500, mx: 'auto', mt: 2, opacity: 0.8 }}>
              Whether you need technical support, have academic questions, or want to explore collaboration opportunities, 
              our team is ready to assist you.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} lg={7}>
              <Paper sx={{ p: 4, borderRadius: 2, height: 'fit-content' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                  Send us a Message
                </Typography>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        placeholder="Please describe your inquiry in detail..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{ 
                          borderRadius: 2, 
                          py: 1.5, 
                          px: 4,
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                          }
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} lg={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Contact Info Cards */}
                {contactInfo.map((contact, index) => (
                  <Paper key={index} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ mt: 0.5 }}>
                        {contact.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {contact.title}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {contact.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}

                {/* Office Hours */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 30, color: '#7b1fa2' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Office Hours
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Monday - Friday: 9:00 AM - 6:00 PM IST
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Saturday: 10:00 AM - 2:00 PM IST
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sunday: Closed
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* Support Categories */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold', mb: 4 }}>
              How Can We Help You?
            </Typography>
            <Grid container spacing={3}>
              {supportCategories.map((category, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: `${category.color}20`,
                        mb: 2
                      }}>
                        <Box sx={{ color: category.color }}>
                          {category.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* FAQ Section */}
          <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
              Frequently Asked Questions
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    How do I reset my password?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    How can I enroll in a course?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse available courses in the Courses section and click "Enroll" on your desired course.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    How do I track my attendance?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your attendance is automatically tracked when you attend classes. View your records in the Attendance section.
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    How can I apply for placements?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visit the Placements section to view available job opportunities and submit your applications.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Developer Info - Full Width Footer */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Platform Developer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                fontSize: '2rem',
                fontWeight: 'bold',
                mr: 2
              }}>
                A
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Akanksha
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Full Stack Developer & Platform Architect
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Email:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  akanksha20628@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Phone:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  +91-7032076051
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label="MERN Stack Expert" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  mr: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }} 
              />
              <Chip 
                label="React.js Developer" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  mr: 1,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }} 
              />
              <Chip 
                label="Node.js Backend" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }} 
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact; 