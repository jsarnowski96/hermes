const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config({ path: __dirname + './../../.env'});

router.post('/', async function(req, res, next) {
    if(req.headers.authorization.includes('Bearer')) {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: info ? info.message : 'Login failed',
                        user: user
                    });
                }

                req.login(user, {session: false}, (err) => {
                    return res.status(200).json({user, token});
                })
                // req.user = user;
                // next();
            });
        })(req, res);
    } else if(req.headers.authorization.includes('Basic')) {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: info ? info.message : 'Login failed',
                    user: user
                });
            }
            req.login(user, {session: false}, (err) => {
                if(err) {
                    res.send(err);
                }
                const token = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET);
                return res.status(200).json({user, token});
            });
        })(req, res);
    }
});

module.exports = router;
