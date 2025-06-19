const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const User = require('../source-code/server/models/User');

async function testAppUserModel() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('Connected!');

    const count = await User.countDocuments();
    console.log('User count before delete:', count);

    const result = await User.deleteMany({});
    console.log('Delete result:', result);

    const countAfter = await User.countDocuments();
    console.log('User count after delete:', countAfter);

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error:', err);
  }
}

testAppUserModel(); 