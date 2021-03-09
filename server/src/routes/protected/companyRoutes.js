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

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Company ID route'});
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
                return res.status(406).json({error: error.message});
            } else if(error.message === 'EmptyFormField') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'OwnerIdDoesNotExist')  {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'OwnerIdNotValid') {
                return res.status(406).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;