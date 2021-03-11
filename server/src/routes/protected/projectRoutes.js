const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

const {
    getProject,
    getProjectList,
    createProject,
    updateProject,
    deleteProject
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.post('/details', async (req, res, next) => {
    await getProject(req.body.userId, req.body.projectId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotFound');
        } else {
            return res.status(200).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/details/:projectId', async (req, res, next) => {
    await getProject(req.body.userId, req.params.projectId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotFound');
        } else {
            return res.status(200).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({error: error.message});
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
        await getProjectList(req.body.ref, req.body.objId)
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({projects: result});
            } else {
                throw new Error('NoProjectsFound');
            }
        })
        .catch((error) => {
            if(error) {
                if(error.message === 'UserIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ProjectIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ProjectIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'ProjectNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'CompanyIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'NoProjectsFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ObjIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'NoOrganizationsFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({error: error.message});
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
            }
        });
    } else {
        await getProjectList()
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({projects: result});
            } else {
                throw new Error('NoProjectsFound');
            }
        })
        .catch((error) => {
            if(error) {
                if(error.message === 'UserIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ProjectIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ProjectIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'ProjectNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'CompanyIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'OrganizationIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'NoProjectsFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ObjIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'NoOrganizationsFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'IncorrectNumberOfArguments') {
                    return res.status(406).json({error: error.message});
                } else {
                    return res.status(500).json({error: error.message});
                }
            } else {
                return res.status(500).json({error: 'UnknownError'});
            }
        });
    }
});

router.post('/create', async (req, res, next) => {
    await createProject(req.body.userId, req.body.projectObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotCreated');
        } else {
            return res.status(201).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'EmptyFormField') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'CategoryIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'OrganizationNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'OrganizationIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectNotSaved') {
                return res.status(304).json({error: error.message});
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/update', async (req, res, next) => {
    await updateProject(req.body.userId, req.body.projectId, req.body.projectObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotUpdated');
        } else {
            return res.status(200).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotUpdated') {
                return res.status(304).json({error: error.message});
            } else if(error.message === 'OrganizationNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

router.post('/delete', async (req, res, next) => {
    await deleteProject(req.body.userId, req.body.projectId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotDeleted');
        } else {
            return res.status(200).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectNotDeleted') {
                return res.status(304).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
        }
    })
});

module.exports = router;