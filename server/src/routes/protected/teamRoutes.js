const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getTeam,
    getTeamList,
    createTeam,
    editTeam,
    deleteTeam
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Team ID route'});
});

router.post('/list', async (req, res, next) => {
    return res.status(200);
});

router.get('/edit', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    if(await createTeam(req.body)) {
        res.status(200).json({message: 'Team succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add team to the database'});
    }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;