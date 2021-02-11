const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config({ path: __dirname + './../../.env'});

router.post('/', async function(req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        const payload = {
            userId: user._id,
            login: req.body.login,
            //role: user.role,
            //expiresIn: process.env.REFRESH_TOKEN_LIFETIME
            //expiresIn: Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFETIME)
        }

        req.login(payload, {session: false}, (err) => {
            if(err) {
                console.log(err);
                return res.status(401).send(err);
            }

            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME, issuer: process.env.ISSUER, audience: process.env.AUDIENCE});
            return res.status(200).json({user, refreshToken});
        });
    })(req, res);
});

module.exports = router;

// TODO: FIX JWT; COOKIE -> GET BACK TO HEADER AUTH, FIX FUCKING JWT PAYLOAD