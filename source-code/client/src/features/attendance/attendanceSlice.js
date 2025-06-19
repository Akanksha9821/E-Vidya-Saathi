import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ courseId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/${courseId}`,
        {
          params: { date }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async ({ courseId, date, attendanceData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/attendance/${courseId}`,
        { date, attendanceData }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ courseId, date, attendanceData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/attendance/${courseId}`,
        { date, attendanceData }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const submitExcuse = createAsyncThunk(
  'attendance/submitExcuse',
  async ({ courseId, date, reason, document }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('reason', reason);
      if (document) {
        formData.append('document', document);
      }

      const response = await axios.post(
        `${API_URL}/api/attendance/${courseId}/excuse`,
        formData,
        {
          'Content-Type': 'multipart/form-data'
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const reviewExcuse = createAsyncThunk(
  'attendance/reviewExcuse',
  async ({ courseId, excuseId, status, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/attendance/${courseId}/excuse/${excuseId}`,
        { status, comment }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAttendanceReport = createAsyncThunk(
  'attendance/getAttendanceReport',
  async ({ courseId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/${courseId}/report`,
        {
          params: { startDate, endDate }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  attendance: [],
  report: null,
  loading: false,
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReport: (state) => {
      state.report = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Excuse
      .addCase(submitExcuse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExcuse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(
          (record) => record._id === action.payload._id
        );
        if (index !== -1) {
          state.attendance[index] = action.payload;
        }
      })
      .addCase(submitExcuse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Review Excuse
      .addCase(reviewExcuse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewExcuse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(
          (record) => record._id === action.payload._id
        );
        if (index !== -1) {
          state.attendance[index] = action.payload;
        }
      })
      .addCase(reviewExcuse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Attendance Report
      .addCase(getAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearReport } = attendanceSlice.actions;
export default attendanceSlice.reducer; 