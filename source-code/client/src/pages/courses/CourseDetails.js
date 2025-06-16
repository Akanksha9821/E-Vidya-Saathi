import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseResponse, studentsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`),
          axios.get(`http://localhost:5000/api/courses/${id}/students`),
        ]);
        setCourse(courseResponse.data);
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (!course) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.name}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Course Details
              </Typography>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {course.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Faculty: {course.faculty?.name}
              </Typography>
            </Paper>
            {user?.role === 'faculty' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrolled Students
                </Typography>
                <List>
                  {students.map((student) => (
                    <React.Fragment key={student._id}>
                      <ListItem>
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
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              {user?.role === 'student' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={() => navigate(`/courses/${id}/enroll`)}
                >
                  Enroll in Course
                </Button>
              )}
              {user?.role === 'faculty' && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    onClick={() => navigate(`/courses/${id}/attendance`)}
                  >
                    Manage Attendance
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/courses/${id}/edit`)}
                  >
                    Edit Course
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CourseDetails; 