const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport');


require('dotenv').config({ path: __dirname + './../../.env'});

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        const authHeader = req.headers.authorization;
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) {
                    if (err.name === 'TokenExpiredError') {
                        console.log('JWT Token expired');
                        return res.status(403).json({error: 'JwtTokenExpired'});
                    } else if (err.name === 'JsonWebTokenError') {
                        console.log('JWT Token malformed');
                        return res.status(406).json({error: 'JwtTokenMalformed'});
                    } else {
                        console.log(err.name + "\n" + err.message);
                        return res.status(500).json({error: err.name + "\n" + err.message});
                    }
                } else {
                    if(payload) {
                        //console.log('JWT Token successfully validated');
                        passport.authenticate('jwt', { session: false });
                        next();
                    } else {
                        console.log('Missing JWT Token payload');
                        return res.status(406).json({error: 'MissingJwtTokenPayload'});
                    }
                }
            });
        } else {
            console.log('Missing Auth Header');
            return res.status(403).json({error: 'MissingAuthHeader'});
        }
    }
}