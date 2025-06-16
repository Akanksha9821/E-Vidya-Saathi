import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const fetchJobPostings = createAsyncThunk(
  'placements/fetchJobPostings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/placements/jobs`, { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createJobPosting = createAsyncThunk(
  'placements/createJobPosting',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/placements/jobs`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJobPosting = createAsyncThunk(
  'placements/updateJobPosting',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/placements/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteJobPosting = createAsyncThunk(
  'placements/deleteJobPosting',
  async (jobId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/placements/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const applyForJob = createAsyncThunk(
  'placements/applyForJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/placements/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'placements/fetchApplications',
  async ({ jobId, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/placements/jobs/${jobId}/applications`, { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'placements/updateApplicationStatus',
  async ({ jobId, applicationId, status, feedback }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/placements/jobs/${jobId}/applications/${applicationId}`,
        { status, feedback }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPlacementStats = createAsyncThunk(
  'placements/fetchPlacementStats',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/placements/stats`, { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  jobPostings: [],
  currentJob: null,
  applications: [],
  stats: null,
  loading: false,
  error: null,
  success: false
};

const placementSlice = createSlice({
  name: 'placements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Job Postings
      .addCase(fetchJobPostings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPostings.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings = action.payload;
      })
      .addCase(fetchJobPostings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch job postings';
      })
      // Create Job Posting
      .addCase(createJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings.push(action.payload);
        state.success = true;
      })
      .addCase(createJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create job posting';
      })
      // Update Job Posting
      .addCase(updateJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobPostings.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobPostings[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update job posting';
      })
      // Delete Job Posting
      .addCase(deleteJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings = state.jobPostings.filter(job => job._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete job posting';
      })
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
        state.success = true;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to apply for job';
      })
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch applications';
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update application status';
      })
      // Fetch Placement Stats
      .addCase(fetchPlacementStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacementStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPlacementStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch placement statistics';
      });
  }
});

export const { clearError, clearSuccess, setCurrentJob } = placementSlice.actions;
export default placementSlice.reducer; 