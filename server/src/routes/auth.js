const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    res.status(200);
});

router.get('/register', (req, res, next) => {
    res.status(200).json('Hermes Server GET /auth/register - ' + res.statusCode);
});

router.get('/login', (req, res, next) => {
    res.status(200).json('Hermes Server GET /auth/login - ' + res.statusCode);
});

router.post('/register', (req, res, next) => {
    const { username, firstname, lastname, email, phone, position, company, password, password_confirm} = req.body;
    let errors = [];
    if(!username || !firstname || !lastname || !email || !phone || !position || !company || !password || !password_confirm) {
        errors.push({msg: 'Please fill in all fields'});
    }

    if(password != password_confirm) {
        errors.push({msg: 'Passwords do not match'});
    }

    if(password.length < 6) {
        errors.push({msg: 'Password has to be at least characters long'});
    }

    if(errors.length > 0) {
        console.log(errors);
    } else {
        //const registerUser = require('../services/registerUser');
        User.findOne({email: req.body.email, username: req.body.username}).exec((error, user) => {
            console.log(user);
            if(user) {
                errors.push({msg: 'There is already an account using this email or username'});
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    position: position,
                    company: company,
                    phone: phone,
                    password: password
                });
    
                bcrypt.genSalt(10, (error, salt) => {
                    if(error) throw error;
                    bcrypt.hash(user.password, salt, (error, hash) => {
                        if(error) throw error;
                        user.password = hash;
                        user.save()
                        .then(() => {
                            console.log('User added');
                            console.log(user);
                            return true;
                        })
                        .catch(error => {
                            console.log(error);
                            return false;
                        });
                    });
                });
            }
        });
    }
    res.status(200).json('Dodano użytkownika');
});

router.post('/login', (req, res, next) => {

});

module.exports = router;