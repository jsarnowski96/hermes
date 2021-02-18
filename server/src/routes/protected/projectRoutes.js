const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getProject,
    getProjectList,
    createProject,
    editProject,
    deleteProject,
    createResourceUserRole
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.get('/details', async (req, res, next) => {
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
    return res.status(200);
});

router.get('/edit', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createProject(req.body)
    .then((result) => {
        return res.status(200).json({result: result});
    })
    .catch((error) => {
        if(error && error === 'KeyDuplication') {
            return res.status(406).json({message: 'There is already an account using provided email or username'});
        } else if(error && error === 'CompanyDoesNotExist') {
            return res.status(404).json({message: 'Company does not exist'});
        } else if(error && error === 'EmptyFormField') {
            return res.status(406).json({message: 'One or more form fields are empty'});
        } else {
            return res.status(500).json({message: error});
        }
    })

    // let response = await createProject(req.body)
    // .then((result) => {
    //     if(result) {
    //         return result;
    //     } else {
    //         return null;
    //     }
    // })
    // .catch((error) => {
    //     if(error) {
    //         console.log(error);
    //         throw error;
    //     }
    // })

    // if(response === null) {
    //     return res.status(503).json({message: 'Could not create project'});
    // } else if(response !== null) {
    //     return res.status(200).json({response: response});
    // }

    // if(response instanceof Error) {
    //     return res.status(503).json({error: response});
    // }
});

router.post('/delete', async (req, res, next) => {

});

module.exports = router;