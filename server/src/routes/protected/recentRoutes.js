const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

const {
    getRecent
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.post('/', async (req, res, next) => {
    await getRecent(req.body.userId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('NoRecentFound');
        } else {
            return res.status(200).json({recent: result});
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    });
});

module.exports = router;