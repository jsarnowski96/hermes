const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {
    update,
    getUserData,
    delete: _delete
}

async function update(id, userForm) {
    const user = User.findById(id);
    let result;

    if (!user) return 'UserNotFound';
    if(user.username !== userForm.username && User.findOne({username: userForm.username})) {
        //debug
        console.log('Check if exists - MATCH FOUND');
        result = false;
    }
    // if (user.username !== userForm.username && await User.findOne({ username: userForm.username })) {
    //     throw 'Username "' + userForm.username + '" is already taken';
    // }

    if (userForm.password) {
        userForm.password = bcrypt.hashSync(userForm.password, 10);
    }

    if(result) {
        // copy userParam properties to user
        Object.assign(user, userForm);
        await user.save();   
    } else {
        return 'UpdateFailed';
    }
}

async function getUserData(id) {
    return await User.findById(id);
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}