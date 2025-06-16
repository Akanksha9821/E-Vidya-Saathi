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

function Privacy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information that you provide directly to us, including your name, email address, and other contact information when you register for an account or use our services.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.',
    },
    {
      title: '3. Information Sharing',
      content: 'We do not share your personal information with third parties except as described in this privacy policy or with your consent.',
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can also object to the processing of your data or request data portability.',
    },
    {
      title: '6. Cookies',
      content: 'We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our platform.',
    },
    {
      title: '7. Third-Party Services',
      content: 'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.',
    },
    {
      title: '8. Children\'s Privacy',
      content: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.',
    },
    {
      title: '9. Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.',
    },
    {
      title: '10. Contact Us',
      content: 'If you have any questions about this privacy policy, please contact us at privacy@evidyasaathi.com.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            At E-Vidya Saathi, we take your privacy seriously. This privacy policy
            explains how we collect, use, and protect your personal information when
            you use our platform.
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
              Your Consent
            </Typography>
            <Typography variant="body1">
              By using our platform, you consent to our privacy policy and agree to
              its terms. If you do not agree with this policy, please do not use
              our platform.
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1">
              If you have any questions about this privacy policy, please contact us at:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Email: privacy@evidyasaathi.com
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

export default Privacy; 