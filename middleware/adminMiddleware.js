const User = require('../models/User');

/**
 * Checks if the authenticated user is an admin.
 * Requires that authMiddleware already ran to set req.userId.
 */
module.exports = async function adminMiddleware(req, res, next) {
    try {
        // Make sure authMiddleware has set req.userId
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized. No user ID found.' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // If user.role is either 'admin' or 'superadmin', proceed
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Forbidden. Admins only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('AdminMiddleware Error:', error);
        return res.status(500).json({ error: 'Server error checking admin rights.' });
    }
};
