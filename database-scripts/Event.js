// ========================= Event.js =========================
// Event Schema: Represents campus events, workshops, etc.
const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Event = mongoose.model('Event', EventSchema);
module.exports = Event;