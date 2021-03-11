const Project = require('../../models/Project');
const Task = require('../../models/Task');
const Team = require('../../models/Team');
const User = require('../../models/User');
const Category = require('../../models/Category');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html')

/* === BASIC MODULE STRUCTURE ===
getX() - return document from collection based on the given ObjectId
getXList() - return the array of documents from collection fulfilling the given search criteria - it utilizes mongo's cross-reference collections
createX() - create new document in the target collection based on the received form data
updateX() - update document based on provided ObjectId and form data
deleteX() - delete document with the specified ID

note regarding user's permissions: check of the ownership or access to the specified resource is performed at several stages throughout the service.
General idea is that backend verifies whether user's data/id is stored in proper role/permission collection in order to get the requested resource or attempt to modify it in any way.
===============================
*/

// ==================== MODULE EXPORTS ==================== //

module.exports = {
    getTask, getTaskList, createTask, updateTask, deleteTask
}

// ==================== TASK CRUD SECTION ==================== //

async function getTask(userId, taskId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!taskId) {
        throw new Error('TaskIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('TaskIdNotValid');   
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    // return await Task.findOne({_id: taskId, $or: [{'author': userId}, {'assigned_user': userId}]}).populate('author assigned_user project teams category')
    return await Task.findById(taskId).populate('author assigned_user project teams category')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TaskNotFound');
            } else {
                result.description = sanitizeHtml(result.description, {
                    allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    allowedAttributes: {
                      'a': [ 'href' ], 'img': [ 'src' ]
                    },
                    allowedIframeHostnames: ['www.youtube.com']
                }); 
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        });
}

async function getTaskList() {
    if(arguments.length === 2) {
        ref = arguments[0];
        objId = arguments[1];

        if(!ref) {
            throw new Error('ReferenceMissing');
        }

        if(!objId) {
            if(ref === 'user') {
                throw new Error('UserIdMissing');
            } else if(ref === 'team') {
                throw new Error('TeamIdMissing');
            } else if(ref === 'project') {
                throw new Error('ProjectIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid(objId)) {
            if(ref === 'user') {
                throw new Error('UserIdNotValid');
            } else if(ref === 'team') {
                throw new Error('TeamIdNotValid');
            }
        }

        if(ref === 'user') {
            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }
        } else if(ref === 'team') {
            if(!(await Team.findById(objId))) {
                throw new Error('TeamNotFound');
            }
        } else if(ref === 'project') {
            if(!(await Project.findById(objId))) {
                throw new Error('rojectNotFound');
            }
        }

        if(ref === 'user') {
            return await Task.find({$or:[ {'author': objId}, {'assigned_user': objId}]}).populate('category author assigned_user project teams')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoTasksFound');
                } else {
                    result.forEach(res => {
                        res.description = sanitizeHtml(res.description, {
                            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                            allowedAttributes: {
                              'a': [ 'href' ], 'img': [ 'src' ]
                            },
                            allowedIframeHostnames: ['www.youtube.com']
                        }); 
                    });
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            })
        } else if(ref === 'team') {
            return await Task.find({teams: objId}).populate('category author assigned_user project teams')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoTasksFound');
                } else {
                    result.forEach(res => {
                        res.description = sanitizeHtml(res.description, {
                            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                            allowedAttributes: {
                              'a': [ 'href' ], 'img': [ 'src' ]
                            },
                            allowedIframeHostnames: ['www.youtube.com']
                        }); 
                    });
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            })
        } else if(ref === 'project') {
            return await Task.find({project: objId}).populate('category author assigned_user project teams')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoTasksFound');
                } else {
                    result.forEach(res => {
                        res.description = sanitizeHtml(res.description, {
                            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                            allowedAttributes: {
                              'a': [ 'href' ], 'img': [ 'src' ]
                            },
                            allowedIframeHostnames: ['www.youtube.com']
                        }); 
                    });
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            })
        }
    } else if(arguments.length === 0) {
        return await Task.find({}).populate('category author assigned_user project teams')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoTasksFound');
            } else {
                result.forEach(res => {
                    res.description = sanitizeHtml(res.description, {
                        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                        allowedAttributes: {
                          'a': [ 'href' ], 'img': [ 'src' ]
                        },
                        allowedIframeHostnames: ['www.youtube.com']
                    }); 
                });
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        })
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createTask(userId, taskObj) {
    const {name, category, status, teams, description, assigned_user, projectId, dueDate} = taskObj;
    let categoryId, taskRes, taskId, roleId, project;

    if(!name || !category || !description || !status || !dueDate) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!projectId) {
        throw new Error('ProjectIdMissing');
    }
    

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    project = await Project.findById(projectId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        throw error;
    })

    if(project instanceof Error) {
        console.log('PROJECT OBJECT: ' + project);
        throw project;
    }

    categoryId = await Category.findOne({name: category}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    });

    if(categoryId instanceof Error) {
        throw categoryId;
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    let task;
    
    if(teams.length > 0) {
        task = new Task({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            status: status,
            category: categoryId,
            author: userId,
            teams: teams,
            project: projectId,
            assigned_user: assigned_user,
            dueDate: dueDate
        });
    } else {
        let teamId = await Team.findOne({members: userId}, '_id')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
                return result._id;
            }
        })
        .catch((error) => {
            if(error) {
                throw error;
            }
        })

        if(teamId instanceof Error) {
            console.log('TEAM ID: ' + teamId);
            throw teamId;
        }

        task = new Task({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            status: status,
            category: categoryId,
            author: userId,
            teams: teamId,
            assigned_user: assigned_user ? assigned_user : null,
            dueDate: dueDate
        });
    }

    taskRes = await task.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TaskNotSaved');
            } else {
                console.log(result);
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        })

    if(taskRes instanceof Error) {
        throw taskRes;
    }

    taskId = await Task.findById(task._id, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    })
    
    if(taskId instanceof Error) {
        throw taskId;
    }

    if(!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('TaskIdNotValid');
    }

    project.modified_at = Date.now()
    project.tasks.push(task._id);

    return await project.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotUpdated');
        } else {
            return taskRes;    
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
    })
}

