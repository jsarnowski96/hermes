const passport = require('passport');
const passportJwt = require('passport-jwt');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = require('../models/User');

require('dotenv').config({ path: __dirname + './../../.env'});

const cookieExtractor = (req) => {
    let refreshToken = null;

    if(req && req.cookies) {
        refreshToken = req.cookies.refreshToken;
    }
    
    return refreshToken;
}

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
    },
    async (login, password, done) => {
        if(login.match(/^[a-zA-Z0-9\-_.]+$/)) {
            try {
                const user = await User.findOne({ username: login }).select('username password');
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.log(err);
                            return done(err, false);
                        }
                        
                        if (result) {
                            return done(null, user, { message: 'JWT Authentication successfull' });
                        } else {
                            console.log('Authentication failed for user ' + login);
                            return done(null, false, new Error('usernameOrPasswordIncorrect'));
                        }
                    });
                } else {
                    console.log('Authentication failed for user ' + login);
                    return done(null, false, new Error('usernameOrPasswordIncorrect'));
                }
            } catch (error) {
                console.log(error);
                return done(error, false);
            }
        } 
        
        if(login.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            try {
                const user = await User.findOne({ email: login }).select('email password');
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.log(err);
                            return done(err, false);
                        }
                        
                        if (result) {
                            return done(null, user, { message: 'JWT Authentication successfull' });
                        } else {
                            console.log('Authentication failed for user ' + login);
                            return done(null, false, new Error('usernameOrPasswordIncorrect'));
                        }
                    });
                } else {
                    console.log('Authentication failed for user ' + login);
                    return done(null, false, new Error('usernameOrPasswordIncorrect'));
                }
            } catch (error) {
                console.log(error);
                return done(error, false);
            }
        }
    }
));

passport.use('refreshToken', new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    passReqToCallback: true
    },
    (jwt_payload, done) => {
        try {
            if(Date.now() >= jwt_payload.expiresIn * 1000) {
                return done(new TokenExpiredError, false);
            }

            User.findById(jwt_payload._id, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    console.log('Authentication failed for user ' + login);
                    return done(null, false, new Error('usernameOrPasswordIncorrect'));
                }
            });
        } catch(error) {
            console.log(error);
            return done(error, false);
        }
    }));

passport.use('accessToken', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    passReqToCallback: true
    },
    (jwt_payload, done) => {
        try {
            if(Date.now() >= jwt_payload.expiresIn * 1000) {
                return done(new TokenExpiredError, false);
            }

            User.findById(jwt_payload._id, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    console.log('Authentication failed for user ' + login);
                    return done(null, false, new Error('usernameOrPasswordIncorrect'));
                }
            });
        } catch(error) {
            console.log(error);
            return done(error, false);
        }
    }));

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        return done(error, user);
    });
});