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
            if(error.message === 'UserNotFound') {
                return res.status(406).json({error: error.message})
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
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
            if(error.message === 'UserNotFound') {
                return res.status(406).json({error: error.message})
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
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
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserIdMissing' || error.message === 'TeamIdMissing' || error.message === 'CompanyIdMissing' || error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'ObjIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'NoUsersFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'OrganizationIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'OrganizationNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'NoProjectsFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({error: error.message})
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
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
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserIdMissing' || error.message === 'TeamIdMissing' || error.message === 'CompanyIdMissing' || error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'ObjIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'NoUsersFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'OrganizationIdNotValid') {
                    return res.status(406).json({error: error.message})
                } else if(error.message === 'OrganizationNotFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'NoProjectsFound') {
                    return res.status(404).json({error: error.message})
                } else if(error.message === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({error: error.message})
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
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
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'CompanyNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'AccessForbidden') {
                return res.status(403).json({error: error.message});
            } else if(error.message === 'UserNotUpdated') {
                return res.status(304).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/create', async (req, res, next) => {
    await createUser(req.body)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotCreated');
        } else {
            return res.status(201).json({user: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserNotCreated') {
                return res.status(304).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/delete', async (req, res, next) => {
    await deleteUser(req.body.userId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotDeleted');
        } else {
            return res.status(200).json({user: result});
        }
    })
    .catcH((error) => {
        if(error) {
            if(error.message === 'UserNotDeleted') {
                return res.status(304).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

module.exports = router;