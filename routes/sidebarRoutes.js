const express = require('express');
const router = express.Router();
const sidebarController = require('../controllers/sidebarController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const superAdminMiddleware = require('../middleware/superAdminMiddleware');


// Only authenticated users (any user) can GET the sidebar tree
router.get('/', authMiddleware, sidebarController.getSidebarTree);

// Admin-only CRUD
router.post('/', authMiddleware, adminMiddleware, sidebarController.createSidebarItem);
router.patch('/:id', authMiddleware, adminMiddleware, superAdminMiddleware, sidebarController.updateSidebarItem);
router.delete('/:id', authMiddleware, adminMiddleware, sidebarController.deleteSidebarItem);

module.exports = router;
