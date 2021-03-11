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
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
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
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else {
                return res.status(500).json({error: error.message});
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
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
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'NoTasksFound') {
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
                if(error.message === 'ReferenceMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'ReferenceIncorrect') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdMissing') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'TeamIdNotValid') {
                    return res.status(406).json({error: error.message});
                } else if(error.message === 'UserNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'TeamNotFound') {
                    return res.status(404).json({error: error.message});
                } else if(error.message === 'NoTasksFound') {
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
    await createTask(req.body.userId, req.body.taskObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotCreated');
        } else {
            return res.status(201).json({task: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'EmptyFormField') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'ProjectIdMissing') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'ProjectIdNotValid') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message})
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message})
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({error: error.message})
            } else if(error.message === 'CategoryIdNotValid') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'TeamNotFound') {
                return res.status(404).json({error: error.message})
            } else if(error.message === 'TaskNotSaved') {
                return res.status(304).json({error: error.message})
            } else if(error.message === 'TaskNotFound') {
                return res.status(404).json({error: error.message})
            } else if(error.message === 'TaskIdNotValid') {
                return res.status(406).json({error: error.message})
            } else if(error.message === 'ProjectNotUpdated') {
                return res.status(304).json({error: error.message})
            } else {
                return res.status(406).json({error: error.message})
            }
        } else {
            return res.status(500).json({error: 'UnknownError'});
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
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});    
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});    
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});    
            } else if(error.message === 'TaskIdMissing') {
                return res.status(406).json({error: error.message});    
            } else if(error.message === 'TaskIdNotValid') {
                return res.status(406).json({error: error.message});    
            } else if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});    
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});    
            } else if(error.message === 'ProjectNotFound') {
                return res.status(404).json({error: error.message});    
            } else if(error.message === 'TaskNotFound') {
                return res.status(404).json({error: error.message});    
            } else if(error.message === 'CategoryNotFound') {
                return res.status(404).json({error: error.message});    
            } else if(error.message === 'TaskNotUpdated') {
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
    await deleteTask(req.body.userId, req.body.taskId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotDeleted');
        } else {
            return res.status(200).json({task: result});
        }
    })
    .catch((error) => {
        if(error) {
            if(error.message === 'UserIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdMissing') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'TaskIdNotValid') {
                return res.status(406).json({error: error.message});
            } else if(error.message === 'UserNotFound') {
                return res.status(404).json({error: error.message});
            } else if(error.message === 'TaskNotDeleted') {
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