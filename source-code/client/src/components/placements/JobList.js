import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchJobPostings,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  clearError,
  clearSuccess
} from '../../features/placements/placementSlice';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobPostings, loading, error, success } = useSelector((state) => state.placements);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    salary: ''
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    company: Yup.string().required('Company name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Job type is required'),
    location: Yup.string().required('Location is required'),
    salary: Yup.number().min(0, 'Salary must be positive').required('Salary is required'),
    requirements: Yup.string().required('Requirements are required'),
    deadline: Yup.date().required('Application deadline is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      company: '',
      description: '',
      type: '',
      location: '',
      salary: '',
      requirements: '',
      deadline: new Date()
    },
    validationSchema,
    onSubmit: async (values) => {
      if (selectedJob) {
        await dispatch(updateJobPosting({ jobId: selectedJob._id, jobData: values }));
      } else {
        await dispatch(createJobPosting(values));
      }
      handleCloseDialog();
    }
  });

  useEffect(() => {
    dispatch(fetchJobPostings(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleOpenDialog = (job = null) => {
    if (job) {
      setSelectedJob(job);
      formik.setValues({
        title: job.title,
        company: job.company,
        description: job.description,
        type: job.type,
        location: job.location,
        salary: job.salary,
        requirements: job.requirements,
        deadline: new Date(job.deadline)
      });
    } else {
      setSelectedJob(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
    formik.resetForm();
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await dispatch(deleteJobPosting(jobId));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Job Postings
        </Typography>
        {user?.role === 'faculty' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Post New Job
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="full-time">Full Time</MenuItem>
                <MenuItem value="part-time">Part Time</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Min Salary"
              type="number"
              value={filters.salary}
              onChange={(e) => handleFilterChange('salary', e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {jobPostings.map((job) => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h2" gutterBottom>
                    {job.title}
                  </Typography>
                  <Chip
                    label={job.type}
                    color={job.type === 'full-time' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {job.company}
                </Typography>
                <Typography variant="body2" paragraph>
                  {job.description}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                  <Chip
                    icon={<LocationIcon />}
                    label={job.location}
                    size="small"
                  />
                  <Chip
                    icon={<MoneyIcon />}
                    label={`$${job.salary.toLocaleString()}`}
                    size="small"
                  />
                  <Chip
                    icon={<WorkIcon />}
                    label={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                {user?.role === 'faculty' && (
                  <>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(job)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedJob ? 'Edit Job Posting' : 'Create Job Posting'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  error={formik.touched.company && Boolean(formik.errors.company)}
                  helperText={formik.touched.company && formik.errors.company}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                  >
                    <MenuItem value="full-time">Full Time</MenuItem>
                    <MenuItem value="part-time">Part Time</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Salary"
                  name="salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Application Deadline"
                  name="deadline"
                  value={formik.values.deadline}
                  onChange={formik.handleChange}
                  error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                  helperText={formik.touched.deadline && formik.errors.deadline}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Requirements"
                  name="requirements"
                  value={formik.values.requirements}
                  onChange={formik.handleChange}
                  error={formik.touched.requirements && Boolean(formik.errors.requirements)}
                  helperText={formik.touched.requirements && formik.errors.requirements}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {selectedJob ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default JobList; 