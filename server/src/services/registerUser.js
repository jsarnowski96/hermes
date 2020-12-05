const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = async function(userObject) {
    let errors = [];
    User.findOne({email: userObject.email, username: userObject.username}).exec((error, user) => {
        console.log(user);
        if(user) {
            errors.push({msg: 'There is already an account using this email or username'});
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: userObject.username,
                firstname: userObject.firstname,
                lastname: userObject.lastname,
                email: userObject.email,
                position: userObject.position,
                company: userObject.company,
                phone: userObject.phone,
                password: userObject.password
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
};