const passport = require('passport');
const passportJwt = require('passport-jwt');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = require('../models/user');

require('dotenv').config({ path: __dirname + './../../.env'});

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
                        if (result) {
                            done(null, user, { message: 'JWT Authentication successfull' });
                        }
                        if (err) {
                            console.log(err);
                            done(err, false, { message: 'Error' });
                        }
                    });
                } else {
                    done(null, false, { message: 'Incorrect username or password' });
                }
            } catch (error) {
                console.log(error);
                done(error, false, { message: 'Error' });
            }
        } 
        
        if(login.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            try {
                const user = await User.findOne({ email: login }).select('email password');
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            done(null, user, { message: 'JWT Authentication successfull' });
                        }
                        if (err) {
                            console.log(err);
                            done(err, false, { message: 'Error' });
                        }
                    });
                } else {
                    done(null, false, { message: 'Incorrect email or password' });
                }
            } catch (error) {
                console.log(error);
                done(error, false, { message: 'Error' });
            }
        }
    }
));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
    passReqToCallback: true
    },
    (jwt_payload, done) => {
        try {
            if(Date.now() > jwt_payload.expiresIn) {
                return done('JWT Expired');
            }

            User.findOne({id: jwt_payload._id}, function(err, user) {
        
                // This flow look familiar?  It is the same as when we implemented
                // the `passport-local` strategy
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
                
            });
        } catch(error) {
            console.log(error);
            return done(error, false);
        }
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user);
    });
});

// TODO: Handle Bearer Token auth on refresh/renew