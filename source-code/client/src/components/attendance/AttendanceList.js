import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  fetchAttendance,
  markAttendance,
  updateAttendance,
  getAttendanceReport
} from '../../features/attendance/attendanceSlice';

const AttendanceList = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { attendance, loading, error } = useSelector((state) => state.attendance);
  const { courses } = useSelector((state) => state.courses);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  const course = courses.find((c) => c._id === courseId);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchAttendance({ courseId, date: selectedDate }));
    }
  }, [dispatch, courseId, selectedDate]);

  useEffect(() => {
    if (attendance) {
      const initialData = {};
      attendance.forEach((record) => {
        initialData[record.student._id] = record.status;
      });
      setAttendanceData(initialData);
    }
  }, [attendance]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsEditing(false);
  };

  const handleStatusChange = (studentId) => (event) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: event.target.checked ? 'present' : 'absent'
    }));
  };

  const handleSave = async () => {
    const formattedData = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status
    }));

    if (attendance.length > 0) {
      await dispatch(updateAttendance({ courseId, date: selectedDate, attendanceData: formattedData }));
    } else {
      await dispatch(markAttendance({ courseId, date: selectedDate, attendanceData: formattedData }));
    }
    setIsEditing(false);
  };

  const handleDownloadReport = async () => {
    const startDate = new Date(selectedDate);
    startDate.setMonth(startDate.getMonth() - 1);
    await dispatch(getAttendanceReport({ courseId, startDate, endDate: selectedDate }));
  };

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
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Attendance - {course.name}
          </Typography>
          <Box display="flex" gap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell align="center">Status</TableCell>
                {isEditing && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {course.students?.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell align="center">
                    {isEditing ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={attendanceData[student._id] === 'present'}
                            onChange={handleStatusChange(student._id)}
                          />
                        }
                        label={attendanceData[student._id] === 'present' ? 'Present' : 'Absent'}
                      />
                    ) : (
                      attendance.find((record) => record.student._id === student._id)?.status || 'Not marked'
                    )}
                  </TableCell>
                  {isEditing && (
                    <TableCell align="center">
                      <Tooltip title="Edit Status">
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(student._id)({
                            target: { checked: attendanceData[student._id] !== 'present' }
                          })}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          {isEditing ? (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Attendance
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Attendance
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AttendanceList; 