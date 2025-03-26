const express = require('express');
const router = express.Router();
const programsController = require('../controllers/programsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public GET
router.get('/', programsController.getProgramsPage);

// Admin routes
router.post('/',
    authMiddleware, adminMiddleware,
    programsController.updateProgramsPage
);

router.post('/items',
    authMiddleware, adminMiddleware,
    programsController.uploadProgramImageMiddleware,
    programsController.addProgramItem
);

router.patch('/items/:programId',
    authMiddleware, adminMiddleware,
    programsController.uploadProgramImageMiddleware,
    programsController.updateProgramItem
);

router.delete('/items/:programId',
    authMiddleware, adminMiddleware,
    programsController.deleteProgramItem
);

router.get('/items/:programId', programsController.getProgramItem);

module.exports = router;
