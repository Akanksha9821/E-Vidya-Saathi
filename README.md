# E-Vidya Saathi

A comprehensive MERN stack application for educational institutions to manage courses, attendance, events, and placements.

## Quick Start

1. Install dependencies:
```bash
# Install server dependencies
cd source-code/server
npm install

# Install client dependencies
cd ../client
npm install
```

2. Start the application:
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## Features

### Authentication & User Management
- Multi-role authentication (Student, Faculty, Admin)
- Secure login/registration
- Profile management
- Password reset functionality

### Course Management
- Course creation and management
- Course enrollment
- Course materials upload
- Course details and syllabus
- Student enrollment tracking

### Attendance System
- Real-time attendance tracking
- Attendance statistics
- Course-wise attendance reports
- Student attendance history

### Event Management
- Academic and non-academic events
- Event registration
- Event details and schedules
- Event participation tracking

### Placement & Career Services
- Job posting and applications
- Resume management
- Placement statistics
- Company profiles
- Application tracking

### Smart Matching System
- Interest-based course recommendations
- Event recommendations
- Job matching based on skills
- Career path suggestions

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Formik & Yup

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Upload)

## Environment Variables

Create a .env file in the server directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=1000000
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/logout - User logout
- POST /api/auth/forgotpassword - Request password reset
- PUT /api/auth/resetpassword/:resettoken - Reset password
- GET /api/auth/me - Get current user
- PUT /api/auth/updatedetails - Update user details
- PUT /api/auth/updatepassword - Update password

### Courses
- GET /api/courses/ - Get all courses
- GET /api/courses/:id - Get course details
- GET /api/courses/student/enrolled - Get enrolled courses
- POST /api/courses/:id/enroll - Enroll in course
- DELETE /api/courses/:id/enroll - Unenroll from course
- GET /api/courses/faculty/courses - Get faculty courses
- POST /api/courses/ - Create course
- PUT /api/courses/:id - Update course
- DELETE /api/courses/:id - Delete course
- GET /api/courses/:id/students - Get course students

### Attendance
- GET /api/attendance/student/attendance - Get student attendance
- GET /api/attendance/course/:courseId - Get course attendance
- GET /api/attendance/course/:courseId/stats - Get attendance stats
- POST /api/attendance/course/:courseId - Mark attendance
- PUT /api/attendance/:id - Update attendance
- DELETE /api/attendance/:id - Delete attendance

### Events
- GET /api/events/ - Get all events
- GET /api/events/:id - Get event details
- GET /api/events/my/events - Get user events
- POST /api/events/:id/register - Register for event
- DELETE /api/events/:id/unregister - Unregister from event
- POST /api/events/ - Create event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- GET /api/events/:id/registrations - Get event registrations

### Placements
- GET /api/placements/ - Get all placements
- GET /api/placements/:id - Get placement details
- GET /api/placements/student/applications - Get student applications
- POST /api/placements/:id/apply - Apply for placement
- DELETE /api/placements/:id/apply - Withdraw application
- GET /api/placements/faculty/jobs - Get faculty jobs
- POST /api/placements/ - Create placement
- PUT /api/placements/:id - Update placement
- DELETE /api/placements/:id - Delete placement
- GET /api/placements/:id/applications - Get placement applications
- PUT /api/placements/:id/applications/:applicationId - Update application

### Matching System
- GET /api/matching/student/:studentId - Get student matches
- GET /api/matching/student/:studentId/jobs - Get job matches
- GET /api/matching/course/:courseId - Get course matches
- GET /api/matching/job/:jobId - Get job matches

### File Upload
- POST /api/upload/profile-picture - Upload profile picture
- POST /api/upload/resume - Upload resume
- POST /api/upload/course-material - Upload course material
- POST /api/upload/event-image - Upload event image
- GET /api/upload/:filename - Get file
- DELETE /api/upload/:filename - Delete file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License
