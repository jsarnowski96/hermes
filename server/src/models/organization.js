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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
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

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;