/* ResourceUserRole - cross-reference collection storing ID keys for the following collections:
    - Project, Company, Organization, Team, Comment and Category stored in enum type array
    - User
    - Role

    Its main purpose is to ensure that user trying to gain the access to certain resource has necessary role with proper permission set.
*/

const mongoose  = require('mongoose');

const ResourceUserRoleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collection_name: {
        type: String,
        enum: ['Team', 'Project', 'Comment', 'Task', 'Organization', 'Company', 'Category'],
        default: ['Project'],
        trim: true,
        required: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: function() {
            switch(this.collection_name) {
                case 'Team': return 'Team';
                case 'Project': return 'Project';
                case 'Comment': return 'Comment';
                case 'Organization': return 'Organization';
                case 'Company': return 'Company';
                case 'Category': return 'Category';
                default: return null;
            }
        },
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
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
    }
});

const ResourceUserRole = mongoose.model('ResourceUserRole', ResourceUserRoleSchema);

module.exports = ResourceUserRole;