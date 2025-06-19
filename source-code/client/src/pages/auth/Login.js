import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { login, clearError } from '../../features/auth/authSlice';
import AuthLayout from '../../components/auth-layout/AuthLayout';

function Login() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: location.state?.role || 'student',
    rememberMe: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.state?.role) {
      setFormData((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location.state]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    console.log('Login attempt with:', formData);
    const result = await dispatch(login(formData));
    console.log('Login result:', result);
    
    if (!result.error && result.payload && result.payload.user) {
      const role = result.payload.user.role;
      console.log('User role:', role);
      console.log('Navigating to dashboard for role:', role);
      
      if (role === 'student') {
        console.log('Navigating to student dashboard');
        navigate('/student/dashboard');
      } else if (role === 'faculty') {
        console.log('Navigating to faculty dashboard');
        navigate('/faculty/dashboard');
      } else if (role === 'admin') {
        console.log('Navigating to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Unknown role, navigating to home');
        navigate('/');
      }
    } else {
      console.log('Login failed:', result.error);
    }
  };

  return (
    <AuthLayout>
      <Typography 
        component="h1" 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.5rem' },
          textAlign: 'center'
        }}
      >
        Sign In
      </Typography>
      
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          sx={{ mb: 1 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          sx={{ mb: 1 }}
        />
        {/* Role is hidden, but always sent */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.rememberMe}
              onChange={handleChange}
              name="rememberMe"
              color="primary"
              disabled={isLoading}
            />
          }
          label="Remember Me"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ 
            mt: 3, 
            mb: 2,
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: 16, sm: 18 },
            minHeight: { xs: 48, sm: 56 }
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>
      </Box>
    </AuthLayout>
  );
}

export default Login; 