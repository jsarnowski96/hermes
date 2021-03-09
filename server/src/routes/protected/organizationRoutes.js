const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getOrganization,
    getOrganizationList,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createResourceUserRole
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Organization ID route'});
});

router.post('/list', async (req, res, next) => {
    await getOrganizationList(req.body.company)
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('NoOrganizationsFound');
        } else {
            return res.status(200).json({organizations: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createOrganization(req.body.userId, req.body.organizationObj) 
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotCreated');
        } else {
            return res.status(200).json({organization: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;