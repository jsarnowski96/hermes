const Team = require('../../models/Team');
const Company = require('../../models/Company');
const User = require('../../models/User');
const mongoose = require('mongoose');
const {registerUser} = require('../registerService');

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
    getUser, getUserList, createUser, updateUser, deleteUser
}


// ==================== USER CRUD ==================== //

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
            } else if(ref === 'organization') {
                throw new Error('OrganizationIdMissing');
            }
        }

        if(ref === 'user') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('UserIdNotValid');
            }

            if(!(await User.findById(objId))) {
                throw new Error('UserNotFound');
            }

            return await Team.find({$or: [{'owner': objId}, {'members': objId}]}, 'members').populate('members')
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

            // return await Team.findOne({$or: [{'owner': objId}, {'members': objId}]}, 'members').populate('members')
            // .then((result) => {
            //     if(!result || result === null) {
            //         throw new Error('TeamNotFound');
            //     } else {
            //         return result.members;
            //     }
            // })
            // .catch((error) => {
            //     if(error) {
            //         throw error;
            //     }
            // })
            
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
            let companyId;

            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('ObjIdNotValid');
            }

            if(!(await Company.findById(objId))) {
                if(!(await User.findById(objId))) {
                    throw new Error('UserNotFound');
                }

                companyId = await User.findById(objId, 'company')
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('UserNotFound');
                    } else {
                        return result.company;
                    }
                })
                .catch((error) => {
                    if(error) {
                        throw error;
                    }
                })

                return await User.find({company: companyId})
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
        } else if(ref === 'organization') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('OrganizationIdNotValid');
            }

            if(!(await Organization.findById(objId))) {
                throw new Error('OrganizationNotFound');
            }

        } else {
            throw new Error('ReferenceIncorrect');
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

    if(userId !== docId) {
        throw new Error('AccessForbidden');
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

async function deleteUser(userId, docId) {
    if(!userId || !docId) {
        throw new Error('UserIdMissing');
    }

    if(userId !== docId) {
        throw new Error('Unauthorized');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid')
    }

    if(!mongoose.Types.ObjectId.isValid(docId)) {
        throw new Error('UserIdNotValid')
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    let teams = await Team.find({$or: [{'owner': docId}, {'members': docId}]})
    let projects = await Team.find({owner: docId});
    let tasks = await Team.find({$or: [{'author': docId}, {'assigned_user': docId}]});
    let companies = await Team.find({owner: docId});

    for(var i = 0; i < teams.length; i++) {
        if(teams[i].owner === docId) {
            teams[i].owner = null;
        }

        for(var j = 0; j < teams[i].members.length; j++) {
            if(teams[i].members[j] === docId) {
                teams[i].members.splice(j, 1);
                teams[i].modified_at = Date.now()
                await teams[i].save();
            }
        }
    }

    for(var i = 0; i < projects.length; i++) {
        if(projects[i].owner === docId) {
            projects[i].owner = null;
            projects[i].modified_at = Date.now()
            await projects[i].save();
        }
    }

    for(var i = 0; i < tasks.length; i++) {
        if(tasks[i].author === docId) {
            tasks[i].author = null;
        }

        if(tasks[i].assigned_user === docId) {
            tasks[i].assigned_user = null;
        }

        tasks[i].modified_at = Date.now()
        await tasks[i].save();
    }

    for(var i = 0; i < companies.length; i++) {
        if(companies[i].owner === docId) {
            companies[i].owner = null;
            companies[i].modified_at = Date.now()
            await companies[i].save();
        }
    }

    return await User.findByIdAndRemove(docId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('UserNotDeleted');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            throw error;
        }
    })
}