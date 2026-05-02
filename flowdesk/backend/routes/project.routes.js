const router = require('express').Router();
const ctrl = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const { roleGuard } = require('../middleware/role.guard');

router.use(protect);

router.get('/',              ctrl.getProjects);
router.post('/',             ctrl.createProject);
router.get('/:id',           ctrl.getProject);
router.patch('/:id',         ctrl.updateProject);
router.delete('/:id',        roleGuard('admin'), ctrl.deleteProject);
router.post('/:id/members',  ctrl.addMember);

module.exports = router;