const User = require("../models/User");

module.exports = async function superAdminMiddleware(req, res, next) {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized. No user ID found.' });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Only 'superadmin' role can pass
        if (user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Forbidden. Superadmin only.' });
        }

        // req.user = user;
        next();
    } catch (error) {
        console.error('SuperAdminMiddleware Error:', error);
        return res.status(500).json({ error: 'Server error checking superadmin rights.' });
    }
};