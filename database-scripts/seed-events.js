const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const MONGO_URI = process.env.MONGO_URI;

const eventSchema = new mongoose.Schema({}, { strict: false, collection: 'events' });
const Event = mongoose.model('Event', eventSchema);

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    await Event.deleteMany();

    const events = [
      {
        name: "AI Workshop",
        date: new Date("2025-06-20"),
        description: "Hands-on session with TensorFlow",
        createdBy: "Admin One",
      },
      {
        name: "Resume Building Webinar",
        date: new Date("2025-06-22"),
        description: "Tips and tricks to create a winning resume",
        createdBy: "Admin One",
      },
    ];

    await Event.insertMany(events);
    console.log("✅ Events seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedEvents(); 