const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config({ path: __dirname + './../../.env'});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            if(err === 'usernameOrPasswordIncorrect') {
                return res.status(403).json({
                    message: info ? info.message: 'ACCESS DENIED - Incorrect username or password',
                    user: user
                })
            } else {
                return res.status(500).json({
                    message: info ? info.message : err,
                    user: user
                });
            }
        }

        const payload = {
            userId: user._id,
            login: req.body.login,
            role: user.role
        }

        req.login(payload, {session: false}, (err) => {
            if(err) {
                console.log(err);
                return res.status(500).json({err});
            }

            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, 
                { 
                    expiresIn: process.env.REFRESH_TOKEN_LIFETIME, 
                    issuer: process.env.ISSUER, 
                    audience: process.env.AUDIENCE
                });
            return res.status(200).json({user, refreshToken});
        });
    })(req, res);
});

router.post("/logout", async (req, res, next) => {
    req.logout();
    console.log('Logged out');
    return res.status(200).json({message: 'Logged out successfully'});
})

module.exports = router;