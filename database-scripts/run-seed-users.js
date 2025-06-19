const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './source-code/server/.env' }); // adjust path if needed

const seedUsers = require('./seed-users');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    await seedUsers();
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 