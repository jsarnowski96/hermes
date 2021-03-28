const Project = require('../../models/Project');
const Team = require('../../models/Team');
const Organization = require('../../models/Organization');
const User = require('../../models/User');
const Company = require('../../models/Company');
const Category = require('../../models/Category');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const Task = require('../../models/Task');

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
    getProject, getProjectList, createProject, updateProject, deleteProject
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
            } else if(ref === 'company') {
                throw new Error('CompanyIdMissing');
            } else if(ref === 'organization') {
                throw new Error('OrganizationIdMissing');
            } else if(ref === 'task') {
                throw new Error('TaskIdMissing');
            }
        }

        if(ref === 'user') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('UserIdNotValid');
            }

            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }

            let teamIds = []; 
            await Team.find({$or: [{'owner': objId}, {'members': objId}]}, '_id organization').populate('organization')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    result.forEach(res => {
                        if(res.organization.company === objId.company) {
                            teamIds.push(res._id);
                        }
                    })
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET PROJECT LIST\n' + error);
                    throw error;
                }
            })
            console.log(teamIds);

            let projects = [];
            await Project.find({$or: [{'owner': objId}, {'teams': teamIds}]}).populate('owner teams category organization')
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
                        })

                        projects = result;
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('GET PROJECT LIST\n' + error);
                        throw error;
                    }
                })
            return projects;
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
                    console.log('GET PROJECT LIST\n' + error);
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
                    console.log('GET PROJECT LIST\n' + error);
                    throw error;
                }
            });
        } else if(ref === 'company') {
            let organizations = [];

            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('ObjIdNotValid');
            }

            if(!(await Company.findById(objId))) {
                if(!(await User.findById(objId))) {
                    throw new Error('ObjNotFound');
                } else {
                    let companyId = await User.findById(objId, 'company')
                    .then((result) => {
                        if(!result || result === null) {
                            throw new Error('UserNotFound');
                        } else {
                            return result.company;
                        }
                    })

                    await Organization.find({company: companyId}, '_id')
                    .then((result) => {
                        if(!result || result === null || result.length === 0) {
                            throw new Error('NoOrganizationsFound');
                        } else {
                            organizations = result;
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            console.log('GET PROJECT LIST\n' + error);
                            throw error;
                        }
                    })
                }
            } else {
                await Organization.find({company: objId}, '_id')
                .then((result) => {
                    if(!result || result === null || result.length === 0) {
                        throw new Error('NoOrganizationsFound');
                    } else {
                        organizations = result;
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('GET PROJECT LIST\n' + error);
                        throw error;
                    }
                })
            }

            let projects = [];

            await Project.find({organization: organizations}).populate('owner teams category organization')
                .then((result) => {
                    if(!result || result === null || result.length === 0) {
                        throw new Error('NoProjectsFound');
                    } else {
                        projects = result;
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('GET PROJECT LIST\n' + error);
                        throw error;
                    }
                })
            return projects;
        } else if(ref === 'organization') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('OrganizationIdNotValid');
            }

            if(!(await Organization.findById(objId))) {
                throw new Error('OrganizationNotFound');
            }

        } else if(ref === 'task') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('TaskIdNotValid');
            }

            if(!(await Task.findById(objId))) {
                throw new Error('TaskNotFound');
            }

            let projects = [];

            await Project.find({tasks: objId}).populate('owner teams category organization')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('ProjectNotFound');
                } else {
                    projects = result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET PROJECT LIST\n' + error);
                    throw error;
                }
            })

            return projects;
        } else {
            throw new Error('ReferenceIncorrect');
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
    const {name, category, status, teams, organization, description, restrictedAccess, dueDate} = projectObj;
    let categoryId, resourceAccessRes, projectRes, projectId, roleId, organizationId;
    let teamIds = [];

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

    for(var i in teams) {
        teamIds.push(teams[i]._id);
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

    organizationId = await Organization.findOne({'name': organization}, '_id')
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
        teams: teamIds,
        restrictedAccess: restrictedAccess,
        organization: organizationId,
        owner: userId,
        dueDate: dueDate
    });

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

    return projectRes;    
}

async function updateProject(userId, projectId, projectObj) {
    let organizationId, categoryId, ownerId, project;

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

    if(!(await Project.findById(projectId))) {
        throw new Error('ProjectNotFound');
    }

    let tasks = await Task.find({project: projectId});
    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].project === projectId) {
            tasks[i].project = null;
            tasks[i].modified_at = Date.now();
            await tasks[i].save();
        }
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