const mongoose = require("mongoose");
require("dotenv").config({ path: "../server/.env" });

const seedUsers = require("./seed-users");
const seedCourses = require("./seed-courses");
const seedEvents = require("./seed-events");
const seedAttendance = require("./seed-attendance");
const seedPlacement = require("./seed-placement");

async function connectToMongo() {
  try {
    console.log("🚀 Starting E-Vidya Saathi Database Seeding...");
    console.log("==================================================");

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Wait for connection to be fully open
    await mongoose.connection.asPromise();

    console.log("✅ Connected to MongoDB Atlas");

    console.log("\n📝 Step 1: Seeding Users...");
    await seedUsers();
    console.log("\n📚 Step 2: Seeding Courses...");
    await seedCourses();
    console.log("\n🎉 Step 3: Seeding Events...");
    await seedEvents();
    console.log("\n📊 Step 4: Seeding Attendance Records...");
    await seedAttendance();
    console.log("\n💼 Step 5: Seeding Placement Records...");
    await seedPlacement();

    console.log("\n✅ All data seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
}

connectToMongo(); 