const passport = require('passport');
const passportJwt = require('passport-jwt');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = require('../models/user');

require('dotenv').config({ path: __dirname + './../../.env'});

var opts = {};

opts.secretOrKey = process.env.REFRESH_TOKEN_SECRET;
opts.issuer = process.env.ISSUER;
opts.audience = process.env.AUDIENCE;

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    opts: opts
    },
    async (login, password, done) => {
        if(login.match(/^[a-zA-Z0-9\-_.]+$/)) {
            try {
                const user = await User.findOne({ username: login }).select('password');
                if (user) {
                    console.log(login);
                    console.log(password);
                    console.log(user.password);
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            return done(null, user, { message: 'JWT Authentication successfull' });
                        }
                        if (err) {
                            console.log(err);
                            return done(err, false, { message: 'Error' });
                        }
                    });
                } else {
                    return done(null, false, { message: 'Issue while retrieving user\'s data' });
                }
            } catch (error) {
                console.log(error);
                return done(error, false, { message: 'Error' });
            }
        } 
        
        if(login.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            try {
                const user = await User.findOne({ email: login }).select('password');
                if (user) {
                    console.log(login);
                    console.log(password);
                    console.log(user.password);
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            return done(null, user, { message: 'JWT Authentication successfull' });
                        }
                        if (err) {
                            console.log(err);
                            return done(err, false, { message: 'Error' });
                        }
                    });
                } else {
                    return done(null, false, { message: 'Issue while retrieving user\'s data' });
                }
            } catch (error) {
                console.log(error);
                return done(error, false, { message: 'Error' });
            }
        }
    }
));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    opts: opts
    },
    async (jwt_payload, done) => {
        if(jwt_payload.login.match(/^[a-zA-Z0-9\-_.]+$/)) {
            try {
                const user = await User.findOne({ username: jwt_payload.login });
                if (user) {
                    return done(null, user, { message: 'JWT Authentication successfull' });
                } else {
                    return done(null, false, { message: 'Issue while retrieving user\'s data' });
                }
            } catch (error) {
                console.log(error);
                return done(error, false, { message: 'Error' });
            }
        }
        
        if(jwt_payload.login.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            try {
                const user = await User.findOne({ email: jwt_payload.login });
                if (user) {
                    return done(null, user, { message: 'JWT Authentication successfull' });
                } else {
                    return done(null, false, { message: 'Issue while retrieving user\'s data' });
                }
            } catch (error) {
                console.log(error);
                return done(error, false, { message: 'Error' });
            }
        }
    }
));

// TODO: Handle Bearer Token auth on refresh/renew