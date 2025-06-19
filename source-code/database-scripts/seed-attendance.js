const Attendance = require("../server/models/Attendance");
const Course = require("../server/models/Course");
const User = require("../server/models/User");

module.exports = async () => {
  try {
    await Attendance.deleteMany();
    console.log("🗑️ Cleared existing attendance records");

    // Get courses and students
    const courses = await Course.find().populate('enrolledStudents');
    const studentUsers = await User.find({ role: "student" });

    if (courses.length === 0) {
      throw new Error("No courses found. Please seed courses first.");
    }

    if (studentUsers.length === 0) {
      throw new Error("No students found. Please seed users first.");
    }

    const attendanceRecords = [];

    // Generate attendance records for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      courses.forEach(course => {
        course.enrolledStudents.forEach(student => {
          // Generate realistic attendance patterns
          const isPresent = Math.random() > 0.15; // 85% attendance rate
          
          attendanceRecords.push({
            student: student._id,
            course: course._id,
            date: date,
            status: isPresent ? 'present' : 'absent',
            markedBy: course.faculty,
            remarks: isPresent ? 'Present' : 'Absent without prior notice',
            timestamp: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000) // Random time during the day
          });
        });
      });
    }

    await Attendance.insertMany(attendanceRecords);
    console.log("✅ Seeded attendance records successfully");
    console.log(`📊 Created ${attendanceRecords.length} attendance records`);
    
    // Calculate and display attendance statistics
    const totalRecords = attendanceRecords.length;
    const presentRecords = attendanceRecords.filter(record => record.status === 'present').length;
    const attendanceRate = ((presentRecords / totalRecords) * 100).toFixed(1);
    
    console.log(`📈 Attendance Statistics:`);
    console.log(`   - Total Records: ${totalRecords}`);
    console.log(`   - Present: ${presentRecords}`);
    console.log(`   - Absent: ${totalRecords - presentRecords}`);
    console.log(`   - Overall Attendance Rate: ${attendanceRate}%`);
    
    return attendanceRecords;
  } catch (error) {
    console.error("❌ Error seeding attendance:", error);
    throw error;
  }
}; 