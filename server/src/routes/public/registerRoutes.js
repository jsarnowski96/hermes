const express = require('express');
const router = express.Router();
const {registerUser} = require('../../services/registerService');

router.post('/', async (req, res, next) => {
    await registerUser(req.body)
    .then((result) => {
        return res.status(200).json({message: 'UserRegistered'});
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'KeyDuplication') {
                return res.status(406).json({origin: 'RegisterService', content: error.message});
            } else if(error.message === 'CompanyDoesNotExist') {
                return res.status(404).json({origin: 'RegisterService', content: error.message});
            } else if(error.message === 'EmptyFormField') {
                return res.status(406).json({origin: 'RegisterService', content: error.message});
            } else {
                return res.status(500).json({origin: 'RegisterService', content: error.message});
            }
        }
    })
});

module.exports = router;


