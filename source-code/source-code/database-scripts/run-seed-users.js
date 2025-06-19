const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../server/.env' }); // Updated path since we're now in source-code/database-scripts

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