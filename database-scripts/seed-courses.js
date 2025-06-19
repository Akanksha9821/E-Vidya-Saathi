const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.model('Course', courseSchema);

async function seedCourses() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Course.deleteMany();

    const courses = [
      {
        title: "Data Structures",
        code: "CS201",
        faculty: "Faculty One",
        students: ["Student One"],
      },
      {
        title: "Operating Systems",
        code: "CS301",
        faculty: "Faculty One",
        students: ["Student One"],
      },
    ];

    await Course.insertMany(courses);
    console.log("✅ Courses seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedCourses(); 