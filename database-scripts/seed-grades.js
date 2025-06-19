const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const gradeSchema = new mongoose.Schema({}, { strict: false, collection: 'grades' });
const Grade = mongoose.model('Grade', gradeSchema);

async function seedGrades() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Grade.deleteMany();

    const grades = [
      { student: "Student One", assignment: "Binary Trees", score: 85 },
      { student: "Student One", assignment: "Process Scheduling", score: 92 },
    ];
    await Grade.insertMany(grades);
    console.log("✅ Grades seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedGrades(); 