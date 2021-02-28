const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getCategory,
    getCategoryList,
    createCategory,
    editCategory,
    deleteCategory,
    createResourceUserRole
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    
});

router.post('/list', async (req, res, next) => {
    //return res.status(200).json({message: 'CATEGORIES - SUCCESS'});
    await getCategoryList(req.body.category_type)
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({categories: result});
            } else {
                return res.status(204).json({categories: null});
            }
        })
        .catch((error) => {
            if(error) {
                if(error === 'NoCategoryFound') {
                    return res.status(404).json({error: error});
                } else if(error === 'MissingCategoryType') {
                    return res.status(406).json({error: error});
                } else {
                    return res.status(500).json({error: error});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
            }
        })
});

router.get('/edit', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {

});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;