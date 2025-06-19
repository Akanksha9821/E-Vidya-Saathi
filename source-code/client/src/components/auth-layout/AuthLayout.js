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
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <SchoolIcon 
            sx={{ 
              fontSize: { xs: 40, sm: 50, md: 60 }, 
              color: 'primary.main', 
              mb: { xs: 1, sm: 2 } 
            }} 
          />
          <Box
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
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
            p: { xs: 3, sm: 4, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout; 