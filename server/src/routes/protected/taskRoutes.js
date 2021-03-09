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

router.get('/details/:id', async (req, res, next) => {
    res.status(200).json({message: 'Task ID route'});
});

router.post('/list', async (req, res, next) => {
    await getTaskList()
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('NoTasksFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            return res.status(500).json({error: error.message});
        }
    })
});

router.post('/update', async (req, res, next) => {

});

router.post('/create', async (req, res, next) => {
    await createTask(req.body)
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

router.post('/delete', async (req, res, next) => {

});

module.exports = router;