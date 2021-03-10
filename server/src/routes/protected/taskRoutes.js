const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {
    getTask,
    getTaskList,
    createTask,
    updateTask,
    deleteTask
} = require('../../services/dbTransactionService');

const {ensureAuthenticated} = require('../../middleware/jwtAuthentication');

router.all('*', ensureAuthenticated);

router.post('/details/:id', async (req, res, next) => {
    await getTask(req.body.userId, req.params.taskId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotFound');
        } else {
            return res.status(200).json({task: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/details', async (req, res, next) => {
    await getTask(req.body.userId, req.body.taskId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotFound');
        } else {
            return res.status(200).json({task: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
})

router.post('/list', async (req, res, next) => {
    if(req.body.ref && req.body.objId) {
        await getTaskList(req.body.ref, req.body.objId)
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({tasks: result});
            } else {
                throw new Error('NoTasksFound');
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error.message);
                return res.status(500).json({error: error.message});
            }
        });
    } else {
        await getTaskList()
        .then((result) => {
            if(result && result !== null && result.length > 0) {
                return res.status(200).json({tasks: result});
            } else {
                throw new Error('NoTasksFound');
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
    await createTask(req.body.userId, req.body.taskObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotCreated');
        } else {
            return res.status(200).json({task: result});
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/update', async (req, res, next) => {
    await updateTask(req.body.userId, req.body.taskId, req.body.taskObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotUpdated');
        } else {
            return res.status(200).json({task: result});
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