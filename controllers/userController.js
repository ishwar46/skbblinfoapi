const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isValidEmail = require("../utils/Validators");
const { sendEmail } = require("../middleware/nodeMailer");
const {
  welcomeEmail,
  PasswordChangedEmail,
} = require("../utils/emailTemplates");
const generateStrongPassword = require("../utils/RandomPass");
const PasswordResetRequest = require("../models/PasswordResetRequest");
const fs = require("fs");
const path = require("path");

const MAX_LOGIN_ATTEMPTS = 5;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Register a new user
 * POST /api/register
 */
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      contact,
      profession,
      password,
      membershipType,
      city,
      state,
      canReceiveText,
      hasSpouse,
      spouse,
      familyMembers,
    } = req.body;

    // Validate required fields
    const errors = {};
    if (!fullName || fullName.trim() === "") {
      errors.fullName = "Full Name is required.";
    }
    if (!username || username.trim() === "") {
      errors.username = "Username is required.";
    }
    if (!email || email.trim() === "") {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!state || state.trim() === "") {
      errors.state = "State is required.";
    }
    if (!contact || contact.trim() === "") {
      errors.contact = "Contact is required.";
    }
    if (!profession || profession.trim() === "") {
      errors.profession = "Profession is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    // If any errors, return 400 Bad Request with details
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with additional fields
    const user = new User({
      fullName,
      username,
      email,
      contact,
      profession,
      password: hashedPassword,
      membershipType: membershipType || "general",
      city: city && city !== "Other" ? city : state,
      state: state || "",
      canReceiveText: canReceiveText || "false",
      hasSpouse: hasSpouse === "yes" || hasSpouse === true,
      spouse: spouse ? spouse : null,
      // familyMembers: familyMembers ? JSON.parse(familyMembers) : [],
      familyMembers:
        typeof familyMembers === "string"
          ? JSON.parse(familyMembers) // If it's a string, parse it
          : Array.isArray(familyMembers)
          ? familyMembers // Keep it as is if it's already an array
          : Object.values(familyMembers) || [],
    });

    await user.save();
    await sendEmail({
      from: "skbbl@gmail.com",
      to: email,
      subject: "Welcome to SKBBL!",
      html: welcomeEmail(username, email, password),
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        membershipType: user.membershipType,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ error: "Server error while registering user." });
  }
};

/**
 * User Login
 * POST /api/login
 */
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Validate required fields
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        error: "Username/email and password are required.",
      });
    }

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    if (user.accountExpiry && user.accountExpiry < new Date()) {
      return res.status(403).json({
        success: false,
        error: "Your membership has expired. Please renew or contact admin.",
      });
    }

    // Check if account is locked or inactive
    if (
      user.accountStatus === "suspended" ||
      user.accountStatus === "deactivated"
    ) {
      return res.status(403).json({
        success: false,
        error: `Account is ${user.accountStatus}. Please contact support.`,
      });
    }

    if (user.accountLocked) {
      return res.status(403).json({
        success: false,
        error:
          "Account is locked due to too many failed logins. Please Contact Admin.",
      });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Increment login attempts and lock account if threshold is reached
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.accountLocked = true;
      }
      await user.save();
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
        attemptsRemaining: MAX_LOGIN_ATTEMPTS - user.loginAttempts,
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.accountLocked = false;

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Record the login log with IP and user agent
    user.loginLogs.push({
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    });
    await user.save();

    // Success response
    return res.status(200).json({
      success: true, // Added success field
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        membershipType: user.membershipType,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    // Error response
    return res.status(500).json({
      success: false,
      error: "Server error while logging in.",
    });
  }
};

/**
 * Get User Profile
 * GET /api/profile
 * Requires JWT authentication (middleware should set req.userId)
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res
      .status(500)
      .json({ error: "Server error while fetching profile." });
  }
};

/**
 * User Profile
 * PATCH /api/profile
 * Requires JWT authentication (middleware should set req.userId)
 */

