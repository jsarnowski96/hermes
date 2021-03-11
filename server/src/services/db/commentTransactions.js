const Project = require('../../models/Project');
const Task = require('../../models/Task');
const Comment = require('../../models/Comment');
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
    getComment, getCommentList, createComment, updateComment, deleteComment
}

// ==================== COMMENT CRUD SECTION ==================== //

async function getComment(commentId) {
    if(!commentId) {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    return await Comment.findById(commentId)
        .then((result) => {
            if(!result || result === null) {
                throw new Error('CommentNotFound');
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

async function getCommentList() {
    let objId, ref;

    if(arguments.length === 2) {
        objId = arguments[0];
        ref = arguments[1];

        if(!objId) {
            if(ref === 'task') {
                throw new Error('TaskIdMissing');
            } else if(ref === 'project') {
                throw new Error('ProjectIdMissing');
            } else if(ref === 'comment') {
                throw new Error('CommentIdMissing');
            }
        }

        if(!mongoose.Types.ObjectId.isValid((objId))) {
            if(ref === 'task') {
                throw new Error('TaskIdNotValid');
            } else if(ref === 'project') {
                throw new Error('ProjectIdNotValid');
            } else if(ref === 'comment') {
                throw new Error('CommentIdNotValid');
            }
        }

        if(ref === 'task') {
            if(!(await Task.findById(objId))) {
                throw new Error('TaskNotFound');
            }

            return await Comment.find({collection_name: 'task', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
            if(!(await Project.findById(objId))) {
                throw new Error('ProjectNotFound');
            }

            return await Comment.find({collection_name: 'project', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
        } else if(ref === 'comment') {
            if(!(await Comment.findById(objId))) {
                throw new Error('CommentNotFound');
            }

            return await Comment.find({collection_name: 'comment', document: objId})
            .then((result) => {
                if(!result || result === null) {
                    throw new Error('CommentNotFound');
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
    } else if(arguments.length === 0) {
        return await Comment.find({})
        .then((result) => {
            if(!result || result === null) {
                throw new Error('NoCommentFound');
            } else {
                return result;
            }
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
    } else {
        throw new Error('IncorrectNumberOfArguments');
    }
}

async function createComment(userId, commentObj) {
    const {body, collection_name, document} = commentObj;
    let commentRes;

    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!body || !collection_name) {
        throw new Error('EmptyFormField');
    }

    if(!document && collection_name === 'task') {
        throw new Error('TaskIdMissing');
    } else if(!document && collection_name === 'comment') {
        throw new Error('CommentIdMissing');
    } else if(!document && collection_name === 'project') {
        throw new Error('ProjectIdMissing')
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!(await User.findById(userId))) {
        throw new Error('UserNotFound');
    }

    if(!mongoose.Types.ObjectId.isValid(document)) {
        if(collection_name === 'task') {
            throw new Error('TaskIdNotValid');
        } else if(collection_name === 'comment') {
            throw new Error('CommentIdNotValid');
        } else if(collection_name === 'project') {
            throw new Error('ProjectIdNotValid')
        }
    }

    if(collection_name === 'task') {
        
    } else if(collection_name === 'comment') {
        throw new Error('CommentIdNotValid');
    } else if(collection_name === 'project') {
        throw new Error('ProjectIdNotValid')
    }

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        body: body,
        user: userId,
        collection_name: collection_name,
        document: document
    })

    commentRes = await comment.save()
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotSaved');
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

    if(commentRes instanceof Error) {
        throw commentRes;
    } else {
        return commentRes;
    }
}

async function updateComment(userId, commentId, commentObj) {
    if(!userId || userId === '') {
        throw new Error('UserIdMissing');
    }

    if(!commentId || commentId === '') {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid')
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');
    }

    if(!(await Comment.findById({commentId}))) {
        throw new Error('CommentNotFound');
    }

    return await Comment.findOneAndUpdate({_id: commentId, author: userId}, commentObj, { new: true})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotUpdated');
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

async function deleteComment(userId, commentId) {
    if(!userId) {
        throw new Error('UserIdMissing');
    }

    if(!commentId) {
        throw new Error('CommentIdMissing');
    }

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('UserIdNotValid');
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('CommentIdNotValid');
    }

    if(!(await User.findById({userId}))) {
        throw new Error('UserNotFound');
    }

    return await Comment.findOneAndDelete({_id: commentId, author: userId})
    .then((result) => {
        if(!result || result === null) {
            throw new Error('CommentNotDeleted');
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