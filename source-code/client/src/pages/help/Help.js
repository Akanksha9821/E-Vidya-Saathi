import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

function Help() {
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email to create a new password.',
    },
    {
      question: 'How do I update my profile?',
      answer: 'You can update your profile by going to the Profile page and clicking on the "Edit Profile" button. Make your changes and click "Save".',
    },
    {
      question: 'How do I register for an event?',
      answer: 'To register for an event, go to the Events page, find the event you want to attend, and click on the "Register" button. Follow the registration form to complete your registration.',
    },
    {
      question: 'How do I apply for a job?',
      answer: 'To apply for a job, go to the Placements page, find the job you want to apply for, and click on the "Apply" button. Fill out the application form and submit your resume.',
    },
  ];

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email Support',
      description: 'support@evidyasaathi.com',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
    },
    {
      icon: <ChatIcon />,
      title: 'Live Chat',
      description: 'Available 24/7',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Help Center
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Frequently Asked Questions
              </Typography>
              {faqs.map((faq, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Support
              </Typography>
              <List>
                {contactInfo.map((contact, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>{contact.icon}</ListItemIcon>
                      <ListItemText
                        primary={contact.title}
                        secondary={contact.description}
                      />
                    </ListItem>
                    {index < contactInfo.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Help; 