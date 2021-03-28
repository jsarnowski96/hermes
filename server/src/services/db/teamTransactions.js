const Team = require('../../models/Team');
const Organization = require('../../models/Organization');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Company = require('../../models/Company');
const Task = require('../../models/Task');
const mongoose = require('mongoose');
const Project = require('../../models/Project');
const { createRecent } = require('./recentTransactions');

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

async function getTeam() {
    if(arguments.length === 3) {
        ref = arguments[0];
        userId = arguments[1];
        objId = arguments[2];

        if(!ref) {
            console.log('GET TEAM - Reference Missing');
            throw new Error('ReferenceMissing');
        }

        if(!userId) {
            console.log('GET TEAM - User ID missing');
            throw new Error('UserIdMissing');
        }

        if(!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('GET TEAM - User ID not valid');
            throw new Error('UserIdNotValid');
        }

        if(!objId) {
            if(ref === 'team' || ref === 'user') {
                console.log('GET TEAM - Team ID missing');
                throw new Error('TeamIdMissing');
            } else if(ref === 'organization') {
                console.log('GET TEAM - Organization ID missing');
                throw new Error('OrganizationIdMissing');
            } else if(ref === 'project') {
                console.log('GET TEAM - Project ID missing');
                throw new Error('ProjectIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid(objId)) {
            if(ref === 'team' || ref === 'user') {
                console.log('GET TEAM - Team ID not valid');
                throw new Error('TeamIdNotValid');  
            } else if(ref === 'organization') {
                console.log('GET TEAM - Organization ID not valid');
                throw new Error('OrganizationIdNotValid');  
            } else if(ref === 'project') {
                console.log('GET TEAM - Project ID not valid');
                throw new Error('ProjectIdNotValid');
            }
        }

        if(ref === 'user') {
            if(!(await User.findById(userId))) {
                console.log('GET TEAM - User not found');
                throw new Error('UserNotFound');
            }
    
            if(userId === objId) {
                return await Team.findOne({$or:[ {'owner': userId}, {'members': userId}]}).populate('owner members category organization')
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('TeamNotFound');
                    } else {
                        return result;
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('GET TEAM\n' + error);
                        throw error;
                    }
                });
            } else {
                return await Team.findOne({_id: objId, $or:[ {'owner': userId}, {'members': userId}]}).populate('owner members category organization')
                .then((result) => {
                    if(!result || result === null) {
                        throw new Error('TeamNotFound');
                    } else {
                        return result;
                    }
                })
                .catch((error) => {
                    if(error) {
                        console.log('GET TEAM\n' + error);
                        throw error;
                    }
                });
            }
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
                    console.log('GET TEAM\n' + error);
                    throw error;
                }
            });
        } else if(ref === 'project') {
            if(!(await Team.findById(objId))) {
                console.log('GET TEAM - Team not found');
                throw new Error('TeamNotFound');
            }

            return await Project.findOne({teams: objId}).populate({pathname: 'teams', populate: {pathname: 'owner', model: 'User'}})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('ProjectNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM\n' + error);
                    throw error;
                }
            });
        } else if(ref === 'organization') {
            if(!(await Organization.findById(objId))) {
                console.log('GET TEAM - Organization not found');
                throw new Error('OrganizationNotFound');
            }

            return await Team.findOne({organization: objId}).populate('owner members category organization')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('TeamNotFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM\n' + error);
                    throw error;
                }
            });
        } else {
            console.log('GET TEAM - Reference incorrect');
            throw new Error('ReferenceIncorrect');
        }
    } else {
        console.log('GET TEAM - Incorrect number of arguments');
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function getTeamList() {
    if(arguments.length === 3) {
        ref = arguments[0];
        userId = arguments[1];
        objId = arguments[2];

        if(!ref) {
            console.log('GET TEAM LIST - Reference missing');
            throw new Error('ReferenceMissing');
        }

        if(!userId) {
            console.log('GET TEAM LIST - User ID missing');
            throw new Error('UserIdMissing');
        }

        if(!objId) {
            if(ref === 'team' || ref === 'user') {
                console.log('GET TEAM LIST - Team ID missing');
                throw new Error('TeamIdMissing');
            } else if(ref === 'company') {
                console.log('GET TEAM LIST - Company ID missing');
                throw new Error('CompanyIdMissing');
            } else if(ref === 'organization') {
                console.log('GET TEAM LIST - Organization ID missing');
                throw new Error('OrganizationIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid(objId)) {
            if(ref === 'team' || ref === 'user') {
                console.log('GET TEAM LIST - Team ID not valid');
                throw new Error('TeamIdNotValid');  
            } else if(ref === 'company') {
                console.log('GET TEAM LIST - Company ID not valid');
                throw new Error('CompanyIdNotValid');  
            } else if(ref === 'organization') {
                console.log('GET TEAM LIST - Organization ID not valid');
                throw new Error('OrganizationIdNotValid');  
            } 
        }

        if(ref === 'user') {
            if(!(await User.findById(objId))) {
                console.log('GET TEAM LIST - User not found');
                throw new Error('UserNotFound');
            }

            return await Team.find({$or: [{'owner': objId}, {'members': objId}]}).populate('organization owner members category')
            .then((result) => {
                if(!result || result === null || result.length === 0) {
                    throw new Error('NoTeamsFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })
        } else if(ref === 'team') {
            let orgId = await Organization.findOne({teams: objId}, '_id')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('OrganizationNotFound');
                } else {
                    return result._id;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })

            return await Team.find({organization: orgId}).populate('organization owner members category')
            .then((result) => {
                if(!result || result === null && result.length === 0) {
                    throw new Error('NoTeamsFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })
        } else if(ref === 'company') {
            if(!(await Company.findById(objId))) {
                console.log('GET TEAM LIST - Company not found');
                throw new Error('CompanyNotFound');
            }

            return await Organization.find({company: objId}, 'teams').populate({pathname: 'teams', populate: { pathname: 'owner', model: 'User'}}).populate({pathname: 'teams', populate: { pathname: 'organization', model: 'Organization'}})
            .then((result) => {
                if(!result || result === null && result.length === 0) {
                    throw new Error('NoTeamsFound');
                } else {
                    return result.teams;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })

        } else if(ref === 'organization') {
            if(!(await Organization.findById(objId))) {
                console.log('GET TEAM LIST - Organization not found');
                throw new Error('OrganizationNotFound');
            }

            return await Team.find({organization: objId}).populate('organization members owner category')
            .then((result) => {
                if(!result || result === null && result.length === 0) {
                    throw new Error('NoTeamsFound');
                } else {
                    return result;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })
        } else if(ref === 'project') {
            if(!(await Project.findById(objId))) {
                console.log('GET TEAM - Project not found');
                throw new Error('ProjectNotFound');
            }

            return await Project.findById(objId, 'teams').populate({pathname: 'teams', populate: { pathname: 'owner', model: 'User'}}).populate({pathname: 'teams', populate: { pathname: 'organization', model: 'Organization'}})
            .then((result) => {
                if(!result || result === null && result.length === 0) {
                    throw new Error('NoTeamsFound');
                } else {
                    return result.teams;
                }
            })
            .catch((error) => {
                if(error) {
                    console.log('GET TEAM LIST\n' + error);
                    throw error;
                }
            })
        } else {
            console.log('GET TEAM LIST - Reference incorrect');
            throw new Error('ReferenceIncorrect');
        }
    } else if(arguments.length === 0) { // for admins/moderators
        return await Team.find({}).populate('owner members category organization')
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoTeamsFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                console.log('GET TEAM LIST\n' + error);
                throw error;
            }
        });
    } else {
        console.log('GET TEAM LIST - Incorrect number of arguments');
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createTeam(userId, teamObj) {
    const {name, description, category, members, avatar_url, organization} = teamObj;
    let categoryId, teamRes;
    let memIds = [];

    if(!name || !description || !category || !organization) {
        console.log('CREATE TEAM - Empty form field');
        throw new Error('EmptyFormField');
    }

    if(!userId) {
        console.log('CREATE TEAM - User ID missing');
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('CREATE TEAM - User ID not valid');
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        console.log('CREATE TEAM - User not found');
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
            console.log('CREATE TEAM\n' + error);
            throw error;
        }
    })

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
            console.log('CREATE TEAM\n' + error);
            throw error;
        }
    })

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
            console.log('CREATE TEAM\n' + error);
            throw error;
        }
    })

    if(teamRes instanceof Error) {
        throw teamRes;
    }

    org.teams.push(team._id);

    await org.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotUpdated');
        } else {
            return teamRes;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('CREATE TEAM\n' + error);
            throw error;
        }
    })

    let recent = {
        collection_name: 'team',
        action_type: 'created',
        document: team._id
    }
    
    await createRecent(userId, recent)
    .then((result) => {
        if(!result || result === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('CREATE TEAM\n' + error);
            throw error;
        }
    })

    return teamRes;
}

