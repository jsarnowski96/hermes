const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getUser,
    getUserList,
    createUser,
    editUser,
    deleteUser
} = require('../../services/userService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'User ID route'});
});

router.post('/list', async (req, res, next) => {
    return res.status(200);
});

router.get('/edit', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    if(await createUser(req.body)) {
        res.status(200).json({message: 'User succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add user to the database'});
    }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;