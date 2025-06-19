const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

// Minimal User model definition
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

async function seedUsers() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = [
    { name: "Admin", email: "admin@mycollege.edu", password: hashedPassword, role: "admin" },
    { name: "Student", email: "student@mycollege.edu", password: hashedPassword, role: "student" },
    { name: "Faculty", email: "faculty@mycollege.edu", password: hashedPassword, role: "faculty" }
  ];

  await User.insertMany(users);
  console.log("✅ Seeded users!");
  process.exit();
}

seedUsers().catch(err => {
  console.error("❌ Seed failed", err);
  process.exit(1);
}); 