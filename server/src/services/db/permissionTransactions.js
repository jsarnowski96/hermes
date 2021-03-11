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
    getPermission, getPermissionList, createPermission, updatePermission, deletePermission
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