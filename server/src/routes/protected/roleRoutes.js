const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getRole,
    getRoleList,
    createRole,
    updateRole,
    deleteRole
} = require('../../services/dbTransactionService');

const {isAuthenticated} = require('../../middleware/authenticator');

router.all('*', isAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Role ID route'});
});

router.post('/list', async (req, res, next) => {
    return res.status(200);
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    if(await createRole(req.body)) {
        res.status(200).json({message: 'Role succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add role to the database'});
    }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;