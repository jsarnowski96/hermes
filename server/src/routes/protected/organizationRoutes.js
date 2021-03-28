const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getOrganization,
    getOrganizationList,
    createOrganization,
    updateOrganization,
    deleteOrganization
} = require('../../services/dbTransactionService');

const {isAuthenticated} = require('../../middleware/authenticator');

router.all('*', isAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Organization ID route'});
});

router.post('/list', async (req, res, next) => {
    if(req.body.ref && req.body.objId) {
        await getOrganizationList(req.body.ref, req.body.objId)
        .then((result) => {
            if(!result || result === null || result.length === 0) {
                throw new Error('NoOrganizationsFound');
            } else {
                return res.status(200).json({organizations: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'OrganizationList', error: error.message});
            }
        })
    } else {
        await getOrganizationList()
        .then((result) => {
            if(!result || result === null || result.length === 0) {
                throw new Error('NoOrganizationsFound');
            } else {
                return res.status(200).json({organizations: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'OrganizationList', error: error.message});
            }
        })
    }
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createOrganization(req.body.userId, req.body.organizationObj) 
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotCreated');
        } else {
            return res.status(200).json({origin: 'CreateOrganization', organization: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({origin: 'CreateOrganization', error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;