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
        console.log('GET USER - User ID missing');
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('GET USER - User ID not valid');
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
            console.log('GET USER\n' + error);
            throw error;
        }
    })
}

async function getUserList() {
    if(arguments.length === 2) {
        ref = arguments[0];
        objId = arguments[1];

        if(!ref) {
            console.log('GET USER LIST - Reference missing');
            throw new Error('ReferenceMissing');
        }

        if(!objId) {
            if(ref === 'user') {
                console.log('GET USER LIST - User ID missing');
                throw new Error('UserIdMissing');
            } else if(ref === 'team') {
                console.log('GET USER LIST - Team ID missing');
                throw new Error('TeamIdMissing');
            } else if(ref === 'company') {
                console.log('GET USER LIST - Company ID missing');
                throw new Error('CompanyIdMissing');
            } else if(ref === 'organization') {
                console.log('GET USER LIST - Organization ID missing');
                throw new Error('OrganizationIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid(objId)) {
            if(ref === 'user') {
                console.log('GET USER LIST - User ID not valid');
                throw new Error('UserIdNotValid');  
            } else if(ref === 'team') {
                console.log('GET USER LIST - Team ID not valid');
                throw new Error('TeamIdNotValid');  
            } else if(ref === 'company') {
                console.log('GET USER LIST - Company ID not valid');
                throw new Error('CompanyIdNotValid');  
            } else if(ref === 'organization') {
                console.log('GET USER LIST - Organization ID not valid');
                throw new Error('OrganizationIdNotValid');  
            }
        }

        if(ref === 'user') {
            if(!(await User.findById(objId))) {
                console.log('GET USER LIST - User not found');
                throw new Error('UserNotFound');
            }

            let companyId = await User.findById(objId, 'company')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('UserNotFound');
                } else {
                    return result.company;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            })

            return await User.find({company: companyId}).populate('company')
            .then((result) => {
                if(!result || result === null || result.length === 0) {
                    throw new Error('NoUsersFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            })            
        } else if(ref === 'team') {
            if(!(await Team.findById(objId))) {
                console.log('GET USER LIST - Team not found');
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
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            })
        } else if(ref === 'company') {
            let companyId = await User.findById(objId, 'company')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('UserNotFound');
                } else {
                    return result.company;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            })
            return await User.find({company: companyId}).populate('company')
            .then((result) => {
                if(!result || result === null || result.length === 0) {
                    throw new Error('NoUsersFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            })
        } else if(ref === 'organization') {
            return await Team.find({organization: objId}, 'members').populate('members')
            .then((result) => {
                if(!result || result === null || result.length === 0) {
                    throw new Error('NoUsersFound');
                } else {
                    return result.members;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET USER LIST\n' + error);
                    throw error;
                }
            });
        } else {
            console.log('GET USER LIST - Reference incorrect');
            throw new Error('ReferenceIncorrect');
        }
    } else if(arguments.length === 0) { // for admins/moderators
        return await User.find({}).populate('company')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoUsersFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log('GET USER LIST\n' + error);
                throw error;
            }
        });
    } else {
        console.log('GET USER LIST - Incorrect number of arguments');
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createUser(userObj) {
    return await registerUser(userObj)
    .then((result) => {
        if(!result) {
            throw new Error('UserNotRegistered');
        }
    })
    .catch((error) => {
        if(error) {
            console.log('GET USER LIST\n' + error);
            throw error;
        }
    })
}

async function updateUser(userId, docId, userObj) {
    let companyId, user;

    if(!userId) {
        console.log('UPDATE USER - User ID missing');
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('UPDATE USER - User ID not valid');
        throw new Error('UserIdNotValid');
    }

    if(userId !== docId) {
        console.log('UPDATE USER - !!! UNAUTHORIZED !!!');
        throw new Error('Unauthorized');
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
            console.log('UPDATE USER\n' + error);
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
            console.log('UPDATE USER\n' + error);
            throw error;
        }
    })

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
            console.log('UPDATE USER\n' + error)
            throw error;
        }
    })
}

async function deleteUser(userId, docId) {
    if(!userId || !docId) {
        console.log('DELETE USER - User ID missing');
        throw new Error('UserIdMissing');
    }

    if(userId !== docId) {
        console.log('DELETE USER - !!! UNAUTHORIZED !!!');
        throw new Error('Unauthorized');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('DELETE USER - User ID not valid');
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(docId)) {
        console.log('DELETE USER - User ID not valid');
        throw new Error('UserIdNotValid')
    }

    if(!(await User.findById(userId))) {
        console.log('DELETE USER - User not found');
        throw new Error('UserNotFound');
    }

    if(!(await User.findById(docId))) {
        console.log('DELETE USER - User not found');
        throw new Error('UserNotFound');
    }

    let teams = await Team.find({$or: [{'owner': docId}, {'members': docId}]})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE USER\n' + error);
            throw error;
        }
    })

    let projects = await Team.find({owner: docId})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE USER\n' + error);
            throw error;
        }
    })

    let tasks = await Team.find({$or: [{'author': docId}, {'assigned_user': docId}]})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE USER\n' + error);
            throw error;
        }
    })

    let companies = await Team.find({owner: docId})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE USER\n' + error);
            throw error;
        }
    })

    if(teams.length > 0) {
        for(var i = 0; i < teams.length; i++) {
            if(teams[i].owner === docId) {
                teams[i].owner = null;
            }
    
            for(var j = 0; j < teams[i].members.length; j++) {
                if(teams[i].members[j] === docId) {
                    teams[i].members.splice(j, 1);
                    teams[i].modified_at = Date.now()
                    await teams[i].save()
                    .then((result) => {
                        if(!result || result === null) {
                            throw new Error('TeamNotUpdated');
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            console.log('DELETE USER\n' + error);
                            throw error;
                        }
                    })
                }
            }
        }
    }

    if(projects.length > 0) {
        for(var i = 0; i < projects.length; i++) {
            if(projects[i].owner === docId) {
                projects[i].owner = null;
                projects[i].modified_at = Date.now()
                await projects[i].save()
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('ProjectNotUpdated');
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('DELETE USER\n' + error);
                        throw error;
                    }
                })
            }
        }
    }

    if(tasks.length > 0) {
        for(var i = 0; i < tasks.length; i++) {
            if(tasks[i].author === docId) {
                tasks[i].author = null;
            }
    
            if(tasks[i].assigned_user === docId) {
                tasks[i].assigned_user = null;
            }
    
            tasks[i].modified_at = Date.now()
            await tasks[i].save()
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TaskNotUpdated');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('DELETE USER\n' + error);
                    throw error;
                }
            })
        }
    }

    if(companies.length > 0) {
        for(var i = 0; i < companies.length; i++) {
            if(companies[i].owner === docId) {
                companies[i].owner = null;
                companies[i].modified_at = Date.now()
                await companies[i].save()
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('CompanyNotUpdated');
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('DELETE USER\n' + error);
                        throw error;
                    }
                })
            }
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
            console.log('DELETE USER\n' + error);
            throw error;
        }
    })
}