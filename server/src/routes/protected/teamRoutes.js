const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getTeam,
    getTeamList,
    createTeam,
    updateTeam,
    deleteTeam
} = require('../../services/dbTransactionService');

const {isAuthenticated} = require('../../middleware/authenticator');

router.all('*', isAuthenticated);

router.post('/details', async (req, res, next) => {
    await getTeam(req.body.ref, req.body.userId, req.body.objId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'ReferenceMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'ReferenceIncorrect') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamIdMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamIdNotValid') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({origin: 'TeamDetails', error: error.message});
            } else {
                return res.status(500).json({origin: 'TeamDetails', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'TeamDetails', error: error.message});
        }
    })
})

router.post('/details/:objId', async (req, res, next) => {
    await getTeam(req.body.ref, req.body.userId, req.params.objId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'ReferenceMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'ReferenceIncorrect') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamIdMissing') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamIdNotValid') {
                return res.status(406).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({origin: 'TeamDetails', error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({origin: 'TeamDetails', error: error.message});
            } else {
                return res.status(500).json({origin: 'TeamDetails', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'TeamDetails', error: error.message});
        }
    })
});

router.post('/list', async (req, res, next) => {
    if(req.body.ref && req.body.userId && req.body.objId) {
        await getTeamList(req.body.ref, req.body.userId, req.body.objId)
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({teams: result});
            } else {
                throw new Error('NoTeamsFound');
            }
        })
        .catch((error) => {
            if(error) {
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'ObjNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'NoTeamsFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(ref === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else {
                    return res.status(500).json({origin: 'TeamList', error: error.message});
                }
            } else {
                return res.status(500).json({origin: 'TeamList', error: error.message});
            }
        })
    } else {
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
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'CompanyNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'ObjNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'NoTeamsFound') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationIdNotValid') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else if(error.message === 'OrganizationNotFound') {
                    return res.status(404).json({origin: 'TeamList', error: error.message});
                } else if(ref === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({origin: 'TeamList', error: error.message});
                } else {
                    return res.status(500).json({origin: 'TeamList', error: error.message});
                }
            } else {
                return res.status(500).json({origin: 'TeamList', error: error.message});
            }
        })
    }
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
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'TeamIdMissing') {
                return res.status(406).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'TeamIdNotValid') {
                return res.status(406).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'OrganizationNotFound') {
                return res.status(404).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({origin: 'UpdateTeam', error: error.message});
            } else if(error.message === 'TeamNotUpdated') {
                return res.status(304).json({origin: 'UpdateTeam', error: error.message});
            } else {
                return res.status(500).json({origin: 'UpdateTeam', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'UpdateTeam', error: error.message});
        }
    })
});

router.post('/create', async (req, res, next) => {
    await createTeam(req.body.userId, req.body.teamObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotSaved');
        } else {
            return res.status(201).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'EmptyFormField') {
                return res.status(406).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'CategoryIdNotValid') {
                return res.status(406).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'OrganizationNotFound') {
                return res.status(404).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'OrganizationIdNotValid') {
                return res.status(406).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'TeamNotSaved') {
                return res.status(304).json({origin: 'CreateTeam', error: error.message});
            } else if(error.message === 'OrganizationNotUpdated') {
                return res.status(304).json({origin: 'CreateTeam', error: error.message});
            } else {
                return res.status(500).json({origin: 'CreateTeam', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'CreateTeam', error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {
    await deleteTeam(req.body.userId, req.body.teamId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotDeleted');
        } else {
            return res.status(200).json({team: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'TeamIdMissing') {
                return res.status(406).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'TeamIdNotValid') {
                return res.status(406).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'NoOrganizationsFound') {
                return res.status(404).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'NoTasksFound') {
                return res.status(404).json({origin: 'DeleteTeam', error: error.message});
            } else if(error.message === 'TeamNotDeleted') {
                return res.status(304).json({origin: 'DeleteTeam', error: error.message});
            }  else {
                return res.status(500).json({origin: 'DeleteTeam', error: error.message});
            }
        } else {
            return res.status(500).json({origin: 'DeleteTeam', error: error.message});
        }
    })
});

module.exports = router;