async function updateTask(userId, taskId, taskObj) {
    let teamId, projectId, categoryId, task;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    if(!taskId) {
        throw new Error('TaskIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('TaskIdNotValid');
    }


    if(!taskObj.assigned_user) {
        throw new Error('UserIdMissing');
    }

    if(!(await User.findById(taskObj.assigned_user))) {
        throw new Error('UserNotFound');
    }

    projectId = await Project.findById(taskObj.project, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })

    if(projectId instanceof Error) {
        console.log('PROJECT ID: ' + projectId);
        throw projectId;
    }

    task = await Task.findById(taskId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    })

    if(taskId instanceof Error) {
        console.log('TASK OBJECT: ' + task);
        throw task;
    }

    task.isNew = false;

    categoryId = await Category.findOne({name: taskObj.category}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
    })

    for(var entry in taskObj) {
        if(task[entry] !== taskObj[entry]) {
            if(entry === 'category') {
                task.category = categoryId;
            } else {
                task[entry] = taskObj[entry];
            }
        }
    }

    if(task.project !== taskObj.project) {
        let project = await Project.findById(projectId);
        for(var i = 0; i < project.tasks.length; i++) {
            if(project.tasks[i] === task._id) {
                project.tasks.splice(i, 1);
                project.modified_at = Date.now();
                await project.save();
            }
        }
    }

    task.modified_at = Date.now();

    return await task.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotUpdated');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error.message);
            throw error;
        }
    })
}

async function deleteTask(userId, taskId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!taskId) {
        throw new Error('TaskIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('TaskIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    let projects = await Project.find({tasks: taskId});
    for(var i = 0; i < projects.length; i++) {
        for(var j = 0; j < projects[i].tasks.length; j++) {
            if(projects[i].tasks[j] === taskId) {
                projects[i].tasks.splice(j, 1);
                projects[i].modified_at = Date.now();
                await projects[i].save();
            }
        }
    }

    return await Task.findOneAndDelete({_id: taskId, author: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TaskNotDeleted');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    })
}