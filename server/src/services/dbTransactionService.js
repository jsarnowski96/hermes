const Project = require('../models/Project');
const Task = require('../models/Task');
const Team = require('../models/Team');
const Comment = require('../models/Comment');
const Company = require('../models/Company');
const Organization = require('../models/Organization');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Repository = require('../models/Repository');
const RepositoryTeam = require('../models/RepositoryTeam');
const User = require('../models/User');
const Category = require('../models/Category');
const ProjectTeam = require('../models/ProjectTeam');
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
    deleteResourceUserRole,
    createProjectTeam,
}

// ==================== PROJECT CRUD SECTION ==================== //

async function getProject(projectId) {
    let project;

    if(!projectId || projectId === '') {
        throw new Error('ProjectIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('ProjectIdNotValid');   
    }

    project = await Project.findById({projectId})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ProjectNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    if(project instanceof Error) {
        throw project;
    } else if(project instanceof Project) {
        return project;
     }else {
        throw new Error(project);
    }
}

async function getProjectList() {
    let projects = [];
    let ref, objId;

    if(arguments.length === 2) {
        ref = arguments[0];
        objId = arguments[1];

        if(!ref || ref === '') {
            throw new Error('ReferenceMissing');
        }

        if(!objId || objId === '') {
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
            if(!(await User.findById({objId}))) {
                throw new Error('UserNotFound');
            }

            projects = await Promise.all([
                Project.find({owner: objId}),
                ResourceUserRole.find({user: objId, collection_name: 'project', role: 'developer'})
            ])
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoRecordsFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
        } else if(ref === 'team') {
            if(!(await Team.findById({objId}))) {
                throw new Error('TeamNotFound');
            }

            projects = await ProjectTeam.find({team: objId}).populate('project')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('ProjectNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
        }
    } else if(arguments.length === 0) {
        projects = await Project.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ProjectNotFound');
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

    if(projects instanceof Error) {
        throw projects;
    } else if((projects instanceof Project && projects.length > 0) || (projects instanceof Promise && projects.length > 0) || (projects instanceof ProjectTeam && projects.length > 0)) {
        return projects;
    } else {
        throw new Error(projects);
    }
}

async function createProject(projectObj) {
    const {name, category, status, requirements, restrictedAccess, dueDate, userId} = projectObj;
    let categoryId, projectRes, resourceUserRoleRes, projectTeamRes, roleId, teamId;

    if(!name || !category || !requirements || !status || !dueDate) {
        throw new Error('EmptyFormField');
    }

    if(userId === null) {
        throw new Error('UserIdEqualsNull')
    } else if(userId === undefined) {
        throw new Error('UserIdUndefined');
    } else if(userId === '') {
        throw new Error('UserIdMissing');
    } else if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    categoryId = await Category.findOne({name: category}).select('_id')
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
    
    if(categoryId instanceof Error) {
        throw categoryId;
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        requirements: requirements,
        status: status,
        category: categoryId,
        restricted_access: restrictedAccess,
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
    
    if(!mongoose.Types.ObjectId.isValid(projectRes._id)) {
        throw new Error('ProjectIdNotValid');
    }

    if(!(await Project.findById({_id: projectRes._id}))) {
        throw new Error('ProjectNotFound');
    }

    roleId = await Role.findOne({name: 'owner'}).select('_id')
        .then((result) => {
           if(!result || result === null) {
               throw new Error('RoleNotFound');
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

    if(roleId instanceof Error) {
        throw roleId;
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }

    const resourceUserRole = new ResourceUserRole({
        user: userId,
        collection_name: 'project',
        document: projectId,
        role: roleId
    });

    resourceUserRoleRes = await resourceUserRole.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ResourceUserRoleNotSaved');
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

    if(resourceUserRoleRes instanceof Error) {
        throw resourceUserRoleRes;
    }

    if(!mongoose.Types.ObjectId.isValid(resourceUserRoleRes._id)) {
        throw new Error('ResourceUserRoleIdNotValid');
    }

    teamId = await User.findById({userId}).select('team')
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

    if(teamId instanceof Error) {
        throw teamId;
    }
    
    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new Error('TeamIdNotValid');
    } 
    
    if(!(await Team.findById({teamId}))) {
        throw new Error('TeamDoesNotExist');
    }

    const projectTeam = new ProjectTeam({
        team: teamId,
        project: projectId
    });

    projectTeamRes = await projectTeam.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ProjectTeamNotSaved');
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
    
    if(projectTeamRes instanceof Error) {
        throw projectTeamRes;
    }

    if(!mongoose.Types.ObjectId.isValid(projectTeamRes._id)) {
        throw new Error('ProjectTeamIdNotValid');
    }

    if(projectRes instanceof Error) {
        throw projectRes;
    } else if(projectRes instanceof Project) {
        return projectRes;
    } else {
        throw new Error(projectRes);
    }
}

async function editProject(projectObj) {

}

async function deleteProject(id) {

}

// ==================== TASK CRUD SECTION ==================== //

async function getTask(taskId) {
    let task;

    if(!taskId || taskId === null) {
        throw new Error('TaskIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new Error('TaskIdNotValid');
    }

    task = await Task.findById({taskId})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TaskNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    if(task instanceof Error) {
        throw task;
    } else if(task instanceof Task) {
        return task;
    } else {
        throw new Error(task);
    }
}

async function getTaskList() {
    let tasks = [];
    let ref, objId;

    if(arguments.length === 2) {
        ref = arguments[0];
        objId = arguments[1];

        if(!ref || ref === '') {
            throw new Error('ReferenceMissing');
        }

        if(!objId || objId === '') {
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
            if(!(await User.findById({objId}))) {
                throw new Error('UserNotFound');
            }
        } else if(ref === 'team') {
            if(!(await Team.findById({objId}))) {
                throw new Error('TeamNotFound');
            }
        }

        if(ref === 'user') {
            tasks = await Task.find({team: teamId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TaskNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
        } else if(ref === 'team') {
            tasks = await Task.find({team: teamId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TaskNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
        }
    } else if(arguments.length === 0) {
        tasks = await Task.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TaskNotFound');
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

    if(tasks instanceof Error) {
        throw tasks;
    } else if(tasks instanceof Task) {
        return tasks;
    } else {
        throw new Error(tasks);
    }
}

async function createTask() {

}

async function editTask() {

}

async function deleteTask() {

}

// ==================== TEAM CRUD SECTION ==================== //

async function getTeam(teamId) {
    let team;

    if(!teamId || teamId === '') {
        throw new Error('TeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        throw new Error('TeamIdNotValid');   
    }

    team = await Team.findById({teamId})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    if(team instanceof Error || team === null) {
        throw team;
    } else if(team instanceof Team) {
        return team;
    } else {
        throw new Error(team);
    }
}

async function getTeamList() {
    let teams = [];

    teams = await Team.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('TeamNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })

    if(teams instanceof Error) {
        throw teams;
    } else if(teams instanceof Task) {
        return teams;
    } else {
        throw new Error(teams);
    }
}

async function createTeam() {
    
}

async function editTeam() {

}

async function deleteTeam() {
    
}

// ==================== COMMENT CRUD SECTION ==================== //

async function getComment(commentId) {
    let comment;

    if(!commentId || commentId === '') {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    comment = await Comment.findById({commentId})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CommentNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    if(comment instanceof Error) {
        throw comment;
    } else if(comment instanceof Comment) {
        return comment;
    } else {
        throw new Error(comment);
    }
}

async function getCommentList() {
    let comments = [];
    let taskId;

    if(arguments.length === 1) {
        taskId = arguments[0];

        if(!taskId || taskId === '') {
            throw new Error('TaskIdMissing');
        }

        if(!mongoose.Types.ObjectId.isValid((taskId))) {
            throw new Error('TaskIdNotValid');
        }

        if(!(await Task.findById({taskId}))) {
            throw new Error('TaskNotFound');
        }

        comments = await Comment.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CommentNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    } else if(arguments.length === 0) {
        comments = await Comment.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CommentNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    } else {

    }

    if(comments instanceof Error) {
        throw comments;
    } else if(comments instanceof Task) {
        return comments;
    } else {
        throw new Error(comment);
    }
}

async function createComment() {
    
}

async function editComment() {

}

async function deleteComment() {

}

// ==================== COMPANY CRUD SECTION ==================== //

async function getCompany(companyId) {
    let company;

    if(!companyId || companyId === '') {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    company = await Company.findById({companyId})
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

    if(company instanceof Error) {
        throw company;
    } else if(company instanceof Company) {
        return company;
    } else {
        throw new Error(company);
    }
}

async function getCompanyList() {
    let companies = [];

    companies = await Company.find({})
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

    if(companies instanceof Error) {
        throw companies;
    } else if(companies instanceof Task) {
        return companies;
    } else {
        throw new Error(companies);
    }
}

async function createCompany(companyObj) {
    let companyRes;
    const {name, description, email, phone, website, owner} = companyObj;
    if(!name || !description || !email || !phone || !website) {
        throw 'EmptyFormField';
    }

    if(!owner || owner === '') {
        throw new Error('UserIdMissing');
    }
    
    if(!mongoose.Types.ObjectId.isValid(owner)) {
        throw new Error('UserIdNotValid');   
    }

    if(!(await User.findById(owner))) {
        throw new Error('UserNotFound');       
    }

    const company = new Company({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        email: email,
        phone: phone,
        website: website,
        owner: owner
    });

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
    } else if(!mongoose.Types.ObjectId.isValid(companyRes._id)) {
        throw new Error('CompanyIdNotValid');
    } else if(!(await Company.findById({_id: companyRes._id}))) {
        throw new Error('CompanyNotFound');
    } else if(companyRes instanceof Company) {
        return companyRes;
    } else {
        throw new Error(companyRes);
    }
}

async function editCompany() {

}

async function deleteCompany() {

}

// ==================== REPOSITORY CRUD SECTION ==================== //

async function getRepository(repositoryId) {
    let repository;

    if(!repositoryId || repositoryId === '') {
        throw new Error('RepositoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(repositoryId)) {
        throw new Error('RepositoryIdNotValid');
    }

    repository = await Repository.findById({repositoryId})
        .then((result) => {
            if(result) {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });

    if(repository instanceof Error) {
        throw repository;
    } else if(repository instanceof Repository) {
        return repository;
    } else {
        throw new Error(repository);
    }
}

async function getRepositoryList() {
    let repositories = [];
    let ref, objId;

    if(arguments.length === 2) {
        ref = arguments[0];
        objId = arguments[1];

        if(!ref || ref === '') {
            throw new Error('ReferenceMissing');
        }

        if(!objId || objId === '') {
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
            if(!(await User.findById({objId}))) {
                throw new Error('UserNotFound');
            }

            let teamId = await User.findById({objId}).select('team')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });

            if(teamId instanceof Error) {
                throw teamId;
            }

            if(!mongoose.Types.ObjectId.isValid(teamId)) {
                throw new Error('TeamIdNotValid');
            }

            repositories = await Promise.all([
                Repository.find({owner: objId}),
                RepositoryTeam.find({team: teamId})
            ])
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('NoRecordsFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
        } else if(ref === 'team') {
            if(!(await Team.findById({objId}))) {
                throw new Error('TeamNotFound');
            }

            repositories = await RepositoryTeam.find({team: objId}).populate('repository')
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
        }
    } else if(arguments.length === 0) {
        repositories = await Repository.find({})
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

    if(repositories instanceof Error) {
        throw repositories;
    } else if((repositories instanceof Repository && repositories.length > 0) || (rpeositories instanceof RepositoryTeam && repositories.length > 0) || (repositories instanceof Promise && repositories.length > 0)) {
        return repositories;
    } else {
        throw new Error(repositories);
    }
}

async function createRepository() {

}

async function editRepository() {

}

async function deleteRepository() {

}

// ==================== ORGANIZATION CRUD SECTION ==================== //

async function getOrganization(organizationId) {
    let organization;

    if(!organizationId || organizationId === '') {
        throw new Error('OrganizationIdMissing')
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    organization = await Organization.findById({organizationId})
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

    if(organization instanceof Error) {
        throw organization;
    } else if(organization instanceof Organization) {
        return organization;
    } else {
        throw new Error(organization);
    }
}

async function getOrganizationList() {
    let organizations = [];
    let company, cName;

    if(arguments.length === 1) {
        cName = arguments[0];
        company = await Company.findOne({name: cName})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CompanyNotFound');
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })

        if(company instanceof Error) {
            throw company;
        } else if(company instanceof Company) {
            organizations = Organization.find({company: company._id})
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
            })
        } else {
            throw new Error(company);
        }


    } else if(arguments.length === 0) {
        organizations = await Organization.find({})
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
        })
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }

    if(organizations instanceof Error) {
        throw organizations;
    } else if(organizations instanceof Organization) {
        return organizations;
    } else {
        throw new Error(organizations);
    }
}

async function createOrganization() {
    
}

async function editOrganization() {

}

async function deleteOrganization() {

}

// ==================== PERMISSION CRUD SECTION ==================== //

async function getPermission(permissionId) {
    let permission;

    if(!permissionId || permissionId === '') {
        throw new Error('PermissionIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(permissionId)) {
        throw new Error( 'PermissionIdNotValid');   
    }

    permission = await Permission.findById({id})
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
        });

    if(permission instanceof Error) {
        throw permission;
    } else if(permission instanceof Permission) {
        return permission;
    } else {
        throw new Error(permission);
    }
}

async function getPermissionList() {
    let permissions = [];
    permissions = await Permission.find({})
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

    if(permissions instanceof Error) {
        throw permissions;
    } else if(permissions instanceof Permission) {
        return permissions;
    } else {
        throw new Error(permissions);
    }
}

async function createPermission(permissionObj) {
    let permissionRes;
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

    permissionRes = await permission.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('PermissionNotSaved');
        } else {
            console.log(result);
            return result;
        }
    })

    if(permissionRes instanceof Error) {
        throw permissionRes;
    } else if(!mongoose.Types.ObjectId.isValid(permissionRes._id)) {
        throw new Error('PermissionIdNotValid');
    } else if(!(await Permission.findById({_id: permissionRes._id}))) {
        throw new Error('PermissionNotFound');
    } else if(permissionRes instanceof Permission) {
        return permissionRes;
    } else {
        throw new Error(permissionRes);
    }

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

}

async function getCategoryList() {
    let categories = [];
    let category_type;
    if(arguments.length === 1) {
        category_type = arguments[0];
        if(!category_type || category_type === '') {
            throw new Error('MissingCategoryType');
        }

        categories = await Category.find({category_type: category_type}, '_id name description')
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
        categories = await Category.find({}, '_id name description')
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

    if(categories instanceof Error) {
        throw categories;
    } else if(categories.length > 0) {
        return categories;
    }
}

async function createCategory() {
    let name, description, category_type, categoryRes;
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

    const category = new Category({
        name: name,
        description: description,
        category_type: category_type
    })

    categoryRes = await category.save()
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

    if(categoryRes instanceof Error) {
        throw categoryRes;
    } else if(categoryRes instanceof Category) {
        return categoryRes;
    } else {
        throw new Error(categoryRes);
    }
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
    let collection_name, role, resourceId, resourceRes, userId;
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

    let resource, roleId;

    if(!collection_name || collection_name === '' || !role || role === '') {
        throw new Error('EmptyFormField');
    }

    if(!userId || userId === '') {
        throw new Error('UserIdMissing');
    }

    if(!resourceId) {
        throw new Error('ResourceIdMissing');
    }

    roleId = await Role.findOne({name: role}).select('_id')
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

    if(roleId instanceof Error) {
        throw roleId;
    }

    if(!mongoose.Types.ObjectId.isValid(roleId)) {
        throw new Error('RoleIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');   
    }

    if(!mongoose.Types.ObjectId.isValid(resourceId)) {
        throw new Error('ResourceIdNotValid') ;
    }

    // 'Team', 'Project', 'Comment', 'Task', 'Organization', 'Company', 'Category'
    switch(collection) {
        case 'Team': resource = await Team.findById({resourceId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
            break;
        case 'Project': resource = await Project.findById({resourceId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('ProjectNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
            break;
        case 'Comment': resource = await Comment.findById({resourceId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
            break;
        case 'Organization': resource = await Organization.findById({resourceId})
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
            break;
        case 'Company': resource = await Company.findById({resourceId})
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
            break;
        case 'Category': resource = await Category.findById({resourceId})
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
            });
            break;
        default: throw new Error('IncorrectResourceName');
    }

    if((resource instanceof Team || resource instanceof Project || resource instanceof Comment || resource instanceof Organization || resource instanceof Company || resource instanceof Category) && resource !== null) {
        let resourceUserRole = new ResourceUserRole({
            user: userId,
            collection_name: collection_name,
            document: resourceId,
            role: roleId
        });

        resourceRes = await resourceUserRole.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('ResourceUserRoleNotSaved');
            } else {
                return result;
            }
        })
    } else {
        throw new Error('ResourceDoesNotExist');
    }

    if(resourceRes instanceof Error) {
        throw resourceRes;
    } else if(resourceRes instanceof ResourceUserRole) {
        return resourceRes;
    } else {
        throw new Error(resourceRes);
    }
}

async function editResourceUserRole() {

}

async function deleteResourceUserRole() {

}

// ==================== CROSS-REFERENCE COLLECTIONS CRUD SECTION ==================== //

// ==================== PROJECT TEAM CRUD SECTION ==================== //

async function getProjectTeam(projectTeamId) {
    let projectTeam;
    if(!projectTeamId || projectTeamId === '') {
        throw new Error('ProjectTeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(projectTeamId)) {
        throw new Error('ProjectTeamIdNotValid');
    }

    projectTeam = await ProjectTeam.findById({projectTeamId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectTeamNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(projectTeam instanceof Error) {
        throw projectTeam;
    } else if(projectTeam instanceof ProjectTeam) {
        return projectTeam;
    } else {
        throw new Error(projectTeam);
    }
}

async function getProjectTeamList() {
    let projectTeams = [];

    projectTeams = await ProjectTeam.find({})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('ProjectTeamNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(projectTeams instanceof Error) {
        throw projectTeams;
    } else if(projectTeams instanceof ProjectTeam) {
        return projectTeams;
    } else {
        throw new Error(projectTeams);
    }
}

async  function createProjectTeam() {

}

async function editProjectTeam() {

}

async function deleteProjectTeam() {

}

// ==================== REPOSITORY TEAM CRUD SECTION ==================== //

async function getRepositoryTeam(repositoryTeamId) {
    let repositoryTeam;
    if(!repositoryTeamId || repositoryTeamId === '') {
        throw new Error('RepositoryTeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(repositoryTeamId)) {
        throw new Error('RepositoryTeamIdNotValid');
    }

    repositoryTeam = await ProjectTeam.findById({repositoryTeamId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RepositoryTeamNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(repositoryTeam instanceof Error) {
        throw repositoryTeam;
    } else if(repositoryTeam instanceof RepositoryTeam) {
        return repositoryTeam;
    } else {
        throw new Error(repositoryTeam);
    }
}

async function getRepositoryTeamList() {
    let repositoryTeams;

    repositoryTeams = await ProjectTeam.findById({})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RepositoryTeamNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(repositoryTeams instanceof Error) {
        throw repositoryTeams;
    } else if(repositoryTeams instanceof RepositoryTeam) {
        return repositoryTeams;
    } else {
        throw new Error(repositoryTeams);
    }
}

async  function createRepositoryTeam() {

}

async function editRepositoryTeam() {

}

async function deleteRepositoryTeam() {

}

// TODO: modify error throwing structure & add additional 'XEqualsNull' errors to the pool