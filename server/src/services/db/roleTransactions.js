const Role = require('../../models/Role');
const Permission = require('../../models/Permission');
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
    getRole, getRoleList, createRole, updateRole, deleteRole
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