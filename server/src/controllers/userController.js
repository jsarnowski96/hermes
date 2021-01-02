const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/', getUserData)

module.exports = router;

function getUserData(req, res, next) {
    userService.getUserData(req.user.sub)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(error => next(error));
}


