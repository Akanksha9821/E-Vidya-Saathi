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
  ContactSupport as ContactSupportIcon,
} from '@mui/icons-material';

function Forbidden() {
  const navigate = useNavigate();

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
            403
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Access Forbidden
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You do not have the necessary permissions to access this page. If you
            believe this is an error, please contact the administrator for
            assistance.
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

export default Forbidden; 