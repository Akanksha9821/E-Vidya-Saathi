const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../source-code/server/.env') });

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const User = mongoose.model('User', userSchema);

async function testUsersDelete() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
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

testUsersDelete(); 