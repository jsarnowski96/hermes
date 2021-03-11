const Category = require('../../models/Category');
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
    getCategory, getCategoryList, createCategory, updateCategory, deleteCategory
}

// ==================== CATEGORY CRUD SECTION ==================== //

async function getCategory(categoryId) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findById(categoryId)
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotFound');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function getCategoryList() {
    if(arguments.length === 1) {
        category_type = arguments[0];
        if(!category_type) {
            throw new Error('CategoryTypeMissing');
        }

        return await Category.find({category_type: category_type})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCategoryFound');
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
    } else if(arguments.length === 0) {
        return await Category.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCategoryFound');
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

async function createCategory() {
    if(arguments.length === 1) {
        _name = arguments[0].name;
        description = arguments[0].description;
        category_type = arguments[0].category_type;
    } else if(arguments.length === 3) {
        _name = arguments[0];
        description = arguments[1];
        category_type = arguments[2];
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }

    if(!_name || !description || !category_type) {
        throw new Error('EmptyFormField');
    }

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: _name,
        description: description,
        category_type: category_type
    })

    return await category.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotSaved');
        } else {
            return result;
        }
    })
    .catch((error) => {
        console.log(error);
        throw error;
    })
}

async function updateCategory(categoryId, categoryObj) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findByIdAndUpdate({_id: categoryId}, categoryObj, {new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotUpdated');
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

async function deleteCategory(categoryId) {
    if(!categoryId) {
        throw new Error('CategoryIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error('CategoryIdNotValid');
    }

    return await Category.findOneAndDelete({_id: categoryId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CategoryNotDeleted');
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