const Project = require('../models/Project')
const Task = require('../models/Task');
const Team = require('../models/Team');
const Comment = require('../models/Comment');
const Company = require('../models/Company');
const Organization = require('../models/Organization');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const Category = require('../models/Category');
const ProjectTeam = require('../models/ProjectTeam');
const ProjectUser = require('../models/ProjectUser');
const ResourceUserRole = require('../models/ResourceUserRole');

const mongoose = require('mongoose');

/* === BASIC MODULE STRUCTURE ===
getX(documentId) - return document from collection by ID
getXList(userId) - return the array of documents from collection fulfilling the given search criteria - it utilizes mongo's cross-reference collections
createX(userId, dataSet) - create new document in the target collection based on the received form data
editX(documentId) - edit document based on provided ID - the exact check for user's ownership of the document is performed directly in route async function
deleteX(documentId) - delete document with the specified ID - the exact check for user's ownership of the document is performed directly in route async function
===============================
*/

// ==================== MODULE EXPORTS ==================== //
module.exports = {
    getProject,
    getProjectList,
    createProject,
    editProject,
    deleteProject,
    getTask,
    getTaskList,
    createTask,
    editTask,
    deleteTask,
    getTeam,
    getTeamList,
    createTeam,
    editTeam,
    deleteTeam,
    getComment,
    getCommentList,
    createComment,
    editComment,
    deleteComment,
    getCompany,
    getCompanyList,
    createCompany,
    editCompany,
    deleteCompany,
    getRepository,
    getRepositoryList,
    createRepository,
    editRepository,
    deleteRepository,
    getOrganization,
    getOrganizationList,
    createOrganization,
    editOrganization,
    deleteOrganization,
    getPermission,
    getPermissionList,
    createPermission,
    editPermission,
    deletePermission,
    getRole,
    getRoleList,
    createRole,
    editRole,
    deleteRole,
    getCategory,
    getCategoryList,
    createCategory,
    editCategory,
    deleteCategory,
    getResourceUserRole,
    getResourceUserRoleList,
    createResourceUserRole,
    editResourceUserRole,
    deleteResourceUserRole
}

// ==================== PROJECT CRUD SECTION ==================== //

async function getProject(id) {
    let project;

    if(!id) {
        throw 'ProjectIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        project = await Project.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(project !== null) {
            return project;
        } else {
            throw 'ProjectDoesNotExist'
        }
    } else {
        throw 'ProjectIdNotValid'
    }
}

async function getProjectList(userId) {
    let projects = [];

    if(!userId) {
        throw 'UserIdMissing';
    }

    if(mongoose.Types.ObjectId.isValid(userId)) {
        if(await User.findById({userId})) {
            await Project.find({owner: userId})
            .then((result) => {
                if(result) {
                    projects.push(result);
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });

            await ProjectUser.find({user: userId})
            .populate('project')
            .then((result) => {
                if(result && !projects.include(result)) {
                    projects.push(result);
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
        }
    }

    if(projects.length > 0) {
        return projects;
    }

    if(projects === undefined) {
        throw 'ProjectArrayUndefined'
    } else if(projects === null) {
        throw 'ProjectArrayIsNull'
    } else if(projects.length === 0) {
        throw 'ProjectArrayIsEmpty'
    }
}

async function createProject(projectObj) {
    const {name, category, requirements, due_date, userId} = projectObj;
    let categoryId;
    if(!name || !category || !requirements || !due_date) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    categoryId = await Category.findOne({name: category});

    if(categoryId === null) {
        categoryId = await createCategory(category, '', 'project');
    }

    if(mongoose.Types.ObjectId.isValid(categoryId)) {
        if(mongoose.Types.ObjectId.isValid(userId)) {
            if(await User.findById({userId})) {
                const project = new Project({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    category: category,
                    requirements: requirements,
                    owner: userId,
                    due_date: due_date
                });
            
                let projectId = project.save(function(error, result) {
                    if(error) throw new Error(error);
                    if(result) return result;
                });

                if(projectId === null) {
                    throw new Error('ProjectIdNotValid');
                }

                if(projectId instanceof Error) {
                    throw new Error(projectId);
                }

                if(mongoose.Types.ObjectId.isValid(projectId)) {
                    if(await Project.findById({projectId})) {
                        return await createResourceUserRole(projectId, userId, 'Project', 'owner');
                    } else {
                        throw new Error('ProjectDoesNotExist');
                    }
                } else {
                    throw new Error('ProjectIdNotValid');
                }
            } else {
                throw new Error('UserDoesNotExist');
            }
        } else {
            throw new Error('UserIdNotValid');
        }
    } else {
        throw new Error('CategoryIdNotValid');
    }
}

async function editProject(id) {

}

async function deleteProject(id) {

}

// ==================== TASK CRUD SECTION ==================== //

async function getTask(id) {
    let task;

    if(!id) {
        throw 'TaskIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        task = await Task.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(task !== null) {
            return task;
        } else {
            throw 'TaskDoesNotExist'
        }
    } else {
        throw 'TaskIdNotValid'
    }
}

async function getTaskList() {

}

async function createTask() {

}

async function editTask() {

}

async function deleteTask() {

}

// ==================== TEAM CRUD SECTION ==================== //

async function getTeam(id) {
    let team;

    if(!id) {
        throw 'TeamIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        team = await Team.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(team !== null) {
            return team;
        } else {
            throw 'TeamDoesNotExist'
        }
    } else {
        throw 'TeamIdNotValid'
    }
}

async function getTeamList() {

}

async function createTeam() {
    
}

async function editTeam() {

}

async function deleteTeam() {
    
}

// ==================== COMMENT CRUD SECTION ==================== //

async function getComment(id) {
    let comment;

    if(!id) {
        throw 'CommentIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        comment = await Comment.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(comment !== null) {
            return comment;
        } else {
            throw 'CommentDoesNotExist'
        }
    } else {
        throw 'CommentIdNotValid'
    }
}

async function getCommentList() {

}

async function createComment() {
    
}

async function editComment() {

}

async function deleteComment() {

}

// ==================== COMPANY CRUD SECTION ==================== //

async function getCompany(id) {
    let company;

    if(!id) {
        throw 'CompanyIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        company = await Company.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(company !== null) {
            return company;
        } else {
            throw 'CompanyDoesNotExist'
        }
    } else {
        throw 'CompanyIdNotValid'
    }
}

