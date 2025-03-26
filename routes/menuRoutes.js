const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController')
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


//Public route for getting menu items

router.get('/', menuController.getMenuItems);

//Admin Routes
router.post('/', authMiddleware, adminMiddleware, menuController.createMenuItem);
router.patch('/:id', authMiddleware, adminMiddleware, menuController.updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;