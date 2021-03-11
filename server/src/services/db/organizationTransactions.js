const Team = require('../../models/Team');
const Company = require('../../models/Company');
const Organization = require('../../models/Organization');
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
    getOrganization, getOrganizationList, createOrganization, updateOrganization, deleteOrganization
}

// ==================== ORGANIZATION CRUD SECTION ==================== //

async function getOrganization(organizationId) {
    if(!organizationId) {
        throw new Error('OrganizationIdMissing')
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    return await Organization.findById(organizationId)
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
}

async function getOrganizationList() {
    if(arguments.length === 2) {
        ref = arguments[0]
        objId = arguments[1]

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
            companyId = await User.findById(objId, 'company')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('UserNotFound');
                } else {
                    return result.company;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })

            if(!mongoose.Types.ObjectId.isValid(companyId)) {
                throw new Error('CompanyIdNotValid');
            }

        } else if(ref === 'team') {
            companyId = await Organization.findOne({teams: objId}, 'company')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('OrganizationNotFound');
                } else {
                    return result.company;
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })

            if(!mongoose.Types.ObjectId.isValid(companyId)) {
                throw new Error('CompanyIdNotValid');
            }
        } else if(ref === 'company') {
            companyId = await Company.findById(objId, '_id')
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CompanyNotFound');
                } else {
                    return result._id;
                }
            })
            .catch((error) => {
                if(error) {
                    throw error;
                }
            })
        } else {
            throw new Error('ReferenceIncorrect');
        }

        return await Organization.find({company: companyId})
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
    } else if(arguments.length === 0) {
        return await Organization.find({})
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
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createOrganization(userId, organizationObj) {
    const {name, description, avatar_url, company} = organizationObj;
    let companyObj, teamId, organization;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!name || !description || !company) {
        throw new Error('EmptyFormField');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    teamId = await Team.findOne({$or:[ {'owner': userId}, {'members': userId} ]}, '_id')
    .then((result) => {
        if(!result || result === null) {
            return null;
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

    if(teamId instanceof Error) {
        throw teamId;
    }

    companyObj = await Company.findOne({name: company, owner: userId}, '_id organizations')
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

    if(companyObj instanceof Error) {
        throw companyObj;
    } 
    
    if(!mongoose.Types.ObjectId(companyObj._id)) {
        throw new Error('CompanyIdNotValid');
    }

    if(!avatar_url) {
        organization = new Organization({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            owner: userId,
            company: companyObj._id
        })
    } else {
        organization = new Organization({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            avatar_url: avatar_url,
            owner: userId,
            company: companyObj._id
        })
    }

    if(teamId !== null) {
        organization.teams.push(teamId);
    }

    let orgRes = await organization.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotSaved');
        } else {
            console.log(result);
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })

    if(orgRes instanceof Error) {
        throw orgRes;
    }
        
    companyObj.organizations.push(organization._id);

    let companyRes = await companyObj.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotUpdated');
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

    if(companyRes instanceof Error) {
        throw companyRes;
    }

    return orgRes;
}

async function updateOrganization(userId, organizationId, organizationObj) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!organizationId) {
        throw new Error('OrganizationIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Organization.findByIdAndUpdate({_id: organizationId, owner: userId}, organizationObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotUpdated');
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

async function deleteOrganization(userId, organizationId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!organizationId) {
        throw new Error('OrganizationIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(organizationId)) {
        throw new Error('OrganizationIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Organization.findOneAndDelete({_id: organizationId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('OrganizationNotDeleted');
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