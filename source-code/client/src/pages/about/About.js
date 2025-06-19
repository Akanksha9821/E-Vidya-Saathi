import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  Security as SecurityIcon,
  Computer as ComputerIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

function About() {
  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Digital Learning Platform',
      description: 'Modern e-learning environment with interactive courses and real-time collaboration tools.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'Student-Faculty Connect',
      description: 'Seamless communication between students and faculty with integrated messaging and feedback systems.',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      title: 'Career Development',
      description: 'Comprehensive placement assistance with job matching algorithms and skill development programs.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      title: 'Secure Environment',
      description: 'Advanced security protocols ensuring data privacy and safe online learning experience.',
    },
    {
      icon: <ComputerIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      title: 'Smart Analytics',
      description: 'AI-powered analytics for attendance tracking, performance monitoring, and personalized insights.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
      title: 'Progress Tracking',
      description: 'Real-time progress monitoring with detailed reports and performance analytics.',
    },
  ];

  const stats = [
    { label: 'Students', value: '5000+', color: '#1976d2' },
    { label: 'Faculty', value: '200+', color: '#2e7d32' },
    { label: 'Courses', value: '150+', color: '#ed6c02' },
    { label: 'Success Rate', value: '95%', color: '#d32f2f' },
  ];

  const values = [
    {
      title: 'Innovation in Education',
      description: 'Leveraging cutting-edge technology to transform traditional learning methods.',
    },
    {
      title: 'Student-Centric Approach',
      description: 'Every feature designed with student success and experience in mind.',
    },
    {
      title: 'Continuous Improvement',
      description: 'Regular updates and enhancements based on user feedback and emerging trends.',
    },
    {
      title: 'Accessibility & Inclusion',
      description: 'Ensuring equal access to quality education for all students.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
            mb: 4,
            mt: 2
          }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              E-Vidya Saathi
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
              Revolutionizing Education Through Technology
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mt: 2, opacity: 0.8 }}>
              A comprehensive digital learning platform designed to bridge the gap between traditional education 
              and modern technological needs, fostering an environment of continuous learning and growth.
            </Typography>
          </Box>

          {/* Mission Section */}
          <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              E-Vidya Saathi is dedicated to transforming the educational landscape by providing a comprehensive 
              digital platform that empowers students, faculty, and administrators. Our mission is to create an 
              inclusive, efficient, and engaging learning environment that adapts to the evolving needs of modern education.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              We believe in leveraging technology to enhance learning outcomes, streamline administrative processes, 
              and create meaningful connections between all stakeholders in the educational ecosystem.
            </Typography>
          </Paper>

          {/* Features Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
              Key Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    height: '100%', 
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Stats Section */}
          <Paper sx={{ p: 4, mb: 4, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold', mb: 3 }}>
              Platform Statistics
            </Typography>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Values Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
              Our Values
            </Typography>
            <Grid container spacing={3}>
              {values.map((value, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Technology Stack */}
          <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
              Technology Stack
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>Frontend</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    <Chip label="React.js" color="primary" />
                    <Chip label="Material-UI" color="secondary" />
                    <Chip label="Redux" color="info" />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>Backend</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    <Chip label="Node.js" color="primary" />
                    <Chip label="Express.js" color="secondary" />
                    <Chip label="JWT" color="info" />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>Database</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    <Chip label="MongoDB" color="primary" />
                    <Chip label="Mongoose" color="secondary" />
                    <Chip label="Atlas" color="info" />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>Features</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    <Chip label="Real-time" color="primary" />
                    <Chip label="Responsive" color="secondary" />
                    <Chip label="Secure" color="info" />
                  </Box>
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
              Developed By
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
                  Full Stack Developer
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Email:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  akanksha20628@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Phone:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  +91-7032076051
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default About; 