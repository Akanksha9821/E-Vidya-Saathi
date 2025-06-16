import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse
} from '../../features/courses/courseSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Course name is required'),
  code: Yup.string().required('Course code is required'),
  description: Yup.string().required('Description is required'),
  credits: Yup.number()
    .required('Credits are required')
    .min(1, 'Credits must be at least 1')
    .max(6, 'Credits cannot exceed 6'),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
});

const CourseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleOpenDialog = (course = null) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCourse(null);
    setOpenDialog(false);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await dispatch(deleteCourse(courseId));
    }
  };

  const handleEnroll = async (courseId) => {
    await dispatch(enrollInCourse(courseId));
  };

  const formik = useFormik({
    initialValues: {
      name: selectedCourse?.name || '',
      code: selectedCourse?.code || '',
      description: selectedCourse?.description || '',
      credits: selectedCourse?.credits || 3,
      capacity: selectedCourse?.capacity || 30
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (selectedCourse) {
        await dispatch(updateCourse({ id: selectedCourse._id, courseData: values }));
      } else {
        await dispatch(createCourse(values));
      }
      handleCloseDialog();
    }
  });

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
          Courses
        </Typography>
        {user?.role === 'faculty' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Course
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="div" gutterBottom>
                    {course.name}
                  </Typography>
                  {user?.role === 'faculty' && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(course)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {course.code}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    icon={<SchoolIcon />}
                    label={`${course.credits} Credits`}
                    size="small"
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${course.students?.length || 0}/${course.capacity} Students`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  View Details
                </Button>
                {user?.role === 'student' && !course.students?.includes(user._id) && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Course Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="code"
                  name="code"
                  label="Course Code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="credits"
                  name="credits"
                  label="Credits"
                  type="number"
                  value={formik.values.credits}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.credits && Boolean(formik.errors.credits)}
                  helperText={formik.touched.credits && formik.errors.credits}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="capacity"
                  name="capacity"
                  label="Capacity"
                  type="number"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                  helperText={formik.touched.capacity && formik.errors.capacity}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CourseList; 