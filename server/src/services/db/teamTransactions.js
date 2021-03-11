const Team = require('../../models/Team');
const Organization = require('../../models/Organization');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Company = require('../../models/Company');
const mongoose = require('mongoose');
const Project = require('../../models/Project');

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
    getTeam, getTeamList, createTeam, updateTeam, deleteTeam
}

// ==================== TEAM CRUD SECTION ==================== //

async function getTeam(ref, objId) {
    let organizationId;

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
        if(!(await User.findById(objId))) {
            throw new Error('UserNotFound');
        }

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
    } else if(ref === 'project') {
        return await Project.find({_id: objId}).opulate({pathname: 'teams', populate: {pathname: 'owner', model: 'User'}})
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
    } else {
        throw new Error('ReferenceIncorrect');
    }
}

async function getTeamList() {
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

            return await Team.find({$or: [{'owner': objId}, {'members': objId}]}).populate('organization owner members category')
            .then((result) => {
                if(!result || result === null || result.length === 0) {
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
        } else if(ref === 'team') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('TeamIdNotValid');
            }

            if(!(await Team.findById(objId))) {
                throw new Error('TeamNotFound');
            }

            return await Team.find(objId).populate('organization owner members category')
            .then((result) => {
                if(!result || result === null && result.length === 0) {
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
        } else if(ref === 'company') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('CompanyIdNotValid');
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
                    
                    return await Organization.find({company: companyId}, 'teams').populate('teams')
                    // .populate({pathname: 'teams', 
                    //     populate: {pathname: 'owner', model: 'User'}, 
                    //     populate: {pathname: 'category', model: 'Category'}, 
                    //     populate: {pathname: 'organization', model: 'Organization'}, 
                    //     populate: {pathname: 'members', model: 'User'}
                    // })
                    .then((result) => {
                        if(!result || result === null || result.length === 0) {
                            throw new Error('NoTeamsFound');
                        } else {
                            return result.teams;
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            throw error;
                        }
                    })
                }
            } else {
                return await Organization.find({company: objId}, 'teams').populate('teams')
                // .populate({pathname: 'teams', 
                //     populate: {pathname: 'owner', model: 'User'}, 
                //     populate: {pathname: 'category', model: 'Category'}, 
                //     populate: {pathname: 'organization', model: 'Organization'}, 
                //     populate: {pathname: 'members', model: 'User'}
                // })
                .then((result) => {
                    if(!result || result === null || result.length === 0) {
                        throw new Error('NoTeamsFound');
                    } else {
                        return result.teams;
                    }
                })
                .catch((error) => {
                    if(error) {
                        throw error;
                    }
                })
            }
        } else if(ref === 'organization') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('OrganizationIdNotValid');
            }

            if(!(await Organization.findById(objId))) {
                throw new Error('OrganizationNotFound');
            }

            return await Team.find({organization: objId}).populate('organization members owner category')
            .then((result) => {
                if(!result || result === null && result.length === 0) {
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
        } else if(ref === 'project') {
            if(!mongoose.Types.ObjectId.isValid(objId)) {
                throw new Error('ProjectIdNotValid');
            }

            if(!(await Project.findById(objId))) {
                throw new Error('ProjectNotFound');
            }

            return await Project.findById({_id: objId}).populate({pathname: 'teams', populate: {pathname: 'owner', model: 'User'}})
            .then((result) => {
                if(!result || result === null && result.length === 0) {
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
        } else {
            throw new Error('ReferenceIncorrect');
        }
    } else if(arguments.length === 0) {
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
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createTeam(userId, teamObj) {
    const {name, description, category, members, avatar_url, organization} = teamObj;
    let categoryId, teamRes;
    let memIds = [];

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

    for(var i in members) {
        memIds.push(members[i]._id);
    }

    let team;

    if(!avatar_url) {
        team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            category: categoryId,
            members: memIds,
            owner: userId,
            organization: org._id
        })
    } else {
        team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            category: categoryId,
            members: memIds,
            owner: userId,
            avatar_url: avatar_url,
            organization: org._id
        })
    }

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

    let organizations = await Organization.find({teams: teamId});
    let tasks = await Task.find({teams: teamId});
    let projects = await Project.find({teams: teamId});

    for(var i = 0; i < organizations.length; i++) {
        for(var j = 0; j < organizations[i].teams.length; j++) {
            if(organizations[i].teams[j] === teamId) {
                organizations[i].teams.splice(j, 1);
                organizations[i].modified_at = Date.now();
                await organizations[i].save()
            }
        }
    }

    for(var i = 0; i < tasks.length; i++) {
        for(var j = 0; j < tasks[i].teams.length; j++) {
            if(tasks[i].teams[j] === teamId) {
                tasks[i].teams.splice(j, 1);
                tasks[i].modified_at = Date.now();
                await tasks[i].save();
            }
        }
    }

    for(var i = 0; i < projects.length; i++) {
        for(var j = 0; j < projects[i].teams.length; j++) {
            if(projects[i].teams[j] === teamId) {
                projects[i].teams.splice(j, 1);
                projects[i].modified_at = Date.now();
                await projects[i].save()
            }
        }
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