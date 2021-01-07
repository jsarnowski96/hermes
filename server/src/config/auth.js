const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config({ path: __dirname + './../../.env'});

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        const authHeader = req.headers.authorization;
        if(req.isAuthenticated()) {
            return next();
        }

        if (authHeader) {
            const token = authHeader.split(' ')[1];
    
            try {
                var decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
                console.log(decode);
                if(decoded) {
                    res.status(200).json({message: 'JWT verified'});
                } else {
                    res.status(406).json({message: 'Not acceptable'});
                }
            } catch(error) {
                console.log(error);
            }
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }
    }
}