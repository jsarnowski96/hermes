const mongoose  = require('mongoose');

const RecentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        validate: /^.{1,100}$/,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collection_name: {
        type: String,
        enum: ['team', 'project', 'comment', 'task', 'organization', 'company', 'category'],
        default: 'project',
        trim: true,
        required: true
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
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: function() {
            switch(this.collection_name) {
                case 'team': return 'Team';
                case 'project': return 'Project';
                case 'comment': return 'Comment';
                case 'task': return 'Task';
                case 'organization': return 'Organization';
                case 'company': return 'Company';
                case 'category': return 'Category';
                default: return null;
            }
        },
        required: true
    }
}, {collection: 'recent'});

const Recent = mongoose.model('Recent', RecentSchema);

module.exports = Recent;