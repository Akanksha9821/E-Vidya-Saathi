import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Card, CardContent, CardActions, Grid, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Welcome() {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate('/login', { state: { role } });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Grid 
        container 
        sx={{ 
          height: { xs: 'auto', md: '80vh' },
          maxWidth: 1100, 
          boxShadow: 3, 
          borderRadius: 4, 
          overflow: 'hidden', 
          background: '#fff',
          minHeight: { xs: '90vh', md: 'auto' }
        }}
      >
        {/* Left Half: Branding */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #4fc3f7 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, sm: 5, md: 6 },
            minHeight: { xs: '40vh', md: 'auto' },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <Avatar 
            sx={{ 
              width: { xs: 80, sm: 90, md: 100 }, 
              height: { xs: 80, sm: 90, md: 100 }, 
              mb: { xs: 2, md: 3 }, 
              bgcolor: '#fff' 
            }}
          >
            <SchoolIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: '#1976d2' }} />
          </Avatar>
          <Typography 
            variant="h2" 
            fontWeight={700} 
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textAlign: 'center'
            }}
          >
            E-Vidya Saathi
          </Typography>
          <Typography 
            variant="h5" 
            fontWeight={400}
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              textAlign: 'center'
            }}
          >
            Your Smart College Companion
          </Typography>
        </Grid>
        
        {/* Right Half: Login Card */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            p: { xs: 3, sm: 4, md: 4 },
            minHeight: { xs: '50vh', md: 'auto' }
          }}
        >
          <Card 
            elevation={6} 
            sx={{ 
              width: '100%', 
              maxWidth: 400, 
              borderRadius: 4,
              mx: 'auto'
            }}
          >
            <CardContent sx={{ textAlign: 'center', pb: 0, px: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color="primary" 
                gutterBottom
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
              >
                Login
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Select your role to continue
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PersonIcon />}
                    sx={{ 
                      mb: 1.5, 
                      py: { xs: 1.25, sm: 1.5 }, 
                      fontWeight: 600, 
                      fontSize: { xs: 16, sm: 18 },
                      minHeight: { xs: 48, sm: 56 }
                    }}
                    onClick={() => handleRoleClick('student')}
                  >
                    Student
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<SchoolIcon />}
                    sx={{ 
                      mb: 1.5, 
                      py: { xs: 1.25, sm: 1.5 }, 
                      fontWeight: 600, 
                      fontSize: { xs: 16, sm: 18 },
                      minHeight: { xs: 48, sm: 56 }
                    }}
                    onClick={() => handleRoleClick('faculty')}
                  >
                    Faculty
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{ 
                      py: { xs: 1.25, sm: 1.5 }, 
                      fontWeight: 600, 
                      fontSize: { xs: 16, sm: 18 },
                      minHeight: { xs: 48, sm: 56 }
                    }}
                    onClick={() => handleRoleClick('admin')}
                  >
                    Admin
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2, pt: 0 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                &copy; {new Date().getFullYear()} E-Vidya Saathi
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 