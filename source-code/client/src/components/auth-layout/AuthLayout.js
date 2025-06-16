import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Box
            component="h1"
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
            }}
          >
            E-Vidya Saathi
          </Box>
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout; 