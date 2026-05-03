const router = require('express').Router();
const { signup, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login',  login);
router.get('/me',      protect, getMe);

// Profile update
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Password change
router.put('/password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;