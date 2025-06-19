const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

// Minimal User model definition for local test
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await User.deleteMany(); // Clear old users

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
      {
        name: "Student One",
        email: "student@mycollege.edu",
        password: hashedPassword,
        role: "student"
      },
      {
        name: "Faculty One",
        email: "faculty@mycollege.edu",
        password: hashedPassword,
        role: "faculty"
      },
      {
        name: "Admin One",
        email: "admin@mycollege.edu",
        password: hashedPassword,
        role: "admin"
      }
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers(); 