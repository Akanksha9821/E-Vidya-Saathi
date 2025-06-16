import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Build as BuildIcon } from '@mui/icons-material';

function Maintenance() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <BuildIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Under Maintenance
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We are currently performing scheduled maintenance to improve our
            services. We will be back shortly.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Estimated time: 30 minutes
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Thank you for your patience.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Maintenance; 