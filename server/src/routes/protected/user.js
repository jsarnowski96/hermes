const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../../config/auth');

router.get('/', ensureAuthenticated, (req, res, next) => {

});

router.get('/edit', ensureAuthenticated, (req, res, next) => {

});

router.post('/edit', ensureAuthenticated, (req, res, next) => {

});

module.exports = router;