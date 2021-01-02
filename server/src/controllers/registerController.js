const express = require('express');
const router = express.Router();
const registerService = require('../services/registerService');

router.post('/', registerUser);

module.exports = router;

function registerUser(req, res, next) {
    registerService.registerUser(req.body)
    .then((result) => {
        if(result) {
            return res.status(200);
        } else if(!result) {
            return res.status(401).json({type: 'AccountDuplication'});
        } else {
            return res.status(401).json({type: 'UnknownError', message: 'Unknown error'});
        }
    })
    .catch(error => {
        res.status(400).json({type: 'UnknownError', message: error})
    });
}


