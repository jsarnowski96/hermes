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
            return res.status(500).json({error: error.message});
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
            return res.status(500).json({error: error.message});
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
                console.log(error.message);
                return res.status(500).json({error: error.message});
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
                console.log(error.message);
                return res.status(500).json({error: error.message});
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
            return res.status(200).json({project: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'EmptyFormField') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'CategoryIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'CategoryIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'CategoryIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'CategoryIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'RoleIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'RoleIdUndefined') {
                return res.status(404).json({error: error.message}); 
            } else if(error.message === 'RoleIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'RoleIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ResourceUserRoleIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ResourceUserRoleIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ResourceUserRoleIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ResourceUserRoleIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectTeamIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectTeamIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'ProjectTeamIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'ProjectTeamIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TeamIdEqualsNull') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TeamIdUndefined') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'TeamIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TeamIdNotValid') {
                return res.status(406).json({error: error.message});
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
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;