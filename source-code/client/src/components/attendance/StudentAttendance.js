import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getAttendanceReport, submitExcuse } from '../../features/attendance/attendanceSlice';

const StudentAttendance = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { attendance, loading, error } = useSelector((state) => state.attendance);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [excuseDialog, setExcuseDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [excuseData, setExcuseData] = useState({
    reason: '',
    document: null,
    documentType: ''
  });

  useEffect(() => {
    if (user) {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      setStartDate(start);
      dispatch(getAttendanceReport({ studentId: user._id, startDate: start, endDate: new Date() }));
    }
  }, [dispatch, user]);

  const handleDateRangeChange = () => {
    dispatch(getAttendanceReport({ studentId: user._id, startDate, endDate }));
  };

  const handleExcuseSubmit = async () => {
    if (selectedRecord && excuseData.reason) {
      const formData = new FormData();
      formData.append('reason', excuseData.reason);
      formData.append('documentType', excuseData.documentType);
      if (excuseData.document) {
        formData.append('document', excuseData.document);
      }

      await dispatch(submitExcuse({
        courseId: selectedRecord.course._id,
        date: selectedRecord.date,
        excuseData: formData
      }));

      setExcuseDialog(false);
      setSelectedRecord(null);
      setExcuseData({ reason: '', document: null, documentType: '' });
    }
  };

  const handleFileChange = (event) => {
    setExcuseData({
      ...excuseData,
      document: event.target.files[0]
    });
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
        <Typography variant="h4" component="h1" gutterBottom>
          My Attendance
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" gap={2} mb={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={handleDateRangeChange}>
            View Records
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Excuse Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance?.map((record) => (
                <TableRow key={`${record.course._id}-${record.date}`}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.course.name}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.excuse?.status || 'No excuse'}</TableCell>
                  <TableCell align="center">
                    {record.status === 'absent' && !record.excuse && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedRecord(record);
                          setExcuseDialog(true);
                        }}
                      >
                        Submit Excuse
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={excuseDialog} onClose={() => setExcuseDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Excuse</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason for Absence"
                  value={excuseData.reason}
                  onChange={(e) => setExcuseData({ ...excuseData, reason: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={excuseData.documentType}
                    onChange={(e) => setExcuseData({ ...excuseData, documentType: e.target.value })}
                  >
                    <MenuItem value="medical">Medical Certificate</MenuItem>
                    <MenuItem value="other">Other Document</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Document
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {excuseData.document && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {excuseData.document.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExcuseDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleExcuseSubmit}
              disabled={!excuseData.reason}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default StudentAttendance; 