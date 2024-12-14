const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Fix: Correctly access `cookies` from `req.cookies`
    const token = req.cookies.token; 
    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        // Verify the token with the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request
        next(); // Proceed to the next middleware
    } catch (err) {
        // Handle errors during token verification
        return res.status(401).json({
            message: 'Unauthorized: Invalid token',
        });
    }
}

module.exports = auth;