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

router.get('/details', async (req, res, next) => {
    let response = await getTeam(req.body.id)
    .then((result) => {
        if(result) {
            return result;
        } else {
            return null;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    });

    if(response === null) {
        res.status(404).json({message: 'Team not found'});
    } else if(response !== null) {
        res.status(200).json({response: response});
    }

    if(response instanceof Error) {
        res.status(503).json({error: response});
    }
})

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Team ID route'});
});

router.get('/list', async (req, res, next) => {
    //return res.status(200).json({message: 'TEAMS - SUCCESS'});
    await getTeamList()
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({teams: result});
            } else {
                return res.status(204).json({teams: null});
            }
        })
        .catch((error) => {
            if(error) {
                if(error === 'NoTeamFound') {
                    return res.status(404).json({error: error});
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
    if(await createTeam(req.body)) {
        res.status(200).json({message: 'Team succesfully added to the database'});
    } else {
        res.status(400).json({message: 'Could not add team to the database'});
    }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;