const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard', ctrl.getDashboard);
router.get('/',          ctrl.getTasks);
router.post('/',         ctrl.createTask);
router.patch('/:id',     ctrl.updateTask);
router.delete('/:id',    ctrl.deleteTask);

module.exports = router;