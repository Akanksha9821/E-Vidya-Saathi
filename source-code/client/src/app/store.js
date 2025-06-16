import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import eventReducer from '../features/events/eventSlice';
import placementReducer from '../features/placements/placementSlice';
import matchingReducer from '../features/matching/matchingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    attendance: attendanceReducer,
    events: eventReducer,
    placements: placementReducer,
    matching: matchingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
}); 