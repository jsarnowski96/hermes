const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getUser,
    getUserList,
    createUser,
    updateUser,
    deleteUser
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.post('/profile/:userId', async (req, res, next) => {
    await getUser(req.params.userId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
        } else {
            return res.status(200).json({user: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/profile', async (req, res, next) => {
    await getUser(req.body.userId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
        } else {
            return res.status(200).json({user: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/list', async (req, res, next) => {
    if(req.body.ref && req.body.objId) {
        await getUserList(req.body.ref, req.body.objId)
        .then((result) => {
            if(!result || result === null || result.length === 0) {
                throw new Error('NoUsersFound');
            } else {
                return res.status(200).json({users: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({error: error.message});
            }
        })
    } else {
        await getUserList()
        .then((result) => {
            if(!result || result === null || result.length === 0) {
                throw new Error('NoUsersFound');
            } else {
                return res.status(200).json({users: result});
            }
        })
        .catch((error) => {
            if(error) {
                return res.status(500).json({error: error.message});
            }
        })
    }
});

router.post('/update', async (req, res, next) => {
    await updateUser(req.body.userId, req.body.docId, req.body.userObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotUpdated');
        } else {
            return res.status(200).json({user: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/create', async (req, res, next) => {
    await createUser(req.body)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotCreated');
        } else {
            return res.status(200).json({user: result});
        }
    })
    .catch((error) => {
        return res.status(500).json({error: error.message});
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;