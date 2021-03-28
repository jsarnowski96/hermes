const Company = require('../../models/Company');
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
    getCompany, getCompanyList, createCompany, updateCompany, deleteCompany
}

// ==================== COMPANY CRUD SECTION ==================== //

async function getCompany() {
    if(arguments.length === 2) {
        userId = arguments[0];
        companyId = arguments[1];

        if(!companyId) {
            throw new Error('CompanyIdMissing');
        }
    
        if(!mongoose.Types.ObjectId.isValid(companyId)) {
            throw new Error('CompanyIdNotValid');
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
    
        let user = await User.findById(userId, 'company')
        then((result) => {
            if(!result || result === null) {
                throw new Error('UserNotFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            if(error) {
                throw error;
            }
        })
    
        if(user.company !== companyId) {
            throw new Error('AccessDenied');
        }
    
        return await Company.findById(companyId)
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
    } else if(arguments.length === 1) {
        userId = arguments[0];
    
        if(!userId) {
            throw new Error('UserIdMissing');
        }
    
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('UserIdNotValid');
        }
    
        if(!(await User.findById(userId))) {
            throw new Error('UserNotFound');
        }
    
        return await User.findById(userId, 'company').populate('company')
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
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function getCompanyList() {
    return await Company.find({}).populate({path: 'owner', model: 'User'})
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
}

async function createCompany(userId, companyObj) {
    const {name, description, email, phone, avatar_url, website} = companyObj;
    let user, companyRes;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!name || !description || !email || !phone || !website) {
        throw new Error('EmptyFormField');
    }
    
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');   
    }

    user = await User.findById(userId)
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

    let company;

    if(!avatar_url) {
        company = new Company({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            email: email,
            phone: phone,
            website: website,
            owner: userId
        });
    } else {
        company = new Company({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            email: email,
            phone: phone,
            avatar_url: avatar_url,
            website: website,
            owner: userId
        });
    }

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
    }

    if(user.company === null) {
        user.company = company._id;
        return await user.save()
        .then((result) => {
            if(!result || result === null) {
                throw new Error('UserNotUpdated');
            } else {
                return companyRes;
            }
        })
        .catch((error) => {
            if(error) {
                console.log(error);
                throw error;
            }
        })
    } else {
        return companyRes;
    }
}

async function updateCompany(userId, companyId, companyObj) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!companyId) {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Company.findOneAndUpdate({_id: companyId, owner: userId}, companyObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotUpdated');
        } else {
            return result;
        }
    })
}

async function deleteCompany(userId, companyId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!companyId) {
        throw new Error('CompanyIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error('CompanyIdNotValid');
    }

    return await Company.findOneAndDelete({_id: companyId, owner: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CompanyNotDeleted');
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