const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport');


require('dotenv').config({ path: __dirname + './../../.env'});

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        const authHeader = req.headers.authorization;
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) {
                    if (err.name === 'TokenExpiredError') {
                        console.log('JWT Token expired');
                    }
                    
                    if (err.name === 'JsonWebTokenError') {
                        console.log('JWT Token malformed');
                    }
                } else {
                    if(payload) {
                        console.log(payload);
                        console.log('Your JWT was successfully validated!');
                        passport.authenticate('jwt', { session: false });
                    } else {
                        console.log('Payload missing');
                    }
                }
            });
        } else {
            console.log('Missing Auth Headers');
        }
    }
}