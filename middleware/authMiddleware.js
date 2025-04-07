const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

module.exports = async function authMiddleware(req, res, next) {
    try {
        // 1. Check if there's an Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Auth Header Missing. Try Again.' });
        }

        // 2. The expected format is "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token error.' });
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token malformatted.' });
        }

        // 3. Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        // 4. Optional: fetch the user from DB if you want user info
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Attach user info to req
        req.userId = user._id;
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        return next();
    } catch (error) {
        console.error('AuthMiddleware Error:', error);
        return res.status(401).json({ error: 'Token verification failed.' });
    }
};
