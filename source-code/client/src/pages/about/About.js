import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  School as SchoolIcon,
  Group as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

function About() {
  const features = [
    {
      icon: <SchoolIcon />,
      title: 'Quality Education',
      description: 'We provide high-quality education through experienced faculty and modern teaching methods.',
    },
    {
      icon: <GroupIcon />,
      title: 'Student Support',
      description: 'Our dedicated support team ensures students receive the help they need throughout their journey.',
    },
    {
      icon: <EmojiEventsIcon />,
      title: 'Career Development',
      description: 'We focus on developing students\' skills and preparing them for successful careers.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Safe Environment',
      description: 'We maintain a safe and secure environment for all our students and staff.',
    },
  ];

  const team = [
    {
      name: 'Dr. John Smith',
      role: 'Principal',
      image: '/images/team/principal.jpg',
    },
    {
      name: 'Dr. Sarah Johnson',
      role: 'Head of Academics',
      image: '/images/team/academics.jpg',
    },
    {
      name: 'Mr. Michael Brown',
      role: 'Placement Officer',
      image: '/images/team/placement.jpg',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About E-Vidya Saathi
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                E-Vidya Saathi is dedicated to providing quality education and fostering
                the growth of students through innovative learning methods and comprehensive
                support systems. We aim to create a nurturing environment where students
                can develop their skills and achieve their full potential.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Our Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" align="center" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Our Team
            </Typography>
            <Grid container spacing={3}>
              {team.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={member.image}
                      alt={member.name}
                    />
                    <CardContent>
                      <Typography variant="h6" align="center" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {member.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Our Values
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Excellence in Education"
                    secondary="We strive for excellence in all aspects of education and student development."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Inclusive Community"
                    secondary="We foster an inclusive environment that respects and values diversity."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmojiEventsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Continuous Improvement"
                    secondary="We continuously work to improve our programs and services."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Integrity and Ethics"
                    secondary="We maintain the highest standards of integrity and ethical conduct."
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default About; 