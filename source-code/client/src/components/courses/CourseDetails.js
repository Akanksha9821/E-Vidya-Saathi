import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchCourses,
  updateCourse,
  deleteCourse,
  removeStudentFromCourse
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

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const course = courses.find((c) => c._id === id);

  useEffect(() => {
    if (!course) {
      dispatch(fetchCourses());
    }
  }, [dispatch, course]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await dispatch(deleteCourse(id));
      navigate('/courses');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      await dispatch(removeStudentFromCourse({ courseId: id, studentId }));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: course?.name || '',
      code: course?.code || '',
      description: course?.description || '',
      credits: course?.credits || 3,
      capacity: course?.capacity || 30
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await dispatch(updateCourse({ id, courseData: values }));
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

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {course.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {course.code}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={`${course.credits} Credits`}
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${course.students?.length || 0}/${course.capacity} Students`}
                  />
                </Box>
              </Box>
              {user?.role === 'faculty' && (
                <Box>
                  <IconButton onClick={handleOpenDialog}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDeleteCourse}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enrolled Students
            </Typography>
            <List>
              {course.students?.map((student) => (
                <React.Fragment key={student._id}>
                  <ListItem
                    secondaryAction={
                      user?.role === 'faculty' && (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveStudent(student._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{student.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={student.email}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Materials
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Course Syllabus"
                  secondary="View and download course syllabus"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Assignments"
                  secondary="View and submit assignments"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
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
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CourseDetails; 