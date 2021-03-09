const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getPermission,
    getPermissionList,
    createPermission,
    updatePermission,
    deletePermission
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Permission ID route'});
});

router.post('/list', async (req, res, next) => {
    return res.status(200);
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    if(await createPermission(req.body)) {
        res.status(200).json({message: 'Permission set succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add permission set to the database'});
    }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;