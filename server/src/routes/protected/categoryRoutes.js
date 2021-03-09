const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getCategory,
    getCategoryList,
    createCategory,
    updateCategory,
    deleteCategory,
    createResourceUserRole
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    
});

router.post('/list', async (req, res, next) => {
    //return res.status(200).json({message: 'CATEGORIES - SUCCESS'});
    return await getCategoryList(req.body.category_type)
        .then((result) => {
            if(result && result !== null) {
                return res.status(200).json({categories: result});
            } else {
                return res.status(204).json({categories: null});
            }
        })
        .catch((error) => {
            if(error) {
                if(error.message === 'CategoryNotFound') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({error: error.message});
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
            }
        })
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {

});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;