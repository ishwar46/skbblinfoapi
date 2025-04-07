const User = require("../models/User");
const DeletedUser = require("../models/deletedUser.model");
const getNextReceiptNumber = require("../utils/getNextReceiptNumber");

/**
 * Promote or demote a user to admin.
 * POST /api/admin/promote
 */
exports.promoteUser = async (req, res) => {
  try {
    const { userIdToPromote, makeAdmin } = req.body;

    if (!userIdToPromote) {
      return res.status(400).json({ error: "userIdToPromote is required." });
    }

    const user = await User.findById(userIdToPromote);
    if (!user) {
      return res.status(404).json({ error: "User to promote not found." });
    }

    // Decide role based on makeAdmin
    user.role = makeAdmin ? "admin" : "user";
    await user.save();

    return res.status(200).json({
      message: `User ${makeAdmin ? "promoted to admin" : "demoted to user"}.`,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("PromoteUser Error:", error);
    return res.status(500).json({ error: "Server error promoting user." });
  }
};

/**
 * Verify a user (approve or set status to something else)
 * PATCH /api/admin/verify-user
 *
 */
exports.verifyUser = async (req, res) => {
  try {
    const {
      userId,
      newStatus,
      statusReason,
      membershipFee,
      membershipPaid,
      setExpiryInDays,
    } = req.body;

    if (!userId || !newStatus) {
      return res.status(400).json({
        error: "userId and newStatus fields are required.",
      });
    }

    // Allowed statuses might be: "active", "suspended", "rejected"
    const ALLOWED_STATUSES = ["active", "suspended", "rejected", "deactivated"];
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update status
    user.accountStatus = newStatus;
    if (newStatus === "rejected") {
      user.membershipReceipt = null;
      user.statusReason = statusReason;
      user.membershipFee = 0; //save membership fee
      user.membershipPaid = false;
    }
    if (newStatus === "deactivated") {
      user.statusReason = statusReason;
      user.membershipFee = 0; //save membership fee
      user.membershipPaid = false;
    }
    if (newStatus === "active") {
      user.membershipFee = membershipFee; //save membership fee
      user.membershipPaid = true;
      user.statusReason = null;

      if (user.membershipReceipt.fileName) {
        const Counter = (await getNextReceiptNumber())
          .toString()
          .padStart(4, "0");

        user.receipts.push({
          receiptNumber: "#JHA-" + Counter,
          fileName: user.membershipReceipt.fileName,
          filePath: user.membershipReceipt.filePath,
          uploadedAt: new Date(),
        });
        user.membershipReceipt = null;
      }
    }

    // If membershipPaid is provided, update
    if (typeof membershipPaid !== "undefined") {
      user.membershipPaid = !!membershipPaid;
      if (user.membershipPaid) {
        user.membershipPaidAt = new Date();
      }
    }

    // If setExpiryInDays is provided, set accountExpiry
    if (setExpiryInDays) {
      // e.g., 1 year from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + setExpiryInDays);
      user.accountExpiry = expiryDate;
    }

    await user.save();

    return res.status(200).json({
      message: "User status updated successfully.",
      user: {
        _id: user._id,
        username: user.username,
        accountStatus: user.accountStatus,
        accountExpiry: user.accountExpiry,
        membershipPaid: user.membershipPaid,
      },
    });
  } catch (error) {
    console.error("VerifyUser Error:", error);
    return res.status(500).json({
      error: "Server error while updating user status.",
    });
  }
};

/**
 * User Authorization (Allow user to access admin dashboard)
 * GET /api/admin/admin-verify
 *
 */
exports.verifyAdmin = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User is an admin.",
    });
  } catch (error) {
    console.error("Admin User Error:", error);
    return res.status(500).json({
      error: `Server error while getting user details: ${error.message}`,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userIdToEdit } = req.params;
    const {
      email,
      username,
      fullName,
      address,
      contact,
      profession,
      membershipType,
      accountStatus,
      membershipPaid,
      hasSpouse,
      spouse,
      familyMembers,
    } = req.body;

    if (!userIdToEdit) {
      return res.status(400).json({ error: "No user ID specified." });
    }

    const user = await User.findById(userIdToEdit);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Admin can update any fields you allow
    if (typeof username !== "undefined") user.username = username.trim();
    if (typeof email !== "undefined") user.email = email.trim();
    if (typeof fullName !== "undefined") user.fullName = fullName.trim();
    if (typeof address !== "undefined") user.address = address.trim();
    if (typeof contact !== "undefined") user.contact = contact.trim();
    if (typeof profession !== "undefined") user.profession = profession.trim();
    if (typeof membershipType !== "undefined")
      user.membershipType = membershipType;
    if (typeof accountStatus !== "undefined")
      user.accountStatus = accountStatus;
    if (typeof membershipPaid !== "undefined")
      user.membershipPaid = membershipPaid;
    if (typeof hasSpouse !== "undefined") user.hasSpouse = hasSpouse;

    if (typeof familyMembers !== "undefined") {
      // Handle familyMembers
      if (typeof familyMembers === "string") {
        try {
          user.familyMembers = JSON.parse(familyMembers); // If it's a string, parse it
        } catch (error) {
          return res
            .status(400)
            .json({ error: "Invalid familyMembers JSON format." });
        }
      } else if (Array.isArray(familyMembers)) {
        // Validate that each family member has the required 'fullName'
        user.familyMembers = familyMembers.map((member) => {
          if (!member.fullName) {
            throw new Error("Each family member must have a fullName.");
          }
          return member;
        });
      } else if (typeof familyMembers === "object") {
        user.familyMembers = Object.values(familyMembers).map((member) => {
          if (!member.fullName) {
            throw new Error("Each family member must have a fullName.");
          }
          return member;
        });
      } else {
        user.familyMembers = []; // Default to empty array if not recognized
      }
    }

    if (typeof spouse !== "undefined") user.spouse = spouse;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully by admin.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        address: user.address,
        contact: user.contact,
        profession: user.profession,
        membershipType: user.membershipType,
        accountStatus: user.accountStatus,
        membershipPaid: user.membershipPaid,
        hasSpouse: spouse ? true : false,
        spouse: spouse ? spouse : null,
        familyMembers: user.familyMembers, // Updated familyMembers
      },
    });
  } catch (error) {
    console.error("Admin Update User Error:", error);
    return res.status(500).json({
      error: `Server error while updating user details: ${error.message}`,
    });
  }
};

/**
 * Delete a user (admins or superadmins only)
 * DELETE /api/admin/delete/:userId
 * Optional: pass "reason" in req.body
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user to delete
    const { reason } = req.body; // optional reason for deletion

    if (!userId) {
      return res.status(400).json({ error: "No userId provided." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Archive user data in DeletedUser
    await DeletedUser.create({
      originalUserId: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      address: user.address,
      profession: user.profession,
      membershipType: user.membershipType,
      membershipFee: user.membershipFee,
      membershipPaid: user.membershipPaid,
      donatedAmount: user.donatedAmount,
      accountExpiry: user.accountExpiry,
      deletedBy: req.userId,
      role: user.role,
      reason: reason || "",
    });

    // Remove the user from main collection
    await user.deleteOne();

    return res.status(200).json({
      message: `User ${user.fullName} has been deleted.`,
    });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    return res.status(500).json({ error: "Server error while deleting user." });
  }
};
