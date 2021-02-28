const express = require('express');
const router = express.Router();
const cors = require('cors');

const {
    getProject,
    getProjectList,
    createProject,
    editProject,
    deleteProject
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details', async (req, res, next) => {
    let response = await getProject(req.body.id)
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
        res.status(404).json({message: 'Project not found'});
    } else if(response !== null) {
        res.status(200).json({response: response});
    }

    if(response instanceof Error) {
        res.status(503).json({error: response});
    }
});

router.get('/details/:id', async (req, res, next) => {
    let response = await getProject(req.params.id)
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
        res.status(404).json({message: 'Project not found'});
    } else if(response !== null) {
        res.status(200).json({response: response});
    }

    if(response instanceof Error) {
        res.status(503).json({error: response});
    }
});

router.post('/list', async (req, res, next) => {
    return await getProjectList(req.body.id)
    .then((result) => {
        if(result && result !== null) {
            return res.status(200).json({project: result});
        } else {
            return res.status(204).json({project: null});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error});
        }
    });
});

router.post('/create', async (req, res, next) => {
    await createProject(req.body)
    .then((result) => {
        if(result && result !== null) {
            return res.status(200).json({message: 'ProjectCreateSuccess', project: project});
        } else {
            return res.status(204).json({message: 'ProjectCreateFailure', project: null});
        }
    })
    .catch((error) => {
        if(error) {
            if(error === 'EmptyFormField') {
                return res.status(406).json({error: error});
            } else if(error === 'UserIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'UserIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'UserIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'UserIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'CategoryIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'CategoryIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'CategoryIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'CategoryIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'ProjectIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'RoleIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'RoleIdUndefined') {
                return res.status(404).json({error: error}); 
            } else if(error === 'RoleIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'RoleIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'ResourceUserRoleIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'ResourceUserRoleIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'ResourceUserRoleIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'ResourceUserRoleIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectTeamIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectTeamIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'ProjectTeamIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'ProjectTeamIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'TeamIdEqualsNull') {
                return res.status(406).json({error: error});
            } else if(error === 'TeamIdUndefined') {
                return res.status(404).json({error: error});
            } else if(error === 'TeamIdMissing') {
                return res.status(406).json({error: error});
            } else if(error === 'TeamIdNotValid') {
                return res.status(406).json({error: error});
            } else if(error === 'TeamDoesNotExist') {
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

router.post('/delete', async (req, res, next) => {

});

module.exports = router;