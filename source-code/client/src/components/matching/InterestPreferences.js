import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Interests as InterestsIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  fetchStudentInterests,
  updateStudentInterests,
  clearError,
  clearSuccess
} from '../../features/matching/matchingSlice';

const INTEREST_CATEGORIES = [
  'Technology',
  'Business',
  'Science',
  'Arts',
  'Sports',
  'Health',
  'Education',
  'Environment',
  'Social Impact',
  'Career Development'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const InterestPreferences = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { interests, loading, error, success } = useSelector((state) => state.matching);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    skillLevel: Yup.string().required('Skill level is required'),
    keywords: Yup.array().of(Yup.string()),
    preferredTime: Yup.string(),
    preferredLocation: Yup.string(),
    notificationPreferences: Yup.object({
      email: Yup.boolean(),
      push: Yup.boolean(),
      sms: Yup.boolean()
    })
  });

  const formik = useFormik({
    initialValues: {
      category: '',
      skillLevel: '',
      keywords: [],
      preferredTime: 'any',
      preferredLocation: '',
      notificationPreferences: {
        email: true,
        push: true,
        sms: false
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      const updatedInterests = [...interests];
      if (selectedCategory) {
        const index = updatedInterests.findIndex(i => i.category === selectedCategory);
        if (index !== -1) {
          updatedInterests[index] = values;
        } else {
          updatedInterests.push(values);
        }
      } else {
        updatedInterests.push(values);
      }
      await dispatch(updateStudentInterests({ studentId: user._id, interests: updatedInterests }));
      handleCloseDialog();
    }
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchStudentInterests(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleOpenDialog = (interest = null) => {
    if (interest) {
      setSelectedCategory(interest.category);
      formik.setValues(interest);
    } else {
      setSelectedCategory(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleDeleteInterest = async (category) => {
    const updatedInterests = interests.filter(i => i.category !== category);
    await dispatch(updateStudentInterests({ studentId: user._id, interests: updatedInterests }));
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
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Interest Preferences
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Interest
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {interests.map((interest) => (
            <Grid item xs={12} md={6} key={interest.category}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" gutterBottom>
                      {interest.category}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteInterest(interest.category)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Skill Level: {interest.skillLevel}
                  </Typography>
                  {interest.keywords.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Keywords:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {interest.keywords.map((keyword) => (
                          <Chip
                            key={keyword}
                            label={keyword}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Preferred Time: {interest.preferredTime}
                  </Typography>
                  {interest.preferredLocation && (
                    <Typography variant="body2" color="textSecondary">
                      Preferred Location: {interest.preferredLocation}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => handleOpenDialog(interest)}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? `Edit ${selectedCategory} Interest` : 'Add New Interest'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    {INTEREST_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Skill Level</InputLabel>
                  <Select
                    name="skillLevel"
                    value={formik.values.skillLevel}
                    onChange={formik.handleChange}
                    error={formik.touched.skillLevel && Boolean(formik.errors.skillLevel)}
                  >
                    {SKILL_LEVELS.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={formik.values.keywords}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('keywords', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Keywords"
                      placeholder="Add keywords"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Time</InputLabel>
                  <Select
                    name="preferredTime"
                    value={formik.values.preferredTime}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="any">Any Time</MenuItem>
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="afternoon">Afternoon</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="weekend">Weekend</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferred Location"
                  name="preferredLocation"
                  value={formik.values.preferredLocation}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Notification Preferences</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.notificationPreferences.email}
                        onChange={(e) => {
                          formik.setFieldValue('notificationPreferences.email', e.target.checked);
                        }}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.notificationPreferences.push}
                        onChange={(e) => {
                          formik.setFieldValue('notificationPreferences.push', e.target.checked);
                        }}
                      />
                    }
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.notificationPreferences.sms}
                        onChange={(e) => {
                          formik.setFieldValue('notificationPreferences.sms', e.target.checked);
                        }}
                      />
                    }
                    label="SMS Notifications"
                  />
                </FormGroup>
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
              {selectedCategory ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default InterestPreferences; 