const User = require('../../models/User');
const Recent = require('../../models/Recent');
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
    getRecent, createRecent
}

// ==================== RECENT CRUD SECTION ==================== //

async function getRecent(userId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    return await Recent.find({})
    .then((result) => {
        if(!result || result === null || result.length === 0) {
            throw new Error('NoRecentFound');
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

async function createRecent(description, userId, collection, document) {
    if(!description || !userId || !collection || !document) {
        throw new Error('EmptyRecent');
    }

    let recent = new Recent({
        _id: new mongoose.Types.ObjectId(),
        description: description,
        user: userId,
        collection_name: collection,
        document: document
    })

    return await recent.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('RecentNotCreated');
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