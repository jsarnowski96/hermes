const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getCompany,
    getCompanyList,
    createCompany,
    updateCompany,
    deleteCompany,
    createResourceUserRole
} = require('../../services/dbTransactionService');

const {isAuthenticated} = require('../../middleware/authenticator');

router.all('*', isAuthenticated);

router.post('/details/:companyId', async (req, res, next) => {
    if(req.body.userId && req.body.companyId) {
        await getCompany(req.body.userId, req.body.companyId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return res.status(200).json({company: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'GetCompany', error: error.message});
            }
        })
    } else if(req.body.userId && !req.body.companyId) {
        await getCompany(req.body.userId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return res.status(200).json({company: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'GetCompany', error: error.message});
            }
        })
    } else { next() }
});

router.post('/details', async (req, res, next) => {
    if(req.body.userId && req.body.companyId) {
        await getCompany(req.body.userId, req.body.companyId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return res.status(200).json({company: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'GetCompany', error: error.message});
            }
        })
    } else if(req.body.userId && !req.body.companyId) {
        await getCompany(req.body.userId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return res.status(200).json({company: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({origin: 'GetCompany', error: error.message});
            }
        })
    } else { next() }
});

router.post('/list', async (req, res, next) => {
    return res.status(200);
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createCompany(req.body.userId, req.body.companyObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotCreated');
        } else {
            return res.status(200).json({company: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'MissingOwnerId') {
                return res.status(406).json({origin: 'CreateCompany', error: error.message});
            } else if(error.message === 'EmptyFormField') {
                return res.status(406).json({origin: 'CreateCompany', error: error.message});
            } else if(error.message === 'OwnerIdDoesNotExist')  {
                return res.status(404).json({origin: 'CreateCompany', error: error.message});
            } else if(error.message === 'OwnerIdNotValid') {
                return res.status(406).json({origin: 'CreateCompany', error: error.message});
            } else {
                return res.status(500).json({origin: 'CreateCompany', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'CreateCompany', error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;