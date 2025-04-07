const express = require('express');
const router = express.Router();
const blogController = require('../controllers/branchController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public endpoint to get
router.get('/', blogController.getBlogPage);

// Admin-only: update page-level info (page title and subtitle)
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    blogController.updateBlogPage
);

// Admin-only: add a new blog item (with image upload)
router.post(
    '/items',
    authMiddleware,
    adminMiddleware,
    blogController.uploadBlogImageMiddleware,
    blogController.addBlogItem
);

// Admin-only: update an existing blog item (optionally with image upload)
router.patch(
    '/items/:blogId',
    authMiddleware,
    adminMiddleware,
    blogController.uploadBlogImageMiddleware,
    blogController.updateBlogItem
);

// Admin-only: delete a blog item
router.delete(
    '/items/:blogId',
    authMiddleware,
    adminMiddleware,
    blogController.deleteBlogItem
);

module.exports = router;
