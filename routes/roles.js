let router = require('express').Router();

let roleController = require("../controllers/roleController");
let { checkPermission } = require("../middleware/permissionMiddleware");

router.get('/', [checkPermission('roles.view')], roleController.index);

router.get('/add', [checkPermission('roles.create')], roleController.add);

router.post('/add', [checkPermission('roles.create')], roleController.addRole);

router.get('/:id/edit', [checkPermission('roles.edit')], roleController.edit);

router.post('/:id/edit', [checkPermission('roles.edit')], roleController.editRole);

router.delete('/:id/delete', [checkPermission('roles.delete')], roleController.deleteRole);

module.exports = router;
