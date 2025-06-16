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
  IconButton
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchEvents,
  registerForEvent,
  fetchEventRegistrations,
  clearError,
  clearSuccess
} from '../../features/events/eventSlice';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, registrations, loading, error, success } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);

  const event = events.find((e) => e._id === eventId);

  const validationSchema = Yup.object({
    additionalInfo: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      additionalInfo: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(registerForEvent({
        eventId,
        registrationData: values
      }));
      handleCloseDialog();
    }
  });

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvents());
      dispatch(fetchEventRegistrations(eventId));
    }
  }, [dispatch, eventId]);

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

  const isRegistered = registrations.some(
    (registration) => registration.student._id === user?._id
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>
            <Chip
              label={event.type}
              color={event.type === 'workshop' ? 'primary' : 'secondary'}
              sx={{ mb: 2 }}
            />
          </Box>
          <IconButton onClick={() => navigate('/events')}>
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
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {event.description}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <Chip
                icon={<EventIcon />}
                label={new Date(event.date).toLocaleDateString()}
              />
              <Chip
                icon={<TimeIcon />}
                label={`${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()}`}
              />
              <Chip
                icon={<LocationIcon />}
                label={event.location}
              />
              <Chip
                icon={<PeopleIcon />}
                label={`${event.registeredCount}/${event.capacity} registered`}
              />
            </Box>

            {user?.role === 'student' && !isRegistered && event.registeredCount < event.capacity && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ mt: 2 }}
              >
                Register for Event
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Registered Participants
            </Typography>
            <List>
              {registrations.map((registration) => (
                <ListItem key={registration._id}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={registration.student.name}
                    secondary={registration.student.rollNumber}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Register for Event</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Information"
              name="additionalInfo"
              value={formik.values.additionalInfo}
              onChange={formik.handleChange}
              error={formik.touched.additionalInfo && Boolean(formik.errors.additionalInfo)}
              helperText={formik.touched.additionalInfo && formik.errors.additionalInfo}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 