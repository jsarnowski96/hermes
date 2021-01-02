const mongoose  = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/org-default.png'
    },
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    org_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;