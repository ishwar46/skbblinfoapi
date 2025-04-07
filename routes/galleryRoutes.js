const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public GET
router.get('/', galleryController.getGallery);

// Admin-only to update page info
router.post('/',
    authMiddleware,
    adminMiddleware,
    galleryController.updateGalleryInfo
);

// Admin-only to add a new image (with upload)
router.post('/images',
    authMiddleware,
    adminMiddleware,
    galleryController.uploadGalleryImageMiddleware,
    galleryController.addImageToGallery
);

// Admin-only to update an existing image
router.patch('/images/:imageId',
    authMiddleware,
    adminMiddleware,
    galleryController.uploadGalleryImageMiddleware,
    galleryController.updateGalleryImage
);

// Admin-only to delete an image
router.delete('/images/:imageId',
    authMiddleware,
    adminMiddleware,
    galleryController.deleteGalleryImage
);

module.exports = router;
