import React from 'react';
import { Box, Container } from '@mui/material';

function ErrorLayout({ children }) {
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
        {children}
      </Container>
    </Box>
  );
}

export default ErrorLayout; 