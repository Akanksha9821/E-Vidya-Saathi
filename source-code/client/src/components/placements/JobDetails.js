import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchJobPostings,
  applyForJob,
  fetchApplications,
  updateApplicationStatus,
  clearError,
  clearSuccess
} from '../../features/placements/placementSlice';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobPostings, applications, loading, error, success } = useSelector((state) => state.placements);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const job = jobPostings.find((j) => j._id === jobId);

  const validationSchema = Yup.object({
    coverLetter: Yup.string().required('Cover letter is required'),
    resume: Yup.string().required('Resume is required')
  });

  const formik = useFormik({
    initialValues: {
      coverLetter: '',
      resume: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(applyForJob({
        jobId,
        applicationData: values
      }));
      handleCloseDialog();
    }
  });

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobPostings());
      if (user?.role === 'faculty') {
        dispatch(fetchApplications({ jobId }));
      }
    }
  }, [dispatch, jobId, user]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = async (applicationId, status, feedback = '') => {
    await dispatch(updateApplicationStatus({
      jobId,
      applicationId,
      status,
      feedback
    }));
  };

  const isApplied = applications.some(
    (application) => application.student._id === user?._id
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Job posting not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {job.title}
            </Typography>
            <Chip
              label={job.type}
              color={job.type === 'full-time' ? 'primary' : 'secondary'}
              sx={{ mb: 2 }}
            />
          </Box>
          <IconButton onClick={() => navigate('/placements')}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" gap={2} mb={3}>
              <Chip
                icon={<BusinessIcon />}
                label={job.company}
              />
              <Chip
                icon={<LocationIcon />}
                label={job.location}
              />
              <Chip
                icon={<MoneyIcon />}
                label={`$${job.salary.toLocaleString()}`}
              />
              <Chip
                icon={<ScheduleIcon />}
                label={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {job.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <Typography paragraph>
              {job.requirements}
            </Typography>

            {user?.role === 'student' && !isApplied && new Date(job.deadline) > new Date() && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mt: 2 }}
              >
                Apply Now
              </Button>
            )}
          </Grid>

          {user?.role === 'faculty' && (
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Applications
                  </Typography>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="All" />
                    <Tab label="Pending" />
                    <Tab label="Shortlisted" />
                    <Tab label="Rejected" />
                  </Tabs>
                  <List>
                    {applications
                      .filter(app => tabValue === 0 || app.status === ['all', 'pending', 'shortlisted', 'rejected'][tabValue])
                      .map((application) => (
                        <ListItem key={application._id}>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={application.student.name}
                            secondary={
                              <>
                                {application.student.rollNumber}
                                <br />
                                Status: {application.status}
                              </>
                            }
                          />
                          {application.status === 'pending' && (
                            <Box>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                              >
                                Shortlist
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for Job</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Cover Letter"
              name="coverLetter"
              value={formik.values.coverLetter}
              onChange={formik.handleChange}
              error={formik.touched.coverLetter && Boolean(formik.errors.coverLetter)}
              helperText={formik.touched.coverLetter && formik.errors.coverLetter}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Resume URL"
              name="resume"
              value={formik.values.resume}
              onChange={formik.handleChange}
              error={formik.touched.resume && Boolean(formik.errors.resume)}
              helperText={formik.touched.resume && formik.errors.resume}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              Submit Application
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default JobDetails; 