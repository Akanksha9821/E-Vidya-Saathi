const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const placementSchema = new mongoose.Schema({}, { strict: false, collection: 'placementRecords' });
const Placement = mongoose.model('Placement', placementSchema);

async function seedPlacement() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Placement.deleteMany();

    const student = "Student One";
    const records = [
      { student, company: "TechCorp", status: "Applied", role: "Software Engineer", date: new Date() },
      { student, company: "DataFlow", status: "Shortlisted", role: "Data Analyst", date: new Date() },
      { student, company: "InnovateTech", status: "Interview Scheduled", role: "ML Engineer", date: new Date() },
      { student, company: "CloudTech", status: "Placed", role: "DevOps Engineer", date: new Date() },
    ];
    await Placement.insertMany(records);
    console.log("✅ Placement records seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedPlacement(); 