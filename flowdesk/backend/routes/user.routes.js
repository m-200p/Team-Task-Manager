const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.guard');

router.use(protect);

router.get('/',           roleGuard('admin'), ctrl.getAllUsers);
router.patch('/:id/role', roleGuard('admin'), ctrl.updateRole);
router.get('/activity',   ctrl.getActivity);

module.exports = router;