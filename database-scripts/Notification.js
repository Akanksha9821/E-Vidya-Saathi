// ========================= Notification.js =========================
// Notification Schema: Stores notifications for users
const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;