async function getCompanyList() {

}

async function createCompany(companyForm) {
    const {name, description, email, phone, website, owner} = companyForm;
    if(!name || !description || !email || !phone || !website) {
        throw 'EmptyFormField';
    }

    if(!owner) {
        throw 'MissingUserId';
    }
    
    if(mongoose.Types.ObjectId.isValid(owner)) {
        if(await User.findById(owner)) {
            const company = new Company({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                description: description,
                email: email,
                phone: phone,
                website: website,
                owner: owner
            });
        
            return company.save(function(error, result) {
                if(error) throw error;
                if(result) return result;
            });
        } else {
            throw 'UserIdDoesNotExist'
        }
    } else {
        throw 'UserIdNotValid'
    }
}

async function editCompany() {

}

async function deleteCompany() {

}

// ==================== REPOSITORY CRUD SECTION ==================== //

async function getRepository(id) {
    let repository;

    if(!id) {
        throw 'RepositoryIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        repository = await Repository.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(repository !== null) {
            return repository;
        } else {
            throw 'RepositoryDoesNotExist'
        }
    } else {
        throw 'RepositoryIdNotValid'
    }
}

async function getRepositoryList() {

}

async function createRepository() {

}

async function editRepository() {

}

async function deleteRepository() {

}

// ==================== ORGANIZATION CRUD SECTION ==================== //

async function getOrganization(id) {
    let organization;

    if(!id) {
        throw 'OrganizationIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        organization = await Organization.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(organization !== null) {
            return organization;
        } else {
            throw 'OrganizationDoesNotExist'
        }
    } else {
        throw 'OrganizationIdNotValid'
    }
}

async function getOrganizationList() {

}

async function createOrganization() {
    
}

async function editOrganization() {

}

async function deleteOrganization() {

}

// ==================== PERMISSION CRUD SECTION ==================== //

async function getPermission(id) {
    let permission;

    if(!id) {
        throw 'PermissionIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        permission = await Permission.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(permission !== null) {
            return permission;
        } else {
            throw 'PermisionDoesNotExist'
        }
    } else {
        throw 'PermissionIdNotValid'
    }
}

async function getPermissionList() {

}

async function createPermission(permissionObj) {
    const {name, description, _create, _read, _update, _delete, is_owner, can_invite} = permissionObj;
    if(!name || !description || _create === undefined || _read === undefined || _update === undefined || _delete === undefined || is_owner === undefined || can_invite === undefined) {
        throw 'EmptyFormField';
    }

    const permission = new Permission({
        name: name,
        descrition: description,
        _create: _create,
        _read: _read,
        _update: _update,
        _delete: _delete,
        is_owner: is_owner,
        can_invite: can_invite
    })

    return permission.save(function(error, result) {
        if(error) throw error;
        if(result) return result;
    });
}

