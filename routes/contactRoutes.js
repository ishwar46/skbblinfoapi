const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public endpoint for retrieving static contact page info
router.get('/page', contactController.getContactPage);

// Admin-only endpoint to update static contact page info
router.put('/page', authMiddleware, adminMiddleware, contactController.updateContactPage);

// Public endpoint for submitting contact queries
router.post('/queries', contactController.submitContactQuery);

// Admin-only endpoint for retrieving all contact queries
router.get('/queries', authMiddleware, adminMiddleware, contactController.getContactQueries);

// Admin-only endpoint for deleting a specific contact query
router.delete('/queries/:id', authMiddleware, adminMiddleware, contactController.deleteContactQuery);

module.exports = router;
