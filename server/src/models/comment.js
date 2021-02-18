const mongoose  = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;