async function editPermission() {

}

async function deletePermission() {

}

// ==================== ROLE CRUD SECTION ==================== //

async function getRole(id) {
    let role;

    if(!id) {
        throw 'RoleIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        role = await Role.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(role !== null) {
            return role;
        } else {
            throw 'RoleDoesNotExist'
        }
    } else {
        throw 'RoleIdNotValid'
    }
}

async function getRoleList() {

}

async function createRole(roleObj, permissionId) {
    const {name, description} = roleObj;
    if(!name || !description) {
        throw 'EmptyFormField';
    }

    if(!permissionId) {
        throw 'PermissionIdMissing';
    }

    if(mongoose.Types.ObjectId.isValid(permissionId)) {
        if(await Permission.findById({permissionId})) {
            const role = new Role({
                name: name,
                description: description,
                permission: permissionId
            })
        
            return role.save(function(error, result) {
                if(error) throw error;
                if(result) return result;
            });
        } else {
            throw 'PermissionDoesNotExist'
        }
    } else {
        throw 'PermissionIdNotValid'
    }
}

async function editRole() {

}

async function deleteRole() {

}

// ==================== CATEGORY CRUD SECTION ==================== //

async function getCategory(id) {
    let category;

    if(!id) {
        throw 'CategoryIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        category = await Category.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(category !== null) {
            return category;
        } else {
            throw 'CategoryDoesNotExist'
        }
    } else {
        throw 'CategoryIdNotValid'
    }
}

async function getCategoryList() {

}

async function createCategory() {
    let name, description, category_type;
    if(arguments.length === 1) {
        name = arguments[0].name;
        description = arguments[0].description;
        category_type = arguments[0].category_type;
    } else if(arguments.length === 3) {
        name = arguments[0];
        description = arguments[1];
        category_type = arguments[2];
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }

    if(!name || !description || !category_type) {
        throw new Error('EmptyFormField');
    }

    let category = new Category({
        name: name,
        description: description,
        category_type: category_type
    })

    return category.save(function(error, result) {
        if(error) throw new Error(error);
        if(result) return result;
    });
}

async function editCategory() {

}

async function deleteCategory() {

}

// ==================== RESOURCE USER ROLE CRUD SECTION ==================== //

async function getResourceUserRole(id) {
    let resourceUserRole;

    if(!id) {
        throw 'ResourceUserRoleIdMissing'
    }

    if(mongoose.Types.ObjectId.isValid(id)) {
        resourceUserRole = await ResourceUserRole.findById({id})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

        if(resourceUserRole !== null) {
            return resourceUserRole;
        } else {
            throw 'ResourceUserRoleDoesNotExist'
        }
    } else {
        throw 'ResourceUserRoleIdNotValid'
    }
}

async function getResourceUserRoleList() {

}

async function createResourceUserRole() {
    let collection_name, role, resourceId, userId;
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

    let resource;

    if(!collection_name || !role) {
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!resourceId) {
        throw new Error('ResourceIdMissing');
    }

    if(await Role.findOne({name: role})) {
        if(mongoose.Types.ObjectId.isValid(userId)) {
            if(await User.findById({userId})) {
                if(mongoose.Types.ObjectId.isValid(resourceId)) {
                    // 'Team', 'Project', 'Comment', 'Task', 'Organization', 'Company', 'Category'
                    switch(collection) {
                        case 'Team': resource = await Team.findOne({_id: resourceId});
                            break;
                        case 'Project': resource = await Project.findOne({_id: resourceId});
                            break;
                        case 'Comment': resource = await Comment.findOne({_id: resourceId});
                            break;
                        case 'Organization': resource = await Organization.findOne({_id: resourceId});
                            break;
                        case 'Company': resource = await Company.findOne({_id: resourceId});
                            break;
                        case 'Category': resource = await Category.findOne({_id: resourceId});
                            break;
                        default: resource = null;
                            break;
                    }   
            
                    if(resource != null) {
                        let resourceUserRole = new ResourceUserRole({
                            user: userId,
                            collection_name: collection_name,
                            document: resourceId,
                            role: role
                        });
        
                        return resourceUserRole.save(function(error, result) {
                            if(error) throw new Error(error);
                            if(result) return result;
                        });
                    } else {
                        throw new Error('ResourceNotFound');
                    }
                } else {
                    throw new Error('ResourceIdNotValid');
                }
            } else {
                throw new Error('UserDoesNotExist');
            }
        } else {
            throw new Error('UserIdNotValid');
        }
    } else {
        throw new Error('RoleNotFound');
    }
}

async function editResourceUserRole() {

}

async function deleteResourceUserRole() {

}