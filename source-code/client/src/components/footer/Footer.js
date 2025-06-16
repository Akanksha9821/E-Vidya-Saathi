import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Quick Links',
      links: [
        { text: 'Home', path: '/' },
        { text: 'About', path: '/about' },
        { text: 'Contact', path: '/contact' },
        { text: 'Help', path: '/help' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Events', path: '/events' },
        { text: 'Placements', path: '/placements' },
        { text: 'Blog', path: '/blog' },
        { text: 'FAQ', path: '/faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', path: '/terms' },
        { text: 'Privacy', path: '/privacy' },
        { text: 'Cookie Policy', path: '/cookie-policy' },
        { text: 'Disclaimer', path: '/disclaimer' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {sections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Link
                    key={link.text}
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    display="block"
                    sx={{ mb: 1 }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            © {currentYear} E-Vidya Saathi. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ mt: { xs: 2, sm: 0 } }}>
            Designed and developed with ❤️ for education
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 