/* ResourceUserRole - cross-reference collection storing ID keys for the following collections:
    - Project, Company, Organization, Team, Comment and Category stored in enum type array
    - User
    - Role

    Its main purpose is to ensure that user trying to gain the access to certain resource has necessary role with proper permission set.
*/

const mongoose  = require('mongoose');

const ResourceAccessSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, {collection: 'resource_access'});

const Resource_Access = mongoose.model('Resource_Access', ResourceAccessSchema);

module.exports = Resource_Access;