async function updateTeam(userId, teamId, teamObj) {
    let team, categoryId, ownerId;

    if(!userId) {
        console.log('UPDATE TEAM: User ID missing');
        throw new Error('UserIdMissing');
    }

    if(!teamId) {
        console.log('UPDATE TEAM: Team ID missing');
        throw new Error('TeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('UPDATE TEAM: User ID not valid');
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        console.log('UPDATE TEAM: Team ID not valid');
        throw new Error('TeamIdNotValid');
    }

    if(!(await User.findById(userId))) {
        console.log('UPDATE TEAM: User not found');
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
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

    if(team.owner !== userId) {
        console.log('UPDATE TEAM: !!! UNAUTHORIZED !!!');
        throw new Error('Unauthorized');
    }

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
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

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
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

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
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

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

    let teamRes = await team.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotUpdated');
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

    let recent = {
        collection_name: 'team',
        action_type: 'edited',
        document: team._id
    }
    
    await createRecent(userId, recent)
    .then((result) => {
        if(!result || result === 0) {
            return null;
        } else {
            return result;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('UPDATE TEAM\n' + error);
            throw error;
        }
    })

    return teamRes;
}

async function deleteTeam(userId, teamId) {
    if(!userId) {
        console.log('UPDATE TEAM: User ID missing');
        throw new Error('UserIdMissing');
    }

    if(!teamId) {
        console.log('UPDATE TEAM: Team ID missing');
        throw new Error('TeamIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('UPDATE TEAM: User ID not valid');
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(teamId)) {
        console.log('UPDATE TEAM: Team ID not valid');
        throw new Error('TeamIdNotValid');
    }

    if(!(await User.findById(userId))) {
        console.log('DELETE TEAM: User found');
        throw new Error('UserNotFound');
    }

    let owner = await Team.findById(teamId, 'owner')
    .then((result) => {
        if(!result || result === null) {
            throw new Error('TeamNotFound');
        } else {
            return result.owner;
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE TEAM\n' + error);
            throw error;
        }
    })

    if(userId !== owner) {
        console.log('DELETE TEAM - !!! UNAUTHORIZED !!!');
        throw new Error('Unauthorized');
    }

    let organizations = await Organization.find({teams: teamId})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('OrganizationNotFound');
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE TEAM - ' + error);
            throw error;
        }
    })

    let tasks = await Task.find({teams: teamId})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('TaskNotFound');
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE TEAM - ' + error);
            throw error;
        }
    })

    let projects = await Project.find({teams: teamId})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('ProjectNotFound');
        }
    })
    .catch((error) => {
        if(error) {
            console.log('DELETE TEAM - ' + error);
            throw error;
        }
    })

    if(organizations.length > 0) {
        for(var i = 0; i < organizations.length; i++) {
            for(var j = 0; j < organizations[i].teams.length; j++) {
                if(organizations[i].teams[j] === teamId) {
                    organizations[i].teams.splice(j, 1);
                    organizations[i].modified_at = Date.now();
                    await organizations[i].save()
                    .then((result) => {
                        if(!result || result === null) {
                            throw new Error('OrganizationNotUpdated');
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            console.log('DELETE TEAM - ' + error);
                            throw error;
                        }
                    })
                }
            }
        }
    }

    if(tasks.length > 0) {
        for(var i = 0; i < tasks.length; i++) {
            for(var j = 0; j < tasks[i].teams.length; j++) {
                if(tasks[i].teams[j] === teamId) {
                    tasks[i].teams.splice(j, 1);
                    tasks[i].modified_at = Date.now();
                    await tasks[i].save()
                    .then((result) => {
                        if(!result || result === null) {
                            throw new Error('TaskNotUpdated');
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            console.log('DELETE TEAM - ' + error);
                            throw error;
                        }
                    })
                }
            }
        }
    }

    if(projects.length > 0) {
        for(var i = 0; i < projects.length; i++) {
            for(var j = 0; j < projects[i].teams.length; j++) {
                if(projects[i].teams[j] === teamId) {
                    projects[i].teams.splice(j, 1);
                    projects[i].modified_at = Date.now();
                    await projects[i].save()
                    .then((result) => {
                        if(!result || result === null) {
                            throw new Error('ProjectNotUpdated');
                        }
                    })
                    .catch((error) => {
                        if(error) {
                            console.log('DELETE TEAM - ' + error);
                            throw error;
                        }
                    })
                }
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
            console.log('DELETE TEAM\n' + error);
            throw error;
        }
    })
}