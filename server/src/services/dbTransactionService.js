const Project = require('../models/Project');
const Task = require('../models/Task');
const Team = require('../models/Team');
const Comment = require('../models/Comment');
const Company = require('../models/Company');
const Organization = require('../models/Organization');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Repository = require('../models/Repository');
const User = require('../models/User');
const Category = require('../models/Category');
const ResourceAccess = require('../models/ResourceAccess');
const Recent = require('../models/Recent');

const sanitizeHtml = require('sanitize-html');

const mongoose = require('mongoose');
const {registerUser} = require('./registerService');

/* === BASIC MODULE STRUCTURE ===
getX() - return document from collection based on the given ObjectId
getXList() - return the array of documents from collection fulfilling the given search criteria - it utilizes mongo's cross-reference collections
createX() - create new document in the target collection based on the received form data
updateX() - update document based on provided ObjectId and form data
deleteX() - delete document with the specified ID

note regarding user's permissions: check of the ownership or access to the specified resource is performed at several stages throughout the service.
General idea is that backend verifies whether user's data/id is stored in proper role/permission collection in order to get the requested resource or attempt to modify it in any way.
===============================

=== ADDITIONAL FUNCTION NAMING CONVENTION ===
eg. ProjectTeam, RepositoryTeam - cross-reference collections storing pairs of ObjectId keys pointing at related collections
*/

// ==================== MODULE EXPORTS ==================== //
module.exports = {
    getUser, getUserList, createUser, updateUser, deleteUser,
    getProject, getProjectList, createProject, updateProject, deleteProject,
    getTask, getTaskList, createTask, updateTask, deleteTask,
    addMember, getTeam, getTeamList, createTeam, updateTeam, deleteTeam,
    getComment, getCommentList, createComment, updateComment, deleteComment,
    getCompany, getCompanyList, createCompany, updateCompany, deleteCompany,
    getRepository, getRepositoryList, createRepository, updateRepository, deleteRepository,
    getOrganization, getOrganizationList, createOrganization, updateOrganization, deleteOrganization,
    getPermission, getPermissionList, createPermission, updatePermission, deletePermission,
    getRole, getRoleList, createRole, updateRole, deleteRole,
    getCategory, getCategoryList, createCategory, updateCategory, deleteCategory,
    getResourceAccess, getResourceAccessList, createResourceAccess, updateResourceAccess, deleteResourceAccess,
    getRecent, createRecent
}

// ==================== USER CRUD SECTION ==================== //

async function getUser(userId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    return await User.findById(userId).populate('company')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
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

async function getUserList() {
    let teamId;

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
            } else if(ref === 'company') {
                throw new Error('CompanyIdMissing');
            }
        }

        if(ref === 'user') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('UserIdNotValid');
            }

            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }

            return await Team.findOne({$or: [{'owner': objId}, {members: {$in: [objId]}}]}, 'members').populate('members')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result.members;
                }
            })
            .catch((error) => {
                if(error) {
                    throw error;
                }
            })
            
        } else if(ref === 'team') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('TeamIdNotValid');
            }

            if(!(await Team.findById(objId))) {
                throw new Error('TeamNotFound');
            }

            return await Team.findById(objId, 'members').populate('members')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result.members;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            })
        } else if(ref === 'company') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('CompanyIdNotValid');
            }

            if(!(await Team.findById(objId))) {
                throw new Error('CompanyNotFound');
            }

            return await User.find({company: objId})
            .then((result) => {
                if(!result || result === null || result.length === 0) {
                    throw new Error('NoUsersFound');
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
    } else if(arguments.length === 0) {
        return await User.find({}).populate('company')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoProjectsFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        });
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createUser(userObj) {
    return await registerUser(userObj)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotRegistered');
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    })
}

