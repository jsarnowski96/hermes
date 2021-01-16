const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {
    getUser,
    getUserList,
    editUser,
    deleteUser
}

async function getUser(id) {
    return await User.findById(id);
}

async function getUserList() {
    
}

async function editUser(id, userForm) {
    const user = User.findById(id);
    let result;

    if (!user) return 'UserNotFound';
    if(user.username !== userForm.username && User.findOne({username: userForm.username})) {
        //debug
        console.log('Check if exists - MATCH FOUND');
        result = false;
    }

    if (userForm.password) {
        userForm.password = bcrypt.hashSync(userForm.password, 10);
    }

    if(result) {
        Object.assign(user, userForm);
        await user.save();   
    } else {
        return 'UpdateFailed';
    }
}

async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}