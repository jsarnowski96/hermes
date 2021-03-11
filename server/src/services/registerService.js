const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');

module.exports = {
    registerUser,
    checkIfCompanyExists,
    checkIfUserExists
}

async function checkIfUserExists(email, username) {
    let result;
    result = await User.findOne({email})
    .then((result) => {
        if(!result || result === null) {
            return false;
        } else {
            return true;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    });

    if(!result || result === null) {
        result = await User.findOne({username})
        .then((result) => {
            if(!result || result === null) {
                return false;
            } else {
                return true;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        });
    
    }

    return result;
}

async function checkIfCompanyExists(company) {
    return await Company.findOne({name: company}).select('_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            return error;
        }
    });
}

async function registerUser(userObj) {
    const {firstname, lastname, username, email, phone, position, company, password} = userObj;
    let userExists, companyId, user;

    if(!firstname || !lastname || !username || !email || !phone || !position || !password) {
        throw new Error('EmptyFormField');
    }

    userExists = await checkIfUserExists(email, username);

    if(userExists === true) {
        console.log('User registration failure - STAGE: user identity verification | REASON: email or username already in use');
        throw new Error('KeyDuplication');
    } else if(userExists instanceof Error) {
        console.log('User registration failure - STAGE: user identity verification | REASON: function returned following error:');
        console.log(userExists);
        throw userExists;
    } else if(userExists === false) {
        if(!company) {
            user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                position: position,
                company: null,
                phone: phone,
                password: password
            });
        } else {
            companyId = await checkIfCompanyExists(company);
            
            if(companyId instanceof Error) {
                console.log('User registration failure - STAGE: company data verification | REASON: company does not exist');
                throw companyId;
            }

            if(!mongoose.Types.ObjectId.isValid(companyId)) {
                throw new Error('CompanyIdNotValid')
            }

            user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                position: position,
                company: companyId,
                phone: phone,
                password: password
            });
        }
    
        bcrypt.genSalt(10, (error, salt) => {
            if(error) throw error;
            bcrypt.hash(user.password, salt, (error, hash) => {
                if(error) throw error;
                user.password = hash;
                return user.save()
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('UserNotRegistered');
                    } else {
                        console.log(result);
                        return result;
                    }
                })
                .catch((error) => {
                    console.log('User registration failure - STAGE: processing verified data | REASON: function returned following error:');
                    console.log(error);
                    throw error;
                })
            });
        });
    }
}; 