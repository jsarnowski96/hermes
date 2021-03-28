const mongoose  = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    body: {
        type: String,
        trim: true,
        required: true
    },
    collection_name: {
        type: String,
        enum: ['task', 'project', 'comment'],
        default: 'task',
        trim: true,
        required: true
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: function() {
            switch(this.collection_name) {
                case 'team': return 'Team';
                case 'project': return 'Project';
                case 'comment': return 'Comment';
                default: return null;
            }
        },
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;