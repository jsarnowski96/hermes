const Team = require('../../models/Team');
const Repository = require('../../models/Repository');
const User = require('../../models/User');
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
    getRepository, getRepositoryList, createRepository, updateRepository, deleteRepository
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