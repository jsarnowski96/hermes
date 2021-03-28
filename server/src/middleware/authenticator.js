const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport');


require('dotenv').config({ path: __dirname + './../../.env'});

module.exports = {
    isAuthenticated: function (req, res, next) {
        const authHeader = req.headers.authorization;
        if(authHeader) {
            const refreshToken = req.cookies.refreshToken || null;
            const accessToken = authHeader.split(' ')[1];

            // verify refresh token from HttpOnly cookie first
            if(refreshToken !== null) {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                    if(err) {
                        if (err.name === 'TokenExpiredError') {
                            console.log('REFRESH TOKEN => ' + err.name + " | " + err.message);
                            return res.status(403).json({error: 'JwtTokenExpired'});
                        } else if (err.name === 'JsonWebTokenError') {
                            console.log('REFRESH TOKEN => ' + err.name + " | " + err.message);
                            return res.status(406).json({error: err.message});
                        } else {
                            console.log('REFRESH TOKEN => ' + err.name + " | " + err.message);
                            return res.status(500).json({error: err.message});
                        }
                    } else {
                        if(!payload) {
                            console.log('REFRESH TOKEN => ' + err.name + " | " + err.message);
                            return res.status(406).json({error: err.message});
                        }
                    }
                });
            } else {
                return res.status(403).json({error: 'MissingRefreshToken'});
            }

            // verify access token from the request body
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
                if(err) {
                    console.log();
                    if (err.name === 'TokenExpiredError') {
                        console.log('ACCESS TOKEN => ' + err.name + " | " + err.message);
                        return res.status(403).json({error: 'JwtTokenExpired'});
                    } else if (err.name === 'JsonWebTokenError') {
                        console.log('ACCESS TOKEN => ' + err.name + " | " + err.message);
                        return res.status(406).json({error: err.message});
                    } else {
                        console.log('ACCESS TOKEN => ' + err.name + " | " + err.message);
                        return res.status(500).json({error: err.message});
                    }
                } else {
                    if(payload) {
                        //console.log('JWT Token validation success\nPayload:\n' + payload);
                        passport.authenticate(['accessToken', 'refreshToken'], { session: false });
                        next();
                    } else {
                        console.log('ACCESS TOKEN => ' + err.name + " | " + err.message);
                        return res.status(406).json({error: err.message});
                    }
                }
            });
        } else {
            console.log('Missing Auth Header');
            return res.status(406).json({error: 'MissingAuthHeader'});
        }
    }
}