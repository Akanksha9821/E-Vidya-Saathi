# E-Vidya-Saathi - Smart Campus Portal

A full-stack web application that serves as a centralized system for managing student activities, faculty interactions, event notifications, and academic placement tracking.

## Features

### Student Dashboard
- Access to courses and materials
- Attendance tracking
- Grade monitoring
- Event notifications
- Placement tracking

### Faculty Dashboard
- Course material management
- Assignment creation and tracking
- Student performance insights
- Schedule management

### Admin Panel
- User management
- Event monitoring
- Campus-wide alerts
- System configuration

### Event Management
- Upcoming events display
- Workshop announcements
- Campus notifications
- Event registration

### Placement Tracking
- Academic placement records
- Company information
- Application status
- Placement statistics

## Technology Stack

### Frontend
- React.js
- Bootstrap 5
- Redux Toolkit
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

### Development Tools
- Git
- VS Code
- Postman
- MongoDB Compass

## Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd source-code/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file from .env.example
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd source-code/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file from .env.example
4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available in the `server/docs` directory. It includes:
- Authentication endpoints
- User management
- Course management
- Event management
- Placement tracking

## Database Schema

The database schema is documented in the `database/schema` directory, including:
- User collections
- Course collections
- Event collections
- Placement collections

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