async function updateUser(userId, docId, userObj) {
    let companyId, user;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    companyId = await Company.findOne({name: userObj.company}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotFound');
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

    user = await User.findById(docId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
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

    if(user instanceof Error) {
        console.log('USER OBJECT: ' + user);
        throw user;
    }

    if(userId !== user._id) {
        throw new Error('Unauthorized');
    }

    user.isNew = false;

    for(var entry in userObj) {
        if(user[entry] !== userObj[entry]) {
            if(entry === 'company') {
                user.company = companyId;
            } else {
                user[entry] = userObj[entry];
            }
        }
    }

    user.modified_at = Date.now();

    return await user.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotUpdated');
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

async function deleteUser(userId) {
    await User.findByIdAndRemove(userId);
}

// ==================== PROJECT CRUD SECTION ==================== //

async function getProject(userId, projectId) {
    let teamId;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!projectId) {
        throw new Error('ProjectIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');   
    }

    teamId = await Team.findOne({$or: [{'owner': userId}, {'members': userId}]}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
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

    if(teamId instanceof Error) {
        console.log('TEAM ID: ' + teamId);
        throw teamId;
    }

    return await Project.findOne({_id: projectId, $or: [{'owner': userId}, {'teams': teamId}]}).populate('owner teams category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ProjectNotFound');
            } else {
                result.body = sanitizeHtml(result.body, {
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

async function getProjectList() {
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
            }
        }

        if(ref === 'user') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('UserIdNotValid');
            }

            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }

            let teamId = await Team.findOne({$or: [{'owner': objId}, {'members': objId}]}, '_id')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
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

            if(teamId instanceof Error) {
                throw teamId;
            }

            if(!mongoose.Types.ObjectId.isValid(teamId)) {
                throw new Error('TeamIdNotValid');
            }

            return await Project.find({$or: [{'owner': objId}, {'teams': teamId}]}).populate('owner teams category organization')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoProjectsFound');
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
                    return result
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            })
        } else if(ref === 'team') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('TeamIdNotValid');
            }

            if(!(await Team.findById(objId))) {
                throw new Error('TeamNotFound');
            }

            let teamId = await Team.findById(objId, '_id')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
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

            if(teamId instanceof Error) {
                throw teamId;
            }

            if(!mongoose.Types.ObjectId.isValid(teamId)) {
                throw new Error('TeamIdNotValid');
            }

            return await Project.find({teams: teamId}).populate('owner teams category organization')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoProjectsFound');
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
            });
        }
    } else if(arguments.length === 0) {
        return await Project.find({}).populate('owner teams category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoProjectsFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        });
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createProject(userId, projectObj) {
    const {name, category, status, team, description, restrictedAccess, dueDate} = projectObj;
    let categoryId, resourceAccessRes, projectRes, projectId, roleId, teamId, organizationId;

    if(!name || !category || !description || !status || !dueDate) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    teamId = await Team.findOne({name: team}, '_id')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
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
    
    if(teamId instanceof Error) {
        throw teamId;
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new Error('TeamIdNotValid');
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

    organizationId = await Organization.findOne({'teams': teamId}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotFound');
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

    if(organizationId instanceof Error) {
        throw organizationId;
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        status: status,
        category: categoryId,
        restrictedAccess: restrictedAccess,
        organization: organizationId,
        owner: userId,
        dueDate: dueDate
    });

    project.teams.push(teamId);

    projectRes = await project.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ProjectNotSaved');
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

    if(projectRes instanceof Error) {
        throw projectRes;
    }

    projectId = await Project.findById(project._id, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotFound');
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
    
    if(projectId instanceof Error) {
        throw projectId;
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');
    }

    // roleId = await Role.findOne({name: 'owner'}, '_id')
    //     .then((result) => {
    //        if(!result || result === null) {
    //            throw new Error('RoleNotFound');
    //        } else {
    //            return result._id;
    //        }
    //     })
    //     .catch((error) => {
    //         if(error) {
    //             console.log(error);
    //             throw error;
    //         }
    //     })

    // if(roleId instanceof Error) {
    //     throw roleId;
    // }

    // if(!mongoose.Types.ObjectId.isValid(roleId)) {
    //     throw new Error('RoleIdNotValid');
    // }

    // const resourceAccess = new ResourceAccess({
    //     _id: new mongoose.Types.ObjectId(),
    //     user: userId,
    //     collection_name: 'project',
    //     document: projectId,
    //     role: roleId
    // });

    // resourceAccessRes = await resourceAccess.save()
    //     .then((result) => {
    //         if(!result || result === null) {
    //             throw new Error('ResourceAccessNotSaved');
    //         } else {
    //             return result;
    //         }
    //     })
    //     .catch((error) => {
    //         if(error) {
    //             console.log(error);
    //             throw error;
    //         }
    //     });

    // if(resourceAccessRes instanceof Error) {
    //     throw resourceAccessRes;
    // }

    // if(!mongoose.Types.ObjectId.isValid(resourceAccessRes._id)) {
    //     throw new Error('ResourceAccessIdNotValid');
    // }

    // if(!(await ResourceAccess.findById({_id: resourceAccess._id}))) {
    //     throw new Error('ResourceAccessNotFound');
    // }

    // await createRecent('User created project', userId, 'project', project._id)
    // .then((result) => {
    //     if(!result || result === null) {
    //         throw new Error('RecentNotCreated');
    //     } else {
    //         return result;
    //     }
    // })
    // .catch((error) => {
    //     if(error) {
    //         console.log(error);
    //         throw error;
    //     }
    // })

    return projectRes;    
}

async function updateProject(userId, projectId, projectObj) {
    let organizationId, teamId, taskId, categoryId, ownerId, project;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    if(!projectId) {
        throw new Error('ProjectIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');
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
        if(error) {
            console.log(error);
            throw error;
        }
    })

    if(project instanceof Error) {
        console.log('PROJECT OBJECT: ' + project);
        throw project;
    }

    project.isNew = false;

    organizationId = await Organization.findOne({name: projectObj.organization}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotFound');
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

    ownerId = await User.findOne({username: projectObj.owner}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
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

    categoryId = await Category.findOne({name: projectObj.category}, '_id')
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

    for(var entry in projectObj) {
        if(project[entry] !== projectObj[entry]) {
            if(entry === 'organization') {
                project.organization = organizationId;
            } else if(entry === 'category') {
                project.category = categoryId;
            } else if(entry === 'owner') {
                project.owner = ownerId;
            } else {
                project[entry] = projectObj[entry];
            }
        }
    }

    project.modified_at = Date.now();

    return await project.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotUpdated');
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

async function deleteProject(userId, projectId) {
    if(!userId || userId === '') {
        throw new Error('UserIdMissing');
    }

    if(!projectId || projectId === '') {
        throw new Error('ProjectIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');
    }

    if(!(await Project.findById({projectId}))) {
        throw new Error('ProjectNotFound');
    }

    return await Project.findOneAndDelete({_id: projectId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectNotDeleted');
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

    return await Task.findOne({_id: taskId, $or: [{'author': userId}, {'assigned_user': userId}]}).populate('author assigned_user project teams category')
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

// ==================== TEAM CRUD SECTION ==================== //

async function addMember(memberObj) {
    const {userId, teamName} = memberObj;
    let team, username, email;
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    const user = await getUser(userId);
    if(user instanceof Error) {
        throw user;
    }

    username = user.username; email = user.email;

    team = await Team.findOne({name: teamName})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
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

    if(team instanceof Error) {
        throw team;
    }

    team.members.push({userId, username, email});
    team.modified_at = Date.now();
    return await team.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotAdded');
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

async function getTeam(ref, objId) {
    if(!ref) {
        throw new Error('ReferenceMissing');
    }

    if(ref === 'user') {
        if(!objId) {
            throw new Error('UserIdMissing');
        }
    } else if(ref === 'team') {
        if(!objId) {
            throw new Error('TeamIdMissing');
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
        return await Team.findOne({$or:[ {'owner': objId}, {'members': objId}]}).populate('owner members category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        });
    } else if(ref === 'team') {
        return await Team.findById(objId).populate('owner members category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
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
}

async function getTeamList() {
    return await Team.find({}).populate('owner members category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
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

async function createTeam(userId, teamObj) {
    const {name, description, category, avatar_url, organization} = teamObj;
    let categoryId, teamRes;

    if(!name || !description || !category || !organization) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    categoryId = await Category.findOne({name: category, category_type: 'team'}, '_id')
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
    })

    if(categoryId instanceof Error) {
        throw categoryId;
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    let org = await Organization.findOne({name: organization})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotFound');
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

    if(org instanceof Error) {
        throw org;
    }

    if(!mongoose.Types.ObjectId.isValid(org._id)) {
        throw new Error('OrganizationIdNotValid');
    }

    let team;

    if(!avatar_url) {
        team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            category: categoryId,
            owner: userId,
            organization: org._id
        })
    } else {
        team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            category: categoryId,
            owner: userId,
            avatar_url: avatar_url,
            organization: org._id
        })
    }

    team.members.push(userId);

    teamRes = await team.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotSaved');
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

    if(teamRes instanceof Error) {
        throw teamRes;
    }

    org.teams.push(team._id);

    return await org.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotUpdated');
        } else {
            return teamRes;
        }
    })
    .catch((error) => {
        if(error) {
            console.log(error);
            throw error;
        }
    })
}

async function updateTeam(userId, teamId, teamObj) {
    let team, categoryId, ownerId;
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!teamId) {
        throw new Error('TeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new Error('TeamIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    team = await Team.findById(teamId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })

    if(team instanceof Error) {
        console.log('TEAM OBJECT: ' + team);
        throw team;
    }

    team.isNew = false;

    organizationId = await Organization.findOne({name: teamObj.organization}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })

    if(organizationId instanceof Error) {
        console.log('ORGANIZATION ID: ' + organizationId);
        throw organizationId;
    }

    ownerId = await User.findById(teamObj.owner, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })

    if(ownerId instanceof Error) {
        console.log('OWNER ID: ' + ownerId);
        throw ownerId;
    }

    categoryId = await Category.findOne({name: teamObj.category}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotFound');
        } else {
            return result._id;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })

    if(categoryId instanceof Error) {
        console.log('CATEGORY ID: ' + categoryId);
        throw categoryId;
    }

    for(var entry in teamObj) {
        if(team[entry] !== teamObj[entry]) {
            if(entry === 'organization') {
                team.organization = organizationId;
            } else if(entry === 'category') {
                team.category = categoryId;
            } else if(entry === 'owner') {
                team.owner = ownerId;
            } else {
                team[entry] = teamObj[entry];
            }
        }
    }

    team.modified_at = Date.now();

    return await team.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotUpdated');
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

async function deleteTeam(userId, teamId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!teamId) {
        throw new Error('TeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new Error('TeamIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Team.findOneAndDelete({_id: teamId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotDeleted');
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

// ==================== COMMENT CRUD SECTION ==================== //

async function getComment(commentId) {
    if(!commentId) {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    return await Comment.findById(commentId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CommentNotFound');
            } else {
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

async function getCommentList() {
    let objId, ref;

    if(arguments.length === 2) {
        objId = arguments[0];
        ref = arguments[1];

        if(!objId) {
            if(ref === 'task') {
                throw new Error('TaskIdMissing');
            } else if(ref === 'project') {
                throw new Error('ProjectIdMissing');
            } else if(ref === 'comment') {
                throw new Error('CommentIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid((objId))) {
            if(ref === 'task') {
                throw new Error('TaskIdNotValid');
            } else if(ref === 'project') {
                throw new Error('ProjectIdNotValid');
            } else if(ref === 'comment') {
                throw new Error('CommentIdNotValid');
            }
        }

        if(ref === 'task') {
            if(!(await Task.findById(objId))) {
                throw new Error('TaskNotFound');
            }

            return await Comment.find({collection_name: 'task', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
        } else if(ref === 'project') {
            if(!(await Project.findById(objId))) {
                throw new Error('ProjectNotFound');
            }

            return await Comment.find({collection_name: 'project', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
        } else if(ref === 'comment') {
            if(!(await Comment.findById(objId))) {
                throw new Error('CommentNotFound');
            }

            return await Comment.find({collection_name: 'comment', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
    } else if(arguments.length === 0) {
        return await Comment.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCommentFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createComment(userId, commentObj) {
    const {body, collection_name, document} = commentObj;
    let commentRes;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!body || !collection_name) {
        throw new Error('EmptyFormField');
    }

    if(!document && collection_name === 'task') {
        throw new Error('TaskIdMissing');
    } else if(!document && collection_name === 'comment') {
        throw new Error('CommentIdMissing');
    } else if(!document && collection_name === 'project') {
        throw new Error('ProjectIdMissing')
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    if(!mongoose.Types.ObjectId.isValid(document)) {
        if(collection_name === 'task') {
            throw new Error('TaskIdNotValid');
        } else if(collection_name === 'comment') {
            throw new Error('CommentIdNotValid');
        } else if(collection_name === 'project') {
            throw new Error('ProjectIdNotValid')
        }
    }

    if(collection_name === 'task') {
        
    } else if(collection_name === 'comment') {
        throw new Error('CommentIdNotValid');
    } else if(collection_name === 'project') {
        throw new Error('ProjectIdNotValid')
    }

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        body: body,
        user: userId,
        collection_name: collection_name,
        document: document
    })

    commentRes = await comment.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotSaved');
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

    if(commentRes instanceof Error) {
        throw commentRes;
    } else {
        return commentRes;
    }
}

async function updateComment(userId, commentId, commentObj) {
    if(!userId || userId === '') {
        throw new Error('UserIdMissing');
    }

    if(!commentId || commentId === '') {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid')
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');
    }

    if(!(await Comment.findById({commentId}))) {
        throw new Error('CommentNotFound');
    }

    return await Comment.findOneAndUpdate({_id: commentId, author: userId}, commentObj, { new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotUpdated');
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

async function deleteComment(userId, commentId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!commentId) {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');
    }

    return await Comment.findOneAndDelete({_id: commentId, author: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotDeleted');
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

// ==================== COMPANY CRUD SECTION ==================== //

async function getCompany(companyId) {
    if(!companyId) {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    return await Company.findById({companyId})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

async function getCompanyList() {
    return await Company.find({}).populate({path: 'owner', model: 'User'})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
}

async function createCompany(userId, companyObj) {
    const {name, description, email, phone, avatar_url, website} = companyObj;
    let user, companyRes;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!name || !description || !email || !phone || !website) {
        throw new Error('EmptyFormField');
    }
    
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');   
    }

    user = await User.findById(userId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotFound');
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

    let company;

    if(!avatar_url) {
        company = new Company({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            email: email,
            phone: phone,
            website: website,
            owner: userId
        });
    } else {
        company = new Company({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            email: email,
            phone: phone,
            avatar_url: avatar_url,
            website: website,
            owner: userId
        });
    }

    companyRes = await company.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotSaved');
        } else {
            console.log(result);
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    });

    if(companyRes instanceof Error) {
        throw companyRes;
    }

    if(user.company === null) {
        user.company = company._id;
        return await user.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('UserNotUpdated');
            } else {
                return companyRes;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        })
    } else {
        return companyRes;
    }
}

async function updateCompany(userId, companyId, companyObj) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!companyId) {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Company.findOneAndUpdate({_id: companyId, owner: userId}, companyObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotUpdated');
        } else {
            return result;
        }
    })
}

async function deleteCompany(userId, companyId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!companyId) {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    return await Company.findOneAndDelete({_id: companyId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotDeleted');
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

// ==================== REPOSITORY CRUD SECTION ==================== //

async function getRepository(repositoryId) {
    if(!repositoryId) {
        throw new Error('RepositoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(repositoryId)) {
        throw new Error('RepositoryIdNotValid');
    }

    return await (await Repository.findById(repositoryId)).populated({path: 'owner', model: 'User'})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('RepositoryNotFound');
            } else {
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

async function getRepositoryList() {
    let ref, objId;

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
            }
        }

        if(ref === 'user') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('UserIdNotValid');
            }
        } else if(ref === 'team') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('TeamIdNotValid');
            }
        }

        if(ref === 'user') {
            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }

            // TODO:

        } else if(ref === 'team') {
            if(!(await Team.findById(objId))) {
                throw new Error('TeamNotFound');
            }

            return await Repository.find({teams: objId}).populate({path: 'teams', model: 'Team'})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('RepositoryNotFound');
                } else {
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
    } else if(arguments.length === 0) {
        return await Repository.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('RepositoryNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createRepository(userId, repositoryObj) {
    const {name, description, repository_url} = repositoryObj;
    let repositoryRes;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!name || !description || !repository_url) {
        throw new Error('EmptyFormField');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    const repository = new Repository({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        owner: userId,
        repository_url: repository_url
    });

    return await repository.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RepositoryNotSaved');
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

async function updateRepository(userId, repositoryId, repositoryObj) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!repositoryId) {
        throw new Error('RepositoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(repositoryId)) {
        throw new Error('RepositoryIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Repository.findOneAndUpdate({_id: repositoryId, owner: userId}, repositoryObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RepositoryNotUpdated');
        } else {
            return result;
        }
    })
}

async function deleteRepository(userId, repositoryId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!repositoryId) {
        throw new Error('RepositoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(repositoryId)) {
        throw new Error('RepositoryIdNotValid');
    }

    return await Repository.findOneAndDelete({_id: repositoryId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RepositoryNotDeleted');
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

// ==================== ORGANIZATION CRUD SECTION ==================== //

async function getOrganization(organizationId) {
    if(!organizationId) {
        throw new Error('OrganizationIdMissing')
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    return await Organization.findById(organizationId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('OrganizationNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

async function getOrganizationList() {
    if(arguments.length === 1) {
        company = arguments[0];
        if(!company) {
            throw new Error('EmptyFormField');
        }

        companyId = await Company.findOne({name: company}, '_id')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            } else {
                return result._id;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })

        if(companyId instanceof Error) {
            throw companyId;
        }

        if(!mongoose.Types.ObjectId.isValid(companyId)) {
            throw new Error('CompanyIdNotValid');
        }

        return await Organization.find({company: companyId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('OrganizationNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
    } else if(arguments.length === 0) {
        return await Organization.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('OrganizationNotFound');
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
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createOrganization(userId, organizationObj) {
    const {name, description, avatar_url, company} = organizationObj;
    let companyObj, teamId, organization;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!name || !description || !company) {
        throw new Error('EmptyFormField');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    teamId = await Team.findOne({$or:[ {'owner': userId}, {'members': userId} ]}, '_id')
    .then((result) => {
        if(!result || result === null) {
            return null;
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

    if(teamId instanceof Error) {
        throw teamId;
    }

    companyObj = await Company.findOne({name: company, owner: userId}, '_id organizations')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(companyObj instanceof Error) {
        throw companyObj;
    } 
    
    if(!mongoose.Types.ObjectId(companyObj._id)) {
        throw new Error('CompanyIdNotValid');
    }

    if(!avatar_url) {
        organization = new Organization({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            owner: userId,
            company: companyObj._id
        })
    } else {
        organization = new Organization({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            avatar_url: avatar_url,
            owner: userId,
            company: companyObj._id
        })
    }

    if(teamId !== null) {
        organization.teams.push(teamId);
    }

    let orgRes = await organization.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotSaved');
        } else {
            console.log(result);
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(orgRes instanceof Error) {
        throw orgRes;
    }
        
    companyObj.organizations.push(organization._id);

    let companyRes = await companyObj.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotUpdated');
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

    if(companyRes instanceof Error) {
        throw companyRes;
    }

    return orgRes;
}

async function updateOrganization(userId, organizationId, organizationObj) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!organizationId) {
        throw new Error('OrganizationIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Organization.findByIdAndUpdate({_id: organizationId, owner: userId}, organizationObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotUpdated');
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

async function deleteOrganization(userId, organizationId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!organizationId) {
        throw new Error('OrganizationIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Organization.findOneAndDelete({_id: organizationId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotDeleted');
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

// ==================== PERMISSION CRUD SECTION ==================== //

async function getPermission(permissionId) {
    if(!permissionId) {
        throw new Error('PermissionIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(permissionId)) {
        throw new Error( 'PermissionIdNotValid');   
    }

    return await Permission.findById(permissionId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('PermissionNotFound');
            } else {
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

async function getPermissionList() {
    return await Permission.find({})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('PermissionNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function createPermission(permissionObj) {
    const {name, description, _create, _read, _update, _delete, is_owner, can_invite} = permissionObj;
    if(!name || !description || _create === undefined || _read === undefined || _update === undefined || _delete === undefined || is_owner === undefined || can_invite === undefined) {
        throw 'EmptyFormField';
    }

    const permission = new Permission({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        descrition: description,
        _create: _create,
        _read: _read,
        _update: _update,
        _delete: _delete,
        is_owner: is_owner,
        can_invite: can_invite
    })

    return await permission.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('PermissionNotSaved');
        } else {
            console.log(result);
            return result;
        }
    })
}

async function updatePermission(permissionId, permissionObj) {
    if(!permissionId) {
        throw new Error('PermissionIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(permissionId)) {
        throw new Error('PermissionIdNotValid');
    }

    return await Permission.findOneAndUpdate({_id: permissionId}, permissionObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('PermissionNotUpdated');
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

async function deletePermission(permissionId) {
    let role;
    if(!permissionId) {
        throw new Error('PermissionIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(permissionId)) {
        throw new Error('PermissionIdNotValid');
    }

    role = await Role.findOneAndDelete({permission: permissionId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RoleNotDeleted');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(!error) {
            console.log(error);
            throw error;
        }
    })

    if(role instanceof Error) {
        throw role;
    }

    return await Permission.findOneAndDelete({_id: permissionId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('PermissionNotDeleted');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(!error) {
            console.log(error);
            throw error;
        }
    })
}

// ==================== ROLE CRUD SECTION ==================== //

async function getRole(roleId) {
    if(!roleId) {
        throw new Error('RoleIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }

    return await Role.findById(roleId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('RoleNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

async function getRoleList() {
    if(arguments.length === 1) {
        let name = arguments[0];
        if(!name) {
            throw new Error('TypeMissing');
        }

        return await Role.find({name})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('RoleNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    } else if(arguments.length === 0) {
        return await Role.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('RoleNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    }
}

async function createRole(permissionId, roleObj) {
    const {name, description} = roleObj;

    if(!name || !description) {
        throw 'EmptyFormField';
    }

    if(!permissionId) {
        throw 'PermissionIdMissing';
    }

    if(!mongoose.Types.ObjectId.isValid(permissionId)) {
        throw new Error('PermissionIdNotValid');
    }
    
    if(!(await Permission.findById(permissionId))) {
        throw new Error('PermissionNotFound');
    }

    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        permission: permissionId
    })


    return await role.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RoleNotSaved');
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

async function updateRole(roleId, roleObj) {
    if(!roleId) {
        throw 'RoleIdMissing';
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }
    
    return await Role.findOneAndUpdate({_id: roleId}, roleObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RoleNotUpdated');
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

async function deleteRole(roleId) {
    if(!roleId) {
        throw new Error('RoleIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }

    return await Role.findOneAndDelete({_id: roleId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RoleNotDeleted');
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

// ==================== CATEGORY CRUD SECTION ==================== //

async function getCategory(categoryId) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findById(categoryId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function getCategoryList() {
    if(arguments.length === 1) {
        category_type = arguments[0];
        if(!category_type) {
            throw new Error('CategoryTypeMissing');
        }

        return await Category.find({category_type: category_type})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCategoryFound');
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
    } else if(arguments.length === 0) {
        return await Category.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCategoryFound');
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
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createCategory() {
    if(arguments.length === 1) {
        _name = arguments[0].name;
        description = arguments[0].description;
        category_type = arguments[0].category_type;
    } else if(arguments.length === 3) {
        _name = arguments[0];
        description = arguments[1];
        category_type = arguments[2];
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }

    if(!_name || !description || !category_type) {
        throw new Error('EmptyFormField');
    }

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: _name,
        description: description,
        category_type: category_type
    })

    return await category.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotSaved');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function updateCategory(categoryId, categoryObj) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findByIdAndUpdate({_id: categoryId}, categoryObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotUpdated');
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

async function deleteCategory(categoryId) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findOneAndDelete({_id: categoryId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotDeleted');
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

// ==================== RESOURCE USER ROLE CRUD SECTION ==================== //

async function getResourceAccess(resourceAccessId) {
    if(!resourceAccessId) {
        throw new Error('ResourceAccessIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(resourceAccessId)) {
        throw new Error('ResourceAccessIdNotValid');
    }

    return await ResourceAccess.findById(resourceAccessId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ResourceAccessNotFound');
            } else {
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

async function getResourceAccessList() {
    return await ResourceAccess.find({})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ResourceAccessNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function createResourceAccess() {
    let resource, roleId;
    
    if(arguments.length === 3) {
        resourceId = arguments[0];
        userId = arguments[1];
        collection_name = arguments[2].collection_name;
        role = arguments[2].role;
    } else if(arguments.length === 4) {
        resourceId = arguments[0];
        userId = arguments[1];
        collection_name = arguments[2];
        role = arguments[3];
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }

    if(!collection_name || !role) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!resourceId) {
        throw new Error('ResourceIdMissing');
    }

    roleId = await Role.findOne({name: role}, '_id')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RoleNotFound');
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

    if(roleId instanceof Error) {
        throw roleId;
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');   
    }

    if(!mongoose.Types.ObjectId.isValid(resourceId)) {
        throw new Error('ResourceIdNotValid') ;
    }

    // 'Team', 'Project', 'Comment', 'Task', 'Organization', 'Company', 'Category'
    switch(collection) {
        case 'Team': resource = await Team.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        case 'Project': resource = await Project.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('ProjectNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        case 'Comment': resource = await Comment.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        case 'Organization': resource = await Organization.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('OrganizationNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        case 'Company': resource = await Company.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CompanyNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        case 'Category': resource = await Category.findById(resourceId)
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CategoryNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log(error);
                    throw error;
                }
            });
            break;
        default: throw new Error('IncorrectResourceName');
    }

    if(resource instanceof Error) {
        throw resource;
    }

    let resourceAccess = new ResourceAccess({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        collection_name: collection_name,
        document: resourceId,
        role: roleId
    });

    return await resourceAccess.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ResourceAccessNotSaved');
        } else {
            return result;
        }
    })
}

async function updateResourceAccess(resourceAccessId, resourceAccessObj) {
    if(!resourceAccessId) {
        throw new Error('ResourceAccessIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(resourceAccessId)) {
        throw new Error('ResourceAccessIdNotValid');
    }

    return await ResourceAccess.findOneAndUpdate({_id: resourceAccessId}, resourceAccessObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ResourceAccessNotUpdated');
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

async function deleteResourceAccess(resourceAccessId) {
    if(!resourceAccessId) {
        throw new Error('ResourceAccessIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(resourceAccessId)) {
        throw new Error('ResourceAccessIdNotValid');
    }

    return await ResourceAccess.findOneAndDelete({_id: resourceAccessId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ResourceAccessNotDeleted');
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

async function getRecent(userId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Recent.find({})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('NoRecentFound');
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

async function createRecent(description, userId, collection, document) {
    if(!description || !userId || !collection || !document) {
        throw new Error('EmptyRecent');
    }

    let recent = new Recent({
        _id: new mongoose.Types.ObjectId(),
        description: description,
        user: userId,
        collection_name: collection,
        document: document
    })

    return await recent.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RecentNotCreated');
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