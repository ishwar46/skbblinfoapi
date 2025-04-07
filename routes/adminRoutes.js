// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Import middlewares
const authMiddleware = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/promote",
  authMiddleware,
  superAdminMiddleware,
  adminController.promoteUser
);

// PATCH /api/admin/verify-user
router.patch(
  "/verify-user",
  authMiddleware,
  adminMiddleware,
  adminController.verifyUser
);

// Only admins or superadmins can update a user
router.patch(
  "/users/:userIdToEdit",
  authMiddleware,
  adminMiddleware,
  adminController.updateUser
);

// Only admins or superadmins can delete a user
router.delete(
  "/delete/:userId",
  authMiddleware,
  adminMiddleware,
  adminController.deleteUser
);
router.get(
  "/admin-verify",
  authMiddleware,
  adminMiddleware,
  adminController.verifyAdmin
);
module.exports = router;
