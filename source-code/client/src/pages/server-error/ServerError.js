import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ContactSupport as ContactSupportIcon,
} from '@mui/icons-material';

function ServerError() {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

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
          <Typography variant="h1" component="h1" gutterBottom>
            500
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Server Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Something went wrong on our end. We are working to fix the issue.
            Please try again later or contact support if the problem persists.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back to Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mr: 2 }}
            >
              Refresh Page
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ContactSupportIcon />}
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ServerError; 