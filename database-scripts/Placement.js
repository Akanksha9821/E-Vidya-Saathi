// ========================= Placement.js =========================
// Placement Schema: Tracks student placement records
const mongoose = require('mongoose');
const PlacementSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  status: { type: String, enum: ['applied', 'interview', 'placed', 'rejected'] },
  package: Number,
  date: Date
});
const Placement = mongoose.model('Placement', PlacementSchema);
module.exports = Placement;