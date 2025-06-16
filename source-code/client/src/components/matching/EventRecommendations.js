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
  Chip,
  CircularProgress,
  Alert,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getEventRecommendations,
  trackEventInteraction,
  getSimilarEvents,
  clearError,
  clearSuccess
} from '../../features/matching/matchingSlice';

const EventRecommendations = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recommendations, similarEvents, loading, error, success } = useSelector((state) => state.matching);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('all');

  const validationSchema = Yup.object({
    rating: Yup.number().min(1).max(5).required('Rating is required'),
    feedback: Yup.string().max(500, 'Feedback must be at most 500 characters'),
    attendance: Yup.string().required('Attendance status is required')
  });

  const formik = useFormik({
    initialValues: {
      rating: 0,
      feedback: '',
      attendance: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (selectedEvent) {
        await dispatch(trackEventInteraction({
          studentId: user._id,
          eventId: selectedEvent._id,
          interaction: {
            type: 'feedback',
            ...values
          }
        }));
        handleCloseDialog();
      }
    }
  });

  useEffect(() => {
    if (user) {
      dispatch(getEventRecommendations(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    formik.resetForm();
  };

  const handleLikeEvent = async (eventId) => {
    await dispatch(trackEventInteraction({
      studentId: user._id,
      eventId,
      interaction: { type: 'like' }
    }));
  };

  const handleDislikeEvent = async (eventId) => {
    await dispatch(trackEventInteraction({
      studentId: user._id,
      eventId,
      interaction: { type: 'dislike' }
    }));
  };

  const handleViewSimilar = async (eventId) => {
    await dispatch(getSimilarEvents(eventId));
  };

  const filteredRecommendations = recommendations.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(event.date) > new Date();
    if (filter === 'past') return new Date(event.date) <= new Date();
    return true;
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
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Recommended Events
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All Events</MenuItem>
              <MenuItem value="upcoming">Upcoming Events</MenuItem>
              <MenuItem value="past">Past Events</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {filteredRecommendations.map((event) => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {event.location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      {new Date(event.date).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {event.description}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {event.categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      Match Score:
                    </Typography>
                    <Rating value={event.matchScore} readOnly precision={0.5} />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EventIcon />}
                    onClick={() => handleOpenDialog(event)}
                  >
                    Provide Feedback
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={() => handleViewSimilar(event._id)}
                  >
                    Similar Events
                  </Button>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleLikeEvent(event._id)}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDislikeEvent(event._id)}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Event Feedback</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formik.values.rating}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('rating', newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Feedback"
                  name="feedback"
                  value={formik.values.feedback}
                  onChange={formik.handleChange}
                  error={formik.touched.feedback && Boolean(formik.errors.feedback)}
                  helperText={formik.touched.feedback && formik.errors.feedback}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Attendance</InputLabel>
                  <Select
                    name="attendance"
                    value={formik.values.attendance}
                    onChange={formik.handleChange}
                    error={formik.touched.attendance && Boolean(formik.errors.attendance)}
                  >
                    <MenuItem value="attended">Attended</MenuItem>
                    <MenuItem value="registered">Registered but didn't attend</MenuItem>
                    <MenuItem value="interested">Interested but didn't register</MenuItem>
                    <MenuItem value="not_interested">Not interested</MenuItem>
                  </Select>
                </FormControl>
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
              Submit Feedback
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default EventRecommendations; 