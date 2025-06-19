const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const attendanceSchema = new mongoose.Schema({}, { strict: false, collection: 'attendance' });
const Attendance = mongoose.model('Attendance', attendanceSchema);

async function seedAttendance() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Attendance.deleteMany();

    const student = "Student One";
    const courses = ["Data Structures", "Operating Systems"];
    const records = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      for (const course of courses) {
        records.push({
          student,
          course,
          date,
          status: Math.random() > 0.2 ? 'present' : 'absent',
        });
      }
    }
    await Attendance.insertMany(records);
    console.log("✅ Attendance seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedAttendance(); 