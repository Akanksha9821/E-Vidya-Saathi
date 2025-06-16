import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function Terms() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using E-Vidya Saathi, you accept and agree to be bound by the terms and conditions of this agreement.',
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily access the materials on E-Vidya Saathi for personal, non-commercial transitory viewing only.',
    },
    {
      title: '3. User Account',
      content: 'To access certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account information.',
    },
    {
      title: '4. User Conduct',
      content: 'You agree to use the platform only for lawful purposes and in accordance with these Terms and Conditions.',
    },
    {
      title: '5. Intellectual Property',
      content: 'The content, organization, graphics, design, and other matters related to the platform are protected under applicable copyrights and other proprietary laws.',
    },
    {
      title: '6. Privacy Policy',
      content: 'Your use of E-Vidya Saathi is also governed by our Privacy Policy, which is incorporated into these Terms and Conditions by reference.',
    },
    {
      title: '7. Disclaimer',
      content: 'The materials on E-Vidya Saathi are provided on an \'as is\' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.',
    },
    {
      title: '8. Limitations',
      content: 'In no event shall E-Vidya Saathi or its suppliers be liable for any damages arising out of the use or inability to use the materials on the platform.',
    },
    {
      title: '9. Revisions',
      content: 'We may revise these terms of service at any time without notice. By using this platform, you agree to be bound by the current version of these terms of service.',
    },
    {
      title: '10. Governing Law',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Welcome to E-Vidya Saathi. These terms and conditions outline the rules and
            regulations for the use of our platform. By accessing this platform, we
            assume you accept these terms and conditions in full.
          </Typography>
          <List>
            {sections.map((section, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6" gutterBottom>
                        {section.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1">{section.content}</Typography>
                    }
                  />
                </ListItem>
                {index < sections.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1">
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Email: legal@evidyasaathi.com
            </Typography>
            <Typography variant="body1">
              Phone: +1 (555) 123-4567
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Terms; 