const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public GET
router.get('/', testimonialsController.getTestimonialsPage);

// Admin routes
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    testimonialsController.updateTestimonialsPage
);

router.post(
    '/items',
    authMiddleware,
    adminMiddleware,
    testimonialsController.uploadTestimonialImageMiddleware,
    testimonialsController.addTestimonialItem
);

router.patch(
    '/items/:testimonialId',
    authMiddleware,
    adminMiddleware,
    testimonialsController.uploadTestimonialImageMiddleware,
    testimonialsController.updateTestimonialItem
);

router.delete(
    '/items/:testimonialId',
    authMiddleware,
    adminMiddleware,
    testimonialsController.deleteTestimonialItem
);

module.exports = router;
