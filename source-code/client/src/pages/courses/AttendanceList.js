import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function AttendanceList() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('present');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [courseId]);

  const handleEditAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceStatus(student.attendance?.status || 'present');
    setOpenDialog(true);
  };

  const handleSaveAttendance = async () => {
    try {
      await axios.post(`http://localhost:5000/api/attendance/course/${courseId}`, {
        studentId: selectedStudent._id,
        status: attendanceStatus,
        date: new Date().toISOString(),
      });
      setOpenDialog(false);
      // Refresh the student list
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Attendance Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.attendance?.status || 'Not marked'}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditAttendance(student)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Student: {selectedStudent?.name}
            </Typography>
            <Button
              variant={attendanceStatus === 'present' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setAttendanceStatus('present')}
              sx={{ mr: 1 }}
            >
              Present
            </Button>
            <Button
              variant={attendanceStatus === 'absent' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => setAttendanceStatus('absent')}
            >
              Absent
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAttendance} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default AttendanceList; 