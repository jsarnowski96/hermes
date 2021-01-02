const bcrypt = require('bcrypt');
const { response } = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {
    checkIfUserExists,
    registerUser
}

async function checkIfUserExists(userForm) {
    if(User.findOne({email: userForm.email})) {
        //debug
        console.log('Check if exists - MATCH FOUND');
        return true;
    }

    if(User.findOne({username: userForm.username})) {
        //debug
        console.log('Check if exists - MATCH FOUND');
        return true;
    }

    //debug
    console.log('Check if exists - OK');
    return false;
}

async function registerUser(userForm) {
    const {firstname, lastname, username, email, phone, position, company, password} = userForm;
    if(!firstname || !lastname || !username || !email || !phone || !company || !password) {
        return 0;
    }
    const check = await checkIfUserExists(email, username);
    if(!check) {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            phone: phone,
            position: position,
            company: company,
            password: password
        });
    
        if(password) {
            user.password = bcrypt.hashSync(user.password, 10);
        }
    
        await user.save()
        .then(response => {
            if(response) {
                console.log(user);
                console.log('User registered');
            }
            return response;
        })
        .catch(error => {
            return error;
        });
    } else {
        return false;
    }
}