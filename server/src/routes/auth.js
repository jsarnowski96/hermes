const router = require('express').Router();

var User = require('../../../common/models/user');

router.get('/', (req, res, next) => {
    res.status(200);
});

router.get('/register', (req, res, next) => {
    res.status(200);
});

router.get('/login', (req, res, next) => {
    res.status(200);
});

router.post('/register', (req, res, next) => {

});

router.post('/login', (req, res, next) => {

});

module.exports = router;