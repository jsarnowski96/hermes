const express = require('express');
const router = express.Router();
const {registerUser} = require('../services/registerService');

router.post('/', async (req, res, next) => {
    await registerUser(req.body)
    .then((result) => {
        return res.status(200).json({result: result});
    })
    .catch((error) => {
        if(error && error === 'KeyDuplication') {
            return res.status(406).json({message: 'There is already an account using provided email or username'});
        } else if(error && error === 'CompanyDoesNotExist') {
            return res.status(404).json({message: 'Company does not exist'});
        } else if(error && error === 'EmptyFormField') {
            return res.status(406).json({message: 'One or more form fields are empty'});
        } else {
            return res.status(500).json({message: error});
        }
    })
});

module.exports = router;


