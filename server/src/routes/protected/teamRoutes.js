const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getTeam,
    getTeamList,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.post('/details', async (req, res, next) => {
    await getTeam(req.body.ref, req.body.objId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
})

router.post('/details/:teamId', async (req, res, next) => {
    await getTeam(req.params.teamId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.get('/list', async (req, res, next) => {
    //return res.status(200).json({message: 'TEAMS - SUCCESS'});
    await getTeamList()
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({teams: result});
            } else {
                throw new Error('NoTeamsFound');
            }
        })
        .catch((error) => {
            if(error) {
                if(error.message === 'NoTeamsFound') {
                    return res.status(404).json({error: error.message});
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
            }
        })
});

router.post('/update', async (req, res, next) => {
    await updateTeam(req.body.userId, req.body.teamId, req.body.teamObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotUpdated');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/create', async (req, res, next) => {
    await createTeam(req.body.userId, req.body.teamObj)
    .then((result) => {
        if(!result || result === null) {
            return res.status(204).json({team: null});
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;