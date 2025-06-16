// ========================= Course.js =========================
// Course Schema: Represents a course in the campus portal
const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }]
});
const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;