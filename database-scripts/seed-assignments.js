const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const assignmentSchema = new mongoose.Schema({}, { strict: false, collection: 'assignments' });
const Assignment = mongoose.model('Assignment', assignmentSchema);

async function seedAssignments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Assignment.deleteMany();

    const assignments = [
      { course: "Data Structures", title: "Binary Trees", dueDate: new Date(Date.now() + 3*24*60*60*1000), materialLink: "https://example.com/binary-trees" },
      { course: "Operating Systems", title: "Process Scheduling", dueDate: new Date(Date.now() + 5*24*60*60*1000), materialLink: "https://example.com/process-scheduling" },
    ];
    await Assignment.insertMany(assignments);
    console.log("✅ Assignments seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedAssignments(); 