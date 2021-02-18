const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getCompany,
    getCompanyList,
    createCompany,
    editCompany,
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

router.get('/edit', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createCompany(req.body)
    .then((result) => {
        return res.status(200).json({result: result});
    })
    .catch((error) => {
        if(error) {
            if(error === 'MissingOwnerId') {
                return res.status(406).json({message: 'Missing owner ID'});
            } else if(error === 'EmptyFormField') {
                return res.status(406).json({message: 'One or more form fields are empty'});
            } else if(error === 'OwnerIdDoesNotExist')  {
                return res.status(404).json({message: 'User with this ID does not exist'});
            } else if(error === 'OwnerIdNotValid') {
                return res.status(406).json({message: 'Owner ID is not valid'});
            } else {
                return res.status(500).json({message: error});
            }
        } else {
            return res.status(500).json({message: 'Unknown error'});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;