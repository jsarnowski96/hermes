const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../../middleware/auth');

router.get('/', ensureAuthenticated, (req, res, next) => {

});

router.get('/edit', ensureAuthenticated, (req, res, next) => {

});

router.post('/create', ensureAuthenticated, (req, res, next) => {

});

router.post('/edit', ensureAuthenticated, (req, res, next) => {

});

module.exports = router;