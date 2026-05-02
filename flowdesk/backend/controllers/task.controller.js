const Task = require('../models/Task');
const Activity = require('../models/Activity');

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).populate('assignedTo', 'name email').populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await Activity.create({ user: req.user._id, project: task.project, task: task._id, action: 'Created task', meta: { title: task.title } });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (req.body.status) await Activity.create({ user: req.user._id, project: task.project, task: task._id, action: `Status → ${req.body.status}`, meta: { title: task.title } });
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    // Admin = sabke tasks, Member = sirf apne
    const baseFilter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const [total, done, inProgress, overdue] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: 'done' }),
      Task.countDocuments({ ...baseFilter, status: 'in-progress' }),
      Task.countDocuments({ ...baseFilter, dueDate: { $lt: now }, status: { $ne: 'done' } })
    ]);
    res.json({ total, done, inProgress, overdue });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
