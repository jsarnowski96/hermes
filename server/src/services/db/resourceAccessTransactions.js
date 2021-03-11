const Project = require('../../models/Project');
const Team = require('../../models/Team');
const Comment = require('../../models/Comment');
const Company = require('../../models/Company');
const Organization = require('../../models/Organization');
const Role = require('../../models/Role');
const User = require('../../models/User');
const Category = require('../../models/Category');
const ResourceAccess = require('../../models/ResourceAccess');
const mongoose = require('mongoose');

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
    getResourceAccess, getResourceAccessList, createResourceAccess, updateResourceAccess, deleteResourceAccess
}

// ==================== RESOURCE ACCESS CRUD SECTION ==================== //

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