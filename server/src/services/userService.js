const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
    getUser,
    getUserList,
    createUser,
    editUser,
    deleteUser
}

async function getUser(id) {
    return await User.findById(id);
}

async function getUserList() {
    
}

function createUser() {

}

async function editUser(id, userForm) {

}

async function deleteUser(id) {
    await User.findByIdAndRemove(id);
}