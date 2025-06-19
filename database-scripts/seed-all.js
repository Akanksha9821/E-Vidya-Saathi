const mongoose = require("mongoose");
require("dotenv").config({ path: "../source-code/server/.env" });

const seedUsers = require("./seed-users");
const seedCourses = require("./seed-courses");
const seedEvents = require("./seed-events");
const seedAttendance = require("./seed-attendance");
const seedPlacement = require("./seed-placement");

async function seedAll() {
  try {
    console.log("🚀 Starting E-Vidya Saathi Database Seeding...");
    console.log("=" .repeat(50));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
    console.log("");

    // Seed in order (users first, then dependent data)
    console.log("📝 Step 1: Seeding Users...");
    await seedUsers();
    console.log("");

    console.log("📚 Step 2: Seeding Courses...");
    await seedCourses();
    console.log("");

    console.log("🎉 Step 3: Seeding Events...");
    await seedEvents();
    console.log("");

    console.log("📊 Step 4: Seeding Attendance Records...");
    await seedAttendance();
    console.log("");

    console.log("💼 Step 5: Seeding Placement Records...");
    await seedPlacement();
    console.log("");

    console.log("=" .repeat(50));
    console.log("🎉 E-Vidya Saathi Database Seeding Completed Successfully!");
    console.log("");
    console.log("📋 Summary:");
    console.log("   ✅ Users: Admin, Faculty, and Students");
    console.log("   ✅ Courses: 5 courses with enrollments");
    console.log("   ✅ Events: 6 upcoming events");
    console.log("   ✅ Attendance: 30 days of records");
    console.log("   ✅ Placements: Student placement data");
    console.log("");
    console.log("🔑 Login Credentials:");
    console.log("   👨‍💼 Admin: admin@evidyasaathi.edu / password123");
    console.log("   👩‍🏫 Faculty: faculty@evidyasaathi.edu / password123");
    console.log("   👨‍🎓 Student: student@evidyasaathi.edu / password123");
    console.log("");
    console.log("🌐 Your application is ready for the hackathon demo!");
    console.log("=" .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Seeding interrupted by user');
  mongoose.connection.close(() => {
    console.log('📡 MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Seeding terminated');
  mongoose.connection.close(() => {
    console.log('📡 MongoDB connection closed');
    process.exit(0);
  });
});

// Run the seeding
seedAll(); 