exports.updateProfile = async (req, res) => {
  try {
    // The userId is set by authMiddleware (JWT decode)
    const userId = req.userId;

    // Accept the fields they may want to update
    const { fullName, address, contact, profession } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update only allowable fields
    if (typeof fullName !== "undefined") user.fullName = fullName.trim();
    if (typeof address !== "undefined") user.address = address.trim();
    if (typeof contact !== "undefined") user.contact = contact.trim();
    if (typeof profession !== "undefined") user.profession = profession.trim();

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        address: user.address,
        contact: user.contact,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      error: "Server error while updating profile.",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { _id } = req.body;
    // Find the user based on the token and expiration
    const user = await User.findById({
      _id,
    });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    const password = generateStrongPassword(8).trim();

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    await sendEmail({
      from: "skbbl@gmail.com",
      to: user.email,
      subject: "Password Changed Successfully",
      html: PasswordChangedEmail(user.username, user.email, password),
    });
    return res.status(200).json({
      message: "Password updated successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        address: user.address,
        contact: user.contact,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ error: "Server error while updating password." });
  }
};

// Forgot Password: Request a reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If a user with that email exists, a reset link has been sent.",
      });
    }

    // Generate a reset token (expires in 1 hour)
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `https://www.skbbl.com.np/reset-password/${resetToken}`;

    const templatePath = path.join(
      __dirname,
      "../utils/forgotPasswordRequest.html"
    );
    let emailTemplate = fs.readFileSync(templatePath, "utf-8");

    emailTemplate = emailTemplate.replace("{{resetLink}}", resetLink);

    const emailResult = await sendEmail({
      from: "skbbl@gmail.com",
      to: email,
      subject: "Password Reset Request - SKBBL",
      html: emailTemplate,
    });

    // Save the reset request in the database
    const passwordResetRequest = new PasswordResetRequest({
      userId: user._id,
      email,
      resetToken,
      emailSent: true,
    });
    await passwordResetRequest.save();

    return res.status(200).json({
      message: "If a user with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res
      .status(500)
      .json({ error: "Server error while processing request." });
  }
};

// Reset Password: Update the user’s password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    // Check if the token exists in the PasswordResetRequest collection
    const resetRequest = await PasswordResetRequest.findOne({
      resetToken: token,
    });
    if (!resetRequest) {
      return res.status(400).json({
        error:
          "Invalid or expired token. Please request a new password reset link.",
      });
    }

    // Verify the token and extract the userId
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Hash the new password and update the user record
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Remove the token so it cannot be reused
    await PasswordResetRequest.deleteOne({ _id: resetRequest._id });

    // Read the email template file
    const templatePath = path.join(
      __dirname,
      "../utils/resetPasswordConfirmation.html"
    );
    let emailTemplate = fs.readFileSync(templatePath, "utf-8");

    emailTemplate = emailTemplate.replace(
      "{{username}}",
      user.username || user.email
    );

    // Send confirmation email
    await sendEmail({
      from: "skbbl@gmail.com",
      to: user.email,
      subject: "Password Reset Confirmation",
      html: emailTemplate,
    });

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ error: "Server error while resetting password." });
  }
};

/**
 * Delete a receipt
 * DELETE /api/admin/delete/:receiptId

 */
exports.deleteReceipt = async (req, res) => {
  try {
    const { userId } = req.body; // ID of the user to delete to delete receipt from
    const { receiptId } = req.params; // Id of receipt to delete

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "user not found." });
    }

    const receipt = user.receipts.id(receiptId);
    if (!receipt) {
      return res.status(404).json({ error: "receipt not found." });
    }

    await receipt.deleteOne();
    await user.save();

    return res.status(200).json({
      message: `receipt has been deleted.`,
    });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    return res.status(500).json({ error: "Server error while deleting user." });
  }
};

exports.sendIdCardEmail = async (req, res) => {
  const { image, fullName, email } = req.body;

  if (!image || !email)
    return res.status(400).json({ success: false, message: "Missing data" });

  try {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    const filename = `${fullName.replace(/\s+/g, "_")}_IDCard.png`;
    const filePath = path.join(__dirname, filename);

    // Save the image temporarily
    fs.writeFileSync(filePath, base64Data, "base64");
    await sendEmail({
      from: "skbbl@gmail.com",
      to: email,
      subject: "Your ID Card",
      text: `Dear ${fullName},\n\nAttached is your membership ID Card.`,
      attachments: [
        {
          filename,
          path: filePath,
        },
      ],
    });

    // Delete temp file
    fs.unlinkSync(filePath);

    res.json({ success: true, message: "Email sent with ID Card" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};
