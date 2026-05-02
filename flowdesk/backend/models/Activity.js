const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  action: { type: String